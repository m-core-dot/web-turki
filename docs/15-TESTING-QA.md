# Testing dan QA MTAS

## Jenis test
- Unit: helper, validator, status transition, perhitungan.
- Integration: server action, route handler, transaksi.
- RLS: akses berdasarkan user dan role.
- E2E: alur nyata dari browser.
- Visual/responsive: ukuran layar dan konsistensi komponen.

## Skenario kritis
### Registrasi
- Submit valid.
- Field wajib kosong.
- Preferensi kurang dari 3 atau lebih dari 5.
- Submit berulang.
- Spam/rate limit.
- Duplikasi data tanpa membocorkan informasi.

### Akun
- Peserta login.
- Reset password.
- Invite kedaluwarsa.
- Peserta lama membuat registrasi baru.
- User nonaktif ditolak.

### Dokumen
- Upload format valid.
- Upload file terlalu besar.
- MIME palsu.
- Replace file membuat versi baru.
- Peserta tidak bisa menyetujui dokumen.
- Peserta tidak bisa mengakses file orang lain.

### Intake dan aplikasi
- Intake upcoming/ open/ closed.
- Manual override mengalahkan tanggal.
- Jurusan tidak termasuk intake.
- Intake tertutup menolak submit.
- Aplikasi duplikat ditolak.
- Peserta tidak dapat mengubah status sendiri.

### Finance
- Finance dapat verifikasi.
- Student tidak dapat verifikasi.
- Nominal tidak valid ditolak.
- Perubahan setelah verified tercatat.

## Definition of Done
Sebuah fitur selesai jika:
- acceptance criteria terpenuhi,
- validasi server tersedia,
- permission dan RLS diuji,
- loading/error/empty state tersedia,
- responsive,
- tidak ada secret di client,
- lint/typecheck/build lulus,
- dokumentasi diperbarui.
