import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY, REMEMBER_COOKIE, isSupabaseConfigured } from './env';

/**
 * Cookie-aware Supabase client for Server Components, Server Actions and
 * Route Handlers. Acts as the signed-in user, so RLS policies apply.
 *
 * When the administrator chose not to be remembered, auth cookies are
 * written as session cookies (no Max-Age) and vanish when the browser closes.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();
  const remember = cookieStore.get(REMEMBER_COOKIE)?.value !== '0';

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            const opts = { ...options, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' };
            if (!remember && value) {
              delete opts.maxAge;
              delete opts.expires;
            }
            cookieStore.set(name, value, opts);
          });
        } catch {
          // Called from a Server Component — cookies are read-only there.
          // The proxy refreshes the session instead.
        }
      },
    },
  });
}
