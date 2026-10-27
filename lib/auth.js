import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';

/**
 * Returns { supabase, user, admin, profile } for a verified administrator,
 * or null. Cached per request so layouts and pages share one lookup.
 */
export const getAdminContext = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: admin } = await supabase
    .from('admins')
    .select('user_id, role, created_at')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!admin) return { supabase, user, admin: null, profile: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  return { supabase, user, admin, profile };
});

/** Use in admin pages/layouts. Redirects anyone who is not an administrator. */
export async function requireAdmin() {
  const ctx = await getAdminContext();
  if (!ctx || !ctx.user) redirect('/admin/login');
  if (!ctx.admin) redirect('/admin/logout?reason=unauthorized');
  return ctx;
}

/**
 * Use at the top of every admin Server Action. Server Actions are public HTTP
 * endpoints, so authorization must be re-checked on each call.
 */
export async function assertAdmin() {
  const ctx = await getAdminContext();
  if (!ctx || !ctx.user || !ctx.admin) {
    const err = new Error('You are not authorised to perform this action.');
    err.code = 'UNAUTHORISED';
    throw err;
  }
  return ctx;
}
