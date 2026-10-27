import LegalPage from '@/components/site/LegalPage';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Inked Whispers collects, uses and protects the personal information you share with us.',
  alternates: { canonical: '/privacy' },
};

const sections = [
  { h: 'Who we are', p: ['Inked Whispers (“we”, “us”) is a literary and cultural community. This policy explains how we handle personal information submitted through this website. For questions, contact us at inked.whispers.org@gmail.com.'] },
  { h: 'Information we collect', p: ['Applications: name, email, phone number, age, city, institution, the role you apply for, your written answers, skills, links you provide and, optionally, a résumé (PDF).', 'Contact form: name, email, optional phone number, subject, inquiry type and message.', 'Newsletter: name and email address.', 'We do not use advertising trackers. Basic technical logs (such as a hashed network identifier used for spam prevention) may be processed for security.'] },
  { h: 'How we use it', p: ['To review applications and contact applicants; to respond to messages; to send newsletters you have subscribed to; and to protect the website from abuse. We never sell or rent personal information.'] },
  { h: 'Who can access it', p: ['Submissions are stored in a secured database with row-level access controls. Only authorised Inked Whispers administrators can view them. Résumés are kept in private storage and are accessible only through short-lived, authenticated links.'] },
  { h: 'Retention', p: ['Application data is retained for the duration of the recruitment cycle and up to [RETENTION PERIOD] afterwards. Messages and subscriber records are retained while they remain relevant, or until you ask us to delete them.'] },
  { h: 'Your choices', p: ['You may request access to, correction of, or deletion of your personal information, or unsubscribe from the newsletter, at any time by writing to inked.whispers.org@gmail.com.'] },
  { h: 'Changes', p: ['We may update this policy from time to time. The “last updated” date above reflects the latest revision.'] },
];

export default function PrivacyPage() {
  return <LegalPage eyebrow="Legal" title="Privacy Policy" updated="[DATE]" sections={sections} />;
}
