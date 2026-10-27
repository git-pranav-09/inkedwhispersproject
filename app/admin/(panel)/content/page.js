import PageHeader from '@/components/admin/PageHeader';
import ContentEditor from '@/components/admin/ContentEditor';
import { requireAdmin } from '@/lib/auth';
import { defaultContent } from '@/lib/site-config';

export const metadata = { title: 'Website Content' };

export default async function ContentPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('site_content').select('key, value');
  const content = structuredClone(defaultContent);
  for (const row of data || []) {
    const base = defaultContent[row.key];
    if (!base) continue;
    if (Array.isArray(base)) content[row.key] = Array.isArray(row.value) && row.value.length ? row.value : base;
    else content[row.key] = { ...base, ...(row.value || {}) };
  }
  return (
    <>
      <PageHeader title="Website Content" description="Edit the words on the public website. Each section saves independently and updates the live site immediately." />
      <ContentEditor content={content} />
    </>
  );
}
