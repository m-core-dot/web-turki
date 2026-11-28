grant usage on schema public to authenticated, service_role;
grant select on table public.universities to authenticated;
grant select, insert, update, delete on table public.universities to service_role;

notify pgrst, 'reload schema';
