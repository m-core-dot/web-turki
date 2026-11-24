# Roadmap Tahapan Pengembangan MTAS

## Ringkasan tahapan

| Tahap | Fokus | Output utama |
|---|---|---|
| 0 | Persiapan & keputusan | scope MVP, akun layanan, repository |
| 1 | Setup project | Next.js berjalan lokal dan terhubung ke Git |
| 2 | Arsitektur & design system | struktur folder, tokens, komponen dasar |
| 3 | Database | schema final, migration, seed |
| 4 | Security | Auth, RBAC, RLS, audit |
| 5 | Registrasi publik | formulir pendaftaran dan review admin |
| 6 | Aktivasi akun | undangan aman dan login peserta |
| 7 | Portal peserta | dashboard, biodata, riwayat pendidikan |
| 8 | Dokumen | upload, versi, review, revisi |
| 9 | Master universitas | universitas, fakultas, jurusan, intake |
| 10 | Aplikasi universitas | pilihan intake/jurusan dan tracking |
| 11 | Keuangan | pembayaran manual dan verifikasi |
| 12 | Notifikasi | WhatsApp provider, queue, retry |
| 13 | Dashboard admin | satu dashboard dengan akses sesuai role |
| 14 | QA & hardening | automated tests, RLS tests, security review |
| 15 | Deployment | Vercel production dan monitoring |

## Tahap 0 — Persiapan
- [ ] Pastikan nama produk: MTAS — Mumtaza Turkey Admission System.
- [ ] Tentukan project Supabase: baru / kosong / sudah berisi data.
- [ ] Tentukan provider WhatsApp (belum ditetapkan).
- [ ] Buat repository Git privat.
- [ ] Siapkan environment development dan production terpisah.
- [ ] Tetapkan PIC dan alur persetujuan perubahan.

**Selesai jika:** seluruh akses layanan tersedia dan tidak ada credential yang dibagikan melalui chat atau repository.

## Tahap 1 — Setup project
- [ ] Buat Next.js App Router + TypeScript.
- [ ] Pasang Tailwind CSS, ESLint, Prettier, dan Supabase SSR client.
- [ ] Buat `.env.example`.
- [ ] Buat layout global dan halaman placeholder.
- [ ] Pastikan `npm run lint`, `npm run typecheck`, dan `npm run build` berjalan.

**Selesai jika:** aplikasi dapat berjalan lokal dan build tanpa error.

## Tahap 2 — Arsitektur & UI foundation
- [ ] Tetapkan struktur folder berdasarkan fitur.
- [ ] Buat design tokens dan komponen UI dasar.
- [ ] Buat responsive shell untuk public, student, dan admin.
- [ ] Buat komponen form, tabel, dialog, badge status, toast, skeleton.
- [ ] Uji keyboard navigation dan tampilan mobile.

**Selesai jika:** seluruh halaman menggunakan komponen konsisten, bukan styling ad hoc.

## Tahap 3 — Database
- [ ] Review seluruh tabel dan relasi.
- [ ] Finalisasi enum dan constraint.
- [ ] Tambahkan index yang relevan.
- [ ] Buat migration berurutan dan seed data development.
- [ ] Uji migration dari database kosong.

**Selesai jika:** migration dapat dijalankan ulang pada database development baru dan semua constraint teruji.

## Tahap 4 — Security
- [ ] Implementasikan Supabase Auth.
- [ ] Terapkan role dan permission.
- [ ] Tulis RLS untuk setiap tabel dan storage bucket.
- [ ] Batasi kolom sensitif melalui server-side update.
- [ ] Tambahkan audit trigger untuk aksi penting.
- [ ] Uji akses lintas role dan lintas peserta.

**Selesai jika:** peserta tidak dapat membaca atau mengubah data peserta lain dan tidak dapat mengubah status verifikasi sendiri.

## Tahap 5 — Registrasi publik
- [ ] Form pendaftaran biodata.
- [ ] Pilihan preferensi jurusan awal 3–5.
- [ ] Validasi client dan server.
- [ ] Rate limit, honeypot/CAPTCHA sesuai kebutuhan, dan pencegahan spam.
- [ ] Simpan sebagai pending review.
- [ ] Admin dapat menyetujui atau menolak dengan catatan.

**Selesai jika:** pendaftaran anonim hanya dapat dibuat melalui endpoint/RPC tervalidasi, bukan INSERT bebas ke tabel.

## Tahap 6 — Aktivasi akun
- [ ] Admin menyetujui registrasi.
- [ ] Server membuat/menautkan akun Auth secara aman.
- [ ] Kirim secure invite / link set password melalui kanal notifikasi.
- [ ] Peserta dapat login dan reset password.
- [ ] Registrasi ulang menggunakan akun peserta yang sama.

**Selesai jika:** tidak ada password plaintext yang dikirim atau disimpan aplikasi.

## Tahap 7 — Portal peserta
- [ ] Dashboard ringkasan.
- [ ] Biodata dan alamat.
- [ ] Riwayat pendidikan multi-record.
- [ ] Angkatan berdasarkan tahun registrasi.
- [ ] Status kelengkapan profil.

**Selesai jika:** peserta hanya dapat mengakses profil dan registrasi miliknya.

## Tahap 8 — Dokumen
Jenis dokumen: Foto, Paspor, KTP, Ijazah, Transkrip semester 1–6.
- [ ] Upload bertahap.
- [ ] Validasi ukuran, MIME, dan ekstensi.
- [ ] Simpan file di private bucket.
- [ ] Version history saat file diganti.
- [ ] Admin memberi status dan catatan revisi.
- [ ] Peserta tidak dapat mengubah status dokumen.

**Selesai jika:** file privat, versi lama terlacak, dan status hanya dapat diubah oleh petugas berwenang.

## Tahap 9 — Master universitas & intake
- [ ] CRUD universitas, fakultas, jurusan.
- [ ] Intake per universitas dengan tanggal buka/tutup sendiri.
- [ ] Admin mengatur jurusan yang tersedia per intake.
- [ ] Status efektif: override manual mengalahkan tanggal otomatis.
- [ ] Jangan tampilkan rincian biaya di pemilihan universitas/jurusan.

**Selesai jika:** periode setiap universitas berjalan independen dan status tampil konsisten.

## Tahap 10 — Aplikasi universitas
- [ ] Peserta memilih intake dan jurusan saat intake dibuka.
- [ ] Jurusan harus berasal dari intake universitas yang dipilih.
- [ ] Satu peserta dapat memiliki beberapa aplikasi independen.
- [ ] Riwayat status dan catatan admin.
- [ ] Nomor referensi resmi universitas hanya terlihat oleh admin berwenang.

**Selesai jika:** validasi relasi dilakukan server-side dan riwayat status tidak dapat diubah peserta.

## Tahap 11 — Keuangan
- [ ] Modul terpisah dari aplikasi universitas.
- [ ] Admin mencatat tagihan/pembayaran.
- [ ] Peserta mengunggah bukti jika diaktifkan.
- [ ] Verifikasi manual oleh role finance.
- [ ] Status unpaid, waiting_verification, verified, rejected, partial, cancelled.
- [ ] Audit semua perubahan nominal dan status.

**Selesai jika:** role non-finance tidak dapat memverifikasi pembayaran.

## Tahap 12 — Notifikasi WhatsApp
- [ ] Pilih provider dan simpan credential di server environment.
- [ ] Template pesan.
- [ ] Queue/outbox dan retry terukur.
- [ ] Log request, response, status, dan error provider.
- [ ] Notifikasi: akun aktif, revisi dokumen, dokumen disetujui, hasil seleksi.

**Selesai jika:** kegagalan provider tidak menggagalkan transaksi utama dan dapat di-retry.

## Tahap 13 — Dashboard admin
- [ ] Satu dashboard bersama.
- [ ] Menu dan aksi mengikuti permission.
- [ ] Ringkasan registrasi, dokumen, intake, aplikasi, keuangan.
- [ ] Filter, pencarian, pagination, export sesuai izin.
- [ ] Audit log untuk aksi penting.

**Selesai jika:** tidak ada role yang memperoleh akses hanya karena menyembunyikan menu di UI.

## Tahap 14 — QA & hardening
- [ ] Unit test fungsi bisnis.
- [ ] Integration test API/server actions.
- [ ] RLS test per role.
- [ ] E2E test alur registrasi sampai hasil.
- [ ] Uji upload file tidak valid.
- [ ] Uji rate limit, session, dan akses URL langsung.
- [ ] Backup dan recovery drill.

## Tahap 15 — Deployment
- [ ] Vercel Preview untuk development.
- [ ] Environment production terpisah.
- [ ] Set domain dan HTTPS.
- [ ] Set Supabase redirect URL.
- [ ] Jalankan migration production setelah backup dan review.
- [ ] Monitoring error dan log.
- [ ] Checklist rollback.

## Aturan status
Gunakan status `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `REVIEW`, `DONE`. Jangan tandai `DONE` hanya karena halaman sudah terlihat.
