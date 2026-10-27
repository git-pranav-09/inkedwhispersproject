'use client';

import { useActionState, useEffect, useRef } from 'react';
import { cx } from '@/lib/utils';

/**
 * Wraps a Server Action in a form with pending + result feedback.
 * `fields` become hidden inputs. Children receive { pending, state }.
 */
export default function ActionForm({ action, fields = {}, children, className, onSuccess, inlineMessage = true, ...rest }) {
  const [state, formAction, pending] = useActionState(action, null);
  const called = useRef(false);

  useEffect(() => {
    if (state?.ok && onSuccess && !called.current) {
      called.current = true;
      onSuccess(state);
    }
    if (!state?.ok) called.current = false;
  }, [state, onSuccess]);

  return (
    <form action={formAction} className={cx('action-form', className)} {...rest}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v ?? ''} />
      ))}
      {typeof children === 'function' ? children({ pending, state }) : children}
      {inlineMessage && state?.message && (
        <p className={cx('action-form__msg', state.ok ? 'is-ok' : 'is-error')} role={state.ok ? 'status' : 'alert'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
