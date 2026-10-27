import Link from 'next/link';
import Image from 'next/image';
import { Pencil, ExternalLink } from 'lucide-react';
import DataTable from './DataTable';
import PublishToggle from './PublishToggle';
import ConfirmAction from './ConfirmAction';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { EVENT_STATUSES, EVENT_MODES } from '@/lib/constants';
import { deleteEvent } from '@/lib/actions/events';
import { formatDate } from '@/lib/utils';

export default function EventsTable({ rows, kind }) {
  const base = kind === 'past' ? '/admin/past-events' : '/admin/events';
  const publicBase = kind === 'past' ? '/past-events' : '/events';
  const columns = [
    {
      key: 'title',
      label: 'Event',
      render: (r) => (
        <Link href={`${base}/${r.id}`} className="cell-event">
          <span className="cell-event__thumb">
            <Image src={r.image_url || '/images/site/event-fallback.jpg'} alt="" width={64} height={44} sizes="64px" />
          </span>
          <span className="cell-primary">
            <strong>{r.title}</strong>
            <span>/{r.slug}</span>
          </span>
        </Link>
      ),
    },
    {
      key: 'event_date',
      label: 'Date',
      render: (r) => (
        <span className="cell-stack">
          <span>{r.event_date ? formatDate(r.event_date, { short: true }) : 'Date TBA'}</span>
          <small>{EVENT_MODES.find((m) => m.value === r.mode)?.label}</small>
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge list={EVENT_STATUSES} value={r.status} /> },
    {
      key: 'is_published',
      label: 'Visibility',
      render: (r) => <PublishToggle id={r.id} title={r.title} published={r.is_published} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'cell-actions',
      render: (r) => (
        <div className="row-actions">
          <Link href={`${base}/${r.id}`} className="icon-btn" aria-label={`Edit ${r.title}`} title="Edit">
            <Pencil size={15} />
          </Link>
          {r.is_published && r.status !== 'draft' && (
            <a href={`${publicBase}/${r.slug}`} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`View ${r.title} on the website`} title="View on website">
              <ExternalLink size={15} />
            </a>
          )}
          <ConfirmAction action={deleteEvent} fields={{ id: r.id, back: kind }} iconOnly triggerLabel={`Delete ${r.title}`} title="Delete this event?" description={`“${r.title}” and its gallery photos will be permanently deleted.`} confirmLabel="Delete event" />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      caption={kind === 'past' ? 'Past events' : 'Events'}
      columns={columns}
      rows={rows}
      empty={
        <EmptyState
          tone="light"
          title={kind === 'past' ? 'No past events yet.' : 'No events yet.'}
          message={kind === 'past' ? 'Mark an event as Completed, or archive one here, to build the public archive.' : 'Create your first event to show it on the website.'}
          action={
            <Link href={`${base}/new`} className="abtn abtn--primary">
              {kind === 'past' ? 'Add past event' : 'Create event'}
            </Link>
          }
        />
      }
    />
  );
}
