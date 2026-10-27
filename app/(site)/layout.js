import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import { getSiteContent } from '@/lib/data';
import { siteConfig } from '@/lib/site-config';
import { isPlaceholder } from '@/lib/utils';
import '@/styles/site.css';

export default async function SiteLayout({ children }) {
  const content = await getSiteContent();
  const sameAs = [content.contact.instagram, content.contact.linkedin, content.contact.youtube, content.contact.other_url].filter(
    (u) => u && !isPlaceholder(u)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo.src}`,
    ...(sameAs.length ? { sameAs } : {}),
    ...(!isPlaceholder(content.contact.email) ? { email: content.contact.email } : {}),
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer contact={content.contact} />
      <script
        type="application/ld+json"
        // JSON-LD is built from trusted config; "<" is escaped to prevent </script> injection.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
