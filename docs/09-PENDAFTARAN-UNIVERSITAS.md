# Aplikasi Peserta ke Universitas

## Konsep
Satu peserta dapat mengirim beberapa aplikasi universitas. Setiap aplikasi memiliki status, jurusan, intake, dan riwayat sendiri.

## Status aplikasi
- `selected`
- `document_review`
- `document_complete`
- `submitted_to_university`
- `result_pending`
- `accepted`
- `rejected`
- `withdrawn`
- `on_hold`

## Alur umum
1. Peserta membuka intake yang aktif.
2. Peserta memilih jurusan yang tersedia pada intake.
3. Server memeriksa kepemilikan registrasi dan status intake.
4. Server memeriksa kelengkapan dokumen sesuai kebutuhan.
5. Aplikasi dibuat dan status awal dicatat.
6. Admin memperbarui status melalui workflow yang diizinkan.
7. Semua perubahan masuk ke `application_status_history`.

## Data internal
Admin yang berwenang dapat mencatat nomor referensi aplikasi dari universitas. Nomor tersebut tidak ditampilkan kepada peserta.

## Validasi server
- Registrasi milik peserta yang sedang login.
- Intake efektif harus open pada saat submit.
- Jurusan harus terhubung ke intake.
- Tidak boleh ada duplikasi aplikasi aktif untuk kombinasi yang sama.
- Transisi status harus mengikuti aturan.
- Peserta tidak dapat mengubah status aplikasi melalui payload.

## Tampilan peserta
Tampilkan universitas, jurusan, tanggal pengajuan, status terkini, timeline status, dan instruksi berikutnya. Sembunyikan catatan internal dan nomor referensi universitas.
