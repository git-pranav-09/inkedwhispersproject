'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { Ornament } from '@/components/ui/Ornament';
import '@/styles/site.css';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page grain">
      <div className="status-page__inner">
        <Ornament />
        <h1 className="status-page__title display">A line went astray.</h1>
        <p className="status-page__text">Something unexpected happened while loading this page. Please try again — if it persists, come back a little later.</p>
        {error?.digest && <p className="status-page__ref">Reference: {error.digest}</p>}
        <div className="status-page__actions">
          <button type="button" className="btn btn--primary" onClick={() => reset()}>
            <RotateCcw size={16} aria-hidden="true" /> Try Again
          </button>
          <Link href="/" className="btn btn--ghost">
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
