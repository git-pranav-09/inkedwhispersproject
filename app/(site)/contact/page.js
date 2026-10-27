import { Mail, Handshake, MessageSquareText, MapPin } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import ContactForm from '@/components/site/ContactForm';
import SocialLinks from '@/components/site/SocialLinks';
import Reveal from '@/components/ui/Reveal';
import { getSiteContent } from '@/lib/data';
import { isPlaceholder } from '@/lib/utils';

export const revalidate = 300;

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Inked Whispers for collaborations, partnerships, media, events or general questions.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact Inked Whispers', url: '/contact' },
};

export default async function ContactPage() {
  const { contact } = await getSiteContent();
  const emailLive = !isPlaceholder(contact.email);

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title={
          <>
            Begin a <em className="gold-text">conversation.</em>
          </>
        }
        intro="Whether you’d like to collaborate, partner, cover a story or simply ask a question — we read every message."
      />
      <section className="section contact" aria-label="Contact information and form">
        <div className="container contact__grid">
          <div className="contact__info">
            <Reveal className="contact-block">
              <span className="contact-block__icon">
                <Mail size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h2 className="contact-block__title">Official Email</h2>
                {emailLive ? (
                  <a href={`mailto:${contact.email}`} className="contact-block__value text-link">
                    {contact.email}
                  </a>
                ) : (
                  <p className="contact-block__value">{contact.email}</p>
                )}
              </div>
            </Reveal>
            <Reveal className="contact-block" delay={70}>
              <span className="contact-block__icon">
                <Handshake size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h2 className="contact-block__title">Collaboration Inquiries</h2>
                <p className="contact-block__text">For institutional programmes, co-hosted events and creative collaborations, choose “Collaboration” or “Partnership” in the form and share a short brief.</p>
              </div>
            </Reveal>
            <Reveal className="contact-block" delay={140}>
              <span className="contact-block__icon">
                <MessageSquareText size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h2 className="contact-block__title">General Queries</h2>
                <p className="contact-block__text">Questions about events, membership or anything else — we usually respond within a few working days.</p>
              </div>
            </Reveal>
            {contact.location && (
              <Reveal className="contact-block" delay={200}>
                <span className="contact-block__icon">
                  <MapPin size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="contact-block__title">Based in</h2>
                  <p className="contact-block__value">{contact.location}</p>
                </div>
              </Reveal>
            )}
            <Reveal className="contact__social" delay={240}>
              <h2 className="contact-block__title">Social Media</h2>
              <SocialLinks contact={contact} variant="list" />
            </Reveal>
          </div>
          <Reveal className="contact__form">
            <h2 className="contact__form-title display">Write to us</h2>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
