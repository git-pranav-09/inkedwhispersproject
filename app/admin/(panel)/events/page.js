import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import FilterBar from '@/components/admin/FilterBar';
import EventsTable from '@/components/admin/EventsTable';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';
import { EVENT_STATUSES } from '@/lib/constants';
import { safeTerm, one } from '@/lib/admin-queries';

export const metadata = { title: 'Events' };

export default async function EventsAdmin({ searchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const q = safeTerm(one(sp?.q));
  const statuses = EVENT_STATUSES.filter((s) => s.value !== 'completed');
  const status = statuses.some((s) => s.value === one(sp?.status)) ? one(sp?.status) : '';

  let query = supabase.from('events').select('id, title, slug, image_url, event_date, mode, status, is_published').neq('status', 'completed');
  if (q) query = query.ilike('title', `%${q}%`);
  if (status) query = query.eq('status', status);
  const { data, error } = await query.order('event_date', { ascending: true, nullsFirst: false }).limit(200);

  return (
    <>
      <PageHeader
        title="Events"
        description="Upcoming and current events. Only published events appear on the website. Set an event to Completed to move it to Past Events."
        actions={
          <Link href="/admin/events/new" className="abtn abtn--primary">
            <Plus size={16} aria-hidden="true" /> New Event
          </Link>
        }
      />
      <FilterBar action="/admin/events" q={q} placeholder="Search events…" resetHref="/admin/events" selects={[{ name: 'status', label: 'Statuses', value: status, options: statuses }]} />
      <div className="a-card a-card--flush">{error ? <EmptyState tone="light" title="Events could not be loaded." message="Please refresh the page." /> : <EventsTable rows={data} kind="upcoming" />}</div>
    </>
  );
}
