import { LogoImage } from '@/components/ui/Logo';
import ForgotPasswordForm from '@/components/admin/ForgotPasswordForm';

export const metadata = { title: 'Reset Password', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main className="login">
      <div className="login__card">
        <div className="login__logo">
          <LogoImage height={150} priority />
        </div>
        <h1 className="login__title">Forgot Password?</h1>
        <p className="login__subtitle">We will email you a secure reset link.</p>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
