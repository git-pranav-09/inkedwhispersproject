'use server';

import { redirect } from 'next/navigation';
import { adminAction, getId, dbError, revalidatePublic } from './_shared';
import { validate, clean } from '@/lib/validations';
import { eventRules } from '@/lib/validations-admin';
import { hasFile, uploadMedia, mediaPathFromUrl } from '@/lib/storage';
import { slugify } from '@/lib/utils';

function parseWinners(raw) {
  try {
    const arr = JSON.parse(String(raw || '[]'));
    if (!Array.isArray(arr)) return [];
    return arr
      .slice(0, 30)
      .map((w) => ({
        position: clean(w?.position).slice(0, 60),
        name: clean(w?.name).slice(0, 160),
        work: clean(w?.work).slice(0, 200),
      }))
      .filter((w) => w.name);
  } catch {
    return [];
  }
}

/** Create or update an event (upcoming or past). */
export async function saveEvent(_prev, formData) {
  const result = await adminAction(async ({ supabase, user }) => {
    const id = getId(formData);
    const kind = formData.get('kind') === 'past' ? 'past' : 'upcoming';

    // Fill the slug from the title when left empty.
    if (!clean(formData.get('slug'))) formData.set('slug', slugify(formData.get('title')));

    const { data, errors, ok } = validate(formData, eventRules);
    if (data.start_time && data.end_time && data.end_time <= data.start_time) errors.end_time = 'End time must be after the start time.';
    if (data.status === 'registration_open' && !data.registration_url) {
      errors.registration_url = 'Add a registration URL to open registrations.';
    }
    if (!ok || Object.keys(errors).length) return { ok: false, errors, message: 'Please review the highlighted fields.' };

    // Draft events are never public.
    if (data.status === 'draft') data.is_published = false;

    const payload = { ...data, winners: parseWinners(formData.get('winners_json')) };

    // Image handling
    const file = formData.get('image');
    const removeImage = formData.get('remove_image') === 'on';
    let previous = null;
    if (id) {
      const { data: existing } = await supabase.from('events').select('image_url').eq('id', id).maybeSingle();
      previous = existing?.image_url || null;
    }
    if (hasFile(file)) {
      const up = await uploadMedia(supabase, file, 'events');
      if (up.error) return { ok: false, errors: { image: up.error }, message: up.error };
      payload.image_url = up.url;
    } else if (removeImage) {
      payload.image_url = null;
    }

    let saved;
    if (id) {
      const { data: row, error } = await supabase.from('events').update(payload).eq('id', id).select('id, status').single();
      if (error) return { ok: false, message: dbError(error) };
      saved = row;
    } else {
      const { data: row, error } = await supabase
        .from('events')
        .insert({ ...payload, created_by: user.id })
        .select('id, status')
        .single();
      if (error) return { ok: false, message: dbError(error) };
      saved = row;
    }

    // Clean up a replaced/removed image from storage.
    if (previous && previous !== payload.image_url && ('image_url' in payload)) {
      const path = mediaPathFromUrl(previous);
      if (path) await supabase.storage.from('media').remove([path]);
    }

    revalidatePublic();
    const base = saved.status === 'completed' || kind === 'past' ? '/admin/past-events' : '/admin/events';
    return { ok: true, redirectTo: `${base}/${saved.id}?saved=1`, created: !id };
  });

  if (result.ok && result.redirectTo) redirect(result.redirectTo);
  return result;
}

export async function setEventPublished(_prev, formData) {
  return adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid event.' };
    const publish = formData.get('publish') === '1';
    const { data: ev } = await supabase.from('events').select('status').eq('id', id).maybeSingle();
    if (!ev) return { ok: false, message: 'Event not found.' };
    const update = { is_published: publish };
    if (publish && ev.status === 'draft') update.status = 'published';
    const { error } = await supabase.from('events').update(update).eq('id', id);
    if (error) return { ok: false, message: dbError(error) };
    revalidatePublic();
    return { ok: true, message: publish ? 'Event published.' : 'Event unpublished.' };
  });
}

export async function deleteEvent(_prev, formData) {
  const result = await adminAction(async ({ supabase }) => {
    const id = getId(formData);
    if (!id) return { ok: false, message: 'Invalid event.' };
    const back = formData.get('back') === 'past' ? '/admin/past-events' : '/admin/events';
    const { data: ev } = await supabase.from('events').select('image_url, event_gallery(storage_path)').eq('id', id).maybeSingle();
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return { ok: false, message: dbError(error, 'The event could not be deleted.') };
    const paths = [mediaPathFromUrl(ev?.image_url), ...(ev?.event_gallery || []).map((g) => g.storage_path)].filter(Boolean);
    if (paths.length) await supabase.storage.from('media').remove(paths);
    revalidatePublic();
    return { ok: true, redirectTo: `${back}?deleted=1` };
  });
  if (result.ok && result.redirectTo) redirect(result.redirectTo);
  return result;
}
