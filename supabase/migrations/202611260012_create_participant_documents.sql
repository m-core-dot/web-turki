create table if not exists public.participant_documents (
  id uuid primary key default gen_random_uuid(),
  registration_number text not null references public.registrations(registration_number) on delete cascade,
  document_type text not null,
  file_name text,
  drive_file_id text,
  drive_url text,
  status text not null default 'not_uploaded' check (status in ('approved', 'revision', 'rejected', 'not_uploaded')),
  revision_number integer not null default 0 check (revision_number >= 0),
  revision_note text,
  uploaded_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (registration_number, document_type)
);

create index if not exists participant_documents_registration_idx on public.participant_documents(registration_number);
grant select, insert, update on table public.participant_documents to service_role;
notify pgrst, 'reload schema';
