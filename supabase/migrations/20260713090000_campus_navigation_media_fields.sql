-- Add media and richer description fields for admin-managed Campus Navigation content.

alter table public.campus_locations
  add column if not exists short_description text,
  add column if not exists full_description text,
  add column if not exists exterior_image_path text,
  add column if not exists map_image_path text;

alter table public.campus_location_contacts
  add column if not exists photo_url text;
