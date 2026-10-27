import Link from 'next/link';
import PageHero from '@/components/site/PageHero';
import EventCard from '@/components/site/EventCard';
import Reveal from '@/components/ui/Reveal';
import EmptyState from '@/components/ui/EmptyState';
import { getUpcomingEvents } from '@/lib/data';

export const revalidate = 60;

export const metadata = {
  title: 'New Events',
  description: 'Upcoming readings, workshops, competitions and conversations from Inked Whispers. Find dates, venues and registration details.',
  alternates: { canonical: '/events' },
  openGraph: { title: 'Upcoming Events · Inked Whispers', url: '/events' },
};

export default async function EventsPage() {
  const { data: events, error } = await getUpcomingEvents();

  return (
    <>
      <PageHero
        eyebrow="New Events"
        title={
          <>
            What happens when you <em className="gold-text">say yes?</em>
          </>
        }
        intro={
          <>
            To the strange idea. The unexpected challenge. The new person. The thing you’ve never tried before.
            <br />
            Our upcoming events are where you find out.
          </>
        }
        image="/images/site/feature-stage.jpg"
      />
      <section className="section" aria-label="Upcoming events">
        <div className="container">
          {error ? (
            <EmptyState title="Events are momentarily unavailable." message={error} />
          ) : events.length ? (
            <div className="card-grid">
              {events.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 100}>
                  <EventCard event={e} priority={i < 3} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming events — yet."
              message="The next chapter is being planned. Subscribe to the newsletter and you’ll be the first to know when registrations open."
              action={
                <div className="empty-state__actions">
                  <Link href="/newsletter" className="btn btn--primary btn--sm">
                    Join the Newsletter
                  </Link>
                  <Link href="/past-events" className="btn btn--ghost btn--sm">
                    See Past Events
                  </Link>
                </div>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}
