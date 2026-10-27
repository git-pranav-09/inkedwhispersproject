'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { requestPasswordResetAction } from '@/lib/actions/auth';
import FormAlert from '@/components/site/FormAlert';

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, null);
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="login__form" noValidate>
      {state?.message && <FormAlert tone={state.ok ? 'success' : 'error'}>{state.message}</FormAlert>}
      <div className={`login-field${errors.email ? ' login-field--error' : ''}`}>
        <label htmlFor="reset-email">Email</label>
        <div className="login-field__control">
          <Mail size={16} aria-hidden="true" />
          <input id="reset-email" name="email" type="email" autoComplete="username" required inputMode="email" maxLength={200} />
        </div>
        {errors.email && <p className="field__error">{errors.email}</p>}
      </div>
      <button type="submit" className="btn btn--primary btn--block login__submit" disabled={pending} aria-busy={pending}>
        {pending ? (<><span className="spinner" aria-hidden="true" /> Sending</>) : (<>Send Reset Link <ArrowRight className="btn__arrow" aria-hidden="true" /></>)}
      </button>
      <p className="login__foot"><Link href="/admin/login">Back to sign in</Link></p>
    </form>
  );
}
