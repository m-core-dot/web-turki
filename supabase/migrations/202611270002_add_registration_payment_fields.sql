alter table public.registrations
  add column if not exists payment_amount integer,
  add column if not exists payment_unique_code integer,
  add column if not exists payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'proof_submitted', 'verified', 'rejected')),
  add column if not exists payment_submitted_at timestamptz;

create index if not exists registrations_payment_status_idx on public.registrations(payment_status);
notify pgrst, 'reload schema';
