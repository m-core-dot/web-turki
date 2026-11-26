update public.staff
set role = 'Super Admin'
where name = 'M Galih Rakasiwi';

notify pgrst, 'reload schema';
