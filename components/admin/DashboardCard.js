import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function DashboardCard({ label, value, icon: Ico, href, hint, accent = false }) {
  const body = (
    <>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {Ico && (
          <span className="stat-card__icon" aria-hidden="true">
            <Ico size={18} strokeWidth={1.7} />
          </span>
        )}
      </div>
      <p className="stat-card__value">{value ?? '—'}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
      {href && <ArrowUpRight className="stat-card__arrow" size={16} aria-hidden="true" />}
    </>
  );
  return href ? (
    <Link href={href} className={`stat-card${accent ? ' stat-card--accent' : ''}`}>
      {body}
    </Link>
  ) : (
    <div className={`stat-card${accent ? ' stat-card--accent' : ''}`}>{body}</div>
  );
}
