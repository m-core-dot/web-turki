# Modul Keuangan

## Prinsip
Modul keuangan dipisahkan dari modul pemilihan universitas. Informasi biaya tidak ditampilkan dalam layar pemilihan universitas/jurusan.

## Fitur
- Kategori pembayaran.
- Tagihan/pencatatan pembayaran.
- Unggah bukti pembayaran (bila diperlukan).
- Verifikasi manual.
- Riwayat pembayaran dan catatan.
- Filter berdasarkan peserta, angkatan, kategori, dan status.

## Status
- `unpaid`
- `waiting_verification`
- `verified`
- `rejected`
- `partial`
- `cancelled`

## Hak akses
- Finance dapat mencatat dan memverifikasi pembayaran.
- Peserta hanya dapat melihat pembayaran miliknya dan mengunggah bukti jika fitur diaktifkan.
- Admin lain hanya mendapat akses baca minimum jika dibutuhkan.
- Semua perubahan nominal dan status harus diaudit.

## Validasi
- Nominal harus positif.
- Mata uang eksplisit.
- Bukti pembayaran disimpan di private bucket.
- Verifikasi tidak boleh dilakukan oleh peserta.
- Jangan mengubah nominal pembayaran yang telah diverifikasi tanpa proses koreksi yang tercatat.
