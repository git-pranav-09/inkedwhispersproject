import { notFound } from 'next/navigation';
import PageHeader from '@/components/admin/PageHeader';
import CoreMemberForm from '@/components/admin/CoreMemberForm';
import { requireAdmin } from '@/lib/auth';
import { UUID_RE } from '@/lib/validations-admin';

export const metadata = { title: 'Edit Core Member' };

export default async function EditCoreMember({ params }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data: member } = await supabase.from('core_members').select('*').eq('id', id).maybeSingle();
  if (!member) notFound();
  return (
    <>
      <PageHeader back={{ href: '/admin/core', label: 'Core Members' }} title={member.name} description={member.designation} />
      <CoreMemberForm member={member} />
    </>
  );
}
