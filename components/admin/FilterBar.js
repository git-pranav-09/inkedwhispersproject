import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';

/**
 * GET-based filter form — filters live in the URL, so views are shareable
 * and work without client JavaScript.
 */
export default function FilterBar({ action, q, placeholder = 'Search…', selects = [], resetHref, children }) {
  return (
    <form className="filter-bar" action={action} method="get" role="search">
      <div className="filter-bar__search">
        <Search size={16} aria-hidden="true" />
        <label htmlFor="filter-q" className="visually-hidden">
          Search
        </label>
        <input id="filter-q" type="search" name="q" defaultValue={q} placeholder={placeholder} maxLength={80} />
      </div>
      {selects.map((s) => (
        <div key={s.name} className="filter-bar__select">
          <label htmlFor={`filter-${s.name}`} className="visually-hidden">
            {s.label}
          </label>
          <select id={`filter-${s.name}`} name={s.name} defaultValue={s.value || ''}>
            {s.all !== false && <option value="">{s.allLabel || `All ${s.label.toLowerCase()}`}</option>}
            {s.options.map((o) => (
              <option key={o.value ?? o} value={o.value ?? o}>
                {o.label ?? o}
              </option>
            ))}
          </select>
        </div>
      ))}
      <div className="filter-bar__actions">
        <button type="submit" className="abtn abtn--dark">
          <SlidersHorizontal size={15} aria-hidden="true" /> Apply
        </button>
        {resetHref && (
          <Link href={resetHref} className="abtn abtn--ghost">
            Reset
          </Link>
        )}
        {children}
      </div>
    </form>
  );
}
