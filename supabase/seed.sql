-- ═══════════════════════════════════════════════════════════════════════
-- Inked Whispers — starter data (safe to run more than once)
-- Run AFTER the migration files. Everything here is editable from the
-- admin panel (Positions, Core Members, Website Content).
-- ═══════════════════════════════════════════════════════════════════════

-- Departments shown on the Join Us page
insert into public.positions (title, department, description, responsibilities, requirements, availability, commitment, sort_order, is_active)
select v.* from (values
  ('Human Resources Department', 'Human Resources', 'The HR Department is responsible for the internal management and coordination of the organisation''s team.', 'Maintaining team records.
Monitoring attendance and participation.
Assisting with recruitment and onboarding.
Maintaining disciplinary records.
Supporting team allocation and restructuring.
Addressing routine team-related concerns.
Coordinating with HODs regarding team matters.
Ensuring relevant concerns reach higher authorities where necessary.
Supporting the organisation in maintaining an efficient and accountable workforce.', null, 'Open', null, 1, true),
  ('PR & Marketing Department', 'PR & Marketing', 'The PR & Marketing Department is responsible for promoting Inked Whispers, its events, initiatives, and opportunities.', 'Developing promotional strategies.
Managing outreach.
Establishing and maintaining relevant collaborations.
Promoting events and initiatives.
Increasing participation and visibility.
Developing marketing campaigns.
Coordinating promotional requirements with other departments.
Building the public image and reach of Inked Whispers.', null, 'Open', null, 2, true),
  ('Social Media Department', 'Social Media', 'The Social Media Department is responsible for managing and developing the digital presence of Inked Whispers.', 'Planning social media content.
Developing content calendars.
Managing event-related posts and announcements.
Maintaining consistency in the organisation''s online presence.
Promoting events, achievements, opportunities, and initiatives.
Monitoring engagement.
Suggesting improvements to the organisation''s social media strategy.
Coordinating with the PR & Marketing and Creative Writing departments when required.', null, 'Open', null, 3, true),
  ('Creative Writing Department', 'Creative Writing', 'The Creative Writing Department has a specialised role within Inked Whispers and is primarily responsible for handling the organisation''s newspaper. It functions primarily as the editorial and newspaper division of Inked Whispers.', 'Handling the Inked Whispers newspaper.
Developing newspaper content from scratch.
Editing and refining content.
Reviewing written submissions.
Maintaining editorial quality.
Editing articles, features, creative pieces, and other newspaper material.
Ensuring consistency in the final publication.
Coordinating with other departments whenever written content is required.', null, 'Open', null, 4, true)
) as v(title, department, description, responsibilities, requirements, availability, commitment, sort_order, is_active)
where not exists (select 1 from public.positions);

-- Core team (add portraits in Admin → Core Members)
insert into public.core_members (name, designation, bio, responsibilities, photo_url, sort_order, is_active)
select v.* from (values
  ('Mihika Goel', 'Founder', 'A writer, creator, and someone who has always believed that young people deserve to be taken seriously. Mihika created Inked Whispers from a deeply personal place, wanting to build the kind of creative space she wished existed: one where you could bring an unfinished thought, an unusual idea, a poem, or a story without ever having to worry about being judged.

What started as an idea has grown into something she holds incredibly close. She calls Inked Whispers her baby, having watched it change, grow, and become something far bigger than she first imagined. The people who have been part of that journey are not just a team to her, but a family she is deeply grateful for.

At the heart of IW is a simple belief: your age, experience, or how different your ideas are should never decide whether you deserve to be heard. She wants IW to be a space where people can create freely, try without fear, and find people who make them feel understood.

For Mihika, Inked Whispers is more than something she founded. It carries a piece of her, and she hopes everyone who becomes part of it can feel that.', 'Set the vision and direction of Inked Whispers, shaping its identity, goals, and long-term growth.
Lead and support the team, ensuring ideas turn into meaningful experiences while every member feels valued and heard.
Oversee major initiatives and decisions, from events and collaborations to the overall quality and future of IW.', null, 1, true),
  ('Anshika Jaiswal', 'President', 'Anshika Jaiswal is the President of Inked Whispers, and for her, IW is much more than a literary organisation. She has always believed that words can give people a voice when they do not know how to express themselves otherwise. She believes creativity should not have to fit into a certain mould, and that everyone deserves a space where they can be heard without feeling judged. That belief is a big part of why Inked Whispers feels personal to her.

Her journey with IW has not always been easy. There have been moments of self doubt, pressure, misunderstandings and the constant struggle of trying to balance her responsibilities with everything else in her life. She has had to learn that being a leader does not mean having everything figured out. Sometimes it means making difficult decisions, learning from mistakes and continuing even when things do not go the way you imagined. Those experiences have shaped the way she leads and made her more patient, responsible and honest with herself.

As President, Anshika wants to build Inked Whispers into something that people genuinely feel connected to, not just another platform where events happen and certificates are given. She wants IW to grow, but she does not want it to lose the warmth and individuality that made her believe in it in the first place. For her, leadership is not about simply being at the top. It is about taking responsibility, standing by the people who trust you and leaving behind something that means a little more than just a title.', 'Lead and coordinate the team, ensuring that every department works together smoothly and effectively.
Oversee events, workshops and new initiatives while working towards the growth and development of Inked Whispers.
Make important decisions, support the team when needed and ensure that Inked Whispers stays true to its values, vision and identity.', null, 2, true),
  ('Sanskar Srivastava', 'Chief Advisor', 'Sanskar Srivastava serves as the Chief Advisor of Inked Whispers, a role that reflects not just his experience but also the trust he has built within the organisation. With a strong journey in Model United Nations, he has participated in numerous conferences as a delegate, chaired several conferences, and has also served as the President of a conference. These experiences have shaped his understanding of leadership, diplomacy, public speaking and decision making, allowing him to bring a mature and practical perspective to Inked Whispers.

Alongside his MUN journey, Sanskar is a UPSC aspirant and an accomplished debater who has represented his abilities at the national level and earned recognition through several debate competition awards. His curiosity, awareness and ability to look at situations from different perspectives make his guidance especially valuable. Whether it is discussing an idea, making an important decision or finding a better way to move forward, he brings a sense of clarity and thoughtfulness that helps the team look beyond what is immediately in front of them.

For Sanskar, being the Chief Advisor of Inked Whispers is much more than a designation. He genuinely believes in the vision of IW and actively contributes to helping it grow into something larger and more meaningful. His guidance, honest opinions and willingness to stand beside the team during important decisions have played a significant role in shaping its journey. He brings not only his experience but also his time, ideas and faith in the people behind Inked Whispers, making his presence an important part of the organisation’s growth and future.', 'Guide the President and Core Team in important decisions, offering experienced and thoughtful perspectives whenever needed.
Advise on events, initiatives and organisational strategies while contributing ideas that support the growth and development of Inked Whispers.
Provide mentorship and support to the team, helping maintain the vision, values and identity of Inked Whispers while encouraging the organisation to grow in the right direction.', null, 3, true)
) as v(name, designation, bio, responsibilities, photo_url, sort_order, is_active)
where not exists (select 1 from public.core_members);

-- Contact details
insert into public.site_content (key, value)
values ('contact', '{"email":"inked.whispers.org@gmail.com","instagram":"https://www.instagram.com/iw_verse/","linkedin":"","youtube":"","other_label":"","other_url":"","location":"Hybrid"}'::jsonb)
on conflict (key) do nothing;
