alter table public.staff
  add column if not exists email text;

create unique index if not exists staff_email_idx
  on public.staff(lower(email))
  where email is not null;

grant select, insert, update, delete on table public.staff to service_role;

notify pgrst, 'reload schema';
