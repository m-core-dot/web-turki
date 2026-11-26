alter table public.participant_education
  drop constraint if exists participant_education_level_check;

alter table public.participant_education
  add constraint participant_education_level_check
  check (education_level in (
    'SMA/MA dan SMK/MAK (sederajat)',
    'Sarjana (S1)',
    'Magister (S2)',
    'Doktor (S3)'
  ));

notify pgrst, 'reload schema';
