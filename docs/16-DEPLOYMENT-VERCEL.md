# Deployment Vercel dan Operasional

## Environment terpisah
Minimal:
- Local development
- Preview/staging
- Production

Gunakan Supabase project terpisah untuk staging dan production jika memungkinkan.

## Vercel
1. Hubungkan repository Git.
2. Pilih framework Next.js.
3. Tambahkan environment variables sesuai environment.
4. Pastikan secret hanya tersedia pada server.
5. Deploy Preview terlebih dahulu.
6. Uji login, redirect, upload, dan seluruh alur kritis.
7. Deploy production setelah approval.

## Supabase Auth
- Tambahkan site URL production.
- Tambahkan redirect URL untuk local dan preview yang diperlukan.
- Periksa email templates.
- Periksa kebijakan password dan session.

## Database
- Jalankan migration melalui workflow yang dikontrol.
- Backup sebelum perubahan production.
- Jangan menjalankan migration eksperimental langsung di production.
- Simpan catatan versi migration.

## Checklist rilis
- [ ] Build production sukses.
- [ ] Environment variables benar.
- [ ] RLS aktif dan telah diuji.
- [ ] Bucket privat.
- [ ] Auth redirect benar.
- [ ] Domain dan HTTPS aktif.
- [ ] Error monitoring tersedia.
- [ ] Backup terverifikasi.
- [ ] Prosedur rollback/forward-fix disiapkan.
