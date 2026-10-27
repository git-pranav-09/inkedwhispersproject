import PageHero from './PageHero';

export default function LegalPage({ eyebrow, title, updated, sections }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={`Last updated: ${updated}`} />
      <section className="section legal">
        <div className="container container--narrow">
          <p className="legal__notice">
            This document is a template provided with the website. Please have it reviewed and adapted to your organisation and local law before launch.
          </p>
          {sections.map((s, i) => (
            <section key={s.h} className="legal__section" aria-labelledby={`legal-${i}`}>
              <h2 id={`legal-${i}`} className="legal__h">
                <span>{String(i + 1).padStart(2, '0')}</span> {s.h}
              </h2>
              <div className="prose">
                {s.p.map((t, j) => (
                  <p key={j}>{t}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
