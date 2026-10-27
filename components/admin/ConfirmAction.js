'use client';

import { useActionState, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { cx } from '@/lib/utils';

/** Destructive action guarded by a confirmation dialog. */
export default function ConfirmAction({
  action,
  fields = {},
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  triggerLabel = 'Delete',
  triggerClassName,
  icon = <Trash2 size={15} aria-hidden="true" />,
  iconOnly = false,
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prev, fd) => {
    const res = await action(prev, fd);
    if (res?.ok) setOpen(false);
    return res;
  }, null);

  return (
    <>
      <button
        type="button"
        className={cx(iconOnly ? 'icon-btn icon-btn--danger' : 'abtn abtn--danger-ghost abtn--sm', triggerClassName)}
        onClick={() => setOpen(true)}
        aria-label={iconOnly ? triggerLabel : undefined}
        title={iconOnly ? triggerLabel : undefined}
      >
        {icon}
        {!iconOnly && triggerLabel}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} description={description} size="sm">
        <form action={formAction} className="confirm">
          {Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v ?? ''} />
          ))}
          {state && !state.ok && state.message && (
            <p className="action-form__msg is-error" role="alert">
              {state.message}
            </p>
          )}
          <div className="confirm__actions">
            <button type="button" className="abtn abtn--ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </button>
            <button type="submit" className="abtn abtn--danger" disabled={pending} aria-busy={pending}>
              {pending ? <span className="spinner" aria-hidden="true" /> : icon}
              {confirmLabel}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
