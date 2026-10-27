-- ═══════════════════════════════════════════════════════════════════════
-- Grant administrator access to an existing Supabase Auth user.
--
-- For adding EXTRA administrators later (the two initial owners use
-- grant-initial-admins.sql). Invite the person first: Supabase Dashboard →
-- Authentication → Users → "Invite user", so they choose their own password.
-- Replace the email below and run this file in the SQL Editor.
--
-- Admin rights can ONLY be granted here (or with the service role). There
-- is deliberately no sign-up page and no API path that writes to admins.
-- ═══════════════════════════════════════════════════════════════════════

insert into public.admins (user_id, role)
select id, 'owner'
from auth.users
where email = 'replace-with-admin@your-domain.com'
on conflict (user_id) do nothing;  -- never overwrites an existing role

-- Optional: set a display name shown in the admin header
insert into public.profiles (id, full_name)
select id, 'Replace With Name'
from auth.users
where email = 'replace-with-admin@your-domain.com'
on conflict (id) do update set full_name = excluded.full_name;

-- Verify
select a.role, u.email, a.created_at
from public.admins a join auth.users u on u.id = a.user_id;

-- To add more administrators later, repeat with role 'admin' instead of 'owner'.
-- To revoke access:  delete from public.admins where user_id = (select id from auth.users where email = '...');
