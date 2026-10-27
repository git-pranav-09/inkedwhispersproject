import SocialIcon from '@/components/ui/SocialIcon';
import { isPlaceholder } from '@/lib/utils';
import { isSafeUrl } from '@/lib/validations';
import { cx } from '@/lib/utils';

/**
 * Renders social profiles from site content. Unfilled [PLACEHOLDER] values are
 * shown as inert labels (never as dead links) so it is obvious what to fill in.
 */
export default function SocialLinks({ contact, variant = 'icons', className }) {
  const items = [
    { key: 'instagram', label: 'Instagram', url: contact.instagram },
    { key: 'linkedin', label: 'LinkedIn', url: contact.linkedin },
    { key: 'youtube', label: 'YouTube', url: contact.youtube },
    { key: 'link', label: isPlaceholder(contact.other_label) ? 'Other' : contact.other_label, url: contact.other_url, raw: contact.other_label },
  ].filter((it) => it.url && String(it.url).trim());

  if (!items.length) return null;

  return (
    <ul role="list" className={cx('socials', `socials--${variant}`, className)}>
      {items.map((it) => {
        const live = !isPlaceholder(it.url) && isSafeUrl(it.url);
        const content = (
          <>
            <SocialIcon name={it.key} size={variant === 'list' ? 18 : 17} />
            <span className={variant === 'icons' ? 'visually-hidden' : 'socials__label'}>{it.label}</span>
            {variant === 'list' && <span className="socials__value">{live ? displayUrl(it) : it.url}</span>}
          </>
        );
        return (
          <li key={it.key}>
            {live ? (
              <a href={it.url} target="_blank" rel="noopener noreferrer" className="socials__item" aria-label={variant === 'icons' ? `${it.label} (opens in a new tab)` : undefined}>
                {content}
              </a>
            ) : (
              <span className="socials__item socials__item--pending" title={`${it.label}: ${it.url} — add the real URL in Admin → Website Content`}>
                {content}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Shows social profiles as @handle where possible, otherwise as a short URL. */
function displayUrl({ key, url }) {
  const short = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  if (key === 'instagram') {
    const m = short.match(/^instagram\.com\/([A-Za-z0-9._]+)$/);
    if (m) return `@${m[1]}`;
  }
  return short;
}
