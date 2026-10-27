import { NibMark } from './Ornament';
import { cx } from '@/lib/utils';

export default function EmptyState({ title, message, action, tone = 'dark', icon, className }) {
  return (
    <div className={cx('empty-state', `empty-state--${tone}`, className)} role="status">
      <div className="empty-state__icon">{icon || <NibMark size={22} />}</div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
