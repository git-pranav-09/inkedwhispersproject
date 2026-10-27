import PageHeader from '@/components/admin/PageHeader';
import { ProfileForm, PasswordForm } from '@/components/admin/SettingsForms';
import { requireAdmin } from '@/lib/auth';
import { formatDate, initials } from '@/lib/utils';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const { supabase, user, admin, profile } = await requireAdmin();
  const { data: roster } = await supabase.from('admins').select('user_id, role, created_at').order('created_at');
  const ids = (roster || []).map((r) => r.user_id);
  const { data: profiles } = ids.length ? await supabase.from('profiles').select('id, full_name').in('id', ids) : { data: [] };
  const nameOf = (id) => profiles?.find((p) => p.id === id)?.full_name;

  return (
    <>
      <PageHeader title="Settings" description="Your account and the administrator roster." />
      <div className="a-grid a-grid--2">
        <ProfileForm name={profile?.full_name || ''} email={user.email} />
        <PasswordForm />
      </div>
      <section className="a-card a-fieldset">
        <h2 className="a-card__title">Administrators</h2>
        <p className="a-hint">
          For security, administrators can only be added or removed from the Supabase SQL editor — never from the website. See “Create the first admin” in the README.
        </p>
        <ul role="list" className="roster">
          {(roster || []).map((r) => (
            <li key={r.user_id} className="roster__item">
              <span className="admin-profile__avatar" aria-hidden="true">
                {initials(nameOf(r.user_id) || (r.user_id === user.id ? user.email : 'A'))}
              </span>
              <span className="roster__main">
                <strong>
                  {nameOf(r.user_id) || (r.user_id === user.id ? user.email : 'Administrator')}
                  {r.user_id === user.id && <span className="tag tag--on">You</span>}
                </strong>
                <span>Since {formatDate(r.created_at, { short: true })}</span>
              </span>
              <span className="tag">{r.role}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="a-card a-fieldset">
        <h2 className="a-card__title">Security checklist</h2>
        <ul className="checklist">
          <li>Disable public sign-ups in Supabase → Authentication → Providers → Email (“Allow new users to sign up” off).</li>
          <li>Keep <code>SUPABASE_SERVICE_ROLE_KEY</code> only in Vercel server environment variables.</li>
          <li>Use a unique password of 12+ characters for every administrator.</li>
          <li>Your role: <strong>{admin.role}</strong>.</li>
        </ul>
      </section>
    </>
  );
}
