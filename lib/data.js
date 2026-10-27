import 'server-only';
import { cache } from 'react';
import { createPublicClient } from './supabase/public';
import { defaultContent, defaultCoreMembers, defaultDepartments } from './site-config';
import { todayIST } from './utils';

/**
 * Public data access. Every function returns { data, error } and never
 * throws, so pages can render graceful empty/error states.
 */

const EVENT_CARD_FIELDS =
  'id, title, slug, short_description, image_url, event_date, start_time, end_time, venue, mode, event_type, fee, registration_url, status';

function notConfigured(fallback) {
  return { data: fallback, error: null, configured: false };
}

export const getSiteContent = cache(async () => {
  const supabase = createPublicClient();
  if (!supabase) return defaultContent;
  const { data, error } = await supabase.from('site_content').select('key, value');
  if (error || !data) return defaultContent;
  const merged = { ...defaultContent };
  for (const row of data) {
    const base = defaultContent[row.key];
    if (Array.isArray(base)) merged[row.key] = Array.isArray(row.value) && row.value.length ? row.value : base;
    else if (base && typeof base === 'object') merged[row.key] = { ...base, ...(row.value || {}) };
    else merged[row.key] = row.value;
  }
  return merged;
});

export async function getUpcomingEvents(limit) {
  const supabase = createPublicClient();
  if (!supabase) return notConfigured([]);
  let query = supabase
    .from('events')
    .select(EVENT_CARD_FIELDS)
    .eq('is_published', true)
    .in('status', ['published', 'registration_open', 'registration_closed'])
    .or(`event_date.gte.${todayIST()},event_date.is.null`)
    .order('event_date', { ascending: true, nullsFirst: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return { data: data || [], error: error ? 'We could not load events right now.' : null, configured: true };
}

export const getEventBySlug = cache(async (slug) => {
  const supabase = createPublicClient();
  if (!supabase) return notConfigured(null);
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .neq('status', 'draft')
    .maybeSingle();
  return { data, error: error ? 'We could not load this event.' : null, configured: true };
});

export async function getPastEvents() {
  const supabase = createPublicClient();
  if (!supabase) return notConfigured([]);
  const { data, error } = await supabase
    .from('events')
    .select(`${EVENT_CARD_FIELDS}, highlights, event_gallery(id, image_url, caption, sort_order)`)
    .eq('is_published', true)
    .eq('status', 'completed')
    .order('event_date', { ascending: false, nullsFirst: false });
  return { data: data || [], error: error ? 'We could not load past events right now.' : null, configured: true };
}

export const getPastEventBySlug = cache(async (slug) => {
  const supabase = createPublicClient();
  if (!supabase) return notConfigured(null);
  const { data, error } = await supabase
    .from('events')
    .select('*, event_gallery(id, image_url, caption, sort_order)')
    .eq('slug', slug)
    .eq('is_published', true)
    .eq('status', 'completed')
    .maybeSingle();
  if (data?.event_gallery) data.event_gallery.sort((a, b) => a.sort_order - b.sort_order);
  return { data, error: error ? 'We could not load this event.' : null, configured: true };
});

export async function getCoreMembers() {
  const supabase = createPublicClient();
  if (!supabase) return notConfigured(defaultCoreMembers);
  const { data, error } = await supabase
    .from('core_members')
    .select('id, name, designation, bio, responsibilities, photo_url, instagram_url, linkedin_url, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return { data: data || [], error: error ? 'We could not load the core team right now.' : null, configured: true };
}

export async function getPositions() {
  const supabase = createPublicClient();
  if (!supabase) return notConfigured(defaultDepartments);
  const { data, error } = await supabase
    .from('positions')
    .select('id, title, department, description, responsibilities, requirements, availability, commitment, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return { data: data || [], error: error ? 'We could not load open positions right now.' : null, configured: true };
}

/** Slugs for the sitemap. */
export async function getEventSlugs() {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('events')
    .select('slug, status, updated_at')
    .eq('is_published', true)
    .neq('status', 'draft');
  return data || [];
}
