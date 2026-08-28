-- Seed data extracted from Alike's existing CV, so the site isn't empty on
-- first run. Portfolio brands/images are intentionally left empty — real
-- project photos get added later through the site's own edit mode.

insert into profile (
  id, full_name, title, bio, photo_url, location, email,
  phone_primary, phone_secondary
) values (
  'singleton',
  'Alike Kingsley Chukwudi',
  'Graphic Designer / Front-End Developer / IT Specialist',
  'I am a Graphic Designer, Front-End Developer and IT Specialist with over 5 years of experience helping businesses promote themselves effectively. I started my graphic design journey 6 years ago, right after high school, teaching myself CorelDraw on YouTube while waiting for university admission. Since then I''ve worked with two major print companies as a design team lead and as a freelancer creating designs for clients around the world. I''m currently a 400-level student of Electronics and Computer Engineering at Nnamdi Azikiwe University, Awka. My work spans business cards, books, flyers, stickers, wallpapers, catalog layouts, large-scale graphics, web design and banners — using Adobe Photoshop and Illustrator, and CorelDraw above all.',
  null,
  'Awka, Anambra State, Nigeria',
  'youngalike@icloud.com',
  '+234 816 590 8505',
  '+234 805 080 2027'
)
on conflict (id) do update set
  full_name = excluded.full_name,
  title = excluded.title,
  bio = excluded.bio,
  location = excluded.location,
  email = excluded.email,
  phone_primary = excluded.phone_primary,
  phone_secondary = excluded.phone_secondary;

insert into social_links (label, url, icon_url, sort_order) values
  ('LinkedIn', 'https://www.linkedin.com/in/alike-kingsley-chukwudi-2267a7310/', null, 0);

insert into skills (name, category, stars, years_label, sort_order) values
  ('CorelDraw Suite', 'pc_mac', 5, '5+ years', 0),
  ('Adobe Photoshop', 'pc_mac', 4, '4+ years', 1),
  ('Adobe Illustrator', 'pc_mac', 3, '1+ year', 2),
  ('Microsoft Publisher', 'pc_mac', 3, '5+ years', 3),
  ('Microsoft Word', 'pc_mac', 5, '7+ years', 4),
  ('HTML5', 'pc_mac', 4, '3+ years', 5),
  ('CSS3', 'pc_mac', 4, '2+ years', 6),
  ('InShot', 'mobile', 4, '1+ year', 0),
  ('PixelLab', 'mobile', 5, '4+ years', 1),
  ('File Maintenance', 'soft', null, null, 0),
  ('Time Management', 'soft', null, null, 1),
  ('Risk Assessment', 'soft', null, null, 2),
  ('Budget Management', 'soft', null, null, 3),
  ('Creative Thinking', 'soft', null, null, 4),
  ('Critical Thinking', 'soft', null, null, 5);

insert into experience (title, company, start_date, end_date, is_current, bullets, sort_order) values
  (
    'Graphics Designer',
    'INX Studio',
    '2019-01-01',
    null,
    true,
    array[
      'Founded INX Studio while working as a freelancer, designing for clients',
      'Joined freelancing platforms like Upwork and others to find and serve clients',
      'In charge of designing flyers, logos, banners, ID cards and other creative work'
    ],
    0
  ),
  (
    'I.T. Specialist',
    'Dataprosys Technologies Limited',
    '2017-01-01',
    '2019-01-01',
    false,
    array[
      'Chief Engineer in charge of printer repairs and servicing',
      'Took part in scheduled development meetings to recommend system modifications and improvements',
      'Spearheaded new techniques to solve recurring printer and system errors',
      'In charge of servicing and maintaining computer systems in case of a breakdown'
    ],
    1
  );

insert into education (degree, school, location, start_date, end_date, is_current, sort_order) values
  (
    'B.Sc. Electronics and Computer Engineering',
    'Nnamdi Azikiwe University, Awka',
    'Anambra, Nigeria',
    '2019-01-01',
    null,
    true,
    0
  ),
  (
    'West African Examination Certificate (WAEC)',
    'Okei-ira Grammar School',
    'Oke-ira, Ogba, Lagos, Nigeria',
    '2014-01-01',
    '2016-01-01',
    false,
    1
  );

insert into certifications (issuer, title, credential_url, sort_order) values
  ('Solution Innovation District Nigeria', 'Graphics Design & Digital Marketing', null, 0),
  ('University of Colorado Boulder', 'Graphics Design', null, 1),
  ('Meta', 'Intro to Front-End Development', null, 2),
  ('Meta', 'Intro to Back-End Development', null, 3);
