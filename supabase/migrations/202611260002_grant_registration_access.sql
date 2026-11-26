-- Ensure the server-only service_role can access registrations.
-- RLS is still enabled; service_role bypasses RLS for trusted server actions.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.registrations to service_role;
grant usage, select on all sequences in schema public to service_role;

notify pgrst, 'reload schema';
