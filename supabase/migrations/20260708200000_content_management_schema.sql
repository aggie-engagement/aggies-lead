-- Content management filing cabinets for Aggies Lead.

create table if not exists public.campus_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text,
  description text,
  address text,
  building text,
  room text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  website_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campus_location_contacts (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.campus_locations(id) on delete cascade,
  name text not null,
  title text,
  email text,
  phone text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  audience text,
  description text,
  class_year text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  resource_type text,
  url text,
  file_path text,
  audience text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  opportunity_type text,
  organization text,
  location text,
  url text,
  starts_at timestamptz,
  ends_at timestamptz,
  deadline_at timestamptz,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  category text,
  estimated_minutes integer,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.module_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  slug text,
  content text,
  lesson_type text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);

create table if not exists public.roadmap_steps (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid not null references public.roadmaps(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  title text not null,
  description text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  event_type text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  registration_url text,
  capacity integer,
  published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.profiles(id) on delete cascade,
  roadmap_id uuid references public.roadmaps(id) on delete set null,
  roadmap_step_id uuid references public.roadmap_steps(id) on delete set null,
  module_id uuid references public.modules(id) on delete set null,
  module_lesson_id uuid references public.module_lessons(id) on delete set null,
  status text not null default 'not_started',
  progress_percent integer not null default 0,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_progress_status_check check (
    status in ('not_started', 'in_progress', 'completed', 'skipped')
  ),
  constraint student_progress_percent_check check (
    progress_percent >= 0 and progress_percent <= 100
  )
);

create index if not exists campus_locations_active_sort_idx
  on public.campus_locations(active, sort_order, name);

create index if not exists campus_location_contacts_location_sort_idx
  on public.campus_location_contacts(location_id, active, sort_order);

create index if not exists roadmaps_published_sort_idx
  on public.roadmaps(published, sort_order, title);

create index if not exists roadmap_steps_roadmap_sort_idx
  on public.roadmap_steps(roadmap_id, published, sort_order);

create index if not exists resources_published_sort_idx
  on public.resources(published, sort_order, title);

create index if not exists opportunities_published_dates_idx
  on public.opportunities(published, starts_at, deadline_at);

create index if not exists modules_published_sort_idx
  on public.modules(published, sort_order, title);

create index if not exists module_lessons_module_sort_idx
  on public.module_lessons(module_id, published, sort_order);

create index if not exists events_published_dates_idx
  on public.events(published, starts_at);

create index if not exists student_progress_student_idx
  on public.student_progress(student_profile_id);

create index if not exists student_progress_module_lesson_idx
  on public.student_progress(student_profile_id, module_lesson_id)
  where module_lesson_id is not null;

create index if not exists student_progress_roadmap_step_idx
  on public.student_progress(student_profile_id, roadmap_step_id)
  where roadmap_step_id is not null;

drop trigger if exists set_campus_locations_updated_at on public.campus_locations;
create trigger set_campus_locations_updated_at
  before update on public.campus_locations
  for each row execute function public.set_updated_at();

drop trigger if exists set_campus_location_contacts_updated_at on public.campus_location_contacts;
create trigger set_campus_location_contacts_updated_at
  before update on public.campus_location_contacts
  for each row execute function public.set_updated_at();

drop trigger if exists set_roadmaps_updated_at on public.roadmaps;
create trigger set_roadmaps_updated_at
  before update on public.roadmaps
  for each row execute function public.set_updated_at();

drop trigger if exists set_roadmap_steps_updated_at on public.roadmap_steps;
create trigger set_roadmap_steps_updated_at
  before update on public.roadmap_steps
  for each row execute function public.set_updated_at();

drop trigger if exists set_resources_updated_at on public.resources;
create trigger set_resources_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

drop trigger if exists set_opportunities_updated_at on public.opportunities;
create trigger set_opportunities_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

drop trigger if exists set_modules_updated_at on public.modules;
create trigger set_modules_updated_at
  before update on public.modules
  for each row execute function public.set_updated_at();

drop trigger if exists set_module_lessons_updated_at on public.module_lessons;
create trigger set_module_lessons_updated_at
  before update on public.module_lessons
  for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists set_student_progress_updated_at on public.student_progress;
create trigger set_student_progress_updated_at
  before update on public.student_progress
  for each row execute function public.set_updated_at();

alter table public.campus_locations enable row level security;
alter table public.campus_location_contacts enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_steps enable row level security;
alter table public.resources enable row level security;
alter table public.opportunities enable row level security;
alter table public.modules enable row level security;
alter table public.module_lessons enable row level security;
alter table public.events enable row level security;
alter table public.student_progress enable row level security;

grant select, insert, update, delete on public.campus_locations to authenticated;
grant select, insert, update, delete on public.campus_location_contacts to authenticated;
grant select, insert, update, delete on public.roadmaps to authenticated;
grant select, insert, update, delete on public.roadmap_steps to authenticated;
grant select, insert, update, delete on public.resources to authenticated;
grant select, insert, update, delete on public.opportunities to authenticated;
grant select, insert, update, delete on public.modules to authenticated;
grant select, insert, update, delete on public.module_lessons to authenticated;
grant select, insert, update, delete on public.events to authenticated;
grant select, insert, update, delete on public.student_progress to authenticated;

drop policy if exists "Admins can manage campus locations" on public.campus_locations;
create policy "Admins can manage campus locations"
  on public.campus_locations
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read active campus locations" on public.campus_locations;
create policy "Authenticated users can read active campus locations"
  on public.campus_locations
  for select
  to authenticated
  using (active = true);

drop policy if exists "Admins can manage campus location contacts" on public.campus_location_contacts;
create policy "Admins can manage campus location contacts"
  on public.campus_location_contacts
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read active campus location contacts" on public.campus_location_contacts;
create policy "Authenticated users can read active campus location contacts"
  on public.campus_location_contacts
  for select
  to authenticated
  using (
    active = true
    and exists (
      select 1
      from public.campus_locations
      where campus_locations.id = campus_location_contacts.location_id
        and campus_locations.active = true
    )
  );

drop policy if exists "Admins can manage roadmaps" on public.roadmaps;
create policy "Admins can manage roadmaps"
  on public.roadmaps
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read published roadmaps" on public.roadmaps;
create policy "Authenticated users can read published roadmaps"
  on public.roadmaps
  for select
  to authenticated
  using (published = true);

drop policy if exists "Admins can manage roadmap steps" on public.roadmap_steps;
create policy "Admins can manage roadmap steps"
  on public.roadmap_steps
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read published roadmap steps" on public.roadmap_steps;
create policy "Authenticated users can read published roadmap steps"
  on public.roadmap_steps
  for select
  to authenticated
  using (
    published = true
    and exists (
      select 1
      from public.roadmaps
      where roadmaps.id = roadmap_steps.roadmap_id
        and roadmaps.published = true
    )
  );

drop policy if exists "Admins can manage resources" on public.resources;
create policy "Admins can manage resources"
  on public.resources
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read published resources" on public.resources;
create policy "Authenticated users can read published resources"
  on public.resources
  for select
  to authenticated
  using (published = true);

drop policy if exists "Admins can manage opportunities" on public.opportunities;
create policy "Admins can manage opportunities"
  on public.opportunities
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read published opportunities" on public.opportunities;
create policy "Authenticated users can read published opportunities"
  on public.opportunities
  for select
  to authenticated
  using (published = true);

drop policy if exists "Admins can manage modules" on public.modules;
create policy "Admins can manage modules"
  on public.modules
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read published modules" on public.modules;
create policy "Authenticated users can read published modules"
  on public.modules
  for select
  to authenticated
  using (published = true);

drop policy if exists "Admins can manage module lessons" on public.module_lessons;
create policy "Admins can manage module lessons"
  on public.module_lessons
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read published module lessons" on public.module_lessons;
create policy "Authenticated users can read published module lessons"
  on public.module_lessons
  for select
  to authenticated
  using (
    published = true
    and exists (
      select 1
      from public.modules
      where modules.id = module_lessons.module_id
        and modules.published = true
    )
  );

drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events"
  on public.events
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated users can read published events" on public.events;
create policy "Authenticated users can read published events"
  on public.events
  for select
  to authenticated
  using (published = true);

drop policy if exists "Admins can manage all student progress" on public.student_progress;
create policy "Admins can manage all student progress"
  on public.student_progress
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Students can read their own progress" on public.student_progress;
create policy "Students can read their own progress"
  on public.student_progress
  for select
  to authenticated
  using (student_profile_id = auth.uid());

drop policy if exists "Students can insert their own progress" on public.student_progress;
create policy "Students can insert their own progress"
  on public.student_progress
  for insert
  to authenticated
  with check (student_profile_id = auth.uid());

drop policy if exists "Students can update their own progress" on public.student_progress;
create policy "Students can update their own progress"
  on public.student_progress
  for update
  to authenticated
  using (student_profile_id = auth.uid())
  with check (student_profile_id = auth.uid());
