import { LogoImage } from '@/components/ui/Logo';
import LoginForm from '@/components/admin/LoginForm';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata = {
  title: 'Admin Login',
  description: 'Administrative portal for Inked Whispers.',
};

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  let notice = null;
  if (sp?.unauthorized) notice = { tone: 'error', text: 'That account does not have administrative access.' };
  else if (sp?.linkerror) notice = { tone: 'error', text: 'That link is invalid or has expired. Request a new reset link below.' };
  else if (sp?.signedout) notice = { tone: 'success', text: 'You have been signed out securely.' };
  const next = typeof sp?.next === 'string' && sp.next.startsWith('/admin/') ? sp.next : '';

  return (
    <main className="login">
      <div className="login__bg" aria-hidden="true">
        <span className="login__glow" />
        <svg className="login__wings" viewBox="0 0 1200 600" fill="none">
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={i} opacity={1 - i * 0.09}>
              <path d={`M600 ${430 - i * 4} C ${470 - i * 30} ${380 - i * 30}, ${300 - i * 30} ${260 - i * 34}, ${80 + i * 34} ${90 + i * 18}`} />
              <path d={`M600 ${430 - i * 4} C ${730 + i * 30} ${380 - i * 30}, ${900 + i * 30} ${260 - i * 34}, ${1120 - i * 34} ${90 + i * 18}`} />
            </g>
          ))}
        </svg>
        <span className="login__ink login__ink--a" />
        <span className="login__ink login__ink--b" />
      </div>

      <div className="login__card">
        <div className="login__logo">
          <LogoImage height={150} priority />
        </div>
        <h1 className="login__title">Welcome Back.</h1>
        <p className="login__subtitle">Enter the administrative portal.</p>
        <LoginForm notice={notice} next={next} configured={isSupabaseConfigured} />
        <p className="login__foot">Restricted access. Activity on this portal is logged.</p>
      </div>
    </main>
  );
}
