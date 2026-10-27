import { EVENT_STATUSES, EVENT_MODES, APPLICATION_STATUSES, MESSAGE_STATUSES, SUBSCRIBER_STATUSES, AVAILABILITY } from './constants';

export const eventRules = {
  title: { label: 'Title', required: true, min: 2, max: 160 },
  slug: { label: 'Slug', required: true, type: 'slug', max: 120 },
  short_description: { label: 'Short description', max: 320 },
  description: { label: 'Description', max: 12000 },
  event_date: { label: 'Date', type: 'date' },
  start_time: { label: 'Start time', type: 'time' },
  end_time: { label: 'End time', type: 'time' },
  venue: { label: 'Venue', max: 240 },
  mode: { label: 'Mode', required: true, type: 'enum', options: EVENT_MODES.map((m) => m.value) },
  event_type: { label: 'Event type', max: 80 },
  fee: { label: 'Fee', max: 80 },
  registration_url: { label: 'Registration URL', type: 'url', max: 500 },
  rules: { label: 'Rules', max: 8000 },
  guidelines: { label: 'Guidelines', max: 8000 },
  organizer_name: { label: 'Organiser name', max: 160 },
  organizer_info: { label: 'Organiser information', max: 1000 },
  contact_email: { label: 'Contact email', type: 'email', max: 200 },
  contact_phone: { label: 'Contact phone', type: 'phone' },
  status: { label: 'Status', required: true, type: 'enum', options: EVENT_STATUSES.map((s) => s.value) },
  is_published: { label: 'Published', type: 'bool' },
  highlights: { label: 'Highlights', max: 8000 },
  results: { label: 'Results', max: 8000 },
  certificate_info: { label: 'Certificate information', max: 4000 },
};

export const positionRules = {
  title: { label: 'Position name', required: true, max: 120 },
  department: { label: 'Department', required: true, max: 120 },
  description: { label: 'Description', max: 2000 },
  responsibilities: { label: 'Responsibilities', max: 4000 },
  requirements: { label: 'Requirements', max: 4000 },
  availability: { label: 'Availability', required: true, type: 'enum', options: AVAILABILITY },
  commitment: { label: 'Commitment', max: 120 },
  sort_order: { label: 'Order', type: 'int', minValue: 0, maxValue: 9999 },
  is_active: { label: 'Visible', type: 'bool' },
};

export const coreMemberRules = {
  name: { label: 'Name', required: true, max: 120 },
  designation: { label: 'Designation', required: true, max: 120 },
  bio: { label: 'Bio', max: 4000 },
  responsibilities: { label: 'Responsibilities', max: 2000 },
  instagram_url: { label: 'Instagram URL', type: 'url', max: 300 },
  linkedin_url: { label: 'LinkedIn URL', type: 'url', max: 300 },
  email: { label: 'Email', type: 'email', max: 200 },
  is_active: { label: 'Visible', type: 'bool' },
};

export const applicationStatusValues = APPLICATION_STATUSES.map((s) => s.value);
export const messageStatusValues = MESSAGE_STATUSES.map((s) => s.value);
export const subscriberStatusValues = SUBSCRIBER_STATUSES.map((s) => s.value);

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
