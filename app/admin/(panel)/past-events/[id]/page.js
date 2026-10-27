import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import EventForm from '@/components/admin/EventForm';
import GalleryManager from '@/components/admin/GalleryManager';
import ConfirmAction from '@/components/admin/ConfirmAction';
import StatusBadge from '@/components/ui/StatusBadge';
import { requireAdmin } from '@/lib/auth';
import { EVENT_STATUSES } from '@/lib/constants';
import { UUID_RE } from '@/lib/validations-admin';
import { deleteEvent } from '@/lib/actions/events';

export const metadata = { title: 'Edit Past Event' };

export default async function EditPastEvent({ params }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const [{ data: event }, { data: images }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).maybeSingle(),
    supabase.from('event_gallery').select('id, image_url, caption, sort_order').eq('event_id', id).order('sort_order').order('created_at'),
  ]);
  if (!event) notFound();

  return (
    <>
      <PageHeader
        back={{ href: '/admin/past-events', label: 'Past Events' }}
        title={event.title}
        description={<StatusBadge list={EVENT_STATUSES} value={event.status} />}
        actions={
          <>
            {event.is_published && event.status === 'completed' && (
              <a href={`/past-events/${event.slug}`} target="_blank" rel="noopener noreferrer" className="abtn abtn--ghost">
                <ExternalLink size={15} aria-hidden="true" /> View live
              </a>
            )}
            <ConfirmAction action={deleteEvent} fields={{ id: event.id, back: 'past' }} title="Delete this past event?" description={`“${event.title}” and all of its gallery photos will be permanently deleted.`} triggerLabel="Delete" confirmLabel="Delete event" />
          </>
        }
      />
      <EventForm event={event} kind="past" />
      <GalleryManager eventId={event.id} images={images || []} />
    </>
  );
}
