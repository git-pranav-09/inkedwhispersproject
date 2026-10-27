export const APPLICATION_STATUSES = [
  { value: 'new', label: 'New', tone: 'info', icon: 'Sparkles' },
  { value: 'under_review', label: 'Under Review', tone: 'warning', icon: 'Eye' },
  { value: 'shortlisted', label: 'Shortlisted', tone: 'gold', icon: 'Star' },
  { value: 'selected', label: 'Selected', tone: 'success', icon: 'CircleCheck' },
  { value: 'rejected', label: 'Rejected', tone: 'danger', icon: 'CircleX' },
];

export const EVENT_STATUSES = [
  { value: 'draft', label: 'Draft', tone: 'muted', icon: 'FilePen' },
  { value: 'published', label: 'Published', tone: 'info', icon: 'Globe' },
  { value: 'registration_open', label: 'Registration Open', tone: 'success', icon: 'DoorOpen' },
  { value: 'registration_closed', label: 'Registration Closed', tone: 'warning', icon: 'Lock' },
  { value: 'completed', label: 'Completed', tone: 'gold', icon: 'Archive' },
];

export const EVENT_MODES = [
  { value: 'offline', label: 'In person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const MESSAGE_STATUSES = [
  { value: 'unread', label: 'Unread', tone: 'info', icon: 'Mail' },
  { value: 'read', label: 'Read', tone: 'muted', icon: 'MailOpen' },
  { value: 'resolved', label: 'Resolved', tone: 'success', icon: 'CircleCheck' },
];

export const SUBSCRIBER_STATUSES = [
  { value: 'active', label: 'Active', tone: 'success', icon: 'CircleCheck' },
  { value: 'unsubscribed', label: 'Unsubscribed', tone: 'muted', icon: 'CircleMinus' },
];

export const AVAILABILITY = ['Open', 'Limited', 'Closed'];

export function findStatus(list, value) {
  return list.find((s) => s.value === value) || { value, label: value, tone: 'muted', icon: 'Circle' };
}

/** Public-facing registration state for an event. */
export function registrationState(event) {
  if (event.status === 'registration_open' && event.registration_url) return { key: 'open', label: 'Register Now' };
  if (event.status === 'registration_open') return { key: 'open-soon', label: 'Registration Open' };
  if (event.status === 'registration_closed') return { key: 'closed', label: 'Registration Closed' };
  if (event.status === 'completed') return { key: 'completed', label: 'Completed' };
  return { key: 'upcoming', label: 'Upcoming' };
}
