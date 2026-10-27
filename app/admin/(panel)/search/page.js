import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { requireAdmin } from '@/lib/auth';
import { safeTerm, one } from '@/lib/admin-queries';
import { APPLICATION_STATUSES, MESSAGE_STATUSES, EVENT_STATUSES, SUBSCRIBER_STATUSES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Search' };

function Group({ title, items, render, viewAll }) {
  if (!items?.length) return null;
  return (
    <section className="a-card">
      <div className="a-card__head">
        <h2 className="a-card__title">
          {title} <span className="a-hint">({items.length})</span>
        </h2>
        {viewAll && (
          <Link href={viewAll} className="a-link">
            Open in {title}
          </Link>
        )}
      </div>
      <ul role="list" className="recent">
        {items.map(render)}
      </ul>
    </section>
  );
}

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = safeTerm(one(sp?.q));
  const { supabase } = await requireAdmin();

  if (!q) {
    return (
      <>
        <PageHeader title="Search" />
        <EmptyState tone="light" title="Search the whole portal." message="Use the search bar above to find applicants, messages, subscribers and events." />
      </>
    );
  }

  const like = `%${q}%`;
  const [apps, msgs, subs, events] = await Promise.all([
    supabase.from('applications').select('id, full_name, email, position_title, status').or(`full_name.ilike.${like},email.ilike.${like},city.ilike.${like},organization.ilike.${like}`).limit(10),
    supabase.from('contact_messages').select('id, name, email, subject, status').or(`name.ilike.${like},email.ilike.${like},subject.ilike.${like}`).limit(10),
    supabase.from('newsletter_subscribers').select('id, name, email, status').or(`name.ilike.${like},email.ilike.${like}`).limit(10),
    supabase.from('events').select('id, title, event_date, status').ilike('title', like).limit(10),
  ]);
  const total = [apps, msgs, subs, events].reduce((n, r) => n + (r.data?.length || 0), 0);
  const enc = encodeURIComponent(q);

  return (
    <>
      <PageHeader title={`Results for “${q}”`} description={`${total} match${total === 1 ? '' : 'es'} across the portal.`} />
      {total === 0 && <EmptyState tone="light" title="No matches." message="Try a shorter term, a surname, or part of an email address." />}
      <div className="a-stack">
        <Group
          title="Applications"
          items={apps.data}
          viewAll={`/admin/applications?q=${enc}`}
          render={(a) => (
            <li key={a.id}>
              <Link href={`/admin/applications/${a.id}`} className="recent__item">
                <span className="recent__main">
                  <span className="recent__name">{a.full_name}</span>
                  <span className="recent__sub">
                    {a.email} · {a.position_title}
                  </span>
                </span>
                <StatusBadge list={APPLICATION_STATUSES} value={a.status} />
              </Link>
            </li>
          )}
        />
        <Group
          title="Messages"
          items={msgs.data}
          viewAll={`/admin/messages?q=${enc}`}
          render={(m) => (
            <li key={m.id}>
              <Link href={`/admin/messages/${m.id}`} className="recent__item">
                <span className="recent__main">
                  <span className="recent__name">{m.subject}</span>
                  <span className="recent__sub">
                    {m.name} · {m.email}
                  </span>
                </span>
                <StatusBadge list={MESSAGE_STATUSES} value={m.status} />
              </Link>
            </li>
          )}
        />
        <Group
          title="Events"
          items={events.data}
          render={(e) => (
            <li key={e.id}>
              <Link href={e.status === 'completed' ? `/admin/past-events/${e.id}` : `/admin/events/${e.id}`} className="recent__item">
                <span className="recent__main">
                  <span className="recent__name">{e.title}</span>
                  <span className="recent__sub">{e.event_date ? formatDate(e.event_date, { short: true }) : 'Date TBA'}</span>
                </span>
                <StatusBadge list={EVENT_STATUSES} value={e.status} />
              </Link>
            </li>
          )}
        />
        <Group
          title="Newsletter"
          items={subs.data}
          viewAll={`/admin/newsletter?q=${enc}`}
          render={(s) => (
            <li key={s.id}>
              <Link href={`/admin/newsletter?q=${encodeURIComponent(s.email)}`} className="recent__item">
                <span className="recent__main">
                  <span className="recent__name">{s.name || s.email}</span>
                  <span className="recent__sub">{s.email}</span>
                </span>
                <StatusBadge list={SUBSCRIBER_STATUSES} value={s.status} />
              </Link>
            </li>
          )}
        />
      </div>
    </>
  );
}
