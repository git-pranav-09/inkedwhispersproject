// Invites the two initial administrators and grants them the 'owner' role once
// their email is confirmed. Run it yourself, locally:
//     npm run admins:setup            (add  -- --resend  to re-send a pending invite)
//
// Needs SUPABASE_SERVICE_ROLE_KEY in .env.local (never committed, never in the
// browser). It never sets or prints a password: invited people choose their own.
// It never changes an existing administrator's role or an existing account.
import { createClient } from '@supabase/supabase-js';

const ADMINS = ['pranav.pandey6780@gmail.com', 'inked.whispers.org@gmail.com'];
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const resend = process.argv.includes('--resend');

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUser(email) {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

for (const email of ADMINS) {
  const user = await findUser(email);

  if (!user) {
    const { error } = await sb.auth.admin.inviteUserByEmail(email, { redirectTo: `${site}/admin/set-password` });
    console.log(error ? `✗ ${email}: invite failed — ${error.message}` : `✉ ${email}: invitation sent. Ask them to open it and choose a password, then re-run this command.`);
    continue;
  }

  if (!user.email_confirmed_at) {
    if (resend) {
      const { error } = await sb.auth.admin.inviteUserByEmail(email, { redirectTo: `${site}/admin/set-password` });
      console.log(error ? `✗ ${email}: re-send failed — ${error.message}` : `✉ ${email}: invitation re-sent.`);
    } else {
      console.log(`… ${email}: account exists but is not confirmed yet — waiting for them to accept the invite (use --resend to send it again).`);
    }
    continue;
  }

  const { data: existing } = await sb.from('admins').select('role').eq('user_id', user.id).maybeSingle();
  if (existing) {
    console.log(`✓ ${email}: already an administrator (${existing.role}) — unchanged.`);
    continue;
  }
  const { error } = await sb.from('admins').insert({ user_id: user.id, role: 'owner' });
  console.log(error ? `✗ ${email}: could not grant access — ${error.message}` : `✓ ${email}: confirmed and granted owner access.`);
}
