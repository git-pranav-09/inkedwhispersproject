import '@/styles/admin.css';

// Admin pages are always rendered per request (never cached or prerendered).
export const dynamic = 'force-dynamic';

export const metadata = {
  title: {
    default: 'Administration',
    template: '%s · Admin · Inked Whispers',
  },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }) {
  return children;
}
