'use client';

import { Eye, EyeOff } from 'lucide-react';
import ActionForm from './ActionForm';
import { setEventPublished } from '@/lib/actions/events';

export default function PublishToggle({ id, title, published }) {
  return (
    <ActionForm action={setEventPublished} fields={{ id, publish: published ? '0' : '1' }} className="inline-form">
      {({ pending }) => (
        <button type="submit" className={`toggle-pill${published ? ' is-on' : ''}`} disabled={pending} aria-label={published ? `Unpublish ${title}` : `Publish ${title}`} title={published ? 'Click to hide from the website' : 'Click to publish'}>
          {pending ? <span className="spinner" aria-hidden="true" /> : published ? <Eye size={13} aria-hidden="true" /> : <EyeOff size={13} aria-hidden="true" />}
          {published ? 'Published' : 'Hidden'}
        </button>
      )}
    </ActionForm>
  );
}
