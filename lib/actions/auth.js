'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { REMEMBER_COOKIE, isSupabaseConfigured } from '@/lib/supabase/env';
import { validate, loginRules } from '@/lib/validations';
import { getClientIp, rateLimit } from '@/lib/security';

const GENERIC = 'The email or password is incorrect.';

export async function loginAction(_prev, formData) {
  if (!isSupabaseConfigured) {
    return { ok: false, message: 'Authentication is not configured. Add the Supabase environment variables and redeploy.' };
  }

  const { data, errors, ok } = validate(formData, loginRules);
  if (!ok) return { ok: false, errors, message: 'Please enter your email and password.' };

  const ip = getClientIp(await headers());
  const allowedIp = await rateLimit('login-ip', ip, { limit: 10, windowSeconds: 900 });
  const allowedAcct = await rateLimit('login-acct', data.email, { limit: 6, windowSeconds: 900 });
  if (!allowedIp || !allowedAcct) {
    return { ok: false, message: 'Too many sign-in attempts. Please wait 15 minutes and try again.' };
  }

  const remember = formData.get('remember') === 'on';
  const cookieStore = await cookies();
  cookieStore.set(REMEMBER_COOKIE, remember ? '1' : '0', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });

  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
  if (error || !auth?.user) return { ok: false, message: GENERIC };

  // Authorization: the account must be listed in public.admins.
  const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', auth.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, message: 'This account does not have administrative access.' };
  }

  const next = String(formData.get('next') || '');
  redirect(next.startsWith('/admin/') && !next.startsWith('//') ? next : '/admin/dashboard');
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(REMEMBER_COOKIE);
  redirect('/admin/login?signedout=1');
}

const MIN_PASSWORD = 12;

/** Sends a password-recovery email. Always answers the same way so the form cannot be used to discover accounts. */
export async function requestPasswordResetAction(_prev, formData) {
  const SENT = { ok: true, message: 'If that address belongs to an administrator, a password reset link is on its way. Check your inbox (and spam).' };
  if (!isSupabaseConfigured) return { ok: false, message: 'Authentication is not configured.' };

  const { data, errors, ok } = validate(formData, { email: loginRules.email });
  if (!ok) return { ok: false, errors, message: 'Please enter a valid email address.' };

  const ip = getClientIp(await headers());
  const allowedIp = await rateLimit('reset-ip', ip, { limit: 5, windowSeconds: 3600 });
  const allowedAcct = await rateLimit('reset-acct', data.email, { limit: 3, windowSeconds: 3600 });
  if (!allowedIp || !allowedAcct) return SENT; // do not reveal throttling either

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(data.email);
  return SENT;
}

/** Lets a signed-in administrator (arrived via invite/recovery link) choose their own password. */
export async function setPasswordAction(_prev, formData) {
  if (!isSupabaseConfigured) return { ok: false, message: 'Authentication is not configured.' };

  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm') || '');
  const errors = {};
  if (password.length < MIN_PASSWORD) errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  else if (password.length > 200) errors.password = 'That password is too long.';
  else if (!/[a-z]/i.test(password) || !/\d/.test(password)) errors.password = 'Include both letters and numbers.';
  if (password !== confirm) errors.confirm = 'The two passwords do not match.';
  if (Object.keys(errors).length) return { ok: false, errors, message: 'Please fix the highlighted fields.' };

  const supabase = await createClient();
  const { data: { user } = {} } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'This link has expired. Request a new one from the sign-in page.' };

  // Only administrators may use this page; anyone else is signed out.
  const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, message: 'This account does not have administrative access.' };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: 'The password could not be saved. It may be too weak or recently used — try another.' };

  redirect('/admin/dashboard');
}
