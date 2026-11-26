alter table public.registrations
  add column if not exists proof_drive_file_id text,
  add column if not exists proof_drive_url text;

grant select, update on table public.registrations to service_role;

notify pgrst, 'reload schema';
