import Icon from './Icon';
import { findStatus } from '@/lib/constants';
import { cx } from '@/lib/utils';

/** Status pill: icon + text + tone, so meaning never relies on colour alone. */
export default function StatusBadge({ list, value, className }) {
  const s = findStatus(list, value);
  return (
    <span className={cx('badge', `badge--${s.tone}`, className)}>
      <Icon name={s.icon} width={13} height={13} strokeWidth={2} />
      {s.label}
    </span>
  );
}
