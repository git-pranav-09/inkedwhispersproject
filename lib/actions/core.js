'use server';

import { redirect } from 'next/navigation';
import { adminAction, getId, dbError, revalidatePublic } from './_shared';
import { validate } from '@/lib/validations';
import { coreMemberRules } from '@/lib/validations-admin';
import { hasFile, uploadMedia, mediaPathFromUrl } from '@/lib/storage';

export async function saveCoreMember(_prev, formData) {
  const result = await adminAction(async ({ supabase }) => {
    const id = getId(formData);
    const { data, errors, ok } = validate(formData, coreMemberRules);
    if (!ok) return { ok: false, errors, message: 'Please review the highlighted fields.' };

    let previous = null;
    if (id) {
      const { data: row } = await supabase.from('core_members').select('photo_url').eq('id', id).maybeSingle();
      previous = row?.photo_url || null;
    }

    const payload = { ...data };
    const file = formData.get('photo');
    if (hasFile(file)) {
      const up = await uploadMedia(supabase, file, 'core');
      if (up.error) return { ok: false, errors: { photo: up.error }, message: up.error };
      payload.photo_url = up.url;
    } else if (formData.get('remove_photo') === 'on') {
      payload.photo_url = null;
    }

    if (id) {
      const { error } = await supabase.from('core_members').update(payload).eq('id', id);
      if (error) return { ok: false, message: dbError(error) };
    } else {
      const { data: last } = await supabase.from('core_members').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
      const { error } = await supabase.from('core_members').insert({ ...payload, sort_order: (last?.sort_order || 0) + 1 });
      if (error) return { ok: false, message: dbError(error) };
    }

    if (previous && 'photo_url' in payload && previous !== payload.photo_url) {
      const path = mediaPathFromUrl(previous);
      if (path) await supabase.storage.from('media').remove([path]);
    }

    revalidatePublic();
    return { ok: true, redirectTo: '/admin/core?saved=1' };
  });
  if (result.ok && result.redirectTo) redirect(result.redirectTo);
  return result;
}

export async function moveCoreMember(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    const dir = formData.get('dir') === 'up' ? -1 : 1;
    if (!id) return { ok: false, message: 'Invalid member.' };
    const { data: items } = await supabase.from('core_members').select('id, sort_order').order('sort_order').order('created_at');
    const list = items || [];
    const i = list.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return { ok: true };
    [list[i], list[j]] = [list[j], list[i]];
    const results = await Promise.all(list.map((x, idx) => supabase.from('core_members').update({ sort_order: idx + 1 }).eq('id', x.id)));
    if (results.some((r) => r.error)) return { ok: false, message: 'The new order could not be saved.' };
    revalidatePublic();
    return { ok: true };
  });
}

export async function deleteCoreMember(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid member.' };
    const { data: row } = await supabase.from('core_members').select('photo_url').eq('id', id).maybeSingle();
    const { error } = await supabase.from('core_members').delete().eq('id', id);
    if (error) return { ok: false, message: dbError(error, 'The member could not be deleted.') };
    const path = mediaPathFromUrl(row?.photo_url);
    if (path) await supabase.storage.from('media').remove([path]);
    revalidatePublic();
    return { ok: true, message: 'Core member removed.' };
  });
}
