import Link from 'next/link';
import { Mail } from 'lucide-react';
import { LogoImage } from '@/components/ui/Logo';
import { Ornament } from '@/components/ui/Ornament';
import SocialLinks from './SocialLinks';
import NewsletterForm from './NewsletterForm';
import { isPlaceholder } from '@/lib/utils';

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/core', label: 'About Core' },
  { href: '/events', label: 'New Events' },
  { href: '/past-events', label: 'Past Events' },
  { href: '/join', label: 'Join Us' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Footer({ contact }) {
  const emailLive = !isPlaceholder(contact.email);
  return (
    <footer className="footer grain">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <LogoImage height={150} />
            <p className="footer__tagline serif">Where Words Become Legacy.</p>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <h2 className="footer__heading">Quick Links</h2>
            <ul role="list" className="footer__links">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer__link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h2 className="footer__heading">Social Media</h2>
            <SocialLinks contact={contact} variant="list" />
          </div>

          <div className="footer__col footer__col--wide">
            <h2 className="footer__heading">Contact</h2>
            {emailLive ? (
              <a className="footer__email" href={`mailto:${contact.email}`}>
                <Mail size={16} aria-hidden="true" /> {contact.email}
              </a>
            ) : (
              <p className="footer__email footer__email--pending">
                <Mail size={16} aria-hidden="true" /> {contact.email}
              </p>
            )}
            <p className="footer__note">More than just updates — occasional letters, never noise.</p>
            <NewsletterForm compact />
          </div>
        </div>

        <Ornament className="footer__ornament" />

        <div className="footer__bottom">
          <p>© 2026 Inked Whispers. All rights reserved.</p>
          <ul role="list" className="footer__legal">
            <li>
              <Link href="/privacy" className="footer__link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="footer__link">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
