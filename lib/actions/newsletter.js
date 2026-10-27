'use server';

import { revalidatePath } from 'next/cache';
import { adminAction, getId, dbError } from './_shared';
import { subscriberStatusValues } from '@/lib/validations-admin';

export async function updateSubscriberStatus(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    const status = String(formData.get('status') || '');
    if (!id || !subscriberStatusValues.includes(status)) return { ok: false, message: 'Invalid status.' };
    const { error } = await supabase.from('newsletter_subscribers').update({ status }).eq('id', id);
    if (error) return { ok: false, message: dbError(error) };
    revalidatePath('/admin/newsletter');
    return { ok: true, message: status === 'active' ? 'Subscriber re-activated.' : 'Subscriber marked as unsubscribed.' };
  });
}

export async function deleteSubscriber(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid subscriber.' };
    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
    if (error) return { ok: false, message: dbError(error, 'The subscriber could not be deleted.') };
    revalidatePath('/admin/newsletter');
    return { ok: true, message: 'Subscriber deleted.' };
  });
}
