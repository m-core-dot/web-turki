create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gender text not null check (gender in ('LAKI-LAKI', 'PEREMPUAN')),
  phone text not null,
  address text not null,
  department text not null,
  role text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists staff_status_idx on public.staff(status);
create index if not exists staff_department_idx on public.staff(department);

alter table public.staff enable row level security;

create policy "authenticated users can read staff"
  on public.staff for select
  to authenticated
  using (auth.uid() is not null);

create policy "authenticated users can insert staff"
  on public.staff for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "authenticated users can update staff"
  on public.staff for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "authenticated users can delete staff"
  on public.staff for delete
  to authenticated
  using (auth.uid() is not null);

create or replace function public.set_staff_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists staff_set_updated_at on public.staff;
create trigger staff_set_updated_at
before update on public.staff
for each row execute function public.set_staff_updated_at();
