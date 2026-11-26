update public.staff
set department = 'Director', role = 'Super Admin'
where lower(email) = 'muafihimam@mumtazacenter.com';

notify pgrst, 'reload schema';
