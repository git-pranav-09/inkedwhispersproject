'use server';

import { adminAction, getId, dbError, revalidatePublic } from './_shared';
import { clean } from '@/lib/validations';
import { hasFile, uploadMedia } from '@/lib/storage';

const MAX_PER_UPLOAD = 12;

export async function uploadGalleryImages(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const eventId = getId(formData, 'event_id');
    if (!eventId) return { ok: false, message: 'Invalid event.' };
    const files = formData.getAll('photos').filter(hasFile).slice(0, MAX_PER_UPLOAD);
    if (!files.length) return { ok: false, message: 'Choose at least one photo to upload.' };

    const { count } = await supabase.from('event_gallery').select('id', { count: 'exact', head: true }).eq('event_id', eventId);
    let order = count || 0;
    const rows = [];
    const failures = [];
    for (const file of files) {
      const up = await uploadMedia(supabase, file, `gallery/${eventId}`);
      if (up.error) {
        failures.push(`${file.name}: ${up.error}`);
        continue;
      }
      rows.push({ event_id: eventId, image_url: up.url, storage_path: up.path, sort_order: order++ });
    }
    if (rows.length) {
      const { error } = await supabase.from('event_gallery').insert(rows);
      if (error) return { ok: false, message: dbError(error, 'Photos uploaded but could not be saved to the gallery.') };
    }
    revalidatePublic();
    if (failures.length) return { ok: rows.length > 0, message: `${rows.length} uploaded. Skipped: ${failures.join('; ')}` };
    return { ok: true, message: `${rows.length} photo${rows.length === 1 ? '' : 's'} added to the gallery.` };
  });
}

export async function updateGalleryCaption(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid photo.' };
    const caption = clean(formData.get('caption')).slice(0, 240) || null;
    const { error } = await supabase.from('event_gallery').update({ caption }).eq('id', id);
    if (error) return { ok: false, message: dbError(error) };
    revalidatePublic();
    return { ok: true, message: 'Caption saved.' };
  });
}

export async function moveGalleryImage(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    const eventId = getId(formData, 'event_id');
    const dir = formData.get('dir') === 'up' ? -1 : 1;
    if (!id || !eventId) return { ok: false, message: 'Invalid photo.' };
    const { data: items } = await supabase.from('event_gallery').select('id, sort_order').eq('event_id', eventId).order('sort_order').order('created_at');
    const list = items || [];
    const i = list.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return { ok: true };
    [list[i], list[j]] = [list[j], list[i]];
    await Promise.all(list.map((x, idx) => supabase.from('event_gallery').update({ sort_order: idx }).eq('id', x.id)));
    revalidatePublic();
    return { ok: true };
  });
}

export async function deleteGalleryImage(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid photo.' };
    const { data: img } = await supabase.from('event_gallery').select('storage_path').eq('id', id).maybeSingle();
    const { error } = await supabase.from('event_gallery').delete().eq('id', id);
    if (error) return { ok: false, message: dbError(error, 'The photo could not be removed.') };
    if (img?.storage_path) await supabase.storage.from('media').remove([img.storage_path]);
    revalidatePublic();
    return { ok: true, message: 'Photo removed.' };
  });
}
