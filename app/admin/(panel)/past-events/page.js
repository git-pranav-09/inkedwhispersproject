import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import FilterBar from '@/components/admin/FilterBar';
import EventsTable from '@/components/admin/EventsTable';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';
import { safeTerm, one } from '@/lib/admin-queries';

export const metadata = { title: 'Past Events' };

export default async function PastEventsAdmin({ searchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const q = safeTerm(one(sp?.q));
  let query = supabase.from('events').select('id, title, slug, image_url, event_date, mode, status, is_published').eq('status', 'completed');
  if (q) query = query.ilike('title', `%${q}%`);
  const { data, error } = await query.order('event_date', { ascending: false, nullsFirst: false }).limit(200);

  return (
    <>
      <PageHeader
        title="Past Events"
        description="The public archive: winners, highlights, results, certificates and photo galleries."
        actions={
          <Link href="/admin/past-events/new" className="abtn abtn--primary">
            <Plus size={16} aria-hidden="true" /> Add Past Event
          </Link>
        }
      />
      <FilterBar action="/admin/past-events" q={q} placeholder="Search past events…" resetHref="/admin/past-events" />
      <div className="a-card a-card--flush">{error ? <EmptyState tone="light" title="Past events could not be loaded." message="Please refresh the page." /> : <EventsTable rows={data} kind="past" />}</div>
    </>
  );
}
