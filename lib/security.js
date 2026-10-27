import 'server-only';
import { createHash } from 'node:crypto';
import { createServiceClient } from './supabase/admin';

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers) {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return headers.get('x-real-ip') || 'unknown';
}

function hashKey(value) {
  const salt = process.env.RATE_LIMIT_SALT || 'inked-whispers';
  return createHash('sha256').update(`${salt}:${value}`).digest('hex');
}

/**
 * CSRF defence for Route Handlers: reject cross-site POSTs by comparing the
 * Origin header to the request host. (Server Actions get this check from
 * Next.js automatically.)
 */
export function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// In-memory fallback used only when the database limiter is unavailable.
const memory = new Map();
function memoryLimit(key, limit, windowSeconds) {
  const now = Date.now();
  const hits = (memory.get(key) || []).filter((t) => now - t < windowSeconds * 1000);
  if (hits.length >= limit) return false;
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 5000) memory.clear();
  return true;
}

/**
 * Returns true if the request may proceed. Uses the database so limits hold
 * across serverless instances; falls back to per-instance memory.
 */
export async function rateLimit(bucket, identifier, { limit = 5, windowSeconds = 600 } = {}) {
  const key = hashKey(`${bucket}:${identifier}`);
  const supabase = createServiceClient();
  if (supabase) {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_bucket: bucket,
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (!error) return data === true;
  }
  return memoryLimit(key, limit, windowSeconds);
}

export function jsonError(message, status = 400, extra = {}) {
  return Response.json({ ok: false, message, ...extra }, { status });
}
