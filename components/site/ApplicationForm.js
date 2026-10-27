'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, FileText, Upload, X } from 'lucide-react';
import { applicationRules } from '@/lib/validations';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import Field from '@/components/ui/Field';
import { Ornament } from '@/components/ui/Ornament';
import Honeypot from './Honeypot';
import FormAlert from './FormAlert';

const MAX_RESUME = 4 * 1024 * 1024;

export default function ApplicationForm({ positions }) {
  const params = useSearchParams();
  const formRef = useRef(null);
  const departments = useMemo(() => [...new Set(positions.map((p) => p.department))], [positions]);
  const [department, setDepartment] = useState('');
  const [positionId, setPositionId] = useState('');
  const [resume, setResume] = useState(null);

  // Pre-select a role when arriving from a position card ("Apply Now").
  useEffect(() => {
    const id = params.get('position');
    const match = positions.find((p) => String(p.id) === id);
    if (match) {
      setDepartment(match.department);
      setPositionId(String(match.id));
    }
  }, [params, positions]);

  const filtered = department ? positions.filter((p) => p.department === department) : positions;
  const selected = positions.find((p) => String(p.id) === positionId);

  const { status, errors, message, onSubmit, submitting } = useFormSubmit({
    endpoint: '/api/applications',
    rules: applicationRules,
    multipart: true,
    beforeSubmit: (fd) => {
      const errs = {};
      const file = fd.get('resume');
      if (file && file.size > 0) {
        if (file.size > MAX_RESUME) errs.resume = 'Résumé must be 4 MB or smaller.';
        else if (file.type && file.type !== 'application/pdf') errs.resume = 'Résumé must be a PDF file.';
      }
      return errs;
    },
  });

  useEffect(() => {
    if (status === 'success') {
      formRef.current?.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status]);

  if (status === 'success') {
    return (
      <div className="apply-success" role="status" aria-live="polite">
        <Ornament />
        <p className="eyebrow eyebrow--plain">Submission confirmed</p>
        <h3 className="apply-success__title display">Application Received.</h3>
        <p className="apply-success__text">
          Thank you for choosing to become part of Inked Whispers. Our team will review your application.
        </p>
        <p className="apply-success__sub">A confirmation of your interest has been recorded. If shortlisted, we will contact you at the email address you provided.</p>
        <div className="apply-success__actions">
          <Link href="/events" className="btn btn--primary">
            Discover Events <ArrowRight className="btn__arrow" aria-hidden="true" />
          </Link>
          <Link href="/" className="btn btn--ghost">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} className="form form--application" onSubmit={onSubmit} noValidate encType="multipart/form-data">
      <Honeypot />

      <fieldset className="form__set">
        <legend className="form__legend">
          <span className="form__legend-num">01</span> About you
        </legend>
        <div className="form__grid">
          <Field label="Full Name" name="full_name" required autoComplete="name" maxLength={120} error={errors.full_name} />
          <Field label="Email" name="email" type="email" required autoComplete="email" inputMode="email" maxLength={200} error={errors.email} />
          <Field label="Phone Number" name="phone" type="tel" required autoComplete="tel" inputMode="tel" maxLength={20} error={errors.phone} />
          <Field label="Age" name="age" type="number" required min={10} max={100} inputMode="numeric" error={errors.age} />
          <Field label="City" name="city" required autoComplete="address-level2" maxLength={120} error={errors.city} />
          <Field label="School / College / Organization" name="organization" required autoComplete="organization" maxLength={200} error={errors.organization} />
        </div>
      </fieldset>

      <fieldset className="form__set">
        <legend className="form__legend">
          <span className="form__legend-num">02</span> The role
        </legend>
        <div className="form__grid">
          <Field
            label="Department"
            name="department"
            as="select"
            required
            placeholder="Choose a department"
            options={departments}
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              const still = positions.find((p) => String(p.id) === positionId && p.department === e.target.value);
              if (!still) setPositionId('');
            }}
            error={errors.department}
          />
          <Field
            label="Position Applied For"
            name="position_id"
            as="select"
            required
            placeholder={department ? 'Choose a position' : 'Choose a department first'}
            options={filtered.map((p) => ({ value: String(p.id), label: p.title }))}
            value={positionId}
            onChange={(e) => {
              setPositionId(e.target.value);
              const p = positions.find((x) => String(x.id) === e.target.value);
              if (p) setDepartment(p.department);
            }}
            error={errors.position_title}
          />
          <input type="hidden" name="position_title" value={selected?.title || ''} />
        </div>
      </fieldset>

      <fieldset className="form__set">
        <legend className="form__legend">
          <span className="form__legend-num">03</span> Your story
        </legend>
        <div className="form__grid">
          <Field
            label="Why do you want to join Inked Whispers?"
            name="motivation"
            as="textarea"
            required
            rows={6}
            minLength={20}
            maxLength={4000}
            error={errors.motivation}
            hint="A few honest sentences are better than a polished essay."
            className="form__full"
          />
          <Field label="Relevant Experience" name="experience" as="textarea" rows={4} maxLength={4000} error={errors.experience} className="form__full" />
          <Field label="Skills" name="skills" as="textarea" rows={3} maxLength={2000} error={errors.skills} hint="For example: copy-editing, Figma, event logistics, public speaking." className="form__full" />
        </div>
      </fieldset>

      <fieldset className="form__set">
        <legend className="form__legend">
          <span className="form__legend-num">04</span> Links &amp; documents
        </legend>
        <div className="form__grid">
          <Field label="Portfolio URL" name="portfolio_url" type="url" inputMode="url" placeholder="https://" maxLength={300} error={errors.portfolio_url} />
          <Field label="LinkedIn URL" name="linkedin_url" type="url" inputMode="url" placeholder="https://linkedin.com/in/…" maxLength={300} error={errors.linkedin_url} />
          <Field label="Instagram URL" name="instagram_url" type="url" inputMode="url" placeholder="https://instagram.com/…" maxLength={300} error={errors.instagram_url} />

          <div className={`field file-field${errors.resume ? ' field--error' : ''}`}>
            <span className="field__label" id="resume-label">
              Résumé <span className="field__opt">Optional · PDF up to 4 MB</span>
            </span>
            <label className="file-field__drop" htmlFor="f-resume">
              {resume ? <FileText size={18} aria-hidden="true" /> : <Upload size={18} aria-hidden="true" />}
              <span className="file-field__name">{resume ? resume.name : 'Choose a PDF file'}</span>
            </label>
            <input
              id="f-resume"
              name="resume"
              type="file"
              accept="application/pdf,.pdf"
              className="file-field__input"
              aria-labelledby="resume-label"
              aria-invalid={errors.resume ? true : undefined}
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
            {resume && (
              <button
                type="button"
                className="file-field__clear"
                onClick={() => {
                  const input = document.getElementById('f-resume');
                  if (input) input.value = '';
                  setResume(null);
                }}
              >
                <X size={14} aria-hidden="true" /> Remove file
              </button>
            )}
            {errors.resume && (
              <p className="field__error" role="alert">
                {errors.resume}
              </p>
            )}
          </div>

          <Field label="Additional Information" name="additional_info" as="textarea" rows={3} maxLength={4000} error={errors.additional_info} className="form__full" />
        </div>
      </fieldset>

      <div className={`consent${errors.consent ? ' consent--error' : ''}`}>
        <input id="f-consent" type="checkbox" name="consent" required aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? 'f-consent-error' : undefined} />
        <label htmlFor="f-consent">I confirm that the information provided is accurate.</label>
        {errors.consent && (
          <p id="f-consent-error" className="field__error" role="alert">
            {errors.consent}
          </p>
        )}
      </div>

      {status === 'error' && <FormAlert>{message}</FormAlert>}

      <div className="form__actions">
        <p className="form__note">
          Your application is stored securely and is visible only to authorised Inked Whispers administrators. See our{' '}
          <Link href="/privacy" className="text-link">
            Privacy Policy
          </Link>
          .
        </p>
        <button type="submit" className="btn btn--primary" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" /> Submitting
            </>
          ) : (
            <>
              Submit Application <ArrowRight className="btn__arrow" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
