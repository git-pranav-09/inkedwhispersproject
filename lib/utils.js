/** Join class names, skipping falsy values. */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const shortDateFmt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
const dateTimeFmt = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
});

/** Formats a `date` column (YYYY-MM-DD) without timezone drift. */
export function formatDate(value, { short = false } = {}) {
  if (!value) return 'Date to be announced';
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return 'Date to be announced';
  return (short ? shortDateFmt : dateFmt).format(d);
}

export function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : dateTimeFmt.format(d);
}

/** Splits a date into the parts used by the editorial date stamp. */
export function dateParts(value) {
  if (!value) return null;
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getUTCDate()).padStart(2, '0'),
    month: d.toLocaleString('en-IN', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
    year: d.getUTCFullYear(),
  };
}

/** "18:30:00" → "6:30 PM" */
export function formatTime(value) {
  if (!value) return null;
  const [h, m] = String(value).split(':').map(Number);
  if (Number.isNaN(h)) return null;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m || 0).padStart(2, '0')} ${suffix}`;
}

export function formatTimeRange(start, end) {
  const s = formatTime(start);
  const e = formatTime(end);
  if (s && e) return `${s} – ${e}`;
  return s || 'Time to be announced';
}

export function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

/** Converts multi-line text into a clean array of non-empty lines. */
export function toLines(text) {
  if (!text) return [];
  return String(text)
    .split(/\r?\n/)
    .map((l) => l.replace(/^[\s•\-–*]+/, '').trim())
    .filter(Boolean);
}

/** Splits text into paragraphs on blank lines. */
export function toParagraphs(text) {
  if (!text) return [];
  return String(text)
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Today's date (YYYY-MM-DD) in India Standard Time. */
export function todayIST() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

/**
 * CSV cell escaping with spreadsheet formula-injection protection
 * (values starting with = + - @ are prefixed with an apostrophe).
 */
export function csvCell(value) {
  if (value === null || value === undefined) return '';
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows, columns) {
  const header = columns.map((c) => csvCell(c.label)).join(',');
  const body = rows.map((row) => columns.map((c) => csvCell(typeof c.value === 'function' ? c.value(row) : row[c.key])).join(','));
  return [header, ...body].join('\r\n');
}

export function initials(name) {
  return String(name || '?')
    .replace(/\[|\]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'IW';
}

/** Returns true when a value is still an unfilled [PLACEHOLDER]. */
export function isPlaceholder(value) {
  return !value || /^\[.*\]$/.test(String(value).trim());
}
