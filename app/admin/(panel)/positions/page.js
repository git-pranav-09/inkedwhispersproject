import PageHeader from '@/components/admin/PageHeader';
import PositionsManager from '@/components/admin/PositionsManager';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Positions' };

export default async function PositionsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('positions').select('*').order('department').order('sort_order').order('title');
  return (
    <>
      <PageHeader title="Positions" description="Departments and roles shown on the Join Us page. Changes appear on the website immediately." />
      {error ? <EmptyState tone="light" title="Positions could not be loaded." message="Please refresh the page." /> : <PositionsManager positions={data || []} />}
    </>
  );
}
