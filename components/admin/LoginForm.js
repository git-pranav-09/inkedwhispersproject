'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { loginAction } from '@/lib/actions/auth';
import FormAlert from '@/components/site/FormAlert';

export default function LoginForm({ notice, next, configured }) {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [show, setShow] = useState(false);
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="login__form" noValidate>
      <input type="hidden" name="next" value={next} />
      {!configured && <FormAlert>Supabase is not configured yet. Add the environment variables described in the README to enable sign-in.</FormAlert>}
      {!state && notice && <FormAlert tone={notice.tone}>{notice.text}</FormAlert>}
      {state && !state.ok && state.message && <FormAlert>{state.message}</FormAlert>}

      <div className={`login-field${errors.email ? ' login-field--error' : ''}`}>
        <label htmlFor="login-email">Email</label>
        <div className="login-field__control">
          <Mail size={16} aria-hidden="true" />
          <input id="login-email" name="email" type="email" autoComplete="username" required inputMode="email" maxLength={200} aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'login-email-err' : undefined} />
        </div>
        {errors.email && (
          <p id="login-email-err" className="field__error">
            {errors.email}
          </p>
        )}
      </div>

      <div className={`login-field${errors.password ? ' login-field--error' : ''}`}>
        <label htmlFor="login-password">Password</label>
        <div className="login-field__control">
          <Lock size={16} aria-hidden="true" />
          <input id="login-password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required maxLength={200} aria-invalid={errors.password ? true : undefined} aria-describedby={errors.password ? 'login-pass-err' : undefined} />
          <button type="button" className="login-field__toggle" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p id="login-pass-err" className="field__error">
            {errors.password}
          </p>
        )}
      </div>

      <p className="login__forgot"><Link href="/admin/forgot-password">Forgot password?</Link></p>

      <label className="login__remember">
        <input type="checkbox" name="remember" defaultChecked />
        <span>Keep me signed in on this device</span>
      </label>

      <button type="submit" className="btn btn--primary btn--block login__submit" disabled={pending || !configured} aria-busy={pending}>
        {pending ? (
          <>
            <span className="spinner" aria-hidden="true" /> Signing in
          </>
        ) : (
          <>
            Sign In <ArrowRight className="btn__arrow" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
