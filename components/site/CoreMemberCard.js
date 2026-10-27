import Image from 'next/image';
import SocialIcon from '@/components/ui/SocialIcon';
import { toLines, isPlaceholder } from '@/lib/utils';
import { isSafeUrl } from '@/lib/validations';

export default function CoreMemberCard({ member, index }) {
  const num = String(index + 1).padStart(2, '0');
  const responsibilities = toLines(member.responsibilities);
  const paragraphs = String(member.bio || '')
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const links = [
    { key: 'instagram', label: 'Instagram', url: member.instagram_url },
    { key: 'linkedin', label: 'LinkedIn', url: member.linkedin_url },
  ].filter((l) => l.url && !isPlaceholder(l.url) && isSafeUrl(l.url));

  return (
    <article className={`core-card${index % 2 ? ' core-card--flip' : ''}${member.photo_url ? '' : ' core-card--pending'}`}>
      <div className="core-card__media">
        <span className="core-card__num" aria-hidden="true">
          {num}
        </span>
        <div className="core-card__frame">
          <Image
            src={member.photo_url || `/images/core/member-${(index % 3) + 1}.jpg`}
            alt={isPlaceholder(member.name) ? `Portrait placeholder for core member ${num}` : member.photo_url ? `Portrait of ${member.name}` : `Portrait of ${member.name} coming soon`}
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            className="core-card__img"
          />
        </div>
      </div>
      <div className="core-card__body">
        <p className="eyebrow">Core Member {num}</p>
        <h2 className="core-card__name display">{member.name}</h2>
        <p className="core-card__role">{member.designation}</p>
        <span className="core-card__rule line-reveal" aria-hidden="true" />
        {paragraphs.length > 0 && (
          <div className="core-card__bio">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
        {responsibilities.length > 0 && (
          <div className="core-card__resp">
            <h3 className="core-card__resp-title">Responsibilities</h3>
            <ul role="list">
              {responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}
        {links.length > 0 && (
          <ul role="list" className="core-card__links">
            {links.map((l) => (
              <li key={l.key}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on ${l.label} (opens in a new tab)`}>
                  <SocialIcon name={l.key} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
