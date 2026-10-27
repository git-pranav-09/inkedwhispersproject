'use client';

// Last-resort boundary (root layout failed). Kept dependency-free on purpose.
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#071426', color: '#F5F1E8', fontFamily: 'Georgia, serif', textAlign: 'center', padding: '2rem' }}>
        <div>
          <h1 style={{ fontWeight: 500, fontSize: '2.4rem', margin: '0 0 1rem' }}>Inked Whispers is momentarily unavailable.</h1>
          <p style={{ color: '#A9B0BA', fontFamily: 'system-ui, sans-serif', margin: '0 0 2rem' }}>Please try again in a moment.</p>
          <button type="button" onClick={() => reset()} style={{ background: '#D4AF37', color: '#03070D', border: 0, borderRadius: 999, padding: '0.9rem 1.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.75rem', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
