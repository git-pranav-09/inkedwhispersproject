import { notFound } from 'next/navigation';
import { Mail, Phone, Reply } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import StatusSelect from '@/components/admin/StatusSelect';
import ConfirmAction from '@/components/admin/ConfirmAction';
import { requireAdmin } from '@/lib/auth';
import { MESSAGE_STATUSES } from '@/lib/constants';
import { INQUIRY_TYPES } from '@/lib/validations';
import { UUID_RE } from '@/lib/validations-admin';
import { updateMessageStatus, deleteMessage } from '@/lib/actions/messages';
import { formatDateTime, toParagraphs } from '@/lib/utils';

export const metadata = { title: 'Message' };

export default async function MessageDetail({ params }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data: m } = await supabase.from('contact_messages').select('*').eq('id', id).maybeSingle();
  if (!m) notFound();

  // Opening an unread message marks it as read.
  if (m.status === 'unread') {
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    m.status = 'read';
  }

  const type = INQUIRY_TYPES.find((t) => t.value === m.inquiry_type)?.label || m.inquiry_type;
  const reply = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`;

  return (
    <>
      <PageHeader back={{ href: '/admin/messages', label: 'All messages' }} eyebrow={type} title={m.subject} description={`From ${m.name} · ${formatDateTime(m.created_at)}`} />
      <div className="a-grid a-grid--detail">
        <article className="a-card a-detail">
          <div className="a-message">
            {toParagraphs(m.message).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
        <aside className="a-stack">
          <div className="a-card">
            <h2 className="a-card__title">Sender</h2>
            <dl className="a-dl a-dl--single">
              <div>
                <dt>Name</dt>
                <dd>{m.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${m.email}`} className="a-link">
                    <Mail size={13} aria-hidden="true" /> {m.email}
                  </a>
                </dd>
              </div>
              {m.phone && (
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${m.phone}`} className="a-link">
                      <Phone size={13} aria-hidden="true" /> {m.phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <a href={reply} className="abtn abtn--dark abtn--block">
              <Reply size={15} aria-hidden="true" /> Reply by email
            </a>
          </div>
          <div className="a-card">
            <h2 className="a-card__title">Status</h2>
            <StatusSelect action={updateMessageStatus} id={m.id} value={m.status} options={MESSAGE_STATUSES} label="Message status" />
          </div>
          <div className="a-card a-card--danger">
            <h2 className="a-card__title">Danger zone</h2>
            <ConfirmAction action={deleteMessage} fields={{ id: m.id }} title="Delete this message?" description="The message will be permanently removed." triggerLabel="Delete message" confirmLabel="Delete permanently" />
          </div>
        </aside>
      </div>
    </>
  );
}
