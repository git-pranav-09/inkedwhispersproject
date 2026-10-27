'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { cx } from '@/lib/utils';

export default function AdminShell({ user, counts, children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className={cx('admin', open && 'admin--nav-open')}>
      <a href="#admin-main" className="skip-link">
        Skip to content
      </a>
      <AdminSidebar counts={counts} onNavigate={() => setOpen(false)} />
      <button type="button" className="admin__scrim" aria-hidden={!open} tabIndex={-1} onClick={() => setOpen(false)} />
      <div className="admin__body">
        <AdminHeader user={user} counts={counts} onMenu={() => setOpen((v) => !v)} menuOpen={open} />
        <main id="admin-main" className="admin__main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
