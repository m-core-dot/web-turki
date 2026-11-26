-- Promote the primary administrator and protect the account from deletion.
update public.staff
set role = 'Super Admin'
where lower(email) = 'muafihimam@mumtazacenter.com';

notify pgrst, 'reload schema';
