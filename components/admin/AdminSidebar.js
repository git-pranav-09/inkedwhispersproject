'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ExternalLink, LogOut } from 'lucide-react';
import { adminNav } from './nav';
import { logoutAction } from '@/lib/actions/auth';
import { cx } from '@/lib/utils';

export default function AdminSidebar({ counts, onNavigate }) {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <div className="admin-sidebar__brand">
        <Link href="/admin/dashboard" className="admin-sidebar__logo" onClick={onNavigate}>
          <Image src="/logo/emblem.png" alt="" width={40} height={38} />
          <span>
            <strong>Inked Whispers</strong>
            <small>Administration</small>
          </span>
        </Link>
      </div>
      <nav className="admin-sidebar__nav">
        <ul role="list">
          {adminNav.map(({ href, label, icon: Ico, countKey }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            const count = countKey ? counts?.[countKey] : 0;
            return (
              <li key={href}>
                <Link href={href} className={cx('admin-sidebar__link', active && 'is-active')} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
                  <Ico size={18} strokeWidth={1.7} aria-hidden="true" />
                  <span>{label}</span>
                  {count > 0 && (
                    <span className="admin-sidebar__count" aria-label={`${count} new`}>
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="admin-sidebar__foot">
        <Link href="/" className="admin-sidebar__link" target="_blank" rel="noopener noreferrer">
          <ExternalLink size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>View website</span>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="admin-sidebar__link admin-sidebar__logout">
            <LogOut size={18} strokeWidth={1.7} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
