import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/admin';
import { applicationRules, validate } from '@/lib/validations';
import { getClientIp, isSameOrigin, jsonError, rateLimit } from '@/lib/security';
import { hasFile, inspectResume, objectPath } from '@/lib/storage';

export const runtime = 'nodejs';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError('Invalid request origin.', 403);

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 4.5 * 1024 * 1024) return jsonError('Your submission is too large. Résumés must be 4 MB or smaller.', 413);

  let form;
  try {
    form = await request.formData();
  } catch {
    return jsonError('We could not read your submission. Please try again.');
  }

  // Honeypot: pretend success so bots learn nothing.
  if (form.get('website')) return Response.json({ ok: true });

  const supabase = createServiceClient();
  if (!supabase) return jsonError('Applications are temporarily unavailable. Please try again later.', 503);

  const ip = getClientIp(await headers());
  if (!(await rateLimit('application', ip, { limit: 5, windowSeconds: 3600 }))) {
    return jsonError('Too many submissions from this network. Please try again in an hour.', 429);
  }

  const { data, errors, ok } = validate(form, applicationRules);

  // The position is resolved on the server — never trust client-sent titles.
  const positionId = String(form.get('position_id') || '');
  let position = null;
  if (UUID_RE.test(positionId)) {
    const { data: p } = await supabase
      .from('positions')
      .select('id, title, department, availability, is_active')
      .eq('id', positionId)
      .maybeSingle();
    if (p && p.is_active && p.availability !== 'Closed') position = p;
  }
  if (!position) errors.position_title = 'Please choose an open position.';

  // Optional résumé
  const resume = form.get('resume');
  let resumeInfo = null;
  if (hasFile(resume)) {
    resumeInfo = await inspectResume(resume);
    if (!resumeInfo.ok) errors.resume = resumeInfo.error;
  }

  if (!ok || Object.keys(errors).length) {
    return jsonError('Please review the highlighted fields.', 422, { errors });
  }

  let resume_path = null;
  if (resumeInfo?.ok) {
    resume_path = objectPath('applications', 'pdf');
    const { error: upErr } = await supabase.storage.from('resumes').upload(resume_path, resumeInfo.bytes, {
      contentType: 'application/pdf',
      upsert: false,
    });
    if (upErr) return jsonError('Your résumé could not be uploaded. Please try again, or submit without it.', 500);
  }

  const { error } = await supabase.from('applications').insert({
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    age: data.age,
    city: data.city,
    organization: data.organization,
    position_id: position.id,
    position_title: position.title,
    department: position.department,
    motivation: data.motivation,
    experience: data.experience,
    skills: data.skills,
    portfolio_url: data.portfolio_url,
    linkedin_url: data.linkedin_url,
    instagram_url: data.instagram_url,
    additional_info: data.additional_info,
    resume_path,
    consent: true,
  });

  if (error) {
    if (resume_path) await supabase.storage.from('resumes').remove([resume_path]);
    console.error('[applications] insert failed', error.code);
    return jsonError('We could not save your application. Please try again shortly.', 500);
  }

  return Response.json({ ok: true, message: 'Application received.' }, { status: 201 });
}
