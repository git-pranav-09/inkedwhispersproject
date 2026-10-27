'use client';

import { ArrowRight, Check } from 'lucide-react';
import { newsletterRules } from '@/lib/validations';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import Field from '@/components/ui/Field';
import Honeypot from './Honeypot';
import FormAlert from './FormAlert';
import { cx } from '@/lib/utils';

export default function NewsletterForm({ compact = false }) {
  const { status, errors, message, onSubmit, submitting, reset } = useFormSubmit({
    endpoint: '/api/newsletter',
    rules: newsletterRules,
  });

  if (status === 'success') {
    return (
      <div className={cx('newsletter-success', compact && 'newsletter-success--compact')} role="status">
        <span className="newsletter-success__icon">
          <Check size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="newsletter-success__title serif">You’re on the list.</p>
          <p className="newsletter-success__text">{message || 'Thank you for subscribing to Inked Whispers.'}</p>
          {!compact && (
            <button type="button" className="text-link newsletter-success__again" onClick={reset}>
              Subscribe another address
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form className={cx('newsletter-form', compact && 'newsletter-form--compact')} onSubmit={onSubmit} noValidate>
      <Honeypot />
      <div className="newsletter-form__fields">
        <Field
          label="Name"
          name="name"
          id={compact ? 'nl-c-name' : 'nl-name'}
          required
          autoComplete="name"
          error={errors.name}
          maxLength={120}
          placeholder={compact ? 'Your name' : 'How should we address you?'}
        />
        <Field
          label="Email"
          name="email"
          id={compact ? 'nl-c-email' : 'nl-email'}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          maxLength={200}
          placeholder="you@example.com"
        />
      </div>
      {status === 'error' && !errors.name && !errors.email && <FormAlert>{message}</FormAlert>}
      <button type="submit" className={cx('btn btn--primary', !compact && 'btn--block')} disabled={submitting} aria-busy={submitting}>
        {submitting ? (
          <>
            <span className="spinner" aria-hidden="true" /> Subscribing
          </>
        ) : (
          <>
            Subscribe <ArrowRight className="btn__arrow" aria-hidden="true" />
          </>
        )}
      </button>
      {!compact && (
        <p className="newsletter-form__privacy">
          We only use your email to send Inked Whispers updates. No spam, no sharing with third parties. You can ask us to remove your details at any time.
        </p>
      )}
    </form>
  );
}
