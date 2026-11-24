# Desain UI/UX MTAS

## Arah visual
MTAS adalah sistem administrasi pendidikan yang modern, tepercaya, rapi, dan mudah dipakai. UI harus terasa profesional dan ringan, bukan seperti template dashboard generik yang terlalu padat.

## Prinsip desain
- **Clarity first:** hierarki informasi jelas.
- **Calm interface:** warna aksen digunakan seperlunya.
- **Consistent:** komponen, spacing, radius, dan status seragam.
- **Responsive:** mobile-first untuk peserta; desktop-first untuk dashboard admin, tetap usable di tablet.
- **Accessible:** kontras teks cukup, fokus keyboard terlihat, label form jelas.
- **Actionable:** setiap status menjelaskan tindakan selanjutnya.

## Palet warna awal
Palet ini adalah baseline dan dapat disesuaikan setelah review brand:
- Primary: `#0F766E` — teal tua untuk aksi utama.
- Primary hover: `#115E59`.
- Accent: `#EAB308` — aksen emas untuk highlight terbatas.
- Background: `#F8FAFC`.
- Surface: `#FFFFFF`.
- Text: `#0F172A`.
- Muted text: `#64748B`.
- Border: `#E2E8F0`.
- Success: `#15803D`.
- Warning: `#B45309`.
- Danger: `#B91C1C`.
- Info: `#0369A1`.

Jangan memakai warna status sebagai dekorasi. Warna harus selalu disertai label teks.

## Typography
- Gunakan font sans-serif modern seperti Geist atau Inter.
- Heading tegas, body mudah dibaca.
- Hindari ukuran teks terlalu kecil; tabel admin tetap terbaca.
- Gunakan angka tabular untuk nomor, tanggal, dan nominal.

## Spacing dan bentuk
- Skala spacing berbasis 4/8 px.
- Radius card: 12–16 px.
- Input/button: 10–12 px.
- Shadow lembut, hanya untuk elevasi.
- Konten utama maksimal sekitar 1280 px pada desktop.

## Komponen wajib
- Button: primary, secondary, outline, destructive, ghost.
- Input, textarea, select, date picker.
- Form field dengan label, helper text, error.
- Badge status.
- Card dan stat card.
- Data table dengan search, filter, pagination.
- Tabs.
- Modal/dialog dan confirmation dialog.
- Dropdown menu.
- Toast/alert.
- Skeleton.
- Empty state.
- File upload dropzone.
- Timeline status.
- Breadcrumb.
- Sidebar dan mobile navigation.

## Pola layout
### Public
Header sederhana, konten fokus, footer ringkas. Form registrasi dibagi beberapa langkah agar tidak melelahkan.

### Student portal
Sidebar pada desktop; bottom navigation atau drawer pada mobile. Header berisi identitas dan notifikasi. Dashboard menonjolkan progress dan tindakan berikutnya.

### Admin
Sidebar tetap, topbar dengan pencarian/akun, area konten lebar. Gunakan tabel untuk data padat, detail drawer atau halaman detail untuk tindakan lanjutan.

## Form UX
- Kelompokkan field berdasarkan topik.
- Tampilkan required/optional dengan jelas.
- Simpan draft jika sesuai.
- Jangan menghapus input saat validasi gagal.
- Error harus menyebut field dan cara memperbaiki.
- Konfirmasi sebelum tindakan destruktif.
- Tampilkan loading pada tombol saat submit.

## Tabel UX
- Search dan filter tidak boleh menghilangkan konteks.
- Pagination server-side untuk dataset besar.
- Kolom penting tetap terlihat pada layar kecil atau gunakan card view.
- Aksi sensitif memerlukan konfirmasi.
- Jangan menampilkan NIK/paspor lengkap di daftar; mask data sensitif.

## Status visual
Gunakan label konsisten:
- Menunggu review
- Perlu revisi
- Disetujui
- Ditolak
- Sedang diproses
- Selesai

## Responsive breakpoints
Ikuti breakpoint Tailwind standar. Uji minimal 360px, 768px, 1024px, dan 1440px. Jangan membuat horizontal overflow pada form dan dashboard.

## Do / Don't
**Do**
- Gunakan whitespace.
- Buat primary action mudah ditemukan.
- Tampilkan empty state yang memberi arahan.
- Mask data sensitif di list.
- Gunakan ikon konsisten.

**Don't**
- Jangan memenuhi dashboard dengan terlalu banyak grafik.
- Jangan menggunakan banyak warna gradient.
- Jangan menampilkan biaya di pemilihan universitas.
- Jangan mengandalkan warna saja untuk status.
- Jangan membuat semua tabel tampil penuh di mobile.
