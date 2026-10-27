'use client';

import { useCallback, useState } from 'react';
import { validate } from '@/lib/validations';

/**
 * Shared submit logic for public forms: client-side pre-validation, POST to a
 * Route Handler, and normalised { status, errors, message } state.
 */
export function useFormSubmit({ endpoint, rules, multipart = false, beforeSubmit }) {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const fd = new FormData(form);

      const extraErrors = beforeSubmit ? beforeSubmit(fd) || {} : {};
      const { errors: v } = rules ? validate(fd, rules) : { errors: {} };
      const all = { ...v, ...extraErrors };
      if (Object.keys(all).length) {
        setErrors(all);
        setStatus('error');
        setMessage('Please review the highlighted fields.');
        const firstKey = Object.keys(all)[0];
        form.querySelector(`[name="${firstKey}"]`)?.focus();
        return;
      }

      setStatus('submitting');
      setErrors({});
      setMessage('');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: multipart ? fd : JSON.stringify(Object.fromEntries(fd.entries())),
          headers: multipart ? undefined : { 'Content-Type': 'application/json' },
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.ok) {
          setErrors(json.errors || {});
          setMessage(json.message || 'Something went wrong. Please try again.');
          setStatus('error');
          return;
        }
        setMessage(json.message || '');
        setStatus('success');
        form.reset();
      } catch {
        setMessage('We could not reach the server. Please check your connection and try again.');
        setStatus('error');
      }
    },
    [endpoint, rules, multipart, beforeSubmit]
  );

  const reset = () => {
    setStatus('idle');
    setErrors({});
    setMessage('');
  };

  return { status, errors, message, onSubmit, reset, submitting: status === 'submitting' };
}
