'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminAction, getId, dbError } from './_shared';
import { messageStatusValues } from '@/lib/validations-admin';

export async function updateMessageStatus(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    const status = String(formData.get('status') || '');
    if (!id || !messageStatusValues.includes(status)) return { ok: false, message: 'Invalid status.' };
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
    if (error) return { ok: false, message: dbError(error) };
    revalidatePath('/admin', 'layout');
    return { ok: true, message: 'Status updated.' };
  });
}

export async function deleteMessage(_prev, formData) {
  const result = await adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid message.' };
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) return { ok: false, message: dbError(error, 'The message could not be deleted.') };
    revalidatePath('/admin', 'layout');
    return { ok: true, deleted: true };
  });
  if (result.ok && result.deleted) redirect('/admin/messages?deleted=1');
  return result;
}
