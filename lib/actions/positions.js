'use server';

import { adminAction, getId, dbError, revalidatePublic } from './_shared';
import { validate } from '@/lib/validations';
import { positionRules } from '@/lib/validations-admin';

export async function savePosition(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    const { data, errors, ok } = validate(formData, positionRules);
    if (!ok) return { ok: false, errors, message: 'Please review the highlighted fields.' };
    if (data.sort_order === null) data.sort_order = 0;
    const q = id ? supabase.from('positions').update(data).eq('id', id) : supabase.from('positions').insert(data);
    const { error } = await q;
    if (error) return { ok: false, message: dbError(error) };
    revalidatePublic();
    return { ok: true, message: id ? 'Position updated.' : 'Position created.', done: true };
  });
}

export async function deletePosition(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid position.' };
    const { error } = await supabase.from('positions').delete().eq('id', id);
    if (error) return { ok: false, message: dbError(error, 'The position could not be deleted.') };
    revalidatePublic();
    return { ok: true, message: 'Position deleted. Existing applications keep their position title.' };
  });
}
