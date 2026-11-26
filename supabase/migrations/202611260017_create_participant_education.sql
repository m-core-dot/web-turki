create table if not exists public.participant_education (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  education_level text not null,
  institution_name text not null,
  major text,
  completion_year integer,
  status text not null default 'in_progress' check (status in ('verified', 'in_progress', 'pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists participant_education_registration_idx on public.participant_education(registration_id);
alter table public.participant_education enable row level security;
grant select, insert, update, delete on table public.participant_education to service_role;
grant select, insert, update, delete on table public.participant_education to authenticated;

create policy "Participants can manage own education"
  on public.participant_education for all to authenticated
  using (exists (select 1 from public.registrations r where r.id = registration_id and r.auth_user_id = auth.uid()))
  with check (exists (select 1 from public.registrations r where r.id = registration_id and r.auth_user_id = auth.uid()));

create or replace function public.set_participant_education_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists participant_education_set_updated_at on public.participant_education;
create trigger participant_education_set_updated_at before update on public.participant_education
for each row execute function public.set_participant_education_updated_at();
