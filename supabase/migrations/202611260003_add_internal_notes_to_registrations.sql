alter table public.registrations
  add column if not exists internal_notes text;

grant select, update on table public.registrations to service_role;

notify pgrst, 'reload schema';
