create or replace function public.create_student_activation_invite(
  p_email text,
  p_first_name text,
  p_last_name text
)
returns public.activation_invites
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(trim(p_email));
  created_invite public.activation_invites;
begin
  if not public.is_admin() then
    raise exception 'Only admins can create student-athlete activation invites.';
  end if;

  if normalized_email = '' or trim(p_first_name) = '' or trim(p_last_name) = '' then
    raise exception 'First name, last name, and email are required.';
  end if;

  insert into public.activation_invites (
    email,
    first_name,
    last_name,
    role,
    temporary_password,
    invited_by
  )
  values (
    normalized_email,
    trim(p_first_name),
    trim(p_last_name),
    'student_athlete',
    'aggieslead',
    auth.uid()
  )
  on conflict (email) do update
  set first_name = excluded.first_name,
      last_name = excluded.last_name,
      role = 'student_athlete',
      temporary_password = 'aggieslead',
      invited_by = auth.uid(),
      activated_at = null,
      expires_at = null
  returning * into created_invite;

  return created_invite;
end;
$$;

create or replace function public.claim_student_activation_invite()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text := lower(auth.jwt() ->> 'email');
  invite public.activation_invites;
  created_profile public.profiles;
begin
  if current_user_id is null then
    raise exception 'You must be signed in to activate a student-athlete account.';
  end if;

  if current_email is null or trim(current_email) = '' then
    raise exception 'The signed-in user must have an email address.';
  end if;

  select *
  into invite
  from public.activation_invites
  where email = current_email
    and role = 'student_athlete'
  limit 1;

  if invite.id is null then
    raise exception 'No student-athlete activation invite exists for this email.';
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
    current_email,
    invite.first_name,
    invite.last_name,
    'student_athlete',
    false
  )
  on conflict (id) do update
  set email = excluded.email,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      role = excluded.role
  returning * into created_profile;

  insert into public.student_athletes (
    profile_id,
    status
  )
  values (
    current_user_id,
    'inactive'
  )
  on conflict (profile_id) do update
  set status = excluded.status;

  update public.activation_invites
  set activated_at = coalesce(activated_at, now())
  where id = invite.id;

  return created_profile;
end;
$$;

grant execute on function public.create_student_activation_invite(text, text, text) to authenticated;
grant execute on function public.claim_student_activation_invite() to authenticated;

grant select, insert, update on table public.activation_invites to authenticated;
grant select, insert, update on table public.student_athletes to authenticated;
