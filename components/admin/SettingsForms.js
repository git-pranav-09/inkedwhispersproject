'use client';

import { useActionState, useRef } from 'react';
import { Save, KeyRound } from 'lucide-react';
import Field from '@/components/ui/Field';
import { updateProfile, changePassword } from '@/lib/actions/settings';
import { cx } from '@/lib/utils';

function Msg({ state }) {
  if (!state?.message) return null;
  return (
    <p className={cx('action-form__msg', state.ok ? 'is-ok' : 'is-error')} role="status">
      {state.message}
    </p>
  );
}

export function ProfileForm({ name, email }) {
  const [state, action, pending] = useActionState(updateProfile, null);
  return (
    <form action={action} className="a-card a-fieldset" noValidate>
      <h2 className="a-card__title">Your profile</h2>
      <Field label="Display name" name="full_name" required defaultValue={name} maxLength={120} error={state?.errors?.full_name} />
      <Field label="Email" name="email_display" defaultValue={email} disabled hint="Email is managed in Supabase Authentication." optionalLabel={false} />
      <Msg state={state} />
      <button type="submit" className="abtn abtn--primary" disabled={pending}>
        {pending ? <span className="spinner" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />} Save profile
      </button>
    </form>
  );
}

export function PasswordForm() {
  const ref = useRef(null);
  const [state, action, pending] = useActionState(async (prev, fd) => {
    const res = await changePassword(prev, fd);
    if (res?.ok) ref.current?.reset();
    return res;
  }, null);
  const e = state?.errors || {};
  return (
    <form ref={ref} action={action} className="a-card a-fieldset" noValidate>
      <h2 className="a-card__title">Change password</h2>
      <Field label="Current password" name="current_password" type="password" autoComplete="current-password" required error={e.current_password} />
      <Field label="New password" name="new_password" type="password" autoComplete="new-password" required minLength={12} hint="At least 12 characters, with letters and numbers." error={e.new_password} />
      <Field label="Confirm new password" name="confirm_password" type="password" autoComplete="new-password" required error={e.confirm_password} />
      <Msg state={state} />
      <button type="submit" className="abtn abtn--dark" disabled={pending}>
        {pending ? <span className="spinner" aria-hidden="true" /> : <KeyRound size={15} aria-hidden="true" />} Update password
      </button>
    </form>
  );
}
