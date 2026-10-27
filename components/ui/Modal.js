'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cx } from '@/lib/utils';

/** Native <dialog>-based modal: focus trapping, Esc to close and inert background for free. */
export default function Modal({ open, onClose, title, description, children, size = 'md', className }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handle = () => onClose?.();
    d.addEventListener('close', handle);
    return () => d.removeEventListener('close', handle);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={cx('modal', `modal--${size}`, className)}
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-desc' : undefined}
      onClick={(e) => {
        if (e.target === ref.current) onClose?.();
      }}
    >
      <div className="modal__panel">
        <header className="modal__head">
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={() => onClose?.()} aria-label="Close dialog">
            <X size={18} />
          </button>
        </header>
        {description && (
          <p id="modal-desc" className="modal__desc">
            {description}
          </p>
        )}
        <div className="modal__body">{open ? children : null}</div>
      </div>
    </dialog>
  );
}
