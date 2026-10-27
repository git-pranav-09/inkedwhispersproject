import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/site/Hero';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import FeatureCard from '@/components/site/FeatureCard';
import EventCard from '@/components/site/EventCard';
import Timeline from '@/components/site/Timeline';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import { Ornament, WingLines } from '@/components/ui/Ornament';
import { getSiteContent, getUpcomingEvents } from '@/lib/data';
import { whyCards } from '@/lib/site-config';

export const revalidate = 60;

export const metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [content, events] = await Promise.all([getSiteContent(), getUpcomingEvents(3)]);
  const home = content.home;

  return (
    <>
      <Hero content={home} />

      {/* ── Philosophy ─────────────────────────────────────────────── */}
      <section id="philosophy" className="section philosophy" aria-labelledby="philosophy-title">
        <div className="container philosophy__grid">
          <Reveal className="philosophy__aside">
            <p className="eyebrow">What We Believe</p>
            <span className="philosophy__mark serif" aria-hidden="true">
              “
            </span>
          </Reveal>
          <div className="philosophy__main">
            <Reveal as="h2" id="philosophy-title" className="philosophy__heading display">
              {home.philosophy_heading}
            </Reveal>
            <div className="philosophy__body">
              {home.philosophy_body.map((p, i) => (
                <Reveal as="p" key={i} delay={i * 80} className={i === 0 ? 'philosophy__lead' : undefined}>
                  {p}
                </Reveal>
              ))}
            </div>
            <Reveal className="philosophy__pillars" delay={200}>
              {['Creativity', 'Expression', 'Community', 'Opportunity', 'Youth', 'Growth'].map((w) => (
                <span key={w}>{w}</span>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Featured ───────────────────────────────────────────────── */}
      <section className="section section--alt" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-head-row">
            <SectionHeading id="featured-title" eyebrow="Featured" title="Three ways a story finds its room." />
            <Reveal>
              <Link href="/about" className="link-arrow">
                About our work <ArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <div className="feature-grid">
            {content.featured.slice(0, 3).map((item, i) => (
              <Reveal key={item.title} delay={i * 110}>
                <FeatureCard item={item} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming events ────────────────────────────────────────── */}
      <section className="section" aria-labelledby="upcoming-title">
        <WingLines side="right" className="section-wing" />
        <div className="container">
          <div className="section-head-row">
            <SectionHeading id="upcoming-title" eyebrow="Upcoming Events" title="On the calendar." intro="Readings, workshops and stages — each one an invitation to listen closely and speak with intent." />
            <Reveal>
              <Link href="/events" className="btn btn--ghost btn--sm">
                All Events <ArrowRight className="btn__arrow" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          {events.error ? (
            <EmptyState title="Events are momentarily unavailable." message={events.error} />
          ) : events.data.length ? (
            <div className="card-grid">
              {events.data.map((e, i) => (
                <Reveal key={e.id} delay={i * 110}>
                  <EventCard event={e} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="The next chapter is being written."
              message="New events will be announced here soon. Subscribe to the newsletter to hear first."
              action={
                <Link href="/newsletter" className="btn btn--ghost btn--sm">
                  Join the Newsletter
                </Link>
              }
            />
          )}
        </div>
      </section>

      {/* ── Journey ────────────────────────────────────────────────── */}
      <section className="section section--navy grain journey" aria-labelledby="journey-title">
        <div className="container">
          <SectionHeading id="journey-title" eyebrow="Our Journey" title="A story told in chapters." align="center" intro="Every organisation is a manuscript in progress. These are the pages so far." />
          <Timeline items={content.journey} />
        </div>
      </section>

      {/* ── Why ────────────────────────────────────────────────────── */}
      <section className="section why" aria-labelledby="why-title">
        <div className="container why__grid">
          <div className="why__intro">
            <SectionHeading id="why-title" eyebrow="Why Inked Whispers?" title="A room that takes your voice seriously." />
            <Reveal className="why__image">
              <Image src="/images/site/about-hands.jpg" alt="A young writer's hands writing in a leather notebook with a fountain pen under lamplight" fill sizes="(max-width: 900px) 100vw, 40vw" />
            </Reveal>
          </div>
          <div className="why__cards">
            {whyCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 90} className="why-card">
                <span className="why-card__icon">
                  <Icon name={c.icon} size={22} strokeWidth={1.4} />
                </span>
                <h3 className="why-card__title">{c.title}</h3>
                <p className="why-card__text">{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="cta grain" aria-labelledby="cta-title">
        <div className="cta__bg" aria-hidden="true">
          <Image src="/images/site/about-nib.jpg" alt="" fill sizes="100vw" />
        </div>
        <div className="container cta__inner">
          <Ornament />
          <Reveal as="h2" id="cta-title" className="cta__title display">
            Your story could be the <em className="gold-text">next whisper.</em>
          </Reveal>
          <Reveal as="p" className="cta__text" delay={100}>
            We are always looking for writers, designers, organisers and listeners who want to build something lasting.
          </Reveal>
          <Reveal delay={180}>
            <Link href="/join" className="btn btn--primary">
              Join Us <ArrowRight className="btn__arrow" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
