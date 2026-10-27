import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import CoreList from '@/components/admin/CoreList';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Core Members' };

export default async function CorePage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('core_members').select('*').order('sort_order').order('created_at');
  return (
    <>
      <PageHeader
        title="Core Members"
        description="People shown on the About Core page, in this order."
        actions={
          <Link href="/admin/core/new" className="abtn abtn--primary">
            <Plus size={16} aria-hidden="true" /> Add Member
          </Link>
        }
      />
      <div className="a-card a-card--flush">
        {error ? (
          <EmptyState tone="light" title="Core members could not be loaded." message="Please refresh the page." />
        ) : data?.length ? (
          <CoreList members={data} />
        ) : (
          <EmptyState tone="light" title="No core members yet." message="Until members are added, the public page shows clearly marked placeholders." />
        )}
      </div>
    </>
  );
}
