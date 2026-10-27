import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Award, CalendarDays, MapPin, ScrollText, Trophy } from 'lucide-react';
import Gallery from '@/components/site/Gallery';
import Reveal from '@/components/ui/Reveal';
import EmptyState from '@/components/ui/EmptyState';
import { getPastEventBySlug } from '@/lib/data';
import { formatDate, toLines, toParagraphs } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: event } = await getPastEventBySlug(slug);
  if (!event) return { title: 'Event not found', robots: { index: false } };
  const description = event.short_description || `Highlights, winners and photographs from ${event.title}.`;
  return {
    title: `${event.title} — Highlights`,
    description,
    alternates: { canonical: `/past-events/${event.slug}` },
    openGraph: { type: 'article', title: event.title, description, url: `/past-events/${event.slug}`, images: [{ url: event.image_url || siteConfig.ogImage }] },
  };
}

export default async function PastEventPage({ params }) {
  const { slug } = await params;
  const { data: event, error } = await getPastEventBySlug(slug);

  if (error) {
    return (
      <section className="section section--top">
        <div className="container">
          <EmptyState title="This event could not be loaded." message={error} />
        </div>
      </section>
    );
  }
  if (!event) notFound();

  const description = toParagraphs(event.description);
  const highlights = toLines(event.highlights);
  const results = toParagraphs(event.results);
  const winners = Array.isArray(event.winners) ? event.winners.filter((w) => w && w.name) : [];
  const gallery = event.event_gallery || [];

  return (
    <article className="event-detail">
      <header className="event-hero event-hero--past grain">
        <div className="event-hero__media" aria-hidden="true">
          <Image src={event.image_url || '/images/site/event-fallback.jpg'} alt="" fill priority sizes="100vw" className="event-hero__img" />
        </div>
        <div className="event-hero__shade" aria-hidden="true" />
        <div className="container event-hero__inner">
          <Link href="/past-events" className="back-link">
            <ArrowLeft size={16} aria-hidden="true" /> The archive
          </Link>
          <div className="event-hero__tags">
            <span className="reg-pill reg-pill--completed">
              <span className="reg-pill__dot" aria-hidden="true" /> Completed
            </span>
            {event.event_type && <span className="tag">{event.event_type}</span>}
          </div>
          <h1 className="event-hero__title display">{event.title}</h1>
          <ul role="list" className="event-hero__facts">
            <li>
              <CalendarDays size={16} aria-hidden="true" /> {formatDate(event.event_date)}
            </li>
            {(event.venue || event.mode === 'online') && (
              <li>
                <MapPin size={16} aria-hidden="true" /> {event.mode === 'online' ? 'Online' : event.venue}
              </li>
            )}
          </ul>
        </div>
      </header>

      <div className="container past-body">
        <div className="past-body__grid">
          <div className="past-body__main">
            {description.length > 0 && (
              <section aria-labelledby="pe-about">
                <h2 id="pe-about" className="event-body__h">The evening</h2>
                <div className="prose">
                  {description.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}
            {highlights.length > 0 && (
              <section aria-labelledby="pe-high">
                <h2 id="pe-high" className="event-body__h">Highlights</h2>
                <ul role="list" className="highlights">
                  {highlights.map((h, i) => (
                    <Reveal as="li" key={i} delay={i * 60}>
                      <span className="highlights__num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {h}
                    </Reveal>
                  ))}
                </ul>
              </section>
            )}
            {results.length > 0 && (
              <section aria-labelledby="pe-results">
                <h2 id="pe-results" className="event-body__h">
                  <ScrollText size={18} aria-hidden="true" /> Results
                </h2>
                <div className="prose">
                  {results.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="past-body__aside">
            {winners.length > 0 && (
              <section className="winners" aria-labelledby="pe-winners">
                <h2 id="pe-winners" className="winners__title">
                  <Trophy size={18} aria-hidden="true" /> Winners
                </h2>
                <ol role="list" className="winners__list">
                  {winners.map((w, i) => (
                    <li key={i} className="winners__item">
                      <span className="winners__pos">{w.position || `#${i + 1}`}</span>
                      <span className="winners__name">{w.name}</span>
                      {w.work && <span className="winners__work">{w.work}</span>}
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {event.certificate_info && (
              <section className="cert" aria-labelledby="pe-cert">
                <h2 id="pe-cert" className="cert__title">
                  <Award size={18} aria-hidden="true" /> Certificates
                </h2>
                <p className="cert__text">{event.certificate_info}</p>
              </section>
            )}
          </aside>
        </div>

        {gallery.length > 0 && (
          <section className="past-gallery" aria-labelledby="pe-gallery">
            <div className="past-gallery__head">
              <p className="eyebrow">Gallery</p>
              <h2 id="pe-gallery" className="display past-gallery__title">
                Moments from the evening
              </h2>
            </div>
            <Gallery images={gallery} title={event.title} />
          </section>
        )}
      </div>
    </article>
  );
}
