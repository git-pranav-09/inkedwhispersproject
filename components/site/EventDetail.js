import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock, IndianRupee, Mail, MapPin, Phone, Tag, User, Wifi } from 'lucide-react';
import { RegistrationPill } from './EventCard';
import { formatDate, formatTimeRange, toLines, toParagraphs } from '@/lib/utils';
import { registrationState, EVENT_MODES } from '@/lib/constants';
import { isSafeUrl } from '@/lib/validations';

function RegistrationCta({ event }) {
  const s = registrationState(event);
  if (s.key === 'open' && isSafeUrl(event.registration_url)) {
    return (
      <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--block">
        Register Now <ArrowUpRight className="btn__arrow" aria-hidden="true" />
        <span className="visually-hidden">(opens in a new tab)</span>
      </a>
    );
  }
  if (s.key === 'closed') {
    return (
      <span className="btn btn--ghost btn--block reg-cta--closed" aria-disabled="true" role="status">
        Registration Closed
      </span>
    );
  }
  return (
    <span className="btn btn--ghost btn--block reg-cta--upcoming" aria-disabled="true" role="status">
      Upcoming
    </span>
  );
}

export default function EventDetail({ event }) {
  const description = toParagraphs(event.description);
  const rules = toLines(event.rules);
  const guidelines = toLines(event.guidelines);
  const mode = EVENT_MODES.find((m) => m.value === event.mode)?.label || 'In person';
  const state = registrationState(event);

  return (
    <article className="event-detail">
      <header className="event-hero grain">
        <div className="event-hero__media" aria-hidden="true">
          <Image src={event.image_url || '/images/site/event-fallback.jpg'} alt="" fill priority sizes="100vw" className="event-hero__img" />
        </div>
        <div className="event-hero__shade" aria-hidden="true" />
        <div className="container event-hero__inner">
          <Link href="/events" className="back-link">
            <ArrowLeft size={16} aria-hidden="true" /> All events
          </Link>
          <div className="event-hero__tags">
            <RegistrationPill event={event} />
            {event.event_type && <span className="tag">{event.event_type}</span>}
          </div>
          <h1 className="event-hero__title display">{event.title}</h1>
          {event.short_description && <p className="event-hero__lede lede">{event.short_description}</p>}
          <ul role="list" className="event-hero__facts">
            <li>
              <CalendarDays size={16} aria-hidden="true" /> {formatDate(event.event_date)}
            </li>
            <li>
              <Clock size={16} aria-hidden="true" /> {formatTimeRange(event.start_time, event.end_time)}
            </li>
            <li>
              {event.mode === 'online' ? <Wifi size={16} aria-hidden="true" /> : <MapPin size={16} aria-hidden="true" />}
              {event.mode === 'online' ? 'Online' : event.venue || 'Venue to be announced'}
            </li>
          </ul>
        </div>
      </header>

      <div className="container event-body">
        <div className="event-body__main">
          {description.length > 0 && (
            <section aria-labelledby="ev-about">
              <h2 id="ev-about" className="event-body__h">About this event</h2>
              <div className="prose">
                {description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          )}
          {rules.length > 0 && (
            <section aria-labelledby="ev-rules">
              <h2 id="ev-rules" className="event-body__h">Rules</h2>
              <ol className="numbered-list">
                {rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ol>
            </section>
          )}
          {guidelines.length > 0 && (
            <section aria-labelledby="ev-guidelines">
              <h2 id="ev-guidelines" className="event-body__h">Guidelines</h2>
              <ul className="prose-list">
                {guidelines.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
          )}
          {(event.organizer_name || event.organizer_info) && (
            <section aria-labelledby="ev-org">
              <h2 id="ev-org" className="event-body__h">Organiser</h2>
              <div className="organizer">
                <User size={18} aria-hidden="true" />
                <div>
                  {event.organizer_name && <p className="organizer__name">{event.organizer_name}</p>}
                  {event.organizer_info && <p className="organizer__info">{event.organizer_info}</p>}
                </div>
              </div>
            </section>
          )}
        </div>

        <aside className="event-aside" aria-label="Event details and registration">
          <div className="event-aside__card">
            <p className="eyebrow eyebrow--plain">Event details</p>
            <dl className="event-aside__list">
              <div>
                <dt>
                  <CalendarDays size={15} aria-hidden="true" /> Date
                </dt>
                <dd>{formatDate(event.event_date)}</dd>
              </div>
              <div>
                <dt>
                  <Clock size={15} aria-hidden="true" /> Time
                </dt>
                <dd>{formatTimeRange(event.start_time, event.end_time)}</dd>
              </div>
              <div>
                <dt>
                  <MapPin size={15} aria-hidden="true" /> Venue
                </dt>
                <dd>
                  {event.mode === 'online' ? 'Online' : event.venue || 'To be announced'}
                  <span className="event-aside__sub">{mode}</span>
                </dd>
              </div>
              <div>
                <dt>
                  <IndianRupee size={15} aria-hidden="true" /> Fee
                </dt>
                <dd>{event.fee || 'Free'}</dd>
              </div>
              {event.event_type && (
                <div>
                  <dt>
                    <Tag size={15} aria-hidden="true" /> Format
                  </dt>
                  <dd>{event.event_type}</dd>
                </div>
              )}
            </dl>
            <RegistrationCta event={event} />
            {state.key === 'upcoming' && <p className="event-aside__note">Registration details will be announced soon.</p>}
            {state.key === 'open-soon' && <p className="event-aside__note">Registration link will be shared shortly.</p>}
          </div>

          {(event.contact_email || event.contact_phone) && (
            <div className="event-aside__card event-aside__card--quiet">
              <p className="eyebrow eyebrow--plain">Questions?</p>
              <ul role="list" className="event-aside__contact">
                {event.contact_email && (
                  <li>
                    <Mail size={15} aria-hidden="true" />
                    <a href={`mailto:${event.contact_email}`} className="text-link">
                      {event.contact_email}
                    </a>
                  </li>
                )}
                {event.contact_phone && (
                  <li>
                    <Phone size={15} aria-hidden="true" />
                    <a href={`tel:${event.contact_phone.replace(/[^+\d]/g, '')}`} className="text-link">
                      {event.contact_phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
