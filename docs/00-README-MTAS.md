# MTAS — Mumtaza Turkey Admission System

Dokumentasi pengembangan MTAS menggunakan **Next.js + TypeScript + Tailwind CSS + Supabase + Vercel**. Folder ini dirancang untuk dibuka langsung di VS Code dan dipakai sebagai panduan kerja bertahap.

## Prinsip pengembangan
1. Kerjakan tahap secara berurutan; jangan membangun UI di atas skema database yang belum disepakati.
2. Setiap fitur harus memiliki validasi server-side, pemeriksaan akses, dan kondisi error/loading/empty.
3. Supabase RLS adalah lapisan keamanan tambahan, bukan pengganti validasi server.
4. Jangan pernah menaruh `SUPABASE_SERVICE_ROLE_KEY` di browser, repository, atau file `.env` yang dikomit.
5. Semua perubahan database dibuat sebagai migration SQL bernomor dan diuji pada project development.
6. Jangan menandai tahap selesai sebelum acceptance criteria terpenuhi.

## Struktur dokumentasi
- `01-ROADMAP-TAHAPAN.md` — urutan dan kriteria selesai setiap tahap.
- `02-SETUP-PROJECT-VSCODE.md` — setup lokal, Next.js, Supabase, dan Vercel.
- `03-ARSITEKTUR-SISTEM.md` — arsitektur aplikasi dan batas tanggung jawab.
- `04-DATABASE-DAN-MIGRATION.md` — rancangan database dan proses migration.
- `05-SECURITY-RBAC-RLS.md` — autentikasi, RBAC, RLS, dan audit.
- `06-ALUR-REGISTRASI.md` — registrasi publik dan persetujuan admin.
- `07-PORTAL-PESERTA.md` — biodata, pendidikan, dokumen, dan dashboard peserta.
- `08-MASTER-UNIVERSITAS-DAN-INTAKE.md` — universitas, jurusan, periode intake.
- `09-PENDAFTARAN-UNIVERSITAS.md` — aplikasi peserta ke universitas.
- `10-MODUL-KEUANGAN.md` — pencatatan pembayaran manual.
- `11-NOTIFIKASI-WHATSAPP.md` — antrean notifikasi dan integrasi provider.
- `12-DESAIN-UI-UX.md` — design system dan arahan visual.
- `13-STRUKTUR-HALAMAN-UI.md` — sitemap, layout, dan spesifikasi halaman.
- `14-API-SERVER-ACTIONS.md` — pola API/server actions.
- `15-TESTING-QA.md` — test plan dan acceptance criteria.
- `16-DEPLOYMENT-VERCEL.md` — deployment dan checklist rilis.
- `17-PROMPT-VIBE-CODING.md` — prompt kerja untuk AI coding assistant di VS Code.

## Status awal proyek
Dokumen ini adalah spesifikasi kerja. Migration SQL baseline yang pernah disiapkan sebelumnya **belum diuji pada project Supabase** dan tidak boleh dianggap siap produksi. Audit keamanan, validasi lintas tabel, RPC registrasi, aktivasi akun, audit trigger, dan pengujian RLS wajib diselesaikan sebelum peluncuran.

## Cara memakai
1. Buka folder proyek MTAS di VS Code.
2. Simpan dokumentasi ini di folder `docs/`.
3. Baca `01-ROADMAP-TAHAPAN.md`.
4. Selesaikan satu tahap, jalankan test, lalu update status checklist.
5. Gunakan `17-PROMPT-VIBE-CODING.md` sebagai instruksi dasar untuk AI coding assistant.
