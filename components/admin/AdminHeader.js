'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, X, FileText, MessageSquare } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import { initials } from '@/lib/utils';

function useDismiss(ref, open, setOpen) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, ref, setOpen]);
}

export default function AdminHeader({ user, counts, onMenu, menuOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(pathname === '/admin/search' ? params.get('q') || '' : '');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  useDismiss(notifRef, notifOpen, setNotifOpen);
  useDismiss(profileRef, profileOpen, setProfileOpen);

  const total = (counts?.newApplications || 0) + (counts?.unreadMessages || 0);
  const name = user.name || user.email;

  return (
    <header className="admin-header">
      <button type="button" className="admin-header__menu icon-btn" onClick={onMenu} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <form
        className="admin-search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const term = q.trim();
          if (term) router.push(`/admin/search?q=${encodeURIComponent(term)}`);
        }}
      >
        <Search size={16} aria-hidden="true" />
        <label htmlFor="admin-search" className="visually-hidden">
          Search applicants, messages, subscribers and events
        </label>
        <input id="admin-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search applicants, messages, events…" maxLength={100} />
      </form>

      <div className="admin-header__actions">
        <div className="dropdown" ref={notifRef}>
          <button type="button" className="icon-btn admin-header__bell" aria-haspopup="true" aria-expanded={notifOpen} onClick={() => setNotifOpen((v) => !v)} aria-label={`Notifications${total ? `: ${total} new` : ''}`}>
            <Bell size={19} />
            {total > 0 && <span className="admin-header__dot">{total > 9 ? '9+' : total}</span>}
          </button>
          {notifOpen && (
            <div className="dropdown__panel dropdown__panel--wide" role="menu">
              <p className="dropdown__title">Notifications</p>
              {total === 0 ? (
                <p className="dropdown__empty">You’re all caught up.</p>
              ) : (
                <ul role="list" className="dropdown__list">
                  {counts.newApplications > 0 && (
                    <li>
                      <Link href="/admin/applications?status=new" className="dropdown__item" role="menuitem" onClick={() => setNotifOpen(false)}>
                        <FileText size={16} aria-hidden="true" />
                        <span>
                          <strong>{counts.newApplications}</strong> new application{counts.newApplications === 1 ? '' : 's'} awaiting review
                        </span>
                      </Link>
                    </li>
                  )}
                  {counts.unreadMessages > 0 && (
                    <li>
                      <Link href="/admin/messages?status=unread" className="dropdown__item" role="menuitem" onClick={() => setNotifOpen(false)}>
                        <MessageSquare size={16} aria-hidden="true" />
                        <span>
                          <strong>{counts.unreadMessages}</strong> unread message{counts.unreadMessages === 1 ? '' : 's'}
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="dropdown" ref={profileRef}>
          <button type="button" className="admin-profile" aria-haspopup="true" aria-expanded={profileOpen} onClick={() => setProfileOpen((v) => !v)}>
            <span className="admin-profile__avatar" aria-hidden="true">
              {initials(name)}
            </span>
            <span className="admin-profile__text">
              <span className="admin-profile__name">{name}</span>
              <span className="admin-profile__role">{user.role}</span>
            </span>
            <ChevronDown size={15} aria-hidden="true" />
          </button>
          {profileOpen && (
            <div className="dropdown__panel" role="menu">
              <p className="dropdown__meta">{user.email}</p>
              <Link href="/admin/settings" className="dropdown__item" role="menuitem" onClick={() => setProfileOpen(false)}>
                <Settings size={16} aria-hidden="true" /> Settings
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="dropdown__item dropdown__item--danger" role="menuitem">
                  <LogOut size={16} aria-hidden="true" /> Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
