import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import CoreMemberCard from '@/components/site/CoreMemberCard';
import Reveal from '@/components/ui/Reveal';
import EmptyState from '@/components/ui/EmptyState';
import { getCoreMembers } from '@/lib/data';

export const revalidate = 300;

export const metadata = {
  title: 'About Core',
  description: 'The minds behind the whispers — meet Mihika Goel, Anshika Jaiswal and Sanskar Srivastava, the core team of Inked Whispers.',
  alternates: { canonical: '/core' },
  openGraph: { title: 'The Core Team · Inked Whispers', url: '/core' },
};

export default async function CorePage() {
  const { data: members, error } = await getCoreMembers();

  return (
    <>
      <PageHero
        eyebrow="About Core"
        title={
          <>
            The minds behind <em className="gold-text">the whispers.</em>
          </>
        }
        intro="Behind every event, idea, and experience are people working together to bring the purpose and vision of Inked Whispers to life."
      />

      <section className="section core-list" aria-label="Core members">
        <div className="container">
          {error ? (
            <EmptyState title="The core team could not be loaded." message={error} />
          ) : members.length ? (
            members.map((m, i) => (
              <Reveal key={m.id}>
                <CoreMemberCard member={m} index={i} />
              </Reveal>
            ))
          ) : (
            <EmptyState title="Introductions coming soon." message="Our core team profiles are being prepared." />
          )}
        </div>
      </section>

      <section className="section section--navy grain center-cta" aria-labelledby="core-cta">
        <div className="container container--narrow">
          <Reveal as="h2" id="core-cta" className="display center-cta__title">
            The story doesn’t end here.
          </Reveal>
          <Reveal as="p" className="lede center-cta__text" delay={80}>
            Inked Whispers grows with every person who becomes part of it. Maybe your chapter is the next one.
          </Reveal>
          <Reveal delay={150}>
            <Link href="/join" className="btn btn--primary">
              Become Part of the Story <ArrowRight className="btn__arrow" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
