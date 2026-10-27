import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Used when a signed-in account is not an administrator: end the session
// and return to the login screen with an explanation.
export async function GET(request) {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  const reason = new URL(request.url).searchParams.get('reason') === 'unauthorized' ? 'unauthorized' : 'signedout';
  return NextResponse.redirect(new URL(`/admin/login?${reason}=1`, request.url));
}
