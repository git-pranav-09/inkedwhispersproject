import { notFound, redirect } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import EventForm from '@/components/admin/EventForm';
import ConfirmAction from '@/components/admin/ConfirmAction';
import StatusBadge from '@/components/ui/StatusBadge';
import { requireAdmin } from '@/lib/auth';
import { EVENT_STATUSES } from '@/lib/constants';
import { UUID_RE } from '@/lib/validations-admin';
import { deleteEvent } from '@/lib/actions/events';

export const metadata = { title: 'Edit Event' };

export default async function EditEvent({ params }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data: event } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  if (!event) notFound();
  if (event.status === 'completed') redirect(`/admin/past-events/${id}`);

  return (
    <>
      <PageHeader
        back={{ href: '/admin/events', label: 'Events' }}
        title={event.title}
        description={<StatusBadge list={EVENT_STATUSES} value={event.status} />}
        actions={
          <>
            {event.is_published && event.status !== 'draft' && (
              <a href={`/events/${event.slug}`} target="_blank" rel="noopener noreferrer" className="abtn abtn--ghost">
                <ExternalLink size={15} aria-hidden="true" /> View live
              </a>
            )}
            <ConfirmAction action={deleteEvent} fields={{ id: event.id, back: 'upcoming' }} title="Delete this event?" description={`“${event.title}” will be permanently deleted.`} triggerLabel="Delete" confirmLabel="Delete event" />
          </>
        }
      />
      <EventForm event={event} kind="upcoming" />
    </>
  );
}
