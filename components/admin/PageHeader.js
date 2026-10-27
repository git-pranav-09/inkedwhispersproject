import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PageHeader({ title, description, back, actions, eyebrow }) {
  return (
    <div className="a-page-head">
      <div className="a-page-head__text">
        {back && (
          <Link href={back.href} className="a-back">
            <ChevronLeft size={16} aria-hidden="true" /> {back.label}
          </Link>
        )}
        {eyebrow && <p className="a-eyebrow">{eyebrow}</p>}
        <h1 className="a-page-head__title">{title}</h1>
        {description && <p className="a-page-head__desc">{description}</p>}
      </div>
      {actions && <div className="a-page-head__actions">{actions}</div>}
    </div>
  );
}
