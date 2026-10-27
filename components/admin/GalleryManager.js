'use client';

import { useActionState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import ActionForm from './ActionForm';
import ConfirmAction from './ConfirmAction';
import { uploadGalleryImages, updateGalleryCaption, moveGalleryImage, deleteGalleryImage } from '@/lib/actions/gallery';

function UploadForm({ eventId }) {
  const ref = useRef(null);
  const [state, action, pending] = useActionState(async (prev, fd) => {
    const res = await uploadGalleryImages(prev, fd);
    if (res?.ok) ref.current?.reset();
    return res;
  }, null);
  return (
    <form ref={ref} action={action} className="gallery-upload">
      <input type="hidden" name="event_id" value={eventId} />
      <label htmlFor="gallery-photos" className="field__label">
        Add photos <span className="field__opt">Up to 12 at a time · JPG, PNG, WebP · 5 MB each</span>
      </label>
      <div className="gallery-upload__row">
        <input id="gallery-photos" name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" className="a-file" required />
        <button type="submit" className="abtn abtn--dark" disabled={pending} aria-busy={pending}>
          {pending ? <span className="spinner" aria-hidden="true" /> : <Upload size={15} aria-hidden="true" />} Upload
        </button>
      </div>
      {state?.message && (
        <p className={`action-form__msg ${state.ok ? 'is-ok' : 'is-error'}`} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}

export default function GalleryManager({ eventId, images }) {
  return (
    <section className="a-card a-fieldset" aria-labelledby="gallery-title">
      <div className="a-card__head">
        <h2 id="gallery-title" className="a-card__title">
          Photo gallery
        </h2>
        <span className="a-hint">{images.length} photo{images.length === 1 ? '' : 's'}</span>
      </div>
      <UploadForm eventId={eventId} />
      {images.length > 0 ? (
        <ul role="list" className="gallery-admin">
          {images.map((img, i) => (
            <li key={img.id} className="gallery-admin__item">
              <div className="gallery-admin__thumb">
                <Image src={img.image_url} alt={img.caption || `Gallery photo ${i + 1}`} fill sizes="220px" />
              </div>
              <ActionForm action={updateGalleryCaption} fields={{ id: img.id }} className="gallery-admin__caption">
                {({ pending }) => (
                  <>
                    <label htmlFor={`cap-${img.id}`} className="visually-hidden">
                      Caption for photo {i + 1}
                    </label>
                    <input id={`cap-${img.id}`} name="caption" defaultValue={img.caption || ''} maxLength={240} placeholder="Caption (optional)" className="a-input a-input--sm" />
                    <button type="submit" className="abtn abtn--ghost abtn--xs" disabled={pending}>
                      Save
                    </button>
                  </>
                )}
              </ActionForm>
              <div className="gallery-admin__tools">
                <ActionForm action={moveGalleryImage} fields={{ id: img.id, event_id: eventId, dir: 'up' }} className="inline-form" inlineMessage={false}>
                  <button type="submit" className="icon-btn" disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`}>
                    <ArrowLeft size={14} />
                  </button>
                </ActionForm>
                <ActionForm action={moveGalleryImage} fields={{ id: img.id, event_id: eventId, dir: 'down' }} className="inline-form" inlineMessage={false}>
                  <button type="submit" className="icon-btn" disabled={i === images.length - 1} aria-label={`Move photo ${i + 1} later`}>
                    <ArrowRight size={14} />
                  </button>
                </ActionForm>
                <ConfirmAction action={deleteGalleryImage} fields={{ id: img.id }} iconOnly triggerLabel={`Delete photo ${i + 1}`} title="Remove this photo?" description="The photo will be deleted from the gallery and storage." confirmLabel="Remove photo" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="a-hint">No photos yet. Uploaded photos appear in a masonry gallery with a lightbox on the public page.</p>
      )}
    </section>
  );
}
