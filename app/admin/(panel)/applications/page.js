import Link from 'next/link';
import { Download, Eye } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import FilterBar from '@/components/admin/FilterBar';
import DataTable from '@/components/admin/DataTable';
import Pagination from '@/components/admin/Pagination';
import StatusSelect from '@/components/admin/StatusSelect';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { applicationFilters, applyApplicationFilters, pageOf } from '@/lib/admin-queries';
import { updateApplicationStatus } from '@/lib/actions/applications';
import { formatDateTime } from '@/lib/utils';

export const metadata = { title: 'Applications' };

const PAGE_SIZE = 20;

export default async function ApplicationsPage({ searchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const f = applicationFilters(sp);
  const page = pageOf(sp);

  const listQuery = applyApplicationFilters(
    supabase.from('applications').select('id, full_name, email, city, position_title, department, status, created_at', { count: 'exact' }),
    f
  ).range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const [{ data: rows, count, error }, { data: facets }] = await Promise.all([
    listQuery,
    supabase.from('applications').select('department, position_title').limit(5000),
  ]);

  const departments = [...new Set((facets || []).map((r) => r.department))].sort();
  const positions = [...new Set((facets || []).filter((r) => !f.department || r.department === f.department).map((r) => r.position_title))].sort();
  const exportQs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();

  const columns = [
    {
      key: 'full_name',
      label: 'Applicant',
      render: (r) => (
        <Link href={`/admin/applications/${r.id}`} className="cell-primary">
          <strong>{r.full_name}</strong>
          <span>{r.email}</span>
        </Link>
      ),
    },
    {
      key: 'position_title',
      label: 'Position',
      render: (r) => (
        <span className="cell-stack">
          <span>{r.position_title}</span>
          <small>{r.department}</small>
        </span>
      ),
    },
    { key: 'city', label: 'City' },
    { key: 'created_at', label: 'Applied', render: (r) => <span className="cell-muted">{formatDateTime(r.created_at)}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusSelect action={updateApplicationStatus} id={r.id} value={r.status} options={APPLICATION_STATUSES} compact label={`Status for ${r.full_name}`} />,
    },
    {
      key: 'view',
      label: 'Actions',
      className: 'cell-actions',
      render: (r) => (
        <Link href={`/admin/applications/${r.id}`} className="abtn abtn--ghost abtn--sm">
          <Eye size={14} aria-hidden="true" /> Open
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Applications"
        description="Every application submitted through the Join Us page. Visible only to administrators."
        actions={
          <a href={`/api/admin/export/applications${exportQs ? `?${exportQs}` : ''}`} className="abtn abtn--ghost" download>
            <Download size={16} aria-hidden="true" /> Export CSV
          </a>
        }
      />

      <FilterBar
        action="/admin/applications"
        q={f.q}
        placeholder="Search name, email, city, institution…"
        resetHref="/admin/applications"
        selects={[
          { name: 'department', label: 'Departments', value: f.department, options: departments },
          { name: 'position', label: 'Positions', value: f.position, options: positions },
          { name: 'status', label: 'Statuses', value: f.status, options: APPLICATION_STATUSES },
          { name: 'sort', label: 'Sort', value: f.sort, all: false, options: [{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }] },
        ]}
      />

      {error ? (
        <EmptyState tone="light" title="Applications could not be loaded." message="Please refresh the page. If the problem continues, confirm the database schema is installed." />
      ) : (
        <div className="a-card a-card--flush">
          <DataTable
            caption="Applications"
            columns={columns}
            rows={rows}
            empty={<EmptyState tone="light" title={f.q || f.status || f.department ? 'No applications match these filters.' : 'No applications yet.'} message={f.q || f.status || f.department ? 'Try adjusting or resetting the filters.' : 'When someone applies through the Join Us page, their application will appear here.'} />}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={count || 0} basePath="/admin/applications" params={f} />
        </div>
      )}
    </>
  );
}
