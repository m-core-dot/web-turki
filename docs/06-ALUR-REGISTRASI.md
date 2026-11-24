# Alur Registrasi Publik

## Tujuan
Calon peserta dapat mengirim pendaftaran awal tanpa akun. Admin memeriksa pendaftaran sebelum akun peserta diaktifkan.

## Form data awal
- Nama lengkap sesuai paspor.
- Tempat lahir sesuai paspor.
- Tanggal lahir.
- Jenis kelamin.
- Nama ayah dan ibu.
- Nomor paspor.
- NIK.
- Nomor WhatsApp.
- Username Telegram.
- Email aktif.
- Nomor telepon orang tua.
- Alamat lengkap.
- Desa/kelurahan, RT, RW, kecamatan, kabupaten/kota, provinsi, kode pos.
- Sekolah asal (bukan nama pesantren), kabupaten/kota, provinsi, jurusan.
- 3–5 preferensi jurusan awal.

## Alur
```text
Calon peserta
   |
   v
Isi formulir registrasi
   |
   v
Validasi client + server
   |
   v
Simpan sebagai pending
   |
   v
Admin Registration review
   |
   +--> Perlu perbaikan --> calon peserta memperbaiki melalui mekanisme aman
   |
   +--> Ditolak
   |
   +--> Disetujui
           |
           v
      Buat/tautkan akun Auth
           |
           v
      Kirim secure activation link
```

## Validasi
- Email harus valid.
- Nomor telepon dinormalisasi ke format internasional.
- NIK dan paspor divalidasi format dasar dan uniqueness.
- Preferensi harus 3–5.
- Field wajib tidak boleh kosong.
- Hindari menampilkan error yang membocorkan apakah NIK/paspor tertentu sudah terdaftar kepada publik.
- Tambahkan rate limit dan perlindungan spam.

## Keamanan endpoint
Jangan memberi akses anon INSERT langsung ke tabel inti. Gunakan route handler atau RPC yang:
1. memvalidasi payload,
2. memeriksa rate limit,
3. membersihkan input,
4. memeriksa duplikasi dengan respons yang tidak membocorkan data,
5. menyimpan data dalam transaksi,
6. menulis audit/event log.

## Hasil ke pengguna
Setelah submit, tampilkan nomor registrasi dan pesan bahwa data sedang diverifikasi. Jangan menyatakan diterima sebelum admin menyetujui.
