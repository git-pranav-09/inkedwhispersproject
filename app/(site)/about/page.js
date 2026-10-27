import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Timeline from '@/components/site/Timeline';
import { Ornament } from '@/components/ui/Ornament';
import { getSiteContent } from '@/lib/data';

export const revalidate = 300;

export const metadata = {
  title: 'About Us',
  description: 'For every whisper waiting to become a voice. Who we are, what we stand for and where we are going — the vision, mission and story of Inked Whispers, a creative space built by young people, for young people.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About Inked Whispers', url: '/about' },
};

export default async function AboutPage() {
  const content = await getSiteContent();
  const about = content.about;

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            For every whisper waiting to <em className="gold-text">become a voice.</em>
          </>
        }
        intro="A space to create, connect, and be heard."
        image="/images/site/about-stilllife.jpg"
      />

      {/* Who we are */}
      <section className="section" aria-labelledby="who-title">
        <div className="container split">
          <div className="split__text">
            <SectionHeading id="who-title" eyebrow="Who We Are" title="“Somewhere, between a whisper and a voice, is where we begin.”" />
            <div className="prose">
              {about.who_we_are.map((p, i) => (
                <Reveal as="p" key={i} delay={i * 80}>
                  {p}
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal className="split__media split__media--offset">
            <div className="framed">
              <Image src="/images/site/feature-circle.jpg" alt="A reading circle gathered in a lamplit, book-lined room, seen from behind" fill sizes="(max-width: 900px) 100vw, 45vw" />
            </div>
            <p className="framed__caption">The circle — where every voice is given the floor.</p>
          </Reveal>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="section section--navy grain" aria-label="Vision and mission">
        <div className="container vm">
          <Reveal className="vm__item">
            <span className="vm__num" aria-hidden="true">
              I
            </span>
            <p className="eyebrow">Vision</p>
            <h2 className="vm__text display">{about.vision}</h2>
          </Reveal>
          <span className="vm__divider" aria-hidden="true" />
          <Reveal className="vm__item" delay={120}>
            <span className="vm__num" aria-hidden="true">
              II
            </span>
            <p className="eyebrow">Mission</p>
            <h2 className="vm__text display">{about.mission}</h2>
          </Reveal>
        </div>
      </section>

      {/* Quote */}
      <section className="quote-block grain" aria-label="Our belief">
        <div className="container container--narrow">
          <Ornament />
          <Reveal as="blockquote" className="quote-block__quote">
            <p className="display">
              “A whisper is still a voice, <br className="hide-sm" />
              even before the world <em className="gold-text">learns to listen.</em>”
            </p>
          </Reveal>
          <p className="quote-block__cite">— The Inked Whispers creed</p>
        </div>
      </section>

      {/* Journey */}
      <section className="section" aria-labelledby="about-journey">
        <div className="container">
          <SectionHeading id="about-journey" eyebrow="Our Journey" title="The chapters so far." align="center" />
          <Timeline items={content.journey} />
        </div>
      </section>

      {/* Values */}
      <section className="section section--alt" aria-labelledby="values-title">
        <div className="container">
          <SectionHeading id="values-title" eyebrow="What Inked Whispers Stands For" title="Four commitments, kept in ink." />
          <ol role="list" className="values">
            {about.values.map((v, i) => (
              <Reveal as="li" key={v.title} className="values__item" delay={i * 90}>
                <span className="values__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="values__title display">{v.title}</h3>
                <p className="values__text">{v.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="center-actions">
            <Link href="/core" className="btn btn--ghost">
              Meet the Core Team <ArrowRight className="btn__arrow" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
