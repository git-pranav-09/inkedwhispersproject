import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { LogoImage } from '@/components/ui/Logo';
import { WingLines } from '@/components/ui/Ornament';
import HeroCanvas from './HeroCanvas';
import Parallax from './Parallax';

export default function Hero({ content }) {
  return (
    <section className="hero grain" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <Parallax speed={0.12} className="hero__bg-media">
          <Image src="/images/site/hero-ink.jpg" alt="" fill priority sizes="100vw" className="hero__bg-img" />
        </Parallax>
        <div className="hero__light" />
        <div className="hero__vignette" />
        <HeroCanvas />
        <WingLines side="left" className="hero__wing hero__wing--left" />
        <WingLines side="right" className="hero__wing hero__wing--right" />
      </div>

      <div className="hero__content container">
        <div className="hero__logo">
          <LogoImage height={260} priority sizes="(max-width: 600px) 180px, 260px" />
        </div>
        <p className="hero__eyebrow eyebrow eyebrow--plain">{content.hero_eyebrow}</p>
        <h1 id="hero-title" className="hero__title display">
          {renderHeadline(content.hero_headline)}
        </h1>
        <p className="hero__sub">{content.hero_subheadline}</p>
        <div className="hero__ctas">
          <Link href="/about" className="btn btn--primary">
            Explore Inked Whispers <ArrowRight className="btn__arrow" aria-hidden="true" />
          </Link>
          <Link href="/events" className="btn btn--ghost">
            Discover Events
          </Link>
        </div>
      </div>

      <a href="#philosophy" className="hero__scroll" aria-label="Scroll to what we believe">
        <span>Scroll</span>
        <ChevronDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

/** Italicises the final word of the headline in gold, editorial-style. */
function renderHeadline(text = '') {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return text;
  const last = words.pop();
  return (
    <>
      {words.join(' ')} <em className="gold-text">{last}</em>
    </>
  );
}
