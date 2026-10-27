'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminAction, getId, dbError } from './_shared';
import { applicationStatusValues } from '@/lib/validations-admin';
import { clean } from '@/lib/validations';

export async function updateApplicationStatus(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    const status = String(formData.get('status') || '');
    if (!id || !applicationStatusValues.includes(status)) return { ok: false, message: 'Invalid status.' };
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) return { ok: false, message: dbError(error) };
    revalidatePath('/admin', 'layout');
    return { ok: true, message: 'Status updated.' };
  });
}

export async function saveApplicationNotes(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid application.' };
    const notes = clean(formData.get('admin_notes')).slice(0, 4000) || null;
    const { error } = await supabase.from('applications').update({ admin_notes: notes }).eq('id', id);
    if (error) return { ok: false, message: dbError(error) };
    revalidatePath(`/admin/applications/${id}`);
    return { ok: true, message: 'Notes saved.' };
  });
}

export async function deleteApplication(_prev, formData) {
  const result = await adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid application.' };
    const { data: app } = await supabase.from('applications').select('resume_path').eq('id', id).maybeSingle();
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) return { ok: false, message: dbError(error, 'The application could not be deleted.') };
    if (app?.resume_path) await supabase.storage.from('resumes').remove([app.resume_path]);
    revalidatePath('/admin', 'layout');
    return { ok: true, deleted: true };
  });
  if (result.ok && result.deleted) redirect('/admin/applications?deleted=1');
  return result;
}
