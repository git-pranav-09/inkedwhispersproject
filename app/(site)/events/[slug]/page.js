import { notFound, permanentRedirect } from 'next/navigation';
import EventDetail from '@/components/site/EventDetail';
import EmptyState from '@/components/ui/EmptyState';
import { getEventBySlug } from '@/lib/data';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: event } = await getEventBySlug(slug);
  if (!event) return { title: 'Event not found', robots: { index: false } };
  const description = event.short_description || `${event.title} — an Inked Whispers event.`;
  const images = event.image_url ? [{ url: event.image_url, alt: event.title }] : [{ url: siteConfig.ogImage }];
  return {
    title: event.title,
    description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: { type: 'article', title: event.title, description, url: `/events/${event.slug}`, images },
    twitter: { card: 'summary_large_image', title: event.title, description, images: images.map((i) => i.url) },
  };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const { data: event, error } = await getEventBySlug(slug);

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
  if (event.status === 'completed') permanentRedirect(`/past-events/${event.slug}`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.short_description || undefined,
    startDate: event.event_date ? `${event.event_date}${event.start_time ? `T${event.start_time}+05:30` : ''}` : undefined,
    endDate: event.event_date && event.end_time ? `${event.event_date}T${event.end_time}+05:30` : undefined,
    eventAttendanceMode:
      event.mode === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : event.mode === 'hybrid'
          ? 'https://schema.org/MixedEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: event.mode === 'online' ? { '@type': 'VirtualLocation', url: `${siteConfig.url}/events/${event.slug}` } : { '@type': 'Place', name: event.venue || 'To be announced' },
    image: event.image_url ? [event.image_url] : undefined,
    organizer: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <>
      <EventDetail event={event} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
