import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Clock, MapPin, Wifi } from 'lucide-react';
import { dateParts, formatDate, formatTimeRange } from '@/lib/utils';
import { registrationState } from '@/lib/constants';
import { cx } from '@/lib/utils';

export function RegistrationPill({ event, className }) {
  const s = registrationState(event);
  return (
    <span className={cx('reg-pill', `reg-pill--${s.key}`, className)}>
      <span className="reg-pill__dot" aria-hidden="true" />
      {s.key === 'open' ? 'Registration Open' : s.label}
    </span>
  );
}

export default function EventCard({ event, href, past = false, priority = false }) {
  const parts = dateParts(event.event_date);
  const link = href || `/${past ? 'past-events' : 'events'}/${event.slug}`;
  const online = event.mode === 'online';
  return (
    <article className="event-card">
      <Link href={link} className="event-card__media" tabIndex={-1} aria-hidden="true">
        <Image
          src={event.image_url || '/images/site/event-fallback.jpg'}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="event-card__img"
          priority={priority}
        />
        {parts && (
          <span className="event-card__date">
            <span className="event-card__day">{parts.day}</span>
            <span className="event-card__month">{parts.month}</span>
          </span>
        )}
        {!past && <RegistrationPill event={event} className="event-card__pill" />}
      </Link>
      <div className="event-card__body">
        {event.event_type && <p className="event-card__type">{event.event_type}</p>}
        <h3 className="event-card__title">
          <Link href={link}>{event.title}</Link>
        </h3>
        {event.short_description && <p className="event-card__desc">{event.short_description}</p>}
        <ul role="list" className="event-card__meta">
          <li>
            <CalendarDays size={15} aria-hidden="true" />
            <span>{formatDate(event.event_date)}</span>
          </li>
          {!past && (
            <li>
              <Clock size={15} aria-hidden="true" />
              <span>{formatTimeRange(event.start_time, event.end_time)}</span>
            </li>
          )}
          <li>
            {online ? <Wifi size={15} aria-hidden="true" /> : <MapPin size={15} aria-hidden="true" />}
            <span>{online ? 'Online' : event.venue || 'Venue to be announced'}{event.mode === 'hybrid' ? ' · Hybrid' : ''}</span>
          </li>
        </ul>
        <Link href={link} className="link-arrow event-card__cta">
          {past ? 'View Highlights' : 'View Event'} <ArrowUpRight aria-hidden="true" />
          <span className="visually-hidden">: {event.title}</span>
        </Link>
      </div>
    </article>
  );
}
