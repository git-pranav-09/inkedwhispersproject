import { CardSkeletonGrid, Skeleton } from '@/components/ui/LoadingState';

export default function Loading() {
  return (
    <>
      <section className="page-hero page-hero--loading">
        <div className="page-hero__inner container">
          <Skeleton className="skeleton-line skeleton-line--eyebrow" />
          <Skeleton className="skeleton-line skeleton-line--title" />
          <Skeleton className="skeleton-line skeleton-line--intro" />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <CardSkeletonGrid count={6} />
        </div>
      </section>
    </>
  );
}
