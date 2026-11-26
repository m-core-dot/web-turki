alter table public.staff
  add column if not exists must_change_password boolean not null default true;

notify pgrst, 'reload schema';
