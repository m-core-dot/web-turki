create sequence if not exists public.faculty_code_seq;
create sequence if not exists public.major_code_seq;

select setval(
  'public.faculty_code_seq',
  coalesce((select max((substring(code from 5))::bigint) from public.faculties where code ~ '^FAC-[0-9]+$'), 0),
  true
);
select setval(
  'public.major_code_seq',
  coalesce((select max((substring(code from 5))::bigint) from public.majors where code ~ '^MJR-[0-9]+$'), 0),
  true
);

create or replace function public.next_faculty_code()
returns text
language sql
security definer
set search_path = public
as $$
  select 'FAC-' || lpad(nextval('public.faculty_code_seq')::text, 3, '0');
$$;

create or replace function public.next_major_code()
returns text
language sql
security definer
set search_path = public
as $$
  select 'MJR-' || lpad(nextval('public.major_code_seq')::text, 3, '0');
$$;

grant execute on function public.next_faculty_code() to service_role;
grant execute on function public.next_major_code() to service_role;
