/**
 * Brand constants and default editorial copy.
 *
 * Everything under `defaultContent` can be overridden from the admin panel
 * (Website Content), which writes to the `site_content` table. Values wrapped
 * in [BRACKETS] are deliberate placeholders for real organisational details.
 */

export const siteConfig = {
  name: 'Inked Whispers',
  tagline: 'Where Words Become Legacy.',
  description:
    'Inked Whispers is a literary and cultural community for young writers, speakers, thinkers and makers — an evolving space for voices, ideas, stories and experiences that deserve to be heard.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  locale: 'en_IN',
  logo: {
    src: '/logo/inked-whispers-logo.png',
    // Intrinsic dimensions of the logo file. Update if you replace the file
    // with one of a different aspect ratio — the UI never distorts it.
    width: 1024,
    height: 1024,
  },
  ogImage: '/images/site/og-image.jpg',
};

export const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/core', label: 'About Core' },
  { href: '/events', label: 'New Events' },
  { href: '/past-events', label: 'Past Events' },
  { href: '/join', label: 'Join Us' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/contact', label: 'Contact Us' },
];

export const defaultContent = {
  contact: {
    email: 'inked.whispers.org@gmail.com',
    instagram: 'https://www.instagram.com/iw_verse/',
    // Leave a social URL empty to hide it from the website.
    linkedin: '',
    youtube: '',
    other_label: '',
    other_url: '',
    location: 'Hybrid',
  },

  home: {
    hero_eyebrow: 'A space for young creators',
    hero_headline: 'Create something that feels like you.',
    hero_subheadline: 'From writing and ideas to events and experiences, Inked Whispers is where young creators come to make, share, and be part of something.',
    philosophy_heading: 'Young voices deserve more than a place to speak.',
    philosophy_body: [
      'They deserve a place to experiment, create, be taken seriously, and figure out what they have to say.',
      'That is what Inked Whispers was built for. A space where your first poem can be shared without feeling like it has to be perfect, where a strange idea can actually be explored, and where being young does not make your creativity any less valuable.',
      'We believe creativity should feel exciting, not intimidating. Through events, competitions, workshops, showcases, and everything we build together, we want young people to try things, find their people, and discover what they are capable of.',
      'And IW is not something people simply watch from the outside. Our members create, organise, write, design, lead, experiment, and contribute. Everyone who becomes part of Inked Whispers gets the chance to leave their mark on what we are building.',
    ],
  },

  featured: [
    {
      eyebrow: 'The Written Word',
      title: 'Pages that find their readers',
      excerpt: 'Prose, poetry and essays shaped in workshop, refined in critique and shared with an audience that reads closely.',
      href: '/events',
      cta: 'Explore programmes',
      image: '/images/site/feature-manuscript.jpg',
    },
    {
      eyebrow: 'The Spoken Stage',
      title: 'Voices, given a room of their own',
      excerpt: 'Open mics, spoken-word evenings and recitations where delivery matters as much as the words themselves.',
      href: '/past-events',
      cta: 'See past stages',
      image: '/images/site/feature-stage.jpg',
    },
    {
      eyebrow: 'The Circle',
      title: 'Conversations that stay with you',
      excerpt: 'Reading circles and dialogues on books, culture and ideas — unhurried, rigorous and generous in spirit.',
      href: '/join',
      cta: 'Take a seat',
      image: '/images/site/feature-circle.jpg',
    },
  ],

  journey: [
    { marker: 'Chapter I', title: 'The First Ink', text: 'Where it began — [FOUNDING YEAR]. Add the founding story: the first gathering, the people in the room, and the question that started it all.' },
    { marker: 'Chapter II', title: 'Finding Our Voice', text: 'The first public programme. [EVENT DETAILS] — describe the moment Inked Whispers stepped beyond a circle of friends.' },
    { marker: 'Chapter III', title: 'A Growing Circle', text: 'Teams, departments and new members. [MILESTONE DETAILS] — how the community found its structure.' },
    { marker: 'Chapter IV', title: 'The Next Page', text: 'What we are writing now. [CURRENT DIRECTION] — the ambitions that will define the coming chapters.' },
  ],

  about: {
    who_we_are: [
      'There is always a thought that hasn\'t been said yet. A story sitting in someone\'s notes, a poem never shown, an idea that feels too different or too young to matter. Inked Whispers exists for those moments. We are a creative space built by young people, for young people, where writers, poets, storytellers, shayars, and creators can bring their ideas into a space that welcomes them. Not because you have to be the best, but because you have something to say.',
      'Through events, competitions, workshops, showcases, and creative communities, we give young creators a space to experiment, connect, take risks, and be recognised. Because your age shouldn\'t decide the value of your voice, and having no platform shouldn\'t mean you go unheard. Inked Whispers is a place to find your people, take your space, and discover what your voice can become.',
    ],
    vision: 'Where today\'s whispers become tomorrow\'s voices.',
    mission: 'Turning creativity into opportunities for young voices to express, connect, and make their mark.',
    values: [
      { title: 'Belong', text: 'A space where every young creator has a place.' },
      { title: 'Be Heard', text: 'Opportunities for every voice to be seen and recognised.' },
      { title: 'Create', text: 'Freedom to experiment, express, and create differently.' },
      { title: 'Grow', text: 'Experiences that help young creators discover what they can become.' },
    ],
  },
};

export const whyCards = [
  {
    icon: 'Feather',
    title: 'Craft over noise',
    text: 'Workshops, critique and mentorship that treat your writing and speaking as work worth refining.',
  },
  {
    icon: 'Users',
    title: 'A serious community',
    text: 'Peers who show up, read closely and hold each other to a high — and generous — standard.',
  },
  {
    icon: 'Compass',
    title: 'Real leadership',
    text: 'Members run the programmes: curating events, editing work, designing campaigns and leading teams.',
  },
  {
    icon: 'BookOpen',
    title: 'Platforms that matter',
    text: 'Stages, publications and audiences where your work is heard, credited and remembered.',
  },
];

/**
 * The core team — shown until the database is connected, and used to seed it
 * (see supabase/updates/2026-10-content-update.sql). Edit in Admin → Core Members.
 * Paragraphs in a bio are separated by a blank line.
 */
export const defaultCoreMembers = [
  {
    name: 'Mihika Goel',
    designation: 'Founder',
    bio: `A writer, creator, and someone who has always believed that young people deserve to be taken seriously. Mihika created Inked Whispers from a deeply personal place, wanting to build the kind of creative space she wished existed: one where you could bring an unfinished thought, an unusual idea, a poem, or a story without ever having to worry about being judged.

What started as an idea has grown into something she holds incredibly close. She calls Inked Whispers her baby, having watched it change, grow, and become something far bigger than she first imagined. The people who have been part of that journey are not just a team to her, but a family she is deeply grateful for.

At the heart of IW is a simple belief: your age, experience, or how different your ideas are should never decide whether you deserve to be heard. She wants IW to be a space where people can create freely, try without fear, and find people who make them feel understood.

For Mihika, Inked Whispers is more than something she founded. It carries a piece of her, and she hopes everyone who becomes part of it can feel that.`,
    responsibilities: `Set the vision and direction of Inked Whispers, shaping its identity, goals, and long-term growth.
Lead and support the team, ensuring ideas turn into meaningful experiences while every member feels valued and heard.
Oversee major initiatives and decisions, from events and collaborations to the overall quality and future of IW.`,
  },
  {
    name: 'Anshika Jaiswal',
    designation: 'President',
    bio: `Anshika Jaiswal is the President of Inked Whispers, and for her, IW is much more than a literary organisation. She has always believed that words can give people a voice when they do not know how to express themselves otherwise. She believes creativity should not have to fit into a certain mould, and that everyone deserves a space where they can be heard without feeling judged. That belief is a big part of why Inked Whispers feels personal to her.

Her journey with IW has not always been easy. There have been moments of self doubt, pressure, misunderstandings and the constant struggle of trying to balance her responsibilities with everything else in her life. She has had to learn that being a leader does not mean having everything figured out. Sometimes it means making difficult decisions, learning from mistakes and continuing even when things do not go the way you imagined. Those experiences have shaped the way she leads and made her more patient, responsible and honest with herself.

As President, Anshika wants to build Inked Whispers into something that people genuinely feel connected to, not just another platform where events happen and certificates are given. She wants IW to grow, but she does not want it to lose the warmth and individuality that made her believe in it in the first place. For her, leadership is not about simply being at the top. It is about taking responsibility, standing by the people who trust you and leaving behind something that means a little more than just a title.`,
    responsibilities: `Lead and coordinate the team, ensuring that every department works together smoothly and effectively.
Oversee events, workshops and new initiatives while working towards the growth and development of Inked Whispers.
Make important decisions, support the team when needed and ensure that Inked Whispers stays true to its values, vision and identity.`,
  },
  {
    name: 'Sanskar Srivastava',
    designation: 'Chief Advisor',
    bio: `Sanskar Srivastava serves as the Chief Advisor of Inked Whispers, a role that reflects not just his experience but also the trust he has built within the organisation. With a strong journey in Model United Nations, he has participated in numerous conferences as a delegate, chaired several conferences, and has also served as the President of a conference. These experiences have shaped his understanding of leadership, diplomacy, public speaking and decision making, allowing him to bring a mature and practical perspective to Inked Whispers.

Alongside his MUN journey, Sanskar is a UPSC aspirant and an accomplished debater who has represented his abilities at the national level and earned recognition through several debate competition awards. His curiosity, awareness and ability to look at situations from different perspectives make his guidance especially valuable. Whether it is discussing an idea, making an important decision or finding a better way to move forward, he brings a sense of clarity and thoughtfulness that helps the team look beyond what is immediately in front of them.

For Sanskar, being the Chief Advisor of Inked Whispers is much more than a designation. He genuinely believes in the vision of IW and actively contributes to helping it grow into something larger and more meaningful. His guidance, honest opinions and willingness to stand beside the team during important decisions have played a significant role in shaping its journey. He brings not only his experience but also his time, ideas and faith in the people behind Inked Whispers, making his presence an important part of the organisation’s growth and future.`,
    responsibilities: `Guide the President and Core Team in important decisions, offering experienced and thoughtful perspectives whenever needed.
Advise on events, initiatives and organisational strategies while contributing ideas that support the growth and development of Inked Whispers.
Provide mentorship and support to the team, helping maintain the vision, values and identity of Inked Whispers while encouraging the organisation to grow in the right direction.`,
  },
].map((m, i) => ({ id: `core-${i + 1}`, photo_url: null, instagram_url: null, linkedin_url: null, sort_order: i + 1, ...m }));

/** Departments shown on Join Us until the database is connected. Edit in Admin → Positions. */
export const defaultDepartments = [
  {
    department: 'Human Resources',
    title: 'Human Resources Department',
    description: 'The HR Department is responsible for the internal management and coordination of the organisation\'s team.',
    responsibilities: `Maintaining team records.
Monitoring attendance and participation.
Assisting with recruitment and onboarding.
Maintaining disciplinary records.
Supporting team allocation and restructuring.
Addressing routine team-related concerns.
Coordinating with HODs regarding team matters.
Ensuring relevant concerns reach higher authorities where necessary.
Supporting the organisation in maintaining an efficient and accountable workforce.`,
  },
  {
    department: 'PR & Marketing',
    title: 'PR & Marketing Department',
    description: 'The PR & Marketing Department is responsible for promoting Inked Whispers, its events, initiatives, and opportunities.',
    responsibilities: `Developing promotional strategies.
Managing outreach.
Establishing and maintaining relevant collaborations.
Promoting events and initiatives.
Increasing participation and visibility.
Developing marketing campaigns.
Coordinating promotional requirements with other departments.
Building the public image and reach of Inked Whispers.`,
  },
  {
    department: 'Social Media',
    title: 'Social Media Department',
    description: 'The Social Media Department is responsible for managing and developing the digital presence of Inked Whispers.',
    responsibilities: `Planning social media content.
Developing content calendars.
Managing event-related posts and announcements.
Maintaining consistency in the organisation's online presence.
Promoting events, achievements, opportunities, and initiatives.
Monitoring engagement.
Suggesting improvements to the organisation's social media strategy.
Coordinating with the PR & Marketing and Creative Writing departments when required.`,
  },
  {
    department: 'Creative Writing',
    title: 'Creative Writing Department',
    description: 'The Creative Writing Department has a specialised role within Inked Whispers and is primarily responsible for handling the organisation\'s newspaper. It functions primarily as the editorial and newspaper division of Inked Whispers.',
    responsibilities: `Handling the Inked Whispers newspaper.
Developing newspaper content from scratch.
Editing and refining content.
Reviewing written submissions.
Maintaining editorial quality.
Editing articles, features, creative pieces, and other newspaper material.
Ensuring consistency in the final publication.
Coordinating with other departments whenever written content is required.`,
  },
].map((p, i) => ({ id: `default-${i + 1}`, availability: 'Open', commitment: null, requirements: null, sort_order: i + 1, ...p }));
