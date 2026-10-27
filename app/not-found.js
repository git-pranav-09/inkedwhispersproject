import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LogoLockup } from '@/components/ui/Logo';
import { Ornament } from '@/components/ui/Ornament';
import '@/styles/site.css';

export const metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="status-page grain">
      <div className="status-page__inner">
        <LogoLockup />
        <p className="status-page__code display" aria-hidden="true">
          404
        </p>
        <Ornament />
        <h1 className="status-page__title display">This page was never written.</h1>
        <p className="status-page__text">The link may be outdated, or the page may have moved to a new chapter.</p>
        <div className="status-page__actions">
          <Link href="/" className="btn btn--primary">
            <ArrowLeft size={16} aria-hidden="true" /> Return Home
          </Link>
          <Link href="/events" className="btn btn--ghost">
            Discover Events
          </Link>
        </div>
      </div>
    </main>
  );
}
