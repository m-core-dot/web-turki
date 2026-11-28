create table if not exists public.intakes (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities(id) on delete cascade,
  code text not null unique,
  name text not null,
  open_date date,
  close_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint intakes_valid_dates check (open_date is null or close_date is null or close_date >= open_date)
);

create index if not exists intakes_university_id_idx on public.intakes(university_id);
create sequence if not exists public.intake_code_seq;
create or replace function public.next_intake_code()
returns text language sql security definer set search_path = public
as $$ select 'INT-' || lpad(nextval('public.intake_code_seq')::text, 3, '0'); $$;
grant execute on function public.next_intake_code() to service_role;
grant select on public.intakes to authenticated;
grant select, insert, update, delete on public.intakes to service_role;
alter table public.intakes enable row level security;
create policy "authenticated users can read intakes" on public.intakes for select to authenticated using (true);
create policy "service role manages intakes" on public.intakes for all to service_role using (true) with check (true);
