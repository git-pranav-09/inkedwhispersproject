'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Pencil } from 'lucide-react';
import ActionForm from './ActionForm';
import ConfirmAction from './ConfirmAction';
import { moveCoreMember, deleteCoreMember } from '@/lib/actions/core';
import { isPlaceholder } from '@/lib/utils';

export default function CoreList({ members }) {
  return (
    <ul role="list" className="core-list">
      {members.map((m, i) => (
        <li key={m.id} className="core-list__item">
          <span className="core-list__order" aria-label={`Position ${i + 1}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="core-list__photo">
            <Image src={m.photo_url || '/images/core/member-1.jpg'} alt="" width={56} height={70} sizes="56px" />
          </span>
          <span className="core-list__main">
            <strong>{m.name}</strong>
            <span>{m.designation}</span>
            {(isPlaceholder(m.name) || isPlaceholder(m.designation)) && <span className="tag tag--limited">Placeholder — edit before launch</span>}
          </span>
          <span className={`tag${m.is_active ? ' tag--on' : ''}`}>{m.is_active ? 'Visible' : 'Hidden'}</span>
          <div className="row-actions">
            <ActionForm action={moveCoreMember} fields={{ id: m.id, dir: 'up' }} className="inline-form" inlineMessage={false}>
              <button type="submit" className="icon-btn" disabled={i === 0} aria-label={`Move ${m.name} up`}>
                <ArrowUp size={15} />
              </button>
            </ActionForm>
            <ActionForm action={moveCoreMember} fields={{ id: m.id, dir: 'down' }} className="inline-form" inlineMessage={false}>
              <button type="submit" className="icon-btn" disabled={i === members.length - 1} aria-label={`Move ${m.name} down`}>
                <ArrowDown size={15} />
              </button>
            </ActionForm>
            <Link href={`/admin/core/${m.id}`} className="icon-btn" aria-label={`Edit ${m.name}`}>
              <Pencil size={15} />
            </Link>
            <ConfirmAction action={deleteCoreMember} fields={{ id: m.id }} iconOnly triggerLabel={`Delete ${m.name}`} title="Remove this core member?" description={`${m.name} will be removed from the About Core page.`} confirmLabel="Remove member" />
          </div>
        </li>
      ))}
    </ul>
  );
}
