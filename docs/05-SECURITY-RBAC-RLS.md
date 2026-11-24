# Security, RBAC, dan RLS

## Role
- `super_admin`: konfigurasi dan akses penuh.
- `admin_registration`: data peserta dan registrasi.
- `admin_documents`: pemeriksaan dokumen.
- `admin_university`: master universitas dan aplikasi.
- `finance`: pembayaran dan verifikasi.
- `student`: data dan proses miliknya sendiri.

Tidak ada role konsultan pada scope awal.

## Prinsip RBAC
- Permission diperiksa di server pada setiap operasi.
- UI boleh menyembunyikan menu, tetapi itu bukan kontrol keamanan.
- Hindari memberi semua staf akses baca/tulis ke semua domain.
- Terapkan least privilege.
- Role tidak boleh ditentukan dari metadata yang dapat diubah pengguna.

## RLS
Aktifkan RLS untuk seluruh tabel yang dapat diakses melalui Supabase client. Setiap tabel perlu policy SELECT/INSERT/UPDATE/DELETE yang eksplisit. Tinjau akses per role dan per kepemilikan record.

Contoh matriks akses tingkat tinggi:

| Domain | Student | Registration | Documents | University | Finance | Super admin |
|---|---|---|---|---|---|---|
| Profil sendiri | Read/update terbatas | Read | Read terbatas | Read terbatas | Read terbatas | Full |
| Registrasi | Read milik sendiri | Manage | Read perlu | Read perlu | Read perlu | Full |
| Dokumen | Upload/read sendiri | Read | Review/manage | Read sesuai kebutuhan | No | Full |
| Universitas | Read yang dipublikasikan | Read | Read | Manage | No | Full |
| Aplikasi | Read milik sendiri | Read | Read perlu | Manage | Read terbatas | Full |
| Pembayaran | Read milik sendiri | No | No | No | Manage | Full |

Sesuaikan matriks sebelum implementasi final.

## Kolom sensitif
Jangan izinkan peserta mengubah:
- status verifikasi,
- role,
- `is_active`,
- nomor referensi internal,
- status aplikasi,
- status pembayaran,
- current document version,
- audit log.

Gunakan server action/RPC khusus untuk perubahan tersebut.

## Storage
- Bucket dokumen dan bukti pembayaran harus private.
- Gunakan signed URL dengan masa berlaku singkat.
- Validasi ukuran, MIME, ekstensi, dan magic bytes di server bila memungkinkan.
- Jangan percaya `content-type` dari browser saja.
- Path file harus konsisten dengan pemilik dan record.
- Jangan izinkan peserta membaca file peserta lain.

## Audit log
Catat setidaknya:
- aktor,
- aksi,
- jenis dan ID record,
- waktu,
- nilai sebelum/sesudah untuk field penting,
- sumber aksi/request ID jika tersedia.

Audit log tidak boleh dapat diubah atau dihapus oleh pengguna biasa.

## Checklist security test
- [ ] Peserta A tidak dapat membaca data Peserta B.
- [ ] Peserta tidak dapat mengubah role sendiri.
- [ ] Peserta tidak dapat menyetujui dokumen sendiri.
- [ ] Admin dokumen tidak dapat memverifikasi pembayaran.
- [ ] Finance tidak dapat mengubah master universitas.
- [ ] Akses langsung ke API tetap ditolak jika tidak berizin.
- [ ] Service role tidak pernah masuk bundle browser.
