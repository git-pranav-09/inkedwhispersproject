'use client';

import { useActionState, useState } from 'react';
import { Plus, Save, Trash2, ImageUp } from 'lucide-react';
import Field from '@/components/ui/Field';
import { saveEvent } from '@/lib/actions/events';
import { EVENT_STATUSES, EVENT_MODES } from '@/lib/constants';
import { slugify } from '@/lib/utils';

function trimTime(t) {
  return t ? String(t).slice(0, 5) : '';
}

function WinnersEditor({ initial }) {
  const [rows, setRows] = useState(initial?.length ? initial : []);
  const update = (i, k, v) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));
  return (
    <div className="winners">
      <input type="hidden" name="winners_json" value={JSON.stringify(rows)} />
      {rows.length === 0 && <p className="a-hint">No winners added yet.</p>}
      {rows.map((w, i) => (
        <div key={i} className="winners__row">
          <div className="winners__cell winners__cell--pos">
            <label htmlFor={`w-pos-${i}`}>Position</label>
            <input id={`w-pos-${i}`} className="a-input" value={w.position || ''} onChange={(e) => update(i, 'position', e.target.value)} placeholder="1st Place" maxLength={60} />
          </div>
          <div className="winners__cell">
            <label htmlFor={`w-name-${i}`}>Name</label>
            <input id={`w-name-${i}`} className="a-input" value={w.name || ''} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Winner name" maxLength={160} />
          </div>
          <div className="winners__cell">
            <label htmlFor={`w-work-${i}`}>Work / Title</label>
            <input id={`w-work-${i}`} className="a-input" value={w.work || ''} onChange={(e) => update(i, 'work', e.target.value)} placeholder="Optional" maxLength={200} />
          </div>
          <button type="button" className="icon-btn icon-btn--danger winners__remove" onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))} aria-label={`Remove winner ${i + 1}`}>
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" className="abtn abtn--ghost abtn--sm" onClick={() => setRows((r) => [...r, { position: '', name: '', work: '' }])} disabled={rows.length >= 30}>
        <Plus size={14} aria-hidden="true" /> Add winner
      </button>
    </div>
  );
}

export default function EventForm({ event, kind = 'upcoming' }) {
  const [state, formAction, pending] = useActionState(saveEvent, null);
  const [title, setTitle] = useState(event?.title || '');
  const [slug, setSlug] = useState(event?.slug || '');
  const [slugTouched, setSlugTouched] = useState(Boolean(event?.slug));
  const [preview, setPreview] = useState(event?.image_url || '');
  const e = state?.errors || {};
  const isPast = kind === 'past';
  const statusOptions = isPast ? EVENT_STATUSES : EVENT_STATUSES;
  const defaultStatus = event?.status || (isPast ? 'completed' : 'draft');

  return (
    <form action={formAction} className="a-form a-form--event" noValidate>
      {event?.id && <input type="hidden" name="id" value={event.id} />}
      <input type="hidden" name="kind" value={kind} />

      {state && !state.ok && state.message && (
        <div className="a-alert" role="alert">
          {state.message}
        </div>
      )}

      <div className="a-form__grid">
        <div className="a-form__main">
          <fieldset className="a-card a-fieldset">
            <legend className="a-card__title">Essentials</legend>
            <Field
              label="Title"
              name="title"
              required
              value={title}
              onChange={(ev) => {
                setTitle(ev.target.value);
                if (!slugTouched) setSlug(slugify(ev.target.value));
              }}
              maxLength={160}
              error={e.title}
            />
            <Field
              label="URL slug"
              name="slug"
              required
              value={slug}
              onChange={(ev) => {
                setSlugTouched(true);
                setSlug(ev.target.value.toLowerCase());
              }}
              maxLength={120}
              hint={`Public address: ${isPast ? '/past-events/' : '/events/'}${slug || 'your-event'}`}
              error={e.slug}
            />
            <Field label="Short description" name="short_description" as="textarea" rows={2} maxLength={320} defaultValue={event?.short_description || ''} hint="Shown on event cards (up to 320 characters)." error={e.short_description} />
            <Field label="Full description" name="description" as="textarea" rows={8} maxLength={12000} defaultValue={event?.description || ''} hint="Separate paragraphs with a blank line." error={e.description} />
          </fieldset>

          <fieldset className="a-card a-fieldset">
            <legend className="a-card__title">When & where</legend>
            <div className="a-form__row a-form__row--3">
              <Field label="Date" name="event_date" type="date" defaultValue={event?.event_date || ''} error={e.event_date} />
              <Field label="Start time" name="start_time" type="time" defaultValue={trimTime(event?.start_time)} error={e.start_time} />
              <Field label="End time" name="end_time" type="time" defaultValue={trimTime(event?.end_time)} error={e.end_time} />
            </div>
            <div className="a-form__row">
              <Field label="Mode" name="mode" as="select" required options={EVENT_MODES} defaultValue={event?.mode || 'offline'} error={e.mode} />
              <Field label="Venue / platform" name="venue" maxLength={240} defaultValue={event?.venue || ''} placeholder="e.g. Auditorium, Lucknow — or Zoom" error={e.venue} />
            </div>
            <div className="a-form__row">
              <Field label="Event type" name="event_type" maxLength={80} defaultValue={event?.event_type || ''} placeholder="e.g. Poetry Competition" error={e.event_type} />
              <Field label="Fee" name="fee" maxLength={80} defaultValue={event?.fee || ''} placeholder="e.g. Free or ₹199" error={e.fee} />
            </div>
          </fieldset>

          {!isPast && (
            <fieldset className="a-card a-fieldset">
              <legend className="a-card__title">Registration, rules & guidelines</legend>
              <Field label="Registration URL" name="registration_url" type="url" maxLength={500} defaultValue={event?.registration_url || ''} placeholder="https://forms.gle/…" hint="Required when status is Registration Open." error={e.registration_url} />
              <Field label="Rules" name="rules" as="textarea" rows={5} maxLength={8000} defaultValue={event?.rules || ''} hint="One rule per line." error={e.rules} />
              <Field label="Guidelines" name="guidelines" as="textarea" rows={5} maxLength={8000} defaultValue={event?.guidelines || ''} hint="One guideline per line." error={e.guidelines} />
            </fieldset>
          )}

          {isPast && (
            <fieldset className="a-card a-fieldset">
              <legend className="a-card__title">Winners, highlights & results</legend>
              <WinnersEditor initial={event?.winners} />
              <Field label="Highlights" name="highlights" as="textarea" rows={5} maxLength={8000} defaultValue={event?.highlights || ''} hint="One highlight per line." error={e.highlights} />
              <Field label="Results" name="results" as="textarea" rows={4} maxLength={8000} defaultValue={event?.results || ''} error={e.results} />
              <Field label="Certificate information" name="certificate_info" as="textarea" rows={3} maxLength={4000} defaultValue={event?.certificate_info || ''} hint="e.g. how and when participants receive certificates." error={e.certificate_info} />
            </fieldset>
          )}

          <fieldset className="a-card a-fieldset">
            <legend className="a-card__title">Organiser & contact</legend>
            <div className="a-form__row">
              <Field label="Organiser name" name="organizer_name" maxLength={160} defaultValue={event?.organizer_name || ''} error={e.organizer_name} />
              <Field label="Contact email" name="contact_email" type="email" maxLength={200} defaultValue={event?.contact_email || ''} error={e.contact_email} />
            </div>
            <div className="a-form__row">
              <Field label="Contact phone" name="contact_phone" type="tel" maxLength={20} defaultValue={event?.contact_phone || ''} error={e.contact_phone} />
              <Field label="Organiser information" name="organizer_info" maxLength={1000} defaultValue={event?.organizer_info || ''} error={e.organizer_info} />
            </div>
            {isPast && (
              <>
                <input type="hidden" name="registration_url" value={event?.registration_url || ''} />
                <input type="hidden" name="rules" value={event?.rules || ''} />
                <input type="hidden" name="guidelines" value={event?.guidelines || ''} />
              </>
            )}
            {!isPast && (
              <>
                <input type="hidden" name="winners_json" value={JSON.stringify(event?.winners || [])} />
                <input type="hidden" name="highlights" value={event?.highlights || ''} />
                <input type="hidden" name="results" value={event?.results || ''} />
                <input type="hidden" name="certificate_info" value={event?.certificate_info || ''} />
              </>
            )}
          </fieldset>
        </div>

        <aside className="a-form__side">
          <div className="a-card a-fieldset a-sticky">
            <h2 className="a-card__title">Publishing</h2>
            <Field label="Status" name="status" as="select" required options={statusOptions} defaultValue={defaultStatus} error={e.status} hint={isPast ? 'Past events should be Completed.' : 'Completed events move to Past Events.'} />
            <label className="a-check">
              <input type="checkbox" name="is_published" defaultChecked={event ? event.is_published : false} />
              <span>
                <strong>Visible on website</strong>
                <small>Drafts are always hidden.</small>
              </span>
            </label>
            <button type="submit" className="abtn abtn--primary abtn--block" disabled={pending} aria-busy={pending}>
              {pending ? <span className="spinner" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
              {event?.id ? 'Save changes' : 'Create event'}
            </button>
          </div>

          <div className="a-card a-fieldset">
            <h2 className="a-card__title">Cover image</h2>
            <div className="image-drop">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Cover preview" className="image-drop__preview" />
              ) : (
                <div className="image-drop__empty">
                  <ImageUp size={22} aria-hidden="true" />
                  <span>No image yet</span>
                </div>
              )}
            </div>
            <label htmlFor="event-image" className="field__label">
              Upload image <span className="field__opt">JPG, PNG or WebP · max 5 MB</span>
            </label>
            <input
              id="event-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="a-file"
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
            {e.image && (
              <p className="field__error" role="alert">
                {e.image}
              </p>
            )}
            {event?.image_url && (
              <label className="a-check a-check--small">
                <input type="checkbox" name="remove_image" />
                <span>Remove current image</span>
              </label>
            )}
          </div>
        </aside>
      </div>
    </form>
  );
}
