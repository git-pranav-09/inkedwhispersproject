import EmptyState from '@/components/ui/EmptyState';
import { cx } from '@/lib/utils';

/**
 * Responsive table. On narrow screens rows collapse into labelled cards
 * (each cell carries data-label).
 */
export default function DataTable({ columns, rows, rowKey = 'id', empty, caption, className }) {
  if (!rows?.length) {
    return empty || <EmptyState tone="light" title="Nothing here yet." message="Records will appear here as they arrive." />;
  }
  return (
    <div className={cx('table-wrap', className)}>
      <table className="table">
        {caption && <caption className="visually-hidden">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={c.className} style={c.width ? { width: c.width } : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((c) => (
                <td key={c.key} data-label={c.label} className={c.className}>
                  {c.render ? c.render(row) : row[c.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
