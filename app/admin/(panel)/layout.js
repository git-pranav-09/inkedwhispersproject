import { Suspense } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import Flash from '@/components/admin/Flash';
import { requireAdmin } from '@/lib/auth';

// Admin pages are always rendered per request (never cached or prerendered).
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }) {
  // Server-side authorization for every admin page.
  const { supabase, user, admin, profile } = await requireAdmin();

  const [apps, msgs] = await Promise.all([
    supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
  ]);

  const counts = { newApplications: apps.count || 0, unreadMessages: msgs.count || 0 };
  const shellUser = { email: user.email, name: profile?.full_name || '', role: admin.role };

  return (
    <Suspense>
      <AdminShell user={shellUser} counts={counts}>
        <Flash />
        {children}
      </AdminShell>
    </Suspense>
  );
}
