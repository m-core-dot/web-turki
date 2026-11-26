create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text not null,
  action text not null,
  target text not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_actor_name_idx on public.audit_logs (actor_name);

alter table public.audit_logs enable row level security;

drop policy if exists "Authenticated users can read audit logs" on public.audit_logs;
create policy "Authenticated users can read audit logs"
  on public.audit_logs for select
  to authenticated
  using (true);

drop policy if exists "Service role can manage audit logs" on public.audit_logs;
create policy "Service role can manage audit logs"
  on public.audit_logs for all
  to service_role
  using (true)
  with check (true);
