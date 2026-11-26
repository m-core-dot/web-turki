create table if not exists public.registration_number_counters (
  registration_year integer primary key,
  last_number integer not null default 0 check (last_number >= 0)
);

alter table public.registration_number_counters enable row level security;
grant select, insert, update on table public.registration_number_counters to service_role;

drop function if exists public.next_registration_number(integer);

create or replace function public.next_registration_number(p_registration_year integer)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  next_number integer;
begin
  insert into public.registration_number_counters (registration_year, last_number)
  values (p_registration_year, 1)
  on conflict (registration_year)
  do update set last_number = registration_number_counters.last_number + 1
  returning registration_number_counters.last_number into next_number;

  return format('REG-%s-%s', p_registration_year, lpad(next_number::text, 5, '0'));
end;
$$;

grant execute on function public.next_registration_number(integer) to service_role;

create or replace function public.set_registration_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  registration_year integer;
begin
  if new.registration_number is null or new.registration_number = '' or new.registration_number !~ '^REG-[0-9]{4}-[0-9]{5}$' then
    registration_year := coalesce(new.batch, extract(year from coalesce(new.submitted_at, now()))::integer);
    new.registration_number := public.next_registration_number(registration_year);
  end if;
  return new;
end;
$$;

drop trigger if exists registrations_set_registration_number on public.registrations;
create trigger registrations_set_registration_number
before insert on public.registrations
for each row execute function public.set_registration_number();

notify pgrst, 'reload schema';
