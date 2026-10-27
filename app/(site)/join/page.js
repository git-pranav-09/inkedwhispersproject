import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import PositionCard from '@/components/site/PositionCard';
import ApplicationForm from '@/components/site/ApplicationForm';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { getPositions } from '@/lib/data';

export const revalidate = 120;

export const metadata = {
  title: 'Join Us',
  description: 'Come build with us. Explore open positions in Human Resources, PR & Marketing, Social Media and Creative Writing — and apply to join Inked Whispers.',
  alternates: { canonical: '/join' },
  openGraph: { title: 'Join Inked Whispers', url: '/join' },
};

const reasons = [
  { title: 'Create something that matters', text: 'Work on real events, ideas, content, and projects that actually reach people.' },
  { title: 'Take ideas from thought to reality', text: 'Pitch ideas, take responsibility, lead projects, and see your work come to life.' },
  { title: 'Find people who get it', text: 'Meet other young creators, writers, and people who are just as excited to make things happen.' },
  { title: 'Leave with something to show for it', text: 'Build experience, create work you’re proud of, and have something real to add to your portfolio.' },
];

export default async function JoinPage() {
  const { data: positions, error } = await getPositions();
  const openPositions = positions.filter((p) => p.availability !== 'Closed');

  return (
    <>
      <PageHero
        eyebrow="Join Us"
        title={
          <>
            Come build <em className="gold-text">with us.</em>
          </>
        }
        intro="Inked Whispers is shaped by the people who bring their ideas, creativity, and energy to it. If you want to contribute, learn, and be part of what we’re building, we’d love to have you."
        image="/images/site/join-desk.jpg"
      >
        <a href="#apply" className="btn btn--primary page-hero__cta">
          Apply Now <ArrowDown className="btn__arrow" aria-hidden="true" />
        </a>
      </PageHero>

      <section className="section" aria-labelledby="why-join">
        <div className="container split split--top">
          <div className="split__text">
            <SectionHeading id="why-join" eyebrow="Why Join" title="More than a team. A place to grow." />
            <ol role="list" className="reasons">
              {reasons.map((r, i) => (
                <Reveal as="li" key={r.title} delay={i * 80} className="reasons__item">
                  <span className="reasons__num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="reasons__title">{r.title}</h3>
                    <p className="reasons__text">{r.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="split__media">
            <div className="framed framed--tall">
              <Image src="/images/site/about-stilllife.jpg" alt="Clothbound books, an ink bottle and a fountain pen on a dark desk" fill sizes="(max-width: 900px) 100vw, 40vw" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="positions-title">
        <div className="container">
          <SectionHeading
            id="positions-title"
            eyebrow="Open Positions"
            title="Find where you fit."
            intro="Every department is run by members. Choose the one that matches your skills — or the one you most want to grow into."
          />
          {error ? (
            <EmptyState title="Positions could not be loaded." message={error} />
          ) : positions.length ? (
            <div className={`position-grid${positions.length % 3 !== 0 && positions.length % 2 === 0 ? ' position-grid--pairs' : ''}`}>
              {positions.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 80}>
                  <PositionCard position={p} index={i} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState title="No positions are open right now." message="Recruitment opens in cycles. Subscribe to the newsletter to hear when the next one begins." action={<Link href="/newsletter" className="btn btn--ghost btn--sm">Join the Newsletter</Link>} />
          )}
        </div>
      </section>

      <section id="apply" className="section apply" aria-labelledby="apply-title">
        <div className="container apply__grid">
          <div className="apply__intro">
            <SectionHeading id="apply-title" eyebrow="Application" title="Tell us who you are." />
            <Reveal as="p" className="apply__text">
              Applications are read by the core team. We look for sincerity, curiosity and commitment — not perfect résumés.
            </Reveal>
            <Reveal as="ul" role="list" className="apply__steps" delay={100}>
              <li>
                <span>01</span> Submit your application
              </li>
              <li>
                <span>02</span> Our team reviews every response
              </li>
              <li>
                <span>03</span> Shortlisted applicants are contacted by email
              </li>
            </Reveal>
          </div>
          <div className="apply__form">
            {openPositions.length ? (
              <Suspense fallback={<LoadingState label="Preparing the form" />}>
                <ApplicationForm positions={openPositions} />
              </Suspense>
            ) : (
              <EmptyState title="Applications are currently closed." message="When a new recruitment cycle opens, the application form will appear here." />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
