-- ═══════════════════════════════════════════════════════════════════════
-- Grant OWNER access to the two initial administrators.
--
-- Run this in the Supabase SQL Editor AFTER each administrator has accepted
-- their invitation (so the account exists and the email is confirmed).
-- It is safe to run repeatedly and to run before one of them has accepted:
--   • accounts that do not exist yet, or are not email-confirmed, are skipped
--     and reported — admin rights are never given to an unverified address;
--   • an account that is already an administrator is left exactly as it is
--     (no role is overwritten).
-- Both accounts are separate Auth users with their own credentials and get
-- the same role ('owner'), so their permissions are identical.
-- ═══════════════════════════════════════════════════════════════════════

do $$
declare
  v_email text;
  v_user  auth.users%rowtype;
  v_role  public.admin_role;
begin
  foreach v_email in array array['pranav.pandey6780@gmail.com', 'inked.whispers.org@gmail.com'] loop
    select * into v_user from auth.users where lower(email) = lower(v_email);

    if not found then
      raise notice '% : no Auth account yet — invite this address first (npm run admins:setup).', v_email;
    elsif v_user.email_confirmed_at is null then
      raise notice '% : account exists but the email is NOT confirmed yet — skipped.', v_email;
    else
      select role into v_role from public.admins where user_id = v_user.id;
      if found then
        raise notice '% : already an administrator (role %) — left unchanged.', v_email, v_role;
      else
        insert into public.admins (user_id, role) values (v_user.id, 'owner');
        raise notice '% : granted owner.', v_email;
      end if;
    end if;
  end loop;
end $$;

-- Verify
select u.email, a.role, u.email_confirmed_at is not null as email_confirmed, a.created_at
from public.admins a join auth.users u on u.id = a.user_id
order by u.email;
