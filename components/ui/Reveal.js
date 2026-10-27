'use client';

import { useEffect, useRef } from 'react';
import { cx } from '@/lib/utils';

/** Fades children up when they enter the viewport. Honors reduced motion via CSS. */
export default function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cx('reveal', className)} style={delay ? { '--reveal-delay': `${delay}ms` } : undefined} {...rest}>
      {children}
    </Tag>
  );
}
