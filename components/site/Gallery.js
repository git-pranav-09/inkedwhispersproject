'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

/** Masonry gallery with an accessible keyboard-driven lightbox. */
export default function Gallery({ images, title }) {
  const [index, setIndex] = useState(-1);
  const dialogRef = useRef(null);
  const lastFocus = useRef(null);
  const open = index >= 0;

  const close = useCallback(() => setIndex(-1), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
    } else if (!open && d.open) {
      d.close();
      lastFocus.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, next, prev]);

  if (!images?.length) return null;
  const current = open ? images[index] : null;

  return (
    <>
      <ul role="list" className="masonry">
        {images.map((img, i) => (
          <li key={img.id || img.image_url} className="masonry__item">
            <button
              type="button"
              className="masonry__btn"
              onClick={(e) => {
                lastFocus.current = e.currentTarget;
                setIndex(i);
              }}
              aria-label={`Open photograph ${i + 1} of ${images.length}${img.caption ? `: ${img.caption}` : ''}`}
            >
              <Image
                src={img.image_url}
                alt={img.caption || `${title} — photograph ${i + 1}`}
                width={800}
                height={i % 3 === 0 ? 1000 : i % 3 === 1 ? 600 : 800}
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                className="masonry__img"
              />
              <span className="masonry__zoom" aria-hidden="true">
                <Expand size={16} />
              </span>
              {img.caption && <span className="masonry__caption">{img.caption}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dialogRef} className="lightbox" aria-label={`${title} gallery`} onClose={close} onClick={(e) => e.target === dialogRef.current && close()}>
        {current && (
          <div className="lightbox__inner">
            <button type="button" className="lightbox__close" onClick={close} aria-label="Close gallery">
              <X size={22} />
            </button>
            <figure className="lightbox__figure">
              <div className="lightbox__frame">
                <Image src={current.image_url} alt={current.caption || `${title} — photograph ${index + 1}`} fill sizes="100vw" className="lightbox__img" />
              </div>
              <figcaption className="lightbox__caption">
                <span>{current.caption || title}</span>
                <span className="lightbox__count">
                  {index + 1} / {images.length}
                </span>
              </figcaption>
            </figure>
            {images.length > 1 && (
              <>
                <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="Previous photograph">
                  <ChevronLeft size={26} />
                </button>
                <button type="button" className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="Next photograph">
                  <ChevronRight size={26} />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
