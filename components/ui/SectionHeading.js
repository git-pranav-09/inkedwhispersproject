import { cx } from '@/lib/utils';
import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, intro, align = 'left', as: H = 'h2', className, id }) {
  return (
    <Reveal className={cx('section-heading', `section-heading--${align}`, className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H className="section-heading__title display" id={id}>
        {title}
      </H>
      {intro && <p className="section-heading__intro lede">{intro}</p>}
    </Reveal>
  );
}
