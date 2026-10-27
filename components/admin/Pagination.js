import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pageSize, total, basePath, params = {} }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const href = (p) => {
    const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    if (p > 1) sp.set('page', String(p));
    else sp.delete('page');
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination__info">
        Showing {from}–{to} of {total}
      </p>
      <div className="pagination__controls">
        {page > 1 ? (
          <Link href={href(page - 1)} className="abtn abtn--ghost abtn--sm" rel="prev">
            <ChevronLeft size={15} aria-hidden="true" /> Previous
          </Link>
        ) : (
          <span className="abtn abtn--ghost abtn--sm is-disabled" aria-disabled="true">
            <ChevronLeft size={15} aria-hidden="true" /> Previous
          </span>
        )}
        <span className="pagination__page">
          Page {page} of {pages}
        </span>
        {page < pages ? (
          <Link href={href(page + 1)} className="abtn abtn--ghost abtn--sm" rel="next">
            Next <ChevronRight size={15} aria-hidden="true" />
          </Link>
        ) : (
          <span className="abtn abtn--ghost abtn--sm is-disabled" aria-disabled="true">
            Next <ChevronRight size={15} aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
