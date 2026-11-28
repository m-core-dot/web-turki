create sequence if not exists public.universities_code_seq;

select setval(
  'public.universities_code_seq',
  greatest(
    coalesce((select max(substring(code from 5)::integer) from public.universities where code ~ '^UNI-[0-9]+$'), 0),
    (select count(*) from public.universities)
  ),
  true
);

create or replace function public.next_university_code()
returns text
language sql
security definer
set search_path = public
as $$
  select 'UNI-' || lpad(nextval('public.universities_code_seq')::text, 3, '0');
$$;

grant execute on function public.next_university_code() to service_role;
