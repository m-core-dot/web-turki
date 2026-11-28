create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  city text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists universities_status_idx on public.universities(status);
create index if not exists universities_city_idx on public.universities(city);

-- Explicit grants are required when the table is created outside Supabase's default ownership role.
grant usage on schema public to authenticated, service_role;
grant select on table public.universities to authenticated;
grant select, insert, update, delete on table public.universities to service_role;

alter table public.universities enable row level security;

create policy "authenticated users can read universities"
  on public.universities for select
  to authenticated
  using (true);

create policy "service role manages universities"
  on public.universities for all
  to service_role
  using (true)
  with check (true);

create or replace function public.set_universities_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists universities_set_updated_at on public.universities;
create trigger universities_set_updated_at
before update on public.universities
for each row execute function public.set_universities_updated_at();

notify pgrst, 'reload schema';
