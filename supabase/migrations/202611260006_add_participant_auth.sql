alter table public.registrations
  add column if not exists auth_user_id uuid,
  add column if not exists must_change_password boolean not null default true;

create unique index if not exists registrations_auth_user_id_idx
  on public.registrations(auth_user_id)
  where auth_user_id is not null;

grant select, update on table public.registrations to service_role;

notify pgrst, 'reload schema';
