create table if not exists public.participant_education (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  education_level text not null,
  institution_name text not null,
  major text,
  completion_year integer,
  status text not null default 'in_progress' check (status in ('verified', 'in_progress', 'pending')),
  school_city text,
  school_province text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.participant_education
  drop constraint if exists participant_education_level_check;

alter table public.participant_education
  add constraint participant_education_level_check
  check (education_level in (
    'SMA/MA dan SMK/MAK (sederajat)',
    'Sarjana (S1)',
    'Magister (S2)',
    'Doktor (S3)'
  ));

notify pgrst, 'reload schema';
