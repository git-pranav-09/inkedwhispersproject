'use client';

import { useActionState, useState } from 'react';
import { ImageUp, Save } from 'lucide-react';
import Field from '@/components/ui/Field';
import { saveCoreMember } from '@/lib/actions/core';

export default function CoreMemberForm({ member }) {
  const [state, action, pending] = useActionState(saveCoreMember, null);
  const [preview, setPreview] = useState(member?.photo_url || '');
  const e = state?.errors || {};
  return (
    <form action={action} className="a-form" noValidate>
      {member?.id && <input type="hidden" name="id" value={member.id} />}
      {state && !state.ok && state.message && (
        <div className="a-alert" role="alert">
          {state.message}
        </div>
      )}
      <div className="a-form__grid">
        <div className="a-form__main">
          <fieldset className="a-card a-fieldset">
            <legend className="a-card__title">Profile</legend>
            <div className="a-form__row">
              <Field label="Name" name="name" required maxLength={120} defaultValue={member?.name || ''} error={e.name} />
              <Field label="Designation" name="designation" required maxLength={120} defaultValue={member?.designation || ''} placeholder="e.g. Founder" error={e.designation} />
            </div>
            <Field label="Bio" name="bio" as="textarea" rows={10} maxLength={4000} hint="Separate paragraphs with a blank line." defaultValue={member?.bio || ''} error={e.bio} />
            <Field label="Responsibilities" name="responsibilities" as="textarea" rows={3} maxLength={2000} defaultValue={member?.responsibilities || ''} hint="One per line." error={e.responsibilities} />
          </fieldset>
          <fieldset className="a-card a-fieldset">
            <legend className="a-card__title">Links</legend>
            <div className="a-form__row a-form__row--3">
              <Field label="Instagram URL" name="instagram_url" type="url" maxLength={300} defaultValue={member?.instagram_url || ''} placeholder="https://instagram.com/…" error={e.instagram_url} />
              <Field label="LinkedIn URL" name="linkedin_url" type="url" maxLength={300} defaultValue={member?.linkedin_url || ''} placeholder="https://linkedin.com/in/…" error={e.linkedin_url} />
              <Field label="Email" name="email" type="email" maxLength={200} defaultValue={member?.email || ''} error={e.email} />
            </div>
          </fieldset>
        </div>
        <aside className="a-form__side">
          <div className="a-card a-fieldset">
            <h2 className="a-card__title">Photo</h2>
            <div className="image-drop image-drop--portrait">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Photo preview" className="image-drop__preview" />
              ) : (
                <div className="image-drop__empty">
                  <ImageUp size={22} aria-hidden="true" />
                  <span>No photo yet</span>
                </div>
              )}
            </div>
            <label htmlFor="member-photo" className="field__label">
              Upload photo <span className="field__opt">Portrait · max 5 MB</span>
            </label>
            <input
              id="member-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="a-file"
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
            {e.photo && (
              <p className="field__error" role="alert">
                {e.photo}
              </p>
            )}
            {member?.photo_url && (
              <label className="a-check a-check--small">
                <input type="checkbox" name="remove_photo" />
                <span>Remove current photo</span>
              </label>
            )}
          </div>
          <div className="a-card a-fieldset">
            <label className="a-check">
              <input type="checkbox" name="is_active" defaultChecked={member ? member.is_active : true} />
              <span>
                <strong>Show on About Core page</strong>
              </span>
            </label>
            <button type="submit" className="abtn abtn--primary abtn--block" disabled={pending} aria-busy={pending}>
              {pending ? <span className="spinner" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />} {member?.id ? 'Save member' : 'Add member'}
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}
