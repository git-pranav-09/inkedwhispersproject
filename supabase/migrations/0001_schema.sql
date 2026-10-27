-- ═══════════════════════════════════════════════════════════════════════
-- Inked Whispers — Database schema
-- Run in Supabase SQL Editor (or `supabase db push`) BEFORE 0002 and 0003.
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ── Enumerations ────────────────────────────────────────────────────────
do $$ begin
  create type public.application_status as enum ('new', 'under_review', 'shortlisted', 'selected', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.event_status as enum ('draft', 'published', 'registration_open', 'registration_closed', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.event_mode as enum ('offline', 'online', 'hybrid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.message_status as enum ('unread', 'read', 'resolved');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.inquiry_type as enum ('general', 'collaboration', 'event', 'media', 'partnership', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscriber_status as enum ('active', 'unsubscribed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.admin_role as enum ('owner', 'admin', 'editor');
exception when duplicate_object then null; end $$;

-- ── Shared trigger: keep updated_at current ────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles: one row per auth user ────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text check (char_length(full_name) <= 120),
  avatar_url  text check (char_length(avatar_url) <= 500),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── admins: the ONLY source of administrative authority ────────────────
-- A Supabase Auth account alone grants nothing. A user becomes an
-- administrator only when a row exists here (inserted manually via SQL).
create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  role        public.admin_role not null default 'admin',
  created_at  timestamptz not null default now()
);

-- Helper used by every RLS policy. SECURITY DEFINER so it can read
-- public.admins without exposing that table to callers.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ── core_members ───────────────────────────────────────────────────────
create table if not exists public.core_members (
  id                uuid primary key default gen_random_uuid(),
  name              text not null check (char_length(name) between 1 and 120),
  designation       text not null check (char_length(designation) between 1 and 120),
  bio               text check (char_length(bio) <= 4000),
  responsibilities  text check (char_length(responsibilities) <= 2000),
  photo_url         text check (char_length(photo_url) <= 500),
  instagram_url     text check (char_length(instagram_url) <= 300),
  linkedin_url      text check (char_length(linkedin_url) <= 300),
  email             text check (char_length(email) <= 200),
  sort_order        integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists core_members_sort_idx on public.core_members (sort_order);
create or replace trigger core_members_updated_at
  before update on public.core_members
  for each row execute function public.set_updated_at();

-- ── events (upcoming AND past — status 'completed' marks a past event) ─
create table if not exists public.events (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(title) between 1 and 160),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 120),
  short_description  text check (char_length(short_description) <= 320),
  description        text check (char_length(description) <= 12000),
  image_url          text check (char_length(image_url) <= 500),
  event_date         date,
  start_time         time,
  end_time           time,
  venue              text check (char_length(venue) <= 240),
  mode               public.event_mode not null default 'offline',
  event_type         text check (char_length(event_type) <= 80),
  fee                text check (char_length(fee) <= 80),
  registration_url   text check (char_length(registration_url) <= 500),
  rules              text check (char_length(rules) <= 8000),
  guidelines         text check (char_length(guidelines) <= 8000),
  organizer_name     text check (char_length(organizer_name) <= 160),
  organizer_info     text check (char_length(organizer_info) <= 1000),
  contact_email      text check (char_length(contact_email) <= 200),
  contact_phone      text check (char_length(contact_phone) <= 40),
  status             public.event_status not null default 'draft',
  is_published       boolean not null default false,
  -- Past-event fields
  winners            jsonb not null default '[]'::jsonb,
  highlights         text check (char_length(highlights) <= 8000),
  results            text check (char_length(results) <= 8000),
  certificate_info   text check (char_length(certificate_info) <= 4000),
  created_by         uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint events_winners_is_array check (jsonb_typeof(winners) = 'array')
);

create index if not exists events_public_idx on public.events (is_published, status, event_date);
create index if not exists events_date_idx on public.events (event_date desc);
create or replace trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ── event_gallery ──────────────────────────────────────────────────────
create table if not exists public.event_gallery (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references public.events (id) on delete cascade,
  image_url     text not null check (char_length(image_url) <= 500),
  storage_path  text check (char_length(storage_path) <= 500),
  caption       text check (char_length(caption) <= 240),
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists event_gallery_event_idx on public.event_gallery (event_id, sort_order);

-- ── positions (open roles shown on Join Us) ────────────────────────────
create table if not exists public.positions (
  id                uuid primary key default gen_random_uuid(),
  title             text not null check (char_length(title) between 1 and 120),
  department        text not null check (char_length(department) between 1 and 120),
  description       text check (char_length(description) <= 2000),
  responsibilities  text check (char_length(responsibilities) <= 4000),
  requirements      text check (char_length(requirements) <= 4000),
  availability      text not null default 'Open' check (availability in ('Open', 'Limited', 'Closed')),
  commitment        text check (char_length(commitment) <= 120),
  sort_order        integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists positions_active_idx on public.positions (is_active, sort_order);
create or replace trigger positions_updated_at
  before update on public.positions
  for each row execute function public.set_updated_at();

-- ── applications (PRIVATE) ─────────────────────────────────────────────
create table if not exists public.applications (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null check (char_length(full_name) between 2 and 120),
  email            citext not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone            text not null check (char_length(phone) between 6 and 20),
  age              integer check (age between 10 and 100),
  city             text not null check (char_length(city) between 1 and 120),
  organization     text not null check (char_length(organization) between 1 and 200),
  position_id      uuid references public.positions (id) on delete set null,
  position_title   text not null check (char_length(position_title) between 1 and 120),
  department       text not null check (char_length(department) between 1 and 120),
  motivation       text not null check (char_length(motivation) between 20 and 4000),
  experience       text check (char_length(experience) <= 4000),
  skills           text check (char_length(skills) <= 2000),
  portfolio_url    text check (char_length(portfolio_url) <= 300),
  linkedin_url     text check (char_length(linkedin_url) <= 300),
  instagram_url    text check (char_length(instagram_url) <= 300),
  additional_info  text check (char_length(additional_info) <= 4000),
  resume_path      text check (char_length(resume_path) <= 500),
  consent          boolean not null check (consent = true),
  status           public.application_status not null default 'new',
  admin_notes      text check (char_length(admin_notes) <= 4000),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists applications_status_idx on public.applications (status);
create index if not exists applications_department_idx on public.applications (department);
create index if not exists applications_position_idx on public.applications (position_title);
create index if not exists applications_created_idx on public.applications (created_at desc);
create or replace trigger applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ── newsletter_subscribers (PRIVATE) ───────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  name        text check (char_length(name) <= 120),
  email       citext not null unique check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  status      public.subscriber_status not null default 'active',
  source      text default 'website' check (char_length(source) <= 60),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists newsletter_status_idx on public.newsletter_subscribers (status, created_at desc);
create or replace trigger newsletter_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

-- ── contact_messages (PRIVATE) ─────────────────────────────────────────
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 2 and 120),
  email         citext not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone         text check (char_length(phone) <= 20),
  subject       text not null check (char_length(subject) between 2 and 200),
  inquiry_type  public.inquiry_type not null default 'general',
  message       text not null check (char_length(message) between 10 and 5000),
  status        public.message_status not null default 'unread',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists contact_status_idx on public.contact_messages (status, created_at desc);
create or replace trigger contact_updated_at
  before update on public.contact_messages
  for each row execute function public.set_updated_at();

-- ── site_content: editable copy blocks (key → JSON) ────────────────────
create table if not exists public.site_content (
  key         text primary key check (key ~ '^[a-z0-9_]+$'),
  value       jsonb not null default '{}'::jsonb,
  updated_by  uuid references auth.users (id) on delete set null,
  updated_at  timestamptz not null default now()
);

create or replace trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ── rate_limits: server-side throttling for public forms & login ───────
create table if not exists public.rate_limits (
  id          bigint generated always as identity primary key,
  bucket      text not null,
  key_hash    text not null,
  created_at  timestamptz not null default now()
);

create index if not exists rate_limits_lookup_idx on public.rate_limits (bucket, key_hash, created_at desc);

-- Atomically records a hit and returns TRUE when the caller is still within
-- the allowed limit. Callable only with the service role (see 0002).
create or replace function public.check_rate_limit(p_bucket text, p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  hits int;
begin
  delete from public.rate_limits where created_at < now() - interval '1 day';

  select count(*) into hits
  from public.rate_limits
  where bucket = p_bucket
    and key_hash = p_key
    and created_at > now() - make_interval(secs => p_window_seconds);

  if hits >= p_limit then
    return false;
  end if;

  insert into public.rate_limits (bucket, key_hash) values (p_bucket, p_key);
  return true;
end;
$$;
