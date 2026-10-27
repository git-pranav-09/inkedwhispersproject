'use server';

import { adminAction, dbError, revalidatePublic } from './_shared';
import { clean, isSafeUrl, isEmail } from '@/lib/validations';
import { defaultContent } from '@/lib/site-config';
import { isPlaceholder } from '@/lib/utils';

const LIMIT = 4000;
const str = (v, max = LIMIT) => clean(v).slice(0, max);

/** Accepts a real URL, a [PLACEHOLDER], or empty. */
function urlOrPlaceholder(v, errors, key) {
  const s = str(v, 300);
  if (!s || isPlaceholder(s)) return s || defaultContent.contact[key];
  if (!isSafeUrl(s)) errors[key] = 'Enter a full URL beginning with https://';
  return s;
}

const builders = {
  contact(fd) {
    const errors = {};
    const email = str(fd.get('email'), 200);
    if (email && !isPlaceholder(email) && !isEmail(email)) errors.email = 'Enter a valid email address.';
    const value = {
      email: email || defaultContent.contact.email,
      instagram: urlOrPlaceholder(fd.get('instagram'), errors, 'instagram'),
      linkedin: urlOrPlaceholder(fd.get('linkedin'), errors, 'linkedin'),
      youtube: urlOrPlaceholder(fd.get('youtube'), errors, 'youtube'),
      other_label: str(fd.get('other_label'), 60) || defaultContent.contact.other_label,
      other_url: urlOrPlaceholder(fd.get('other_url'), errors, 'other_url'),
      location: str(fd.get('location'), 120),
    };
    return { value, errors };
  },
  home(fd) {
    const errors = {};
    const body = str(fd.get('philosophy_body'), 6000)
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const value = {
      hero_eyebrow: str(fd.get('hero_eyebrow'), 80),
      hero_headline: str(fd.get('hero_headline'), 120),
      hero_subheadline: str(fd.get('hero_subheadline'), 300),
      philosophy_heading: str(fd.get('philosophy_heading'), 300),
      philosophy_body: body,
    };
    if (!value.hero_headline) errors.hero_headline = 'A headline is required.';
    if (!body.length) errors.philosophy_body = 'Add at least one paragraph.';
    return { value, errors };
  },
  featured(fd) {
    const errors = {};
    const value = [0, 1, 2].map((i) => {
      const href = str(fd.get(`f${i}_href`), 200) || '/';
      if (!href.startsWith('/') || href.startsWith('//')) errors[`f${i}_href`] = 'Use an internal path such as /events.';
      return {
        eyebrow: str(fd.get(`f${i}_eyebrow`), 60),
        title: str(fd.get(`f${i}_title`), 120),
        excerpt: str(fd.get(`f${i}_excerpt`), 400),
        href,
        cta: str(fd.get(`f${i}_cta`), 40),
        image: defaultContent.featured[i].image,
      };
    });
    value.forEach((v, i) => {
      if (!v.title) errors[`f${i}_title`] = 'Title is required.';
    });
    return { value, errors };
  },
  journey(fd) {
    const errors = {};
    let items = [];
    try {
      items = JSON.parse(String(fd.get('journey_json') || '[]'));
    } catch {
      errors.journey = 'The timeline could not be read.';
    }
    const value = (Array.isArray(items) ? items : [])
      .slice(0, 12)
      .map((it) => ({ marker: str(it?.marker, 40), title: str(it?.title, 120), text: str(it?.text, 600) }))
      .filter((it) => it.title);
    if (!value.length) errors.journey = 'Add at least one chapter.';
    return { value, errors };
  },
  about(fd) {
    const errors = {};
    const paras = (k) =>
      str(fd.get(k), 6000)
        .split(/\r?\n\s*\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean);
    const values = [0, 1, 2, 3]
      .map((i) => ({ title: str(fd.get(`v${i}_title`), 60), text: str(fd.get(`v${i}_text`), 400) }))
      .filter((v) => v.title);
    const value = {
      who_we_are: paras('who_we_are'),
      vision: str(fd.get('vision'), 400),
      mission: str(fd.get('mission'), 400),
      values: values.length ? values : defaultContent.about.values,
    };
    if (!value.vision) errors.vision = 'Vision is required.';
    if (!value.mission) errors.mission = 'Mission is required.';
    return { value, errors };
  },
};

export async function saveContent(_prev, formData) {
  return adminAction(async ({ supabase, user }) => {
    const key = String(formData.get('key') || '');
    const build = builders[key];
    if (!build) return { ok: false, message: 'Unknown content section.' };
    const { value, errors } = build(formData);
    if (Object.keys(errors).length) return { ok: false, errors, message: 'Please review the highlighted fields.' };
    const { error } = await supabase.from('site_content').upsert({ key, value, updated_by: user.id }, { onConflict: 'key' });
    if (error) return { ok: false, message: dbError(error) };
    revalidatePublic();
    return { ok: true, message: 'Saved. The public website has been updated.' };
  });
}
