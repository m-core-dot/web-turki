create table if not exists public.faculties (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities(id) on delete cascade,
  code text not null unique,
  name text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.majors (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculties(id) on delete cascade,
  code text not null unique,
  name text not null,
  degree text not null default 'Bachelor',
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faculties_university_id_idx on public.faculties(university_id);
create index if not exists majors_faculty_id_idx on public.majors(faculty_id);
grant usage on schema public to authenticated, service_role;
grant select on public.faculties, public.majors to authenticated;
grant select, insert, update, delete on public.faculties, public.majors to service_role;
alter table public.faculties enable row level security;
alter table public.majors enable row level security;
create policy "authenticated users can read faculties" on public.faculties for select to authenticated using (true);
create policy "authenticated users can read majors" on public.majors for select to authenticated using (true);
create policy "service role manages faculties" on public.faculties for all to service_role using (true) with check (true);
create policy "service role manages majors" on public.majors for all to service_role using (true) with check (true);
