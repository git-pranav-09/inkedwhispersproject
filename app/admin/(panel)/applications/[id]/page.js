import { notFound } from 'next/navigation';
import { Download, ExternalLink, Mail, Phone } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import StatusSelect from '@/components/admin/StatusSelect';
import ConfirmAction from '@/components/admin/ConfirmAction';
import NotesForm from '@/components/admin/NotesForm';
import StatusBadge from '@/components/ui/StatusBadge';
import { requireAdmin } from '@/lib/auth';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { UUID_RE } from '@/lib/validations-admin';
import { updateApplicationStatus, deleteApplication } from '@/lib/actions/applications';
import { formatDateTime, toParagraphs } from '@/lib/utils';
import { isSafeUrl } from '@/lib/validations';

export const metadata = { title: 'Application' };

function Block({ title, text }) {
  if (!text) return null;
  return (
    <section className="a-detail__block">
      <h2 className="a-detail__h">{title}</h2>
      {toParagraphs(text).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </section>
  );
}

function SafeLink({ href, children }) {
  if (!href || !isSafeUrl(href)) return <span className="cell-muted">—</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="a-link">
      {children} <ExternalLink size={13} aria-hidden="true" />
    </a>
  );
}

export default async function ApplicationDetail({ params }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data: a } = await supabase.from('applications').select('*').eq('id', id).maybeSingle();
  if (!a) notFound();

  // Short-lived signed URL; resumes are never publicly accessible.
  let resumeUrl = null;
  if (a.resume_path) {
    const { data } = await supabase.storage.from('resumes').createSignedUrl(a.resume_path, 300, { download: `${a.full_name.replace(/[^\w -]/g, '')} - Resume.pdf` });
    resumeUrl = data?.signedUrl || null;
  }

  return (
    <>
      <PageHeader
        back={{ href: '/admin/applications', label: 'All applications' }}
        title={a.full_name}
        description={`${a.position_title} · ${a.department}`}
        actions={<StatusBadge list={APPLICATION_STATUSES} value={a.status} />}
      />

      <div className="a-grid a-grid--detail">
        <article className="a-card a-detail">
          <dl className="a-dl">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${a.email}`} className="a-link">
                  <Mail size={13} aria-hidden="true" /> {a.email}
                </a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${a.phone}`} className="a-link">
                  <Phone size={13} aria-hidden="true" /> {a.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{a.age ?? '—'}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{a.city}</dd>
            </div>
            <div>
              <dt>College / Organisation</dt>
              <dd>{a.organization}</dd>
            </div>
            <div>
              <dt>Applied</dt>
              <dd>{formatDateTime(a.created_at)}</dd>
            </div>
            <div>
              <dt>Portfolio</dt>
              <dd>
                <SafeLink href={a.portfolio_url}>Open portfolio</SafeLink>
              </dd>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <SafeLink href={a.linkedin_url}>Open profile</SafeLink>
              </dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>
                <SafeLink href={a.instagram_url}>Open profile</SafeLink>
              </dd>
            </div>
          </dl>

          <Block title="Why do you want to join Inked Whispers?" text={a.motivation} />
          <Block title="Previous experience" text={a.experience} />
          <Block title="Skills" text={a.skills} />
          <Block title="Additional information" text={a.additional_info} />
        </article>

        <aside className="a-stack">
          <div className="a-card">
            <h2 className="a-card__title">Review</h2>
            <StatusSelect action={updateApplicationStatus} id={a.id} value={a.status} options={APPLICATION_STATUSES} label="Application status" />
          </div>
          <div className="a-card">
            <h2 className="a-card__title">Resume</h2>
            {resumeUrl ? (
              <a href={resumeUrl} className="abtn abtn--dark abtn--block" rel="noopener noreferrer">
                <Download size={15} aria-hidden="true" /> Download resume (PDF)
              </a>
            ) : (
              <p className="cell-muted">{a.resume_path ? 'The resume link could not be generated. Refresh to try again.' : 'No resume was uploaded.'}</p>
            )}
            {resumeUrl && <p className="a-hint">Secure link, valid for 5 minutes.</p>}
          </div>
          <div className="a-card">
            <h2 className="a-card__title">Internal notes</h2>
            <NotesForm id={a.id} notes={a.admin_notes || ''} />
          </div>
          <div className="a-card a-card--danger">
            <h2 className="a-card__title">Danger zone</h2>
            <p className="a-hint">Permanently deletes this application and its resume.</p>
            <ConfirmAction action={deleteApplication} fields={{ id: a.id }} title="Delete this application?" description={`The application from ${a.full_name} and any uploaded resume will be permanently removed.`} triggerLabel="Delete application" confirmLabel="Delete permanently" />
          </div>
        </aside>
      </div>
    </>
  );
}
