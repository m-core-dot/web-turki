drop policy if exists "authenticated users can read staff" on public.staff;
drop policy if exists "authenticated users can insert staff" on public.staff;
drop policy if exists "authenticated users can update staff" on public.staff;
drop policy if exists "authenticated users can delete staff" on public.staff;

create policy "Staff can read own staff record"
  on public.staff for select
  to authenticated
  using (auth_user_id = auth.uid());
