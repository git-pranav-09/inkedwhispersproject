'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LockKeyhole } from 'lucide-react';
import { mainNav } from '@/lib/site-config';
import { LogoLockup } from '@/components/ui/Logo';
import { cx } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const first = panelRef.current?.querySelector('a');
    first?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = panelRef.current.querySelectorAll('a, button');
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className={cx('nav', scrolled && 'nav--scrolled', open && 'nav--open')}>
      <div className="nav__inner container">
        <LogoLockup className="nav__brand" />

        <nav className="nav__desktop" aria-label="Primary">
          <ul role="list" className="nav__list">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={cx('nav__link', isActive(item.href) && 'is-active')} aria-current={isActive(item.href) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/admin/login" className="nav__admin">
            <LockKeyhole size={13} aria-hidden="true" />
            Admin Login
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div id="mobile-menu" ref={panelRef} className="nav__panel" hidden={!open} aria-label="Mobile navigation">
        <nav className="nav__panel-inner container" aria-label="Mobile">
          <ol role="list" className="nav__panel-list">
            {mainNav.map((item, i) => (
              <li key={item.href} style={{ '--i': i }}>
                <Link href={item.href} className={cx('nav__panel-link', isActive(item.href) && 'is-active')} aria-current={isActive(item.href) ? 'page' : undefined}>
                  <span className="nav__panel-num">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
          <div className="nav__panel-foot">
            <Link href="/admin/login" className="btn btn--ghost btn--sm">
              <LockKeyhole size={14} aria-hidden="true" /> Admin Login
            </Link>
            <p className="nav__panel-tag serif">Where Words Become Legacy.</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
