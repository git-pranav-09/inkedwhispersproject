import LegalPage from '@/components/site/LegalPage';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'The terms that govern use of the Inked Whispers website, events and submissions.',
  alternates: { canonical: '/terms' },
};

const sections = [
  { h: 'Acceptance', p: ['By using this website or participating in Inked Whispers events, you agree to these terms. If you do not agree, please do not use the website.'] },
  { h: 'Events & registration', p: ['Event details, schedules and fees may change. Specific rules and guidelines published on each event page form part of these terms for that event. Registration fees, where applicable, are governed by the refund terms stated on the event page — [REFUND POLICY].'] },
  { h: 'Submissions & original work', p: ['When you submit writing or other creative work, you confirm that it is your original work. You retain copyright. You grant Inked Whispers a non-exclusive licence to display or publish the work in connection with the relevant event or programme, with credit to you.'] },
  { h: 'Conduct', p: ['We expect respectful conduct in all spaces — physical and digital. Plagiarism, harassment or discriminatory behaviour may result in disqualification or removal from the community.'] },
  { h: 'Photography', p: ['Events may be photographed or recorded for documentation and promotion. If you prefer not to appear in published media, please let the organisers know at the event.'] },
  { h: 'Liability', p: ['The website is provided “as is”. To the extent permitted by law, Inked Whispers is not liable for indirect losses arising from use of the website or attendance at events.'] },
  { h: 'Contact', p: ['Questions about these terms can be sent to inked.whispers.org@gmail.com.'] },
];

export default function TermsPage() {
  return <LegalPage eyebrow="Legal" title="Terms & Conditions" updated="[DATE]" sections={sections} />;
}
