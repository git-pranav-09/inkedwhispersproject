import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/admin';
import { newsletterRules, validate } from '@/lib/validations';
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

  const { data, errors, ok } = validate(body, newsletterRules);
  if (!ok) return jsonError('Please review the highlighted fields.', 422, { errors });

  const supabase = createServiceClient();
  if (!supabase) return jsonError('Subscriptions are temporarily unavailable. Please try again later.', 503);

  const ip = getClientIp(await headers());
  if (!(await rateLimit('newsletter', ip, { limit: 6, windowSeconds: 900 }))) {
    return jsonError('Too many attempts. Please wait a few minutes and try again.', 429);
  }

  const { data: existing, error: lookupError } = await supabase
    .from('newsletter_subscribers')
    .select('id, status')
    .eq('email', data.email)
    .maybeSingle();

  if (lookupError) return jsonError('We could not complete your subscription. Please try again shortly.', 500);

  if (existing?.status === 'active') {
    return jsonError('This email is already subscribed to the Inked Whispers newsletter.', 409, {
      errors: { email: 'This email is already subscribed.' },
    });
  }

  if (existing) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'active', name: data.name })
      .eq('id', existing.id);
    if (error) return jsonError('We could not complete your subscription. Please try again shortly.', 500);
    return Response.json({ ok: true, message: 'Welcome back — your subscription has been renewed.' });
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({ name: data.name, email: data.email, source: 'website' });
  if (error) {
    if (error.code === '23505') {
      return jsonError('This email is already subscribed to the Inked Whispers newsletter.', 409, {
        errors: { email: 'This email is already subscribed.' },
      });
    }
    return jsonError('We could not complete your subscription. Please try again shortly.', 500);
  }

  return Response.json({ ok: true, message: 'Thank you — you will hear from us when there is something worth sharing.' }, { status: 201 });
}
