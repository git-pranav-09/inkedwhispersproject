'use client';

import { useFormStatus } from 'react-dom';
import { cx } from '@/lib/utils';

export default function SubmitButton({ children, pendingLabel = 'Please wait', className, variant = 'primary', pending: forced, ...rest }) {
  const { pending } = useFormStatus();
  const busy = forced ?? pending;
  return (
    <button type="submit" className={cx('btn', `btn--${variant}`, className)} disabled={busy} aria-busy={busy} {...rest}>
      {busy ? (
        <>
          <span className="spinner" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
