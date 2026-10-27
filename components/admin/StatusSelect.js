'use client';

import { useActionState, useRef } from 'react';
import { cx } from '@/lib/utils';

/** Inline status dropdown that saves immediately on change. */
export default function StatusSelect({ action, id, value, options, label = 'Status', className, compact = false }) {
  const formRef = useRef(null);
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form ref={formRef} action={formAction} className={cx('status-select', compact && 'status-select--compact', className)}>
      <input type="hidden" name="id" value={id} />
      <label className={compact ? 'visually-hidden' : 'status-select__label'} htmlFor={`status-${id}`}>
        {label}
      </label>
      <div className="status-select__row">
        <select
          id={`status-${id}`}
          name="status"
          defaultValue={value}
          disabled={pending}
          onChange={() => formRef.current?.requestSubmit()}
          className="status-select__control"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {pending && <span className="spinner status-select__spin" aria-label="Saving" />}
      </div>
      {state?.message && !compact && (
        <p className={cx('action-form__msg', state.ok ? 'is-ok' : 'is-error')} role="status">
          {state.message}
        </p>
      )}
      {state && !state.ok && compact && (
        <p className="action-form__msg is-error" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
