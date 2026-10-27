import { CircleAlert, CircleCheck } from 'lucide-react';
import { cx } from '@/lib/utils';

export default function FormAlert({ tone = 'error', children, className }) {
  if (!children) return null;
  const Icon = tone === 'success' ? CircleCheck : CircleAlert;
  return (
    <div className={cx('form-alert', `form-alert--${tone}`, className)} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon size={18} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
