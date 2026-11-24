# Arsitektur Sistem MTAS

## Gambaran umum
```text
Browser
  |
  v
Next.js UI (App Router)
  |
  +--> Server Components / Server Actions / Route Handlers
          |
          +--> Auth & permission checks
          |
          +--> Supabase PostgreSQL (RLS)
          |
          +--> Supabase Storage (private buckets)
          |
          +--> Notification outbox / worker
                    |
                    +--> WhatsApp Provider
  |
  v
Vercel Hosting
```

## Batas tanggung jawab
- **UI:** menampilkan data, mengumpulkan input, memberi feedback.
- **Server layer:** autentikasi, validasi, otorisasi, transaksi, dan integrasi provider.
- **Database:** integritas relasi, constraint, RLS, audit.
- **Storage:** file privat dengan metadata dan policy.
- **Notification worker:** mengirim notifikasi secara terpisah dari request utama.

## Entitas inti
- `profiles`: identitas akun Auth.
- `students`: data induk peserta.
- `registrations`: pendaftaran per angkatan.
- `admission_batches`: kelompok berdasarkan tahun registrasi.
- `student_education`: riwayat pendidikan jamak.
- `student_documents` dan `document_versions`: dokumen dan versi.
- `universities`, `faculties`, `majors`, `university_intakes`, `intake_majors`.
- `student_applications`: aplikasi peserta ke intake/jurusan.
- `payments`: transaksi keuangan.
- `audit_logs`: jejak perubahan.
- `notification_logs`: riwayat pengiriman.

## Pemisahan peserta, akun, dan registrasi
Satu orang peserta dapat memiliki satu akun dan banyak registrasi lintas tahun. Data peserta tidak harus langsung memiliki akun saat pendaftaran publik. `students.auth_user_id` dapat kosong sampai registrasi disetujui dan akun diaktifkan. Registrasi baru menggunakan akun yang sama jika peserta kembali mendaftar.

## Alur data
1. Pendaftar mengirim formulir melalui endpoint publik tervalidasi.
2. Server menyimpan calon peserta dan registrasi berstatus menunggu.
3. Admin memeriksa data.
4. Setelah disetujui, server mengundang peserta membuat password.
5. Peserta melengkapi profil dan dokumen.
6. Saat intake dibuka, peserta membuat aplikasi universitas.
7. Admin memperbarui status aplikasi.
8. Modul finance mengelola transaksi secara terpisah.

## Prinsip implementasi
- Gunakan UUID sebagai primary key.
- Gunakan foreign key dan unique constraint.
- Simpan waktu dalam `timestamptz`.
- Gunakan transaksi untuk operasi multi-tabel.
- Jangan percaya `user_id`, role, status, atau nominal yang dikirim browser.
- Semua perubahan status penting dicatat.
