import PageHeader from '@/components/admin/PageHeader';
import CoreMemberForm from '@/components/admin/CoreMemberForm';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Add Core Member' };

export default async function NewCoreMember() {
  await requireAdmin();
  return (
    <>
      <PageHeader back={{ href: '/admin/core', label: 'Core Members' }} title="Add core member" />
      <CoreMemberForm />
    </>
  );
}
