import PageHeader from '@/components/admin/PageHeader';
import EventForm from '@/components/admin/EventForm';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Add Past Event' };

export default async function NewPastEvent() {
  await requireAdmin();
  return (
    <>
      <PageHeader back={{ href: '/admin/past-events', label: 'Past Events' }} title="Add past event" description="Create the archive entry first — you can upload gallery photos after saving." />
      <EventForm kind="past" />
    </>
  );
}
