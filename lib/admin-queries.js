import 'server-only';
import { applicationStatusValues, messageStatusValues, subscriberStatusValues } from './validations-admin';
import { INQUIRY_TYPES } from './validations';

/** Strips characters that have meaning inside PostgREST filter strings. */
export function safeTerm(q) {
  return String(q || '')
    .replace(/[,()%*\\:"'.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

export function one(v) {
  return Array.isArray(v) ? v[0] : v;
}

export function pageOf(sp) {
  const n = parseInt(one(sp?.page), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function applicationFilters(sp) {
  const status = one(sp?.status);
  return {
    q: safeTerm(one(sp?.q)),
    department: String(one(sp?.department) || '').slice(0, 120),
    position: String(one(sp?.position) || '').slice(0, 120),
    status: applicationStatusValues.includes(status) ? status : '',
    sort: one(sp?.sort) === 'oldest' ? 'oldest' : 'newest',
  };
}

export function applyApplicationFilters(query, f) {
  let q = query;
  if (f.q) q = q.or(`full_name.ilike.%${f.q}%,email.ilike.%${f.q}%,city.ilike.%${f.q}%,organization.ilike.%${f.q}%`);
  if (f.department) q = q.eq('department', f.department);
  if (f.position) q = q.eq('position_title', f.position);
  if (f.status) q = q.eq('status', f.status);
  return q.order('created_at', { ascending: f.sort === 'oldest' });
}

export function subscriberFilters(sp) {
  const status = one(sp?.status);
  return {
    q: safeTerm(one(sp?.q)),
    status: subscriberStatusValues.includes(status) ? status : '',
    sort: one(sp?.sort) === 'oldest' ? 'oldest' : 'newest',
  };
}

export function applySubscriberFilters(query, f) {
  let q = query;
  if (f.q) q = q.or(`name.ilike.%${f.q}%,email.ilike.%${f.q}%`);
  if (f.status) q = q.eq('status', f.status);
  return q.order('created_at', { ascending: f.sort === 'oldest' });
}

export function messageFilters(sp) {
  const status = one(sp?.status);
  const type = one(sp?.type);
  return {
    q: safeTerm(one(sp?.q)),
    status: messageStatusValues.includes(status) ? status : '',
    type: INQUIRY_TYPES.some((t) => t.value === type) ? type : '',
  };
}
