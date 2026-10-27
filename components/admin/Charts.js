/** Dependency-free charts rendered on the server. */

export function ColumnChart({ data, label }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <figure className="col-chart" aria-label={label}>
      <div className="col-chart__plot">
        {data.map((d) => (
          <div key={d.label} className="col-chart__col">
            <span className="col-chart__val">{d.value}</span>
            <span className="col-chart__bar" style={{ '--h': `${(d.value / max) * 100}%` }} aria-hidden="true" />
            <span className="col-chart__label">{d.label}</span>
          </div>
        ))}
      </div>
      <figcaption className="visually-hidden">
        {label}: {data.map((d) => `${d.label} ${d.value}`).join(', ')}
      </figcaption>
    </figure>
  );
}

export function BarList({ data, label, emptyText = 'No data yet.' }) {
  if (!data.length) return <p className="bar-list__empty">{emptyText}</p>;
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul role="list" className="bar-list" aria-label={label}>
      {data.map((d) => (
        <li key={d.label} className="bar-list__item">
          <div className="bar-list__row">
            <span className="bar-list__label">{d.label}</span>
            <span className="bar-list__value">{d.value}</span>
          </div>
          <span className="bar-list__track" aria-hidden="true">
            <span className="bar-list__fill" style={{ '--w': `${(d.value / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ul>
  );
}
