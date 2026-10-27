import Link from 'next/link';
import { FileText, Sparkles, CalendarDays, Archive, Mail, MessageSquare, ArrowRight, Plus } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import DashboardCard from '@/components/admin/DashboardCard';
import { ColumnChart, BarList } from '@/components/admin/Charts';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';
import { APPLICATION_STATUSES, MESSAGE_STATUSES } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import { INQUIRY_TYPES } from '@/lib/validations';

export const metadata = { title: 'Dashboard' };

function weekBuckets(rows, weeks = 8) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay() - (weeks - 1) * 7);
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 7);
    return { start: d, label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), value: 0 };
  });
  for (const r of rows) {
    const t = new Date(r.created_at);
    const idx = Math.floor((t - start) / (7 * 864e5));
    if (idx >= 0 && idx < weeks) buckets[idx].value++;
  }
  return buckets.map(({ label, value }) => ({ label, value }));
}

function tally(rows, key, labelFor = (v) => v) {
  const map = new Map();
  rows.forEach((r) => map.set(r[key], (map.get(r[key]) || 0) + 1));
  return [...map.entries()].map(([k, v]) => ({ label: labelFor(k), value: v })).sort((a, b) => b.value - a.value);
}

export default async function DashboardPage() {
  const { supabase, profile } = await requireAdmin();
  const since = new Date(Date.now() - 56 * 864e5).toISOString();
  const head = { count: 'exact', head: true };

  const [total, fresh, upcoming, past, subs, unread, recentApps, recentMsgs, allApps] = await Promise.all([
    supabase.from('applications').select('id', head),
    supabase.from('applications').select('id', head).eq('status', 'new'),
    supabase.from('events').select('id', head).in('status', ['draft', 'published', 'registration_open', 'registration_closed']),
    supabase.from('events').select('id', head).eq('status', 'completed'),
    supabase.from('newsletter_subscribers').select('id', head).eq('status', 'active'),
    supabase.from('contact_messages').select('id', head).eq('status', 'unread'),
    supabase.from('applications').select('id, full_name, position_title, department, status, created_at').order('created_at', { ascending: false }).limit(6),
    supabase.from('contact_messages').select('id, name, subject, inquiry_type, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('applications').select('department, status, created_at').limit(5000),
  ]);

  const failed = [total, fresh, upcoming, past, subs, unread].some((r) => r.error);
  const appsRows = allApps.data || [];
  const weekly = weekBuckets(appsRows.filter((r) => r.created_at >= since));
  const byDept = tally(appsRows, 'department').slice(0, 8);
  const byStatus = tally(appsRows, 'status', (v) => APPLICATION_STATUSES.find((s) => s.value === v)?.label || v);

  const hour = Number(new Intl.DateTimeFormat('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date()));
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={`${greeting}${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}.`}
        description="Here is what is happening across Inked Whispers today."
        actions={
          <>
            <Link href="/admin/events/new" className="abtn abtn--primary">
              <Plus size={16} aria-hidden="true" /> New Event
            </Link>
            <Link href="/admin/applications?status=new" className="abtn abtn--ghost">
              Review Applications
            </Link>
          </>
        }
      />

      {failed && (
        <div className="a-alert" role="alert">
          Some statistics could not be loaded. Confirm the database schema has been applied and your account is listed in <code>public.admins</code>.
        </div>
      )}

      <section className="stat-grid" aria-label="Key figures">
        <DashboardCard label="Total Applications" value={total.count ?? 0} icon={FileText} href="/admin/applications" />
        <DashboardCard label="New Applications" value={fresh.count ?? 0} icon={Sparkles} href="/admin/applications?status=new" accent hint="Awaiting first review" />
        <DashboardCard label="Upcoming Events" value={upcoming.count ?? 0} icon={CalendarDays} href="/admin/events" hint="Including drafts" />
        <DashboardCard label="Past Events" value={past.count ?? 0} icon={Archive} href="/admin/past-events" />
        <DashboardCard label="Newsletter Subscribers" value={subs.count ?? 0} icon={Mail} href="/admin/newsletter" hint="Active" />
        <DashboardCard label="Unread Messages" value={unread.count ?? 0} icon={MessageSquare} href="/admin/messages?status=unread" />
      </section>

      <section className="a-grid a-grid--2-1">
        <div className="a-card">
          <div className="a-card__head">
            <h2 className="a-card__title">Applications · last 8 weeks</h2>
          </div>
          <ColumnChart data={weekly} label="Applications received per week" />
        </div>
        <div className="a-card">
          <div className="a-card__head">
            <h2 className="a-card__title">Pipeline status</h2>
          </div>
          <BarList data={byStatus} label="Applications by status" emptyText="No applications yet." />
        </div>
      </section>

      <section className="a-grid a-grid--1-2">
        <div className="a-card">
          <div className="a-card__head">
            <h2 className="a-card__title">By department</h2>
          </div>
          <BarList data={byDept} label="Applications by department" emptyText="No applications yet." />
        </div>
        <div className="a-card">
          <div className="a-card__head">
            <h2 className="a-card__title">Recent applications</h2>
            <Link href="/admin/applications" className="a-link">
              View all <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          {recentApps.data?.length ? (
            <ul role="list" className="recent">
              {recentApps.data.map((a) => (
                <li key={a.id}>
                  <Link href={`/admin/applications/${a.id}`} className="recent__item">
                    <span className="recent__main">
                      <span className="recent__name">{a.full_name}</span>
                      <span className="recent__sub">
                        {a.position_title} · {a.department}
                      </span>
                    </span>
                    <span className="recent__side">
                      <StatusBadge list={APPLICATION_STATUSES} value={a.status} />
                      <span className="recent__date">{formatDateTime(a.created_at)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState tone="light" title="No applications yet." message="Submissions from the Join Us page will appear here." />
          )}
        </div>
      </section>

      <section className="a-card">
        <div className="a-card__head">
          <h2 className="a-card__title">Latest messages</h2>
          <Link href="/admin/messages" className="a-link">
            View all <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {recentMsgs.data?.length ? (
          <ul role="list" className="recent">
            {recentMsgs.data.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages/${m.id}`} className="recent__item">
                  <span className="recent__main">
                    <span className="recent__name">{m.subject}</span>
                    <span className="recent__sub">
                      {m.name} · {INQUIRY_TYPES.find((t) => t.value === m.inquiry_type)?.label || m.inquiry_type}
                    </span>
                  </span>
                  <span className="recent__side">
                    <StatusBadge list={MESSAGE_STATUSES} value={m.status} />
                    <span className="recent__date">{formatDateTime(m.created_at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState tone="light" title="Inbox is quiet." message="Messages sent through the Contact page will appear here." />
        )}
      </section>
    </>
  );
}
