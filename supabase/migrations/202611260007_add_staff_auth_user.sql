alter table public.staff
  add column if not exists auth_user_id uuid;

create unique index if not exists staff_auth_user_id_idx
  on public.staff(auth_user_id)
  where auth_user_id is not null;

grant select, insert, update, delete on table public.staff to service_role;

notify pgrst, 'reload schema';
