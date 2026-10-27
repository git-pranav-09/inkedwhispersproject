import Image from 'next/image';
import { WingLines } from '@/components/ui/Ornament';
import { cx } from '@/lib/utils';

/** Editorial page header used by every inner page. */
export default function PageHero({ eyebrow, title, intro, image, imageAlt = '', align = 'left', children, className }) {
  return (
    <section className={cx('page-hero grain', image && 'page-hero--image', `page-hero--${align}`, className)}>
      {image && (
        <div className="page-hero__media" aria-hidden={imageAlt ? undefined : 'true'}>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="page-hero__img" />
        </div>
      )}
      <div className="page-hero__shade" aria-hidden="true" />
      <WingLines side="right" className="page-hero__wing" />
      <div className="page-hero__inner container">
        {eyebrow && <p className="eyebrow page-hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title display">{title}</h1>
        {intro && <p className="page-hero__intro lede">{intro}</p>}
        {children}
        <span className="page-hero__rule" aria-hidden="true" />
      </div>
    </section>
  );
}
