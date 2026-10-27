import { Download } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import FilterBar from '@/components/admin/FilterBar';
import DataTable from '@/components/admin/DataTable';
import Pagination from '@/components/admin/Pagination';
import StatusSelect from '@/components/admin/StatusSelect';
import ConfirmAction from '@/components/admin/ConfirmAction';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';
import { SUBSCRIBER_STATUSES } from '@/lib/constants';
import { subscriberFilters, applySubscriberFilters, pageOf } from '@/lib/admin-queries';
import { updateSubscriberStatus, deleteSubscriber } from '@/lib/actions/newsletter';
import { formatDateTime } from '@/lib/utils';

export const metadata = { title: 'Newsletter' };
const PAGE_SIZE = 30;

export default async function NewsletterPage({ searchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const f = subscriberFilters(sp);
  const page = pageOf(sp);

  const [{ data: rows, count, error }, active] = await Promise.all([
    applySubscriberFilters(supabase.from('newsletter_subscribers').select('id, name, email, status, source, created_at', { count: 'exact' }), f).range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1),
    supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ]);
  const exportQs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <strong className="cell-strong">{r.name || '—'}</strong> },
    {
      key: 'email',
      label: 'Email',
      render: (r) => (
        <a href={`mailto:${r.email}`} className="a-link">
          {r.email}
        </a>
      ),
    },
    { key: 'created_at', label: 'Subscribed', render: (r) => <span className="cell-muted">{formatDateTime(r.created_at)}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusSelect action={updateSubscriberStatus} id={r.id} value={r.status} options={SUBSCRIBER_STATUSES} compact label={`Status for ${r.email}`} /> },
    {
      key: 'actions',
      label: 'Actions',
      className: 'cell-actions',
      render: (r) => <ConfirmAction action={deleteSubscriber} fields={{ id: r.id }} iconOnly triggerLabel={`Delete ${r.email}`} title="Delete subscriber?" description={`${r.email} will be permanently removed from the list.`} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Newsletter"
        description={`${active.count ?? 0} active subscriber${active.count === 1 ? '' : 's'}. Duplicate sign-ups are blocked automatically.`}
        actions={
          <a href={`/api/admin/export/newsletter${exportQs ? `?${exportQs}` : ''}`} className="abtn abtn--ghost" download>
            <Download size={16} aria-hidden="true" /> Export CSV
          </a>
        }
      />
      <FilterBar
        action="/admin/newsletter"
        q={f.q}
        placeholder="Search name or email…"
        resetHref="/admin/newsletter"
        selects={[
          { name: 'status', label: 'Statuses', value: f.status, options: SUBSCRIBER_STATUSES },
          { name: 'sort', label: 'Sort', value: f.sort, all: false, options: [{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }] },
        ]}
      />
      {error ? (
        <EmptyState tone="light" title="Subscribers could not be loaded." message="Please refresh the page." />
      ) : (
        <div className="a-card a-card--flush">
          <DataTable caption="Newsletter subscribers" columns={columns} rows={rows} empty={<EmptyState tone="light" title={f.q || f.status ? 'No subscribers match.' : 'No subscribers yet.'} message="Sign-ups from the Newsletter page and footer appear here." />} />
          <Pagination page={page} pageSize={PAGE_SIZE} total={count || 0} basePath="/admin/newsletter" params={f} />
        </div>
      )}
    </>
  );
}
