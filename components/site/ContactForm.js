'use client';

import { ArrowRight, MailCheck } from 'lucide-react';
import { contactRules, INQUIRY_TYPES } from '@/lib/validations';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import Field from '@/components/ui/Field';
import Honeypot from './Honeypot';
import FormAlert from './FormAlert';

export default function ContactForm() {
  const { status, errors, message, onSubmit, submitting, reset } = useFormSubmit({
    endpoint: '/api/contact',
    rules: contactRules,
  });

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span className="form-success__icon">
          <MailCheck size={26} aria-hidden="true" />
        </span>
        <h3 className="form-success__title display">Message received.</h3>
        <p className="form-success__text">
          Thank you for writing to Inked Whispers. A member of our team will read your message and respond to the email you provided.
        </p>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-describedby="contact-form-note">
      <Honeypot />
      <div className="form__grid">
        <Field label="Name" name="name" required autoComplete="name" maxLength={120} error={errors.name} />
        <Field label="Email" name="email" type="email" required autoComplete="email" inputMode="email" maxLength={200} error={errors.email} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} error={errors.phone} />
        <Field label="Inquiry type" name="inquiry_type" as="select" required options={INQUIRY_TYPES} placeholder="Choose a category" error={errors.inquiry_type} />
        <Field label="Subject" name="subject" required maxLength={200} error={errors.subject} className="form__full" />
        <Field
          label="Message"
          name="message"
          as="textarea"
          required
          rows={6}
          maxLength={5000}
          error={errors.message}
          className="form__full"
          placeholder="Tell us a little about what you have in mind."
        />
      </div>
      {status === 'error' && <FormAlert>{message}</FormAlert>}
      <div className="form__actions">
        <p id="contact-form-note" className="form__note">
          Your message is stored securely and read only by the Inked Whispers team.
        </p>
        <button type="submit" className="btn btn--primary" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" /> Sending
            </>
          ) : (
            <>
              Send Message <ArrowRight className="btn__arrow" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
