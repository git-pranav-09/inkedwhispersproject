import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function FeatureCard({ item, index }) {
  return (
    <article className="feature-card">
      <Link href={item.href || '/'} className="feature-card__link">
        <div className="feature-card__media">
          <Image src={item.image || '/images/site/event-fallback.jpg'} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" className="feature-card__img" />
          <span className="feature-card__index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="feature-card__body">
          <p className="feature-card__eyebrow">{item.eyebrow}</p>
          <h3 className="feature-card__title">{item.title}</h3>
          <p className="feature-card__excerpt">{item.excerpt}</p>
          <span className="link-arrow">
            {item.cta || 'Read more'} <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
