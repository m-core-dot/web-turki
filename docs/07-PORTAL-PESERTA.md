# Portal Peserta

## Navigasi
- Dashboard
- Biodata
- Riwayat Pendidikan
- Dokumen
- Pilihan Universitas
- Status Pendaftaran
- Pembayaran (jika diaktifkan)
- Pengaturan Akun

## Dashboard peserta
Tampilkan:
- sapaan dan nama peserta,
- angkatan/registrasi aktif,
- progress kelengkapan profil,
- ringkasan status dokumen,
- ringkasan aplikasi universitas,
- notifikasi penting,
- tindakan berikutnya yang perlu dilakukan.

Jangan membuat angka progress yang menyesatkan. Definisikan rumus progress secara eksplisit.

## Biodata
Field mengikuti dokumen `06-ALUR-REGISTRASI.md`. Peserta dapat memperbarui field yang diizinkan. Perubahan field sensitif dapat memerlukan review admin.

## Riwayat pendidikan
Gunakan daftar record, bukan satu field sekolah saja. Field minimum:
- jenjang,
- nama institusi,
- jurusan/program,
- kota/kabupaten,
- provinsi,
- tahun mulai,
- tahun selesai,
- status pendidikan,
- penanda pendidikan terakhir.

## Registrasi ulang
- Gunakan akun yang sama.
- Peserta membuat registrasi baru untuk tahun/angkatan baru.
- Data profil dan dokumen yang masih relevan dapat digunakan kembali.
- Riwayat registrasi lama tetap tersimpan dan tidak ditimpa.

## States UI
Setiap halaman harus punya:
- loading/skeleton,
- empty state,
- error state dengan aksi coba lagi,
- success feedback,
- disabled state saat submit,
- validasi field yang jelas.
