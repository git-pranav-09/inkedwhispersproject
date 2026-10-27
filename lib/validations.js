/**
 * Dependency-free validation shared by the browser (instant feedback) and the
 * server (authoritative). The server ALWAYS re-validates; client checks are a
 * convenience only.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-()]{6,20}$/;
// Strip ASCII control characters except tab/newline/carriage return.
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function clean(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(CONTROL_RE, '').trim();
}

export function isEmail(v) {
  return EMAIL_RE.test(v);
}

/** Only http(s) URLs are accepted — blocks javascript:, data:, etc. */
export function isSafeUrl(v) {
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Field rule shape:
 *   { label, required, min, max, type: 'text'|'email'|'url'|'phone'|'int'|'enum'|'bool'|'date'|'time'|'slug',
 *     options: [...] (enum), minValue, maxValue (int) }
 */
export function validate(input, rules) {
  const data = {};
  const errors = {};
  const get = typeof input?.get === 'function' ? (k) => input.get(k) : (k) => input?.[k];

  for (const [key, rule] of Object.entries(rules)) {
    const label = rule.label || key;
    const raw = get(key);

    if (rule.type === 'bool') {
      const v = raw === true || raw === 'on' || raw === 'true' || raw === '1';
      if (rule.required && !v) errors[key] = rule.message || `${label} must be confirmed.`;
      data[key] = v;
      continue;
    }

    const value = clean(raw);

    if (!value) {
      if (rule.required) errors[key] = `${label} is required.`;
      data[key] = rule.type === 'int' ? null : rule.emptyAs !== undefined ? rule.emptyAs : null;
      continue;
    }

    if (rule.min && value.length < rule.min) {
      errors[key] = `${label} must be at least ${rule.min} characters.`;
    } else if (rule.max && value.length > rule.max) {
      errors[key] = `${label} must be ${rule.max} characters or fewer.`;
    }

    switch (rule.type) {
      case 'email':
        if (!isEmail(value)) errors[key] = 'Please enter a valid email address.';
        data[key] = value.toLowerCase();
        break;
      case 'url':
        if (!isSafeUrl(value)) errors[key] = 'Please enter a full URL beginning with https://';
        data[key] = value;
        break;
      case 'phone':
        if (!PHONE_RE.test(value)) errors[key] = 'Please enter a valid phone number.';
        data[key] = value;
        break;
      case 'int': {
        const n = Number(value);
        if (!Number.isInteger(n)) errors[key] = `${label} must be a whole number.`;
        else if (rule.minValue !== undefined && n < rule.minValue) errors[key] = `${label} must be at least ${rule.minValue}.`;
        else if (rule.maxValue !== undefined && n > rule.maxValue) errors[key] = `${label} must be ${rule.maxValue} or less.`;
        data[key] = Number.isInteger(n) ? n : null;
        break;
      }
      case 'enum':
        if (!rule.options.includes(value)) errors[key] = `Please choose a valid ${label.toLowerCase()}.`;
        data[key] = value;
        break;
      case 'date':
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) errors[key] = `${label} must be a valid date.`;
        data[key] = value;
        break;
      case 'time':
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) errors[key] = `${label} must be a valid time.`;
        data[key] = value;
        break;
      case 'slug':
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) errors[key] = 'Use lowercase letters, numbers and hyphens only.';
        data[key] = value;
        break;
      default:
        data[key] = value;
    }
  }

  return { data, errors, ok: Object.keys(errors).length === 0 };
}

// ── Public form schemas ────────────────────────────────────────────────

export const applicationRules = {
  full_name: { label: 'Full name', required: true, min: 2, max: 120 },
  email: { label: 'Email', required: true, type: 'email', max: 200 },
  phone: { label: 'Phone number', required: true, type: 'phone' },
  age: { label: 'Age', required: true, type: 'int', minValue: 10, maxValue: 100 },
  city: { label: 'City', required: true, max: 120 },
  organization: { label: 'School / College / Organization', required: true, max: 200 },
  position_title: { label: 'Position', required: true, max: 120 },
  department: { label: 'Department', required: true, max: 120 },
  motivation: { label: 'This answer', required: true, min: 20, max: 4000 },
  experience: { label: 'Relevant experience', max: 4000 },
  skills: { label: 'Skills', max: 2000 },
  portfolio_url: { label: 'Portfolio URL', type: 'url', max: 300 },
  linkedin_url: { label: 'LinkedIn URL', type: 'url', max: 300 },
  instagram_url: { label: 'Instagram URL', type: 'url', max: 300 },
  additional_info: { label: 'Additional information', max: 4000 },
  consent: { label: 'Confirmation', type: 'bool', required: true, message: 'Please confirm that the information provided is accurate.' },
};

export const INQUIRY_TYPES = [
  { value: 'general', label: 'General Query' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'event', label: 'Event' },
  { value: 'media', label: 'Media' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
];

export const contactRules = {
  name: { label: 'Name', required: true, min: 2, max: 120 },
  email: { label: 'Email', required: true, type: 'email', max: 200 },
  phone: { label: 'Phone', type: 'phone' },
  subject: { label: 'Subject', required: true, min: 2, max: 200 },
  inquiry_type: { label: 'Inquiry type', required: true, type: 'enum', options: INQUIRY_TYPES.map((t) => t.value) },
  message: { label: 'Message', required: true, min: 10, max: 5000 },
};

export const newsletterRules = {
  name: { label: 'Name', required: true, min: 2, max: 120 },
  email: { label: 'Email', required: true, type: 'email', max: 200 },
};

export const loginRules = {
  email: { label: 'Email', required: true, type: 'email', max: 200 },
  password: { label: 'Password', required: true, min: 6, max: 200 },
};
