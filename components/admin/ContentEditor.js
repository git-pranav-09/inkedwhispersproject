'use client';

import { useActionState, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react';
import Field from '@/components/ui/Field';
import { saveContent } from '@/lib/actions/content';
import { cx } from '@/lib/utils';

function Section({ id, title, description, children }) {
  const [state, action, pending] = useActionState(saveContent, null);
  const errors = state?.errors || {};
  return (
    <form action={action} className="a-card a-fieldset content-section" id={`content-${id}`} noValidate>
      <input type="hidden" name="key" value={id} />
      <div className="content-section__head">
        <div>
          <h2 className="a-card__title">{title}</h2>
          {description && <p className="a-hint">{description}</p>}
        </div>
        <button type="submit" className="abtn abtn--primary" disabled={pending} aria-busy={pending}>
          {pending ? <span className="spinner" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />} Save
        </button>
      </div>
      {state?.message && (
        <p className={cx('action-form__msg', state.ok ? 'is-ok' : 'is-error')} role="status">
          {state.message}
        </p>
      )}
      {children(errors)}
    </form>
  );
}

function JourneyEditor({ initial, error }) {
  const [items, setItems] = useState(initial);
  const set = (i, k, v) => setItems((list) => list.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const move = (i, d) =>
    setItems((list) => {
      const next = [...list];
      const j = i + d;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  return (
    <div className="journey-edit">
      <input type="hidden" name="journey_json" value={JSON.stringify(items)} />
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
      {items.map((it, i) => (
        <div key={i} className="journey-edit__item">
          <div className="a-form__row">
            <div className="field">
              <label className="field__label" htmlFor={`j-m-${i}`}>
                Marker
              </label>
              <input id={`j-m-${i}`} className="field__control" value={it.marker} maxLength={40} onChange={(e) => set(i, 'marker', e.target.value)} placeholder="Chapter I / 2025" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`j-t-${i}`}>
                Title
              </label>
              <input id={`j-t-${i}`} className="field__control" value={it.title} maxLength={120} onChange={(e) => set(i, 'title', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor={`j-x-${i}`}>
              Text
            </label>
            <textarea id={`j-x-${i}`} className="field__control" rows={3} value={it.text} maxLength={600} onChange={(e) => set(i, 'text', e.target.value)} />
          </div>
          <div className="row-actions">
            <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move chapter ${i + 1} up`}>
              <ArrowUp size={15} />
            </button>
            <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move chapter ${i + 1} down`}>
              <ArrowDown size={15} />
            </button>
            <button type="button" className="icon-btn icon-btn--danger" onClick={() => setItems((l) => l.filter((_, idx) => idx !== i))} aria-label={`Remove chapter ${i + 1}`}>
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="abtn abtn--ghost abtn--sm" onClick={() => setItems((l) => [...l, { marker: '', title: '', text: '' }])} disabled={items.length >= 12}>
        <Plus size={14} aria-hidden="true" /> Add chapter
      </button>
    </div>
  );
}

const TABS = [
  { id: 'contact', label: 'Contact & Social' },
  { id: 'home', label: 'Homepage' },
  { id: 'featured', label: 'Featured' },
  { id: 'journey', label: 'Our Journey' },
  { id: 'about', label: 'About' },
];

export default function ContentEditor({ content }) {
  const [tab, setTab] = useState('contact');
  const c = content;
  return (
    <div className="content-editor">
      <div className="a-tabs" role="tablist" aria-label="Content sections">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} className={cx('a-tab', tab === t.id && 'is-active')} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'contact' && (
          <Section id="contact" title="Contact & social links" description="Shown on the Contact page and in the footer. Leave a value in [BRACKETS] to keep it hidden as a placeholder.">
            {(e) => (
              <>
                <div className="a-form__row">
                  <Field label="Official email" name="email" defaultValue={c.contact.email} maxLength={200} error={e.email} />
                  <Field label="Location" name="location" defaultValue={c.contact.location} maxLength={120} error={e.location} />
                </div>
                <div className="a-form__row">
                  <Field label="Instagram URL" name="instagram" defaultValue={c.contact.instagram} maxLength={300} error={e.instagram} />
                  <Field label="LinkedIn URL" name="linkedin" defaultValue={c.contact.linkedin} maxLength={300} error={e.linkedin} />
                </div>
                <div className="a-form__row a-form__row--3">
                  <Field label="YouTube URL" name="youtube" defaultValue={c.contact.youtube} maxLength={300} error={e.youtube} />
                  <Field label="Other social — label" name="other_label" defaultValue={c.contact.other_label} maxLength={60} error={e.other_label} />
                  <Field label="Other social — URL" name="other_url" defaultValue={c.contact.other_url} maxLength={300} error={e.other_url} />
                </div>
              </>
            )}
          </Section>
        )}

        {tab === 'home' && (
          <Section id="home" title="Homepage hero & philosophy">
            {(e) => (
              <>
                <Field label="Hero eyebrow" name="hero_eyebrow" defaultValue={c.home.hero_eyebrow} maxLength={80} error={e.hero_eyebrow} />
                <Field label="Hero headline" name="hero_headline" required defaultValue={c.home.hero_headline} maxLength={120} hint="The last word is set in gold italics." error={e.hero_headline} />
                <Field label="Hero sub-headline" name="hero_subheadline" as="textarea" rows={2} defaultValue={c.home.hero_subheadline} maxLength={300} error={e.hero_subheadline} />
                <Field label="Philosophy statement" name="philosophy_heading" as="textarea" rows={2} defaultValue={c.home.philosophy_heading} maxLength={300} error={e.philosophy_heading} />
                <Field label="Philosophy paragraphs" name="philosophy_body" as="textarea" rows={10} required defaultValue={(c.home.philosophy_body || []).join('\n\n')} maxLength={6000} hint="Separate paragraphs with a blank line." error={e.philosophy_body} />
              </>
            )}
          </Section>
        )}

        {tab === 'featured' && (
          <Section id="featured" title="Featured content cards" description="Three cards on the homepage. Links must be internal paths such as /events.">
            {(e) => (
              <div className="featured-edit">
                {[0, 1, 2].map((i) => {
                  const f = c.featured[i] || {};
                  return (
                    <fieldset key={i} className="featured-edit__card">
                      <legend>Card {i + 1}</legend>
                      <Field label="Eyebrow" name={`f${i}_eyebrow`} defaultValue={f.eyebrow} maxLength={60} />
                      <Field label="Title" name={`f${i}_title`} required defaultValue={f.title} maxLength={120} error={e[`f${i}_title`]} />
                      <Field label="Excerpt" name={`f${i}_excerpt`} as="textarea" rows={3} defaultValue={f.excerpt} maxLength={400} />
                      <div className="a-form__row">
                        <Field label="Link" name={`f${i}_href`} defaultValue={f.href} maxLength={200} error={e[`f${i}_href`]} />
                        <Field label="Link text" name={`f${i}_cta`} defaultValue={f.cta} maxLength={40} />
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            )}
          </Section>
        )}

        {tab === 'journey' && (
          <Section id="journey" title="Our Journey timeline" description="Shown on the homepage and About page. Replace the [BRACKETED] placeholders with your real history.">
            {(e) => <JourneyEditor initial={c.journey} error={e.journey} />}
          </Section>
        )}

        {tab === 'about' && (
          <Section id="about" title="About page">
            {(e) => (
              <>
                <Field label="Who we are" name="who_we_are" as="textarea" rows={8} defaultValue={(c.about.who_we_are || []).join('\n\n')} maxLength={6000} hint="Separate paragraphs with a blank line." />
                <div className="a-form__row">
                  <Field label="Vision" name="vision" as="textarea" rows={3} required defaultValue={c.about.vision} maxLength={400} error={e.vision} />
                  <Field label="Mission" name="mission" as="textarea" rows={3} required defaultValue={c.about.mission} maxLength={400} error={e.mission} />
                </div>
                <p className="field__label">What Inked Whispers stands for</p>
                <div className="a-form__row">
                  {[0, 1, 2, 3].map((i) => (
                    <fieldset key={i} className="featured-edit__card">
                      <legend>Value {i + 1}</legend>
                      <Field label="Title" name={`v${i}_title`} defaultValue={c.about.values?.[i]?.title || ''} maxLength={60} />
                      <Field label="Text" name={`v${i}_text`} as="textarea" rows={3} defaultValue={c.about.values?.[i]?.text || ''} maxLength={400} />
                    </fieldset>
                  ))}
                </div>
              </>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}
