import Image from 'next/image';
import { Users, PenLine, Sparkles } from 'lucide-react';
import NewsletterForm from '@/components/site/NewsletterForm';
import Reveal from '@/components/ui/Reveal';
import { Ornament, WingLines } from '@/components/ui/Ornament';

export const metadata = {
  title: 'Newsletter',
  description: 'More than just updates. Team projects, teen voices, creative work, event moments and ideas from around Inked Whispers.',
  alternates: { canonical: '/newsletter' },
  openGraph: { title: 'The Inked Whispers Newsletter', url: '/newsletter' },
};

const promises = [
  { icon: Users, title: 'Team & community', text: 'A look at what our members are working on, creating, and contributing to Inked Whispers.' },
  { icon: PenLine, title: 'Teen voices', text: 'Writing, art, ideas, and other work from young creators in and around our community.' },
  { icon: Sparkles, title: 'Inside Inked Whispers', text: 'Event highlights, behind the scenes, new projects, and the things happening across IW.' },
];

export default function NewsletterPage() {
  return (
    <section className="newsletter-page grain" aria-labelledby="nl-title">
      <div className="newsletter-page__bg" aria-hidden="true">
        <Image src="/images/site/hero-ink.jpg" alt="" fill priority sizes="100vw" />
      </div>
      <WingLines side="left" className="newsletter-page__wing" />
      <div className="container newsletter-page__grid">
        <div className="newsletter-page__intro">
          <p className="eyebrow">Newsletter</p>
          <h1 id="nl-title" className="display newsletter-page__title">
            More than just <em className="gold-text">updates.</em>
          </h1>
          <p className="lede">A collection of what’s being created around Inked Whispers. Team projects, teenage voices, creative work, event moments, ideas, and everything in between.</p>
          <ul role="list" className="promises">
            {promises.map(({ icon: Ico, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="promises__item">
                <span className="promises__icon">
                  <Ico size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="promises__title">{title}</h2>
                  <p className="promises__text">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal className="newsletter-card">
          <Ornament />
          <h2 className="newsletter-card__title serif">Subscribe</h2>
          <p className="newsletter-card__text">A few thoughtful letters a season. Nothing more.</p>
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}
