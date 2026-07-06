create or replace function public.first_admin_exists()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where role = 'admin'
  );
$$;

create or replace function public.create_first_admin_profile(
  first_name text,
  last_name text
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text := auth.jwt() ->> 'email';
  created_profile public.profiles;
begin
  if current_user_id is null then
    raise exception 'You must be signed in to create the first admin profile.';
  end if;

  if current_email is null or length(trim(current_email)) = 0 then
    raise exception 'The signed-in user must have an email address.';
  end if;

  if exists (select 1 from public.profiles where role = 'admin') then
    raise exception 'An admin account already exists.';
  end if;

  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    profile_completed
  )
  values (
    current_user_id,
    lower(current_email),
    trim(first_name),
    trim(last_name),
    'admin',
    true
  )
  returning * into created_profile;

  return created_profile;
end;
$$;

grant execute on function public.first_admin_exists() to anon, authenticated;
grant execute on function public.create_first_admin_profile(text, text) to authenticated;
