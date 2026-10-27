import PageHeader from '@/components/admin/PageHeader';
import EventForm from '@/components/admin/EventForm';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'New Event' };

export default async function NewEvent() {
  await requireAdmin();
  return (
    <>
      <PageHeader back={{ href: '/admin/events', label: 'Events' }} title="New event" description="Save as Draft while you prepare it; publish when ready." />
      <EventForm kind="upcoming" />
    </>
  );
}
