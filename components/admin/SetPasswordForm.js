'use client';

import { useActionState, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { setPasswordAction } from '@/lib/actions/auth';
import FormAlert from '@/components/site/FormAlert';

export default function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(setPasswordAction, null);
  const [show, setShow] = useState(false);
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="login__form" noValidate>
      {state && !state.ok && state.message && <FormAlert>{state.message}</FormAlert>}
      {[
        ['password', 'New password', 'Use 12+ characters with letters and numbers.'],
        ['confirm', 'Confirm password', null],
      ].map(([name, label, hint]) => (
        <div key={name} className={`login-field${errors[name] ? ' login-field--error' : ''}`}>
          <label htmlFor={`sp-${name}`}>{label}</label>
          <div className="login-field__control">
            <Lock size={16} aria-hidden="true" />
            <input id={`sp-${name}`} name={name} type={show ? 'text' : 'password'} autoComplete="new-password" required minLength={12} maxLength={200} />
            {name === 'password' && (
              <button type="button" className="login-field__toggle" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {hint && !errors[name] && <p className="field__hint">{hint}</p>}
          {errors[name] && <p className="field__error">{errors[name]}</p>}
        </div>
      ))}
      <button type="submit" className="btn btn--primary btn--block login__submit" disabled={pending} aria-busy={pending}>
        {pending ? (<><span className="spinner" aria-hidden="true" /> Saving</>) : (<>Save Password <ArrowRight className="btn__arrow" aria-hidden="true" /></>)}
      </button>
    </form>
  );
}
