import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY, REMEMBER_COOKIE, isSupabaseConfigured } from './env';

/**
 * Refreshes the Supabase session on every /admin request and performs the
 * first (optimistic) authentication gate. Full authorization — confirming the
 * user is listed in public.admins — happens server-side in the admin layout
 * and inside every Server Action.
 */
export async function updateSession(request) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  // Reachable without a session: the emailed-link landing route and the reset request page.
  const isPublicAuthPath = pathname === '/admin/auth/confirm' || pathname === '/admin/forgot-password';

  if (!isSupabaseConfigured) {
    if (isLogin || isPublicAuthPath) return response;
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  const remember = request.cookies.get(REMEMBER_COOKIE)?.value !== '0';

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          const opts = { ...options, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' };
          if (!remember && value) {
            delete opts.maxAge;
            delete opts.expires;
          }
          response.cookies.set(name, value, opts);
        });
      },
    },
  });

  // getUser() validates the JWT with Supabase Auth — never trust getSession() alone.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin && !isPublicAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    if (pathname !== '/admin' && pathname !== '/admin/dashboard') url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}
