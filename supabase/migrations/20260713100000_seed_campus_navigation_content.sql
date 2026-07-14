-- Seed existing Campus Navigation content from the prototype fallback data.
-- Locations are upserted by slug so manually entered records, including Fueling Station, are updated instead of duplicated.
-- These columns are also added here defensively so the seed works even if the media-fields migration was not applied first.

alter table public.campus_locations
  add column if not exists short_description text,
  add column if not exists full_description text,
  add column if not exists exterior_image_path text,
  add column if not exists map_image_path text;

alter table public.campus_location_contacts
  add column if not exists photo_url text;

with location_seed (
  slug,
  name,
  category,
  short_description,
  full_description,
  exterior_image_path,
  map_image_path,
  sort_order
) as (
  values
    (
      'laub',
      'Jim and Carol Laub Athletics-Academic Center',
      'the stadium',
      $$Often referred to as "the stadium," the Jim and Carol Laub Athletics-Academic Center is home to many of the primary resources and support services available to Utah State student-athletes.$$,
      $$1st Floor
- Training Room (Dr. Trevor Short and Sports Medicine)
- Equipment Room
- Football Locker Room

2nd Floor
- Spetman Auditorium
- Freshman Connections Classes
- SAAC Meetings
- Special Events and Guest Speakers
- Football Offices

3rd Floor
- Study Hall
- Academic Services (Justice Smith)
- Track & Field Offices (Artie Gulden)
- Aggie Engagement Offices (Isaiah Jones)
- Compliance Offices (Tony Hearrell)$$,
      '/images/campus-navigation/laub/laub-exterior.jpg',
      '/images/campus-navigation/laub/laub-map.jpg',
      10
    ),
    (
      'icon',
      'ICON',
      'the weight room',
      $$Often referred to as "the weight room," ICON serves as the primary strength and conditioning facility for Utah State student-athletes. The facility offers a variety of weight training equipment, recovery resources, and protein shakes. Student-athletes interested in using the facility outside of scheduled team activities must receive approval from [Insert Name].$$,
      $$Often referred to as "the weight room," ICON serves as the primary strength and conditioning facility for Utah State student-athletes. The facility offers a variety of weight training equipment, recovery resources, and protein shakes. Student-athletes interested in using the facility outside of scheduled team activities must receive approval from [Insert Name].$$,
      '/images/campus-navigation/icon/icon-exterior.jpg',
      '/images/campus-navigation/icon/icon-map.jpg',
      20
    ),
    (
      'fueling-station',
      'Fueling Station',
      'fueling',
      $$Often referred to as "fueling," the Fueling Station provides student-athletes with access to nutritious food and beverages before and after training, practices, and competitions. Available exclusively to student-athletes, the Fueling Station offers a variety of options designed to support performance, energy, recovery, and overall wellness.$$,
      $$Often referred to as "fueling," the Fueling Station provides student-athletes with access to nutritious food and beverages before and after training, practices, and competitions. Available exclusively to student-athletes, the Fueling Station offers a variety of options designed to support performance, energy, recovery, and overall wellness.$$,
      '/images/campus-navigation/fueling-station/fueling-station-exterior.jpg',
      '/images/campus-navigation/fueling-station/fueling-station-map.jpg',
      30
    ),
    (
      'olympic-complex',
      'Olympic Complex & Student Health',
      'Olympic Complex',
      $$The Olympic Complex is home to several Olympic sport offices and locker rooms, including soccer, softball, and tennis. Connected to the facility is the Student Health and Wellness Center, which serves all Utah State students by providing medical care, wellness resources, and mental health support. This is also where Olivia Huffman, Director of Mental Wellness, is located.$$,
      $$The Olympic Complex is home to several Olympic sport offices and locker rooms, including soccer, softball, and tennis. Connected to the facility is the Student Health and Wellness Center, which serves all Utah State students by providing medical care, wellness resources, and mental health support. This is also where Olivia Huffman, Director of Mental Wellness, is located.$$,
      '/images/campus-navigation/olympic-complex/olympic-complex-exterior.jpg',
      '/images/campus-navigation/olympic-complex/olympic-complex-map.jpg',
      40
    ),
    (
      'west-stadium',
      'West Stadium Center',
      'the west stadium',
      $$Often referred to as the "West Stadium" or the "WSC," the West Stadium Center hosts a variety of student-athlete and university events. The third floor is commonly used for career fairs, alumni events, networking opportunities, guest speakers, leadership programming, and other special events throughout the year.$$,
      $$Often referred to as the "West Stadium" or the "WSC," the West Stadium Center hosts a variety of student-athlete and university events. The third floor is commonly used for career fairs, alumni events, networking opportunities, guest speakers, leadership programming, and other special events throughout the year.$$,
      '/images/campus-navigation/west-stadium/west-stadium-exterior.jpg',
      '/images/campus-navigation/west-stadium/west-stadium-map.jpg',
      50
    ),
    (
      'indoor-laub',
      'Stan Laub Indoor Training Center',
      'the indoor',
      $$Often referred to as "the indoor," the Stan Laub Indoor Training Center serves as Utah State Athletics' primary indoor practice facility. Many teams utilize the facility throughout the year, particularly during the winter months when outdoor conditions are limited.$$,
      $$Often referred to as "the indoor," the Stan Laub Indoor Training Center serves as Utah State Athletics' primary indoor practice facility. Many teams utilize the facility throughout the year, particularly during the winter months when outdoor conditions are limited.$$,
      '/images/campus-navigation/indoor-laub/indoor-laub-interior.jpg',
      '/images/campus-navigation/indoor-laub/indoor-laub-map.jpg',
      60
    ),
    (
      'spectrum',
      'Dee Glen Smith Spectrum',
      'the spec',
      $$Often referred to as "the Spec," the Dee Glen Smith Spectrum is home to Utah State Basketball and Gymnastics and occasionally hosts Volleyball events.$$,
      $$1st Floor
- Ticketing Offices
- Locker Rooms

2nd Floor
- Main Athletics Offices
- Senior Administration Offices (Cameron Walker)
- Marketing & Creative Content
- Business Services

3rd Floor
- Gymnastics Coaches Offices (Kristin White)$$,
      '/images/campus-navigation/spectrum/spectrum-exterior.jpg',
      '/images/campus-navigation/spectrum/spectrum-map.jpg',
      70
    ),
    (
      'wayne-estes',
      'Wayne Estes Center',
      'the Estes',
      $$Often referred to as "the Estes," the Wayne Estes Center serves as the home venue for Utah State Volleyball and houses the offices of the Men's Basketball, Women's Basketball, and Volleyball coaching staffs.$$,
      $$Often referred to as "the Estes," the Wayne Estes Center serves as the home venue for Utah State Volleyball and houses the offices of the Men's Basketball, Women's Basketball, and Volleyball coaching staffs.$$,
      '/images/campus-navigation/wayne-estes/wayne-estes-exterior.jpg',
      '/images/campus-navigation/wayne-estes/wayne-estes-map.jpg',
      80
    ),
    (
      'tsc',
      'Taggart Student Center',
      'TSC',
      $$The Taggart Student Center, commonly referred to as the TSC, is one of the main student hubs on campus. The building includes the Campus Store, Admissions, Student Media, the Marketplace, meeting spaces, dining options, and a variety of student resources and services.$$,
      $$The Taggart Student Center, commonly referred to as the TSC, is one of the main student hubs on campus. The building includes the Campus Store, Admissions, Student Media, the Marketplace, meeting spaces, dining options, and a variety of student resources and services.$$,
      '/images/campus-navigation/tsc/tsc-exterior.jpg',
      '/images/campus-navigation/tsc/tsc-map.jpg',
      90
    ),
    (
      'hper',
      'HPER / ARC',
      null,
      $$The ARC, also known as the Aggie Recreation Center, serves as the university's primary recreation and fitness facility. The HPER building is home to the Ray Corn Gymnastics Training Facility and includes swimming pools, basketball courts, racquetball courts, locker rooms, and additional recreational spaces for students.$$,
      $$The ARC, also known as the Aggie Recreation Center, serves as the university's primary recreation and fitness facility. The HPER building is home to the Ray Corn Gymnastics Training Facility and includes swimming pools, basketball courts, racquetball courts, locker rooms, and additional recreational spaces for students.$$,
      '/images/campus-navigation/hper/arc-exterior.jpg',
      '/images/campus-navigation/hper/hper-arc-map.jpg',
      100
    ),
    (
      'library',
      'Library / Testing Center',
      null,
      $$The Merrill-Cazier Library serves as Utah State University's main library and provides study spaces, research support, tutoring resources, and academic assistance. The Testing Center is frequently used by student-athletes for accommodated exams. Be sure to schedule exams well in advance, especially during midterms and finals, as appointment times fill quickly.$$,
      $$The Merrill-Cazier Library serves as Utah State University's main library and provides study spaces, research support, tutoring resources, and academic assistance. The Testing Center is frequently used by student-athletes for accommodated exams. Be sure to schedule exams well in advance, especially during midterms and finals, as appointment times fill quickly.$$,
      '/images/campus-navigation/library/library-exterior.jpg',
      '/images/campus-navigation/library/library-map.jpg',
      110
    ),
    (
      'old-main',
      'Old Main',
      null,
      $$Old Main is the oldest building on Utah State University's campus and remains one of its most recognizable landmarks. Fun fact: the iconic "A" on Old Main lights up blue whenever a Utah State Athletics team wins. The Quad surrounding Old Main hosts many campus traditions, events, activities, and student gatherings throughout the year.$$,
      $$Old Main is the oldest building on Utah State University's campus and remains one of its most recognizable landmarks. Fun fact: the iconic "A" on Old Main lights up blue whenever a Utah State Athletics team wins. The Quad surrounding Old Main hosts many campus traditions, events, activities, and student gatherings throughout the year.$$,
      '/images/campus-navigation/old-main/old-main-quad-exterior.jpg',
      '/images/campus-navigation/old-main/old-main-quad-map.jpg',
      120
    )
)
insert into public.campus_locations (
  slug,
  name,
  category,
  description,
  short_description,
  full_description,
  exterior_image_path,
  map_image_path,
  active,
  sort_order
)
select
  slug,
  name,
  category,
  short_description,
  short_description,
  full_description,
  exterior_image_path,
  map_image_path,
  true,
  sort_order
from location_seed
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  exterior_image_path = excluded.exterior_image_path,
  map_image_path = excluded.map_image_path,
  active = true,
  sort_order = excluded.sort_order,
  updated_at = now();

with contact_seed (
  location_slug,
  name,
  title,
  photo_url,
  sort_order
) as (
  values
    ('laub', 'Tony Hearrell', 'Senior Associate AD, Compliance & Student-Athlete Services', '/images/campus-navigation/laub/tony-hearrell-headshot.jpg', 10),
    ('laub', 'Justice Smith', 'Associate AD, Academic Services', '/images/campus-navigation/laub/justice-smith-headshot.jpg', 20),
    ('laub', 'Isaiah Jones', 'Associate AD, Aggie Engagement', '/images/campus-navigation/laub/isaiah-jones-headshot.jpg', 30),
    ('laub', 'Dr. Trevor Short', 'Senior Associate AD, Health, Wellness and Performance', '/images/campus-navigation/laub/trevor-short-headshot.jpg', 40),
    ('laub', 'Artie Gulden', 'Head Coach, Track & Field and Cross Country', '/images/campus-navigation/laub/artie-gulden-headshot.jpg', 50),
    ('laub', 'Bronco Mendenhall', 'Head Coach, Football', '/images/campus-navigation/laub/bronco-mendenhall-headshot.jpg', 60),
    ('fueling-station', 'Natalie Norris', 'Director of Sports Nutrition', '/images/campus-navigation/fueling-station/natalie-norris-headshot.jpg', 10),
    ('olympic-complex', 'Manny Martins', 'Head Coach, Soccer', '/images/campus-navigation/olympic-complex/manny-martins-headshot.jpg', 10),
    ('olympic-complex', 'Shelby Thompson', 'Interim Head Coach, Softball', '/images/campus-navigation/olympic-complex/shelby-thompson-headshot.jpg', 20),
    ('olympic-complex', 'Aaron Paajanen', 'Head Coach, Men''s Tennis', '/images/campus-navigation/olympic-complex/aaron-paajanen-headshot.jpg', 30),
    ('olympic-complex', 'Veronika Golanova', 'Head Coach, Women''s Tennis', '/images/campus-navigation/olympic-complex/veronika-golanova-headshot.jpg', 40),
    ('olympic-complex', 'Olivia Huffman', 'Director of Mental Wellness', '/images/campus-navigation/olympic-complex/olivia-huffman-headshot.jpg', 50),
    ('spectrum', 'Cameron Walker', 'Vice President and Director of Athletics', '/images/campus-navigation/spectrum/cameron-walker-headshot.jpg', 10),
    ('spectrum', 'Kristin White', 'Head Coach, Gymnastics', '/images/campus-navigation/spectrum/kristin-white-headshot.jpg', 20),
    ('wayne-estes', 'Ben Jacobsen', 'Head Coach, Men''s Basketball', '/images/campus-navigation/wayne-estes/ben-jacobsen-headshot.jpg', 10),
    ('wayne-estes', 'Wesley Brooks', 'Head Coach, Women''s Basketball', '/images/campus-navigation/wayne-estes/wesley-brooks-headshot.jpg', 20),
    ('wayne-estes', 'Keith Smith', 'Head Coach, Volleyball', '/images/campus-navigation/wayne-estes/keith-smith-headshot.jpg', 30)
),
resolved_contacts as (
  select
    campus_locations.id as location_id,
    contact_seed.name,
    contact_seed.title,
    contact_seed.photo_url,
    contact_seed.sort_order
  from contact_seed
  join public.campus_locations on campus_locations.slug = contact_seed.location_slug
),
updated_contacts as (
  update public.campus_location_contacts
  set
    name = resolved_contacts.name,
    title = resolved_contacts.title,
    photo_url = resolved_contacts.photo_url,
    email = null,
    phone = null,
    active = true,
    sort_order = resolved_contacts.sort_order,
    updated_at = now()
  from resolved_contacts
  where campus_location_contacts.location_id = resolved_contacts.location_id
    and lower(campus_location_contacts.name) = lower(resolved_contacts.name)
  returning campus_location_contacts.id
)
insert into public.campus_location_contacts (
  location_id,
  name,
  title,
  photo_url,
  email,
  phone,
  active,
  sort_order
)
select
  resolved_contacts.location_id,
  resolved_contacts.name,
  resolved_contacts.title,
  resolved_contacts.photo_url,
  null,
  null,
  true,
  resolved_contacts.sort_order
from resolved_contacts
where not exists (
  select 1
  from public.campus_location_contacts
  where campus_location_contacts.location_id = resolved_contacts.location_id
    and lower(campus_location_contacts.name) = lower(resolved_contacts.name)
);
