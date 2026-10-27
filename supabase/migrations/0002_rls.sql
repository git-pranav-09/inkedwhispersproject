-- ═══════════════════════════════════════════════════════════════════════
-- Inked Whispers — Row Level Security
-- Principle: deny by default. The public may READ only published content.
-- Private submissions (applications, subscribers, messages) are written
-- exclusively by the server (service role, after validation + rate limiting)
-- and read exclusively by administrators.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.profiles               enable row level security;
alter table public.admins                 enable row level security;
alter table public.core_members           enable row level security;
alter table public.events                 enable row level security;
alter table public.event_gallery          enable row level security;
alter table public.positions              enable row level security;
alter table public.applications           enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.site_content           enable row level security;
alter table public.rate_limits            enable row level security;

-- Force RLS even for table owners connecting through PostgREST.
alter table public.applications           force row level security;
alter table public.newsletter_subscribers force row level security;
alter table public.contact_messages       force row level security;

-- ── profiles ───────────────────────────────────────────────────────────
drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: self insert" on public.profiles;
create policy "profiles: self insert" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ── admins: admins may see the roster; nobody may write through the API ─
drop policy if exists "admins: admin read" on public.admins;
create policy "admins: admin read" on public.admins
  for select to authenticated using (public.is_admin());
-- (No insert/update/delete policies → only the SQL editor / service role can grant admin.)

-- ── core_members ───────────────────────────────────────────────────────
drop policy if exists "core: public read active" on public.core_members;
create policy "core: public read active" on public.core_members
  for select to anon, authenticated using (is_active or public.is_admin());

drop policy if exists "core: admin write" on public.core_members;
create policy "core: admin write" on public.core_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── events ─────────────────────────────────────────────────────────────
drop policy if exists "events: public read published" on public.events;
create policy "events: public read published" on public.events
  for select to anon, authenticated
  using ((is_published and status <> 'draft') or public.is_admin());

drop policy if exists "events: admin write" on public.events;
create policy "events: admin write" on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── event_gallery ──────────────────────────────────────────────────────
drop policy if exists "gallery: public read published" on public.event_gallery;
create policy "gallery: public read published" on public.event_gallery
  for select to anon, authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.events e
      where e.id = event_gallery.event_id and e.is_published and e.status <> 'draft'
    )
  );

drop policy if exists "gallery: admin write" on public.event_gallery;
create policy "gallery: admin write" on public.event_gallery
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── positions ──────────────────────────────────────────────────────────
drop policy if exists "positions: public read active" on public.positions;
create policy "positions: public read active" on public.positions
  for select to anon, authenticated using (is_active or public.is_admin());

drop policy if exists "positions: admin write" on public.positions;
create policy "positions: admin write" on public.positions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── site_content ───────────────────────────────────────────────────────
drop policy if exists "content: public read" on public.site_content;
create policy "content: public read" on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists "content: admin write" on public.site_content;
create policy "content: admin write" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── applications: admin read/update/delete only. No public access. ─────
drop policy if exists "applications: admin read" on public.applications;
create policy "applications: admin read" on public.applications
  for select to authenticated using (public.is_admin());

drop policy if exists "applications: admin update" on public.applications;
create policy "applications: admin update" on public.applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "applications: admin delete" on public.applications;
create policy "applications: admin delete" on public.applications
  for delete to authenticated using (public.is_admin());

-- ── newsletter_subscribers ─────────────────────────────────────────────
drop policy if exists "newsletter: admin read" on public.newsletter_subscribers;
create policy "newsletter: admin read" on public.newsletter_subscribers
  for select to authenticated using (public.is_admin());

drop policy if exists "newsletter: admin update" on public.newsletter_subscribers;
create policy "newsletter: admin update" on public.newsletter_subscribers
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "newsletter: admin delete" on public.newsletter_subscribers;
create policy "newsletter: admin delete" on public.newsletter_subscribers
  for delete to authenticated using (public.is_admin());

-- ── contact_messages ───────────────────────────────────────────────────
drop policy if exists "messages: admin read" on public.contact_messages;
create policy "messages: admin read" on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "messages: admin update" on public.contact_messages;
create policy "messages: admin update" on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages: admin delete" on public.contact_messages;
create policy "messages: admin delete" on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- ── rate_limits: no API access at all (service role bypasses RLS) ──────
-- Intentionally no policies.

-- ── Function privileges ────────────────────────────────────────────────
revoke all on function public.check_rate_limit(text, text, int, int) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, text, int, int) to service_role;

revoke all on function public.handle_new_user() from public, anon, authenticated;
