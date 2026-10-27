'use client';

import { useEffect, useRef } from 'react';
import { cx } from '@/lib/utils';

/** Subtle vertical parallax. Disabled for reduced motion and small screens. */
export default function Parallax({ speed = 0.15, className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (window.innerWidth < 768) {
        el.style.transform = '';
        return;
      }
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={cx('parallax', className)}>
      {children}
    </div>
  );
}
