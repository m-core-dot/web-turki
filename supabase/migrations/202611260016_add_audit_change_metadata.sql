alter table public.audit_logs
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists audit_logs_metadata_gin_idx
  on public.audit_logs using gin (metadata);

grant select, insert, update, delete on table public.audit_logs to service_role;

grant select on table public.audit_logs to authenticated;

notify pgrst, 'reload schema';
