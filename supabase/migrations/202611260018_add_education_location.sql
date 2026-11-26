alter table public.participant_education
  add column if not exists school_city text,
  add column if not exists school_province text;

notify pgrst, 'reload schema';
