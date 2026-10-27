import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/admin';
import { contactRules, validate } from '@/lib/validations';
import { getClientIp, isSameOrigin, jsonError, rateLimit } from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError('Invalid request origin.', 403);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request.');
  }
  if (!body || typeof body !== 'object') return jsonError('Invalid request.');
  if (body.website) return Response.json({ ok: true });

  const { data, errors, ok } = validate(body, contactRules);
  if (!ok) return jsonError('Please review the highlighted fields.', 422, { errors });

  const supabase = createServiceClient();
  if (!supabase) return jsonError('Messaging is temporarily unavailable. Please email us directly.', 503);

  const ip = getClientIp(await headers());
  if (!(await rateLimit('contact', ip, { limit: 5, windowSeconds: 900 }))) {
    return jsonError('You have sent several messages recently. Please wait a few minutes before trying again.', 429);
  }

  const { error } = await supabase.from('contact_messages').insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    inquiry_type: data.inquiry_type,
    message: data.message,
  });

  if (error) {
    console.error('[contact] insert failed', error.code);
    return jsonError('We could not send your message. Please try again shortly.', 500);
  }

  return Response.json({ ok: true, message: 'Message received.' }, { status: 201 });
}
