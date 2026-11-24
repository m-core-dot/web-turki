# Struktur Halaman dan Spesifikasi UI MTAS

## Sitemap publik
```text
/
├── /tentang
├── /universitas
├── /alur-pendaftaran
├── /faq
├── /registrasi
├── /registrasi/berhasil
└── /login
```

## Sitemap peserta
```text
/portal
├── /portal/biodata
├── /portal/pendidikan
├── /portal/dokumen
├── /portal/universitas
│   └── /portal/universitas/[intakeId]
├── /portal/aplikasi
│   └── /portal/aplikasi/[applicationId]
├── /portal/pembayaran
└── /portal/pengaturan
```

## Sitemap admin
```text
/admin
├── /admin/registrasi
│   └── /admin/registrasi/[registrationId]
├── /admin/peserta
│   └── /admin/peserta/[studentId]
├── /admin/dokumen
├── /admin/universitas
├── /admin/fakultas
├── /admin/jurusan
├── /admin/intake
├── /admin/aplikasi
├── /admin/keuangan
├── /admin/notifikasi
├── /admin/audit-log
└── /admin/pengaturan
```

## Halaman publik
### Landing page
- Hero dengan CTA registrasi.
- Penjelasan alur layanan.
- Keunggulan pendampingan.
- Ringkasan proses.
- FAQ dan footer.

### Registrasi
- Step 1: identitas.
- Step 2: kontak dan alamat.
- Step 3: pendidikan.
- Step 4: preferensi jurusan (3–5).
- Step 5: review dan submit.
- Indikator langkah dan ringkasan data.

## Portal peserta
### Dashboard
- Welcome panel.
- Progress kelengkapan.
- Checklist dokumen.
- Aplikasi aktif.
- Pengumuman/notifikasi.

### Biodata
- Form terkelompok: identitas, keluarga, kontak, alamat.
- Tombol simpan.
- Status review jika field perlu persetujuan.

### Dokumen
- Kartu per jenis dokumen.
- Status dan catatan revisi.
- Upload/replace.
- Riwayat versi yang dapat dilihat sesuai kebijakan.

### Universitas
- List intake yang upcoming/open/closed.
- Filter lokasi/program jika relevan.
- Detail intake dan jurusan yang tersedia.
- Tidak ada rincian biaya pada pemilihan.

### Aplikasi
- Timeline status.
- Detail jurusan dan universitas.
- Instruksi berikutnya.
- Nomor referensi internal tidak ditampilkan.

## Dashboard admin
### Overview
- Total registrasi masuk.
- Perlu review.
- Dokumen perlu diperiksa.
- Aplikasi berjalan.
- Pembayaran menunggu verifikasi (hanya role berwenang).
- Aktivitas terbaru sesuai permission.

### List page
Gunakan pola konsisten:
1. Page title dan deskripsi.
2. Primary action sesuai permission.
3. Search.
4. Filter.
5. Table/list.
6. Pagination.
7. Empty/error/loading state.

### Detail peserta
- Header identitas dan status.
- Tab: Ringkasan, Biodata, Pendidikan, Dokumen, Registrasi, Aplikasi, Pembayaran (berdasarkan permission).
- Catatan internal dipisahkan dari informasi peserta.
- Mask NIK/paspor di tampilan umum.

## Layout rules
- Public layout tidak menampilkan sidebar.
- Student layout hanya menampilkan menu peserta.
- Admin layout menampilkan menu sesuai permission.
- Route protection wajib di server; middleware/layout UI bukan satu-satunya kontrol.
