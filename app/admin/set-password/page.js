import { LogoImage } from '@/components/ui/Logo';
import SetPasswordForm from '@/components/admin/SetPasswordForm';

export const metadata = { title: 'Choose Your Password', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main className="login">
      <div className="login__card">
        <div className="login__logo">
          <LogoImage height={150} priority />
        </div>
        <h1 className="login__title">Choose Your Password.</h1>
        <p className="login__subtitle">Set a password only you know.</p>
        <SetPasswordForm />
      </div>
    </main>
  );
}
