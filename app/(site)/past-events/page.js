import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Images } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import Reveal from '@/components/ui/Reveal';
import EmptyState from '@/components/ui/EmptyState';
import { getPastEvents } from '@/lib/data';
import { formatDate, toLines } from '@/lib/utils';

export const revalidate = 300;

export const metadata = {
  title: 'Past Events',
  description: 'An archive of Inked Whispers events — highlights, winners, results and photographs from past readings, competitions and gatherings.',
  alternates: { canonical: '/past-events' },
  openGraph: { title: 'Past Events · Inked Whispers', url: '/past-events' },
};

export default async function PastEventsPage() {
  const { data: events, error } = await getPastEvents();

  return (
    <>
      <PageHero
        eyebrow="Past Events"
        title={
          <>
            Some moments deserve <em className="gold-text">to be remembered.</em>
          </>
        }
        intro="A look back at the events, voices, and experiences that have shaped Inked Whispers along the way."
        image="/images/site/feature-manuscript.jpg"
      />
      <section className="section" aria-label="Past events archive">
        <div className="container">
          {error ? (
            <EmptyState title="The archive is momentarily unavailable." message={error} />
          ) : events.length ? (
            <ol role="list" className="archive">
              {events.map((e, i) => {
                const highlight = toLines(e.highlights)[0];
                const photos = e.event_gallery?.length || 0;
                return (
                  <Reveal as="li" key={e.id} className="archive__item">
                    <Link href={`/past-events/${e.slug}`} className="archive__link">
                      <span className="archive__num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="archive__media">
                        <Image src={e.image_url || '/images/site/event-fallback.jpg'} alt="" fill sizes="(max-width: 800px) 100vw, 40vw" />
                      </div>
                      <div className="archive__body">
                        <p className="archive__date">{formatDate(e.event_date)}</p>
                        <h2 className="archive__title display">{e.title}</h2>
                        {(e.short_description || highlight) && <p className="archive__desc">{e.short_description || highlight}</p>}
                        <div className="archive__foot">
                          {photos > 0 && (
                            <span className="archive__photos">
                              <Images size={15} aria-hidden="true" /> {photos} photograph{photos === 1 ? '' : 's'}
                            </span>
                          )}
                          <span className="link-arrow">
                            View Highlights <ArrowUpRight aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </ol>
          ) : (
            <EmptyState
              title="The archive is still blank."
              message="Once our first events are complete, their highlights, winners and photographs will live here."
              action={
                <Link href="/events" className="btn btn--ghost btn--sm">
                  See Upcoming Events
                </Link>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}
