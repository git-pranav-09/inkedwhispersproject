-- ═══════════════════════════════════════════════════════════════════════
-- Inked Whispers — administrator safeguards (idempotent)
--  1. Table privileges on public.admins: API roles can only READ it (and RLS
--     limits that to admins). Nobody can grant admin through the Data API.
--  2. The last remaining owner can never be deleted or demoted, so a mistake
--     cannot lock everyone out of the portal.
-- ═══════════════════════════════════════════════════════════════════════

revoke all on table public.admins from anon, authenticated;
grant select on table public.admins to authenticated;

create or replace function public.protect_last_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role = 'owner'
     and (tg_op = 'DELETE' or new.role is distinct from 'owner')
     and not exists (
       select 1 from public.admins where role = 'owner' and user_id <> old.user_id
     )
  then
    raise exception 'Cannot remove or demote the last owner. Add another owner first.'
      using errcode = '23514';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.protect_last_owner() from public, anon, authenticated;

drop trigger if exists admins_protect_last_owner on public.admins;
create trigger admins_protect_last_owner
  before update or delete on public.admins
  for each row execute function public.protect_last_owner();
