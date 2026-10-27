import { cx } from '@/lib/utils';

export function Skeleton({ className, style }) {
  return <div className={cx('skeleton', className)} style={style} aria-hidden="true" />;
}

export function CardSkeletonGrid({ count = 3, className }) {
  return (
    <div className={cx('card-grid', className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <Skeleton className="skeleton-card__media" />
          <Skeleton className="skeleton-card__line skeleton-card__line--sm" />
          <Skeleton className="skeleton-card__line" />
          <Skeleton className="skeleton-card__line skeleton-card__line--md" />
        </div>
      ))}
    </div>
  );
}

export default function LoadingState({ label = 'Loading', className }) {
  return (
    <div className={cx('loading-state', className)} role="status" aria-live="polite">
      <span className="loading-state__ink" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="loading-state__label">{label}…</span>
    </div>
  );
}
