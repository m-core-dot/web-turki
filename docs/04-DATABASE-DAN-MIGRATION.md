# Database dan Migration MTAS

## Domain tabel
### Identitas & akses
`profiles`, `roles`, `user_roles`, `role_permissions`.

### Pendaftaran
`admission_batches`, `students`, `student_addresses`, `student_education`, `registrations`, `registration_reviews`, `student_preferences`.

### Dokumen
`document_types`, `student_documents`, `document_versions`, `document_reviews`.

### Universitas
`universities`, `faculties`, `majors`, `university_intakes`, `intake_majors`.

### Aplikasi
`student_applications`, `application_status_history`.

### Keuangan
`payment_categories`, `payments`, `payment_proofs`, `payment_reviews`.

### Operasional
`notification_templates`, `notification_logs`, `audit_logs`, `system_settings`.

## Aturan data penting
- Angkatan berasal dari tahun registrasi, bukan tahun akademik universitas.
- Satu peserta dapat memiliki beberapa registrasi.
- Satu registrasi terhubung ke satu admission batch.
- Riwayat pendidikan berupa banyak record.
- Preferensi jurusan awal 3–5 pilihan.
- Setiap universitas mengelola intake secara independen.
- Satu peserta dapat memiliki banyak aplikasi universitas.
- Dokumen peserta dapat digunakan kembali lintas aplikasi.
- Nomor referensi universitas hanya terlihat oleh admin yang berwenang.
- Biaya tidak ditampilkan pada UI pemilihan universitas/jurusan.

## Migration workflow
1. Buat file bernomor, misalnya `202611240001_create_students.sql`.
2. Migration harus kecil, fokus, dan dapat direview.
3. Uji pada database development kosong.
4. Uji juga upgrade dari schema sebelumnya.
5. Catat perubahan breaking dan langkah rollback.
6. Jangan mengedit migration yang sudah diterapkan di environment bersama; buat migration baru.

## Validasi yang wajib dibuat
- Minimum 3 dan maksimum 5 preferensi saat submit registrasi.
- `intake_major` harus benar-benar milik intake yang dipilih.
- Intake harus sesuai batch/aturan eligibility registrasi.
- Peserta hanya dapat mengajukan aplikasi atas registrasinya sendiri.
- Aplikasi tidak boleh dibuat jika intake efektif tidak `open`.
- Hanya petugas berwenang dapat mengubah status dokumen/aplikasi.
- Status pembayaran hanya finance/admin berwenang yang dapat mengubahnya.

## Status intake efektif
Urutan prioritas:
1. Jika `manual_status_override` terisi, gunakan nilai override.
2. Jika status dasar `draft` atau `cancelled`, pertahankan.
3. Jika tanggal sekarang sebelum tanggal buka: `upcoming`.
4. Jika tanggal sekarang berada dalam periode buka: `open`.
5. Jika melewati tanggal tutup: `closed`.

Implementasikan sebagai view atau fungsi database yang konsisten; jangan mengandalkan status yang hanya diperbarui oleh browser.

## Catatan baseline SQL terdahulu
Paket migration baseline yang disiapkan sebelumnya belum dieksekusi dan belum diuji. Sebelum digunakan:
- review schema dan enum,
- perbaiki RLS per role,
- batasi update kolom sensitif,
- tambahkan RPC registrasi dan aktivasi akun,
- tambahkan validasi lintas tabel,
- tambahkan audit triggers,
- uji storage path dan versioning,
- uji migration dari database kosong.

## Backup
Sebelum migration production:
- pastikan backup tersedia,
- catat versi migration terakhir,
- jalankan pada staging,
- siapkan prosedur rollback atau forward-fix.
