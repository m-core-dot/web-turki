create extension if not exists pgcrypto;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_number text not null unique default ('REG-' || extract(year from now())::text || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  program_level text not null check (program_level in ('S1', 'S2', 'S3')),
  full_name text not null,
  birth_place text not null,
  birth_date date,
  gender text,
  passport_number text,
  nik text not null unique,
  telegram_username text,
  email text not null,
  whatsapp_phone text not null,
  father_name text not null,
  father_phone text,
  mother_name text not null,
  mother_phone text not null,
  address text not null,
  rt_rw text,
  village text not null,
  district text not null,
  regency text not null,
  province text not null,
  postal_code text not null,
  school text not null,
  school_city text not null,
  school_province text not null,
  major text,
  preferences text[] not null check (cardinality(preferences) between 3 and 5),
  source text not null,
  source_other text,
  batch integer not null default extract(year from now())::integer,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'needs_revision', 'rejected')),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists registrations_status_idx on public.registrations(status);
create index if not exists registrations_batch_idx on public.registrations(batch);
create index if not exists registrations_submitted_at_idx on public.registrations(submitted_at desc);

alter table public.registrations enable row level security;

create policy "registration admins can read registrations"
  on public.registrations for select
  to authenticated
  using (auth.uid() is not null);

create policy "registration admins can insert registrations"
  on public.registrations for insert
  to authenticated
  with check (auth.uid() is not null);

create or replace function public.set_registrations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at
before update on public.registrations
for each row execute function public.set_registrations_updated_at();
