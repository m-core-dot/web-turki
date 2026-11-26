-- The registrations table may already exist from an earlier schema version.
-- Add the program field without recreating or deleting existing registrations.
alter table public.registrations
  add column if not exists program_level text;

update public.registrations
set program_level = 'S1'
where program_level is null;

alter table public.registrations
  alter column program_level set default 'S1',
  alter column program_level set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'registrations_program_level_check'
      and conrelid = 'public.registrations'::regclass
  ) then
    alter table public.registrations
      add constraint registrations_program_level_check
      check (program_level in ('S1', 'S2', 'S3'));
  end if;
end
$$;

notify pgrst, 'reload schema';
