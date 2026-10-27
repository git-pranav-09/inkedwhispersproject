import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import FilterBar from '@/components/admin/FilterBar';
import DataTable from '@/components/admin/DataTable';
import Pagination from '@/components/admin/Pagination';
import StatusSelect from '@/components/admin/StatusSelect';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';
import { MESSAGE_STATUSES } from '@/lib/constants';
import { INQUIRY_TYPES } from '@/lib/validations';
import { messageFilters, pageOf } from '@/lib/admin-queries';
import { updateMessageStatus } from '@/lib/actions/messages';
import { formatDateTime, cx } from '@/lib/utils';

export const metadata = { title: 'Contact Messages' };
const PAGE_SIZE = 25;

export default async function MessagesPage({ searchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const f = messageFilters(sp);
  const page = pageOf(sp);

  let q = supabase.from('contact_messages').select('id, name, email, subject, inquiry_type, message, status, created_at', { count: 'exact' });
  if (f.q) q = q.or(`name.ilike.%${f.q}%,email.ilike.%${f.q}%,subject.ilike.%${f.q}%`);
  if (f.status) q = q.eq('status', f.status);
  if (f.type) q = q.eq('inquiry_type', f.type);
  const { data: rows, count, error } = await q.order('created_at', { ascending: false }).range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const typeLabel = (v) => INQUIRY_TYPES.find((t) => t.value === v)?.label || v;
  const columns = [
    {
      key: 'subject',
      label: 'Message',
      render: (r) => (
        <Link href={`/admin/messages/${r.id}`} className={cx('cell-primary', r.status === 'unread' && 'is-unread')}>
          <strong>{r.subject}</strong>
          <span>{r.message.slice(0, 110)}{r.message.length > 110 ? '…' : ''}</span>
        </Link>
      ),
    },
    {
      key: 'name',
      label: 'From',
      render: (r) => (
        <span className="cell-stack">
          <span>{r.name}</span>
          <small>{r.email}</small>
        </span>
      ),
    },
    { key: 'inquiry_type', label: 'Type', render: (r) => <span className="tag">{typeLabel(r.inquiry_type)}</span> },
    { key: 'created_at', label: 'Received', render: (r) => <span className="cell-muted">{formatDateTime(r.created_at)}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusSelect action={updateMessageStatus} id={r.id} value={r.status} options={MESSAGE_STATUSES} compact label={`Status for message from ${r.name}`} /> },
  ];

  return (
    <>
      <PageHeader title="Contact Messages" description="Enquiries sent through the Contact page." />
      <FilterBar
        action="/admin/messages"
        q={f.q}
        placeholder="Search name, email or subject…"
        resetHref="/admin/messages"
        selects={[
          { name: 'status', label: 'Statuses', value: f.status, options: MESSAGE_STATUSES },
          { name: 'type', label: 'Types', value: f.type, options: INQUIRY_TYPES },
        ]}
      />
      {error ? (
        <EmptyState tone="light" title="Messages could not be loaded." message="Please refresh the page." />
      ) : (
        <div className="a-card a-card--flush">
          <DataTable caption="Contact messages" columns={columns} rows={rows} empty={<EmptyState tone="light" title={f.q || f.status || f.type ? 'No messages match.' : 'No messages yet.'} message="Messages from the Contact page will appear here." />} />
          <Pagination page={page} pageSize={PAGE_SIZE} total={count || 0} basePath="/admin/messages" params={f} />
        </div>
      )}
    </>
  );
}
