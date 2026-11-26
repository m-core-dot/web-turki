alter table public.registrations
  add column if not exists proof_file_name text,
  add column if not exists proof_storage_path text;

insert into storage.buckets (id, name, public)
values ('registration-proofs', 'registration-proofs', false)
on conflict (id) do nothing;

grant select, update on table public.registrations to service_role;

notify pgrst, 'reload schema';
