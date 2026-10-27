import { getAdminContext } from '@/lib/auth';
import { applicationFilters, applyApplicationFilters } from '@/lib/admin-queries';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { toCsv, todayIST } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const ctx = await getAdminContext();
  if (!ctx?.admin) return new Response('Unauthorized', { status: 401 });

  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const f = applicationFilters(sp);
  const { data, error } = await applyApplicationFilters(ctx.supabase.from('applications').select('*'), f).limit(10000);
  if (error) return new Response('Export failed', { status: 500 });

  const label = (v) => APPLICATION_STATUSES.find((s) => s.value === v)?.label || v;
  const csv = toCsv(data || [], [
    { label: 'Submitted', value: (r) => new Date(r.created_at).toISOString() },
    { label: 'Full name', key: 'full_name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Age', key: 'age' },
    { label: 'City', key: 'city' },
    { label: 'College / Organisation', key: 'organization' },
    { label: 'Department', key: 'department' },
    { label: 'Position', key: 'position_title' },
    { label: 'Status', value: (r) => label(r.status) },
    { label: 'Motivation', key: 'motivation' },
    { label: 'Experience', key: 'experience' },
    { label: 'Skills', key: 'skills' },
    { label: 'Portfolio', key: 'portfolio_url' },
    { label: 'LinkedIn', key: 'linkedin_url' },
    { label: 'Instagram', key: 'instagram_url' },
    { label: 'Additional info', key: 'additional_info' },
    { label: 'Resume on file', value: (r) => (r.resume_path ? 'Yes' : 'No') },
    { label: 'Admin notes', key: 'admin_notes' },
  ]);

  return new Response('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inked-whispers-applications-${todayIST()}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
