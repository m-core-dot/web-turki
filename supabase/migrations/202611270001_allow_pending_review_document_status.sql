alter table public.participant_documents
drop constraint if exists participant_documents_status_check;

alter table public.participant_documents
add constraint participant_documents_status_check
check (status in ('approved', 'pending_review', 'revision', 'rejected', 'not_uploaded'));

notify pgrst, 'reload schema';
