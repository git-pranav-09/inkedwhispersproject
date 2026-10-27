import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';
import { toLines } from '@/lib/utils';

export default function PositionCard({ position, index }) {
  const closed = position.availability === 'Closed';
  const responsibilities = toLines(position.responsibilities);
  const requirements = toLines(position.requirements);
  return (
    <article className={`position-card${closed ? ' position-card--closed' : ''}`}>
      <header className="position-card__head">
        <span className="position-card__num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={`avail avail--${position.availability.toLowerCase()}`}>
          <span className="avail__dot" aria-hidden="true" />
          {position.availability === 'Open' ? 'Open' : position.availability === 'Limited' ? 'Limited seats' : 'Closed'}
        </span>
      </header>
      <p className="position-card__dept">{position.title?.toLowerCase().includes(position.department?.toLowerCase()) ? 'Department' : position.department}</p>
      <h3 className="position-card__title">{position.title}</h3>
      {position.description && <p className="position-card__desc">{position.description}</p>}

      <details className="position-card__details">
        <summary>
          {requirements.length ? <>Responsibilities &amp; requirements</> : 'Responsibilities'}
          <span className="position-card__chev" aria-hidden="true" />
        </summary>
        <div className="position-card__lists">
          {responsibilities.length > 0 && (
            <div>
              <h4>Responsibilities</h4>
              <ul>
                {responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {requirements.length > 0 && (
            <div>
              <h4>Requirements</h4>
              <ul>
                {requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>

      <footer className="position-card__foot">
        {position.commitment && (
          <span className="position-card__commit">
            <Clock3 size={14} aria-hidden="true" /> {position.commitment}
          </span>
        )}
        {closed ? (
          <span className="position-card__closed">Not accepting applications</span>
        ) : (
          <Link href={`/join?position=${encodeURIComponent(position.id)}#apply`} scroll={false} className="link-arrow">
            Apply Now <ArrowRight aria-hidden="true" />
            <span className="visually-hidden">for {position.title}</span>
          </Link>
        )}
      </footer>
    </article>
  );
}
