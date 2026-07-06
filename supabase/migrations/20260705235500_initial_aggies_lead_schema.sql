create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  role text not null default 'student_athlete',
  phone text,
  profile_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('student_athlete', 'admin', 'coach', 'staff'))
);

create table if not exists public.sports (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.student_athletes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete cascade,
  sport_id uuid references public.sports(id),
  class_year text,
  entry_year integer,
  expected_graduation_year integer,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_athletes_status_check check (status in ('active', 'transfer', 'graduated', 'inactive'))
);

create table if not exists public.activation_invites (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text not null,
  last_name text not null,
  role text not null default 'student_athlete',
  temporary_password text,
  invited_by uuid references public.profiles(id),
  activated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint activation_invites_role_check check (role in ('student_athlete', 'admin', 'coach', 'staff'))
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists sports_active_idx on public.sports(active);
create index if not exists student_athletes_profile_id_idx on public.student_athletes(profile_id);
create index if not exists student_athletes_sport_id_idx on public.student_athletes(sport_id);
create index if not exists activation_invites_invited_by_idx on public.activation_invites(invited_by);

insert into public.sports (name, slug)
values
  ('Football', 'football'),
  ('Men''s Basketball', 'mens-basketball'),
  ('Women''s Basketball', 'womens-basketball'),
  ('Gymnastics', 'gymnastics'),
  ('Volleyball', 'volleyball'),
  ('Soccer', 'soccer'),
  ('Softball', 'softball'),
  ('Men''s Cross Country', 'mens-cross-country'),
  ('Women''s Cross Country', 'womens-cross-country'),
  ('Men''s Track & Field', 'mens-track-field'),
  ('Women''s Track & Field', 'womens-track-field'),
  ('Men''s Tennis', 'mens-tennis'),
  ('Women''s Tennis', 'womens-tennis'),
  ('Golf', 'golf')
on conflict (slug) do update
set name = excluded.name,
    active = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.prevent_profile_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change profile roles.';
  end if;

  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists prevent_profile_role_self_escalation on public.profiles;
create trigger prevent_profile_role_self_escalation
before update on public.profiles
for each row
execute function public.prevent_profile_role_self_escalation();

drop trigger if exists set_student_athletes_updated_at on public.student_athletes;
create trigger set_student_athletes_updated_at
before update on public.student_athletes
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.sports enable row level security;
alter table public.student_athletes enable row level security;
alter table public.activation_invites enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Authenticated users can read active sports" on public.sports;
create policy "Authenticated users can read active sports"
on public.sports
for select
to authenticated
using (active = true);

drop policy if exists "Users can read their own student athlete record" on public.student_athletes;
create policy "Users can read their own student athlete record"
on public.student_athletes
for select
to authenticated
using (profile_id = auth.uid());

drop policy if exists "Admins can read all student athletes" on public.student_athletes;
create policy "Admins can read all student athletes"
on public.student_athletes
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert student athletes" on public.student_athletes;
create policy "Admins can insert student athletes"
on public.student_athletes
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update student athletes" on public.student_athletes;
create policy "Admins can update student athletes"
on public.student_athletes
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read activation invites" on public.activation_invites;
create policy "Admins can read activation invites"
on public.activation_invites
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert activation invites" on public.activation_invites;
create policy "Admins can insert activation invites"
on public.activation_invites
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update activation invites" on public.activation_invites;
create policy "Admins can update activation invites"
on public.activation_invites
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
