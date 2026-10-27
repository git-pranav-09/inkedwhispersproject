import { getAdminContext } from '@/lib/auth';
import { subscriberFilters, applySubscriberFilters } from '@/lib/admin-queries';
import { toCsv, todayIST } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const ctx = await getAdminContext();
  if (!ctx?.admin) return new Response('Unauthorized', { status: 401 });

  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const f = subscriberFilters(sp);
  const { data, error } = await applySubscriberFilters(ctx.supabase.from('newsletter_subscribers').select('*'), f).limit(50000);
  if (error) return new Response('Export failed', { status: 500 });

  const csv = toCsv(data || [], [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Status', key: 'status' },
    { label: 'Source', key: 'source' },
    { label: 'Subscribed', value: (r) => new Date(r.created_at).toISOString() },
  ]);

  return new Response('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inked-whispers-newsletter-${todayIST()}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
