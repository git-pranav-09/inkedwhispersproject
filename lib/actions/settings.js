'use server';

import { revalidatePath } from 'next/cache';
import { adminAction } from './_shared';
import { clean } from '@/lib/validations';

export async function updateProfile(_prev, formData) {
  return adminAction(async ({ supabase, user }) => {
    const full_name = clean(formData.get('full_name')).slice(0, 120);
    if (full_name.length < 2) return { ok: false, errors: { full_name: 'Please enter your name.' } };
    const { error } = await supabase.from('profiles').upsert({ id: user.id, full_name }, { onConflict: 'id' });
    if (error) return { ok: false, message: 'Your profile could not be updated.' };
    revalidatePath('/admin', 'layout');
    return { ok: true, message: 'Profile updated.' };
  });
}

export async function changePassword(_prev, formData) {
  return adminAction(async ({ supabase, user }) => {
    const current = String(formData.get('current_password') || '');
    const next = String(formData.get('new_password') || '');
    const confirm = String(formData.get('confirm_password') || '');
    const errors = {};
    if (!current) errors.current_password = 'Enter your current password.';
    if (next.length < 12) errors.new_password = 'Use at least 12 characters.';
    else if (!/[A-Za-z]/.test(next) || !/[0-9]/.test(next)) errors.new_password = 'Include both letters and numbers.';
    if (next !== confirm) errors.confirm_password = 'Passwords do not match.';
    if (Object.keys(errors).length) return { ok: false, errors };

    // Re-authenticate before allowing the change.
    const { error: authError } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
    if (authError) return { ok: false, errors: { current_password: 'Current password is incorrect.' } };

    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) return { ok: false, message: error.message || 'The password could not be changed.' };
    return { ok: true, message: 'Password changed successfully.' };
  });
}
