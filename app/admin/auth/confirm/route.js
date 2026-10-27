import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Landing point for the links in Supabase invite / password-recovery emails
// (see supabase/email-templates). Exchanges the one-time token for a session,
// then sends the person to choose their own password. Only these two link
// types are accepted, and the destination is fixed — no open redirect.
const ALLOWED = new Set(['invite', 'recovery']);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  const fail = () => NextResponse.redirect(new URL('/admin/login?linkerror=1', request.url));
  if (!tokenHash || !ALLOWED.has(type)) return fail();

  const supabase = await createClient();
  if (!supabase) return fail();

  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) return fail();

  return NextResponse.redirect(new URL('/admin/set-password', request.url));
}
