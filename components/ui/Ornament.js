import { cx } from '@/lib/utils';

/** Gold ornamental separator: fine rules flanking a nib-shaped diamond. */
export function Ornament({ className }) {
  return (
    <div className={cx('ornament', className)} aria-hidden="true">
      <span className="ornament__line" />
      <svg viewBox="0 0 40 24" width="40" height="24" className="ornament__glyph">
        <path d="M20 2 L26 12 L20 22 L14 12 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M20 7 L20 17" stroke="currentColor" strokeWidth="1" />
        <circle cx="20" cy="12" r="1.4" fill="currentColor" />
        <path d="M2 12 C8 12 10 8 13 8" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M38 12 C32 12 30 8 27 8" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <span className="ornament__line" />
    </div>
  );
}

/** Large, faint wing contour used as a decorative background element. */
export function WingLines({ className, side = 'left' }) {
  return (
    <svg
      className={cx('wing-lines', `wing-lines--${side}`, className)}
      viewBox="0 0 600 420"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M600 ${360 - i * 6} C ${470 - i * 18} ${330 - i * 34}, ${300 - i * 30} ${250 - i * 40}, ${40 + i * 22} ${60 + i * 20}`}
          stroke="url(#wingGrad)"
          strokeWidth={i === 0 ? 1.4 : 0.8}
          opacity={1 - i * 0.12}
        />
      ))}
      <defs>
        <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="0.5" stopColor="#D4AF37" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F4D35E" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Thin fountain-pen nib outline. */
export function NibMark({ className, size = 28 }) {
  return (
    <svg className={className} width={size} height={size * 1.4} viewBox="0 0 20 28" fill="none" aria-hidden="true">
      <path d="M10 1 L17 12 C17 18 14 22 13 27 H7 C6 22 3 18 3 12 Z" stroke="currentColor" strokeWidth="1" />
      <path d="M10 1 V14" stroke="currentColor" strokeWidth="1" />
      <circle cx="10" cy="15.5" r="1.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
