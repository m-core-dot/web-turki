# Master Universitas dan Intake

## Master data
- Universitas
- Fakultas
- Jurusan/program studi
- Intake/periode penerimaan
- Jurusan yang tersedia pada intake

## Aturan
- Setiap universitas memiliki periode pendaftaran sendiri.
- Admin mengelola tanggal buka dan tutup masing-masing intake.
- Status intake menggunakan mode hybrid: otomatis berdasarkan tanggal, dapat dioverride admin.
- Manual override selalu lebih diutamakan daripada tanggal.
- Peserta hanya dapat memilih universitas/jurusan ketika intake efektif berstatus `open`.
- Jurusan yang tampil harus berasal dari daftar `intake_majors` intake tersebut.
- Jangan tampilkan biaya kuliah, registrasi, bahasa, asrama, atau biaya lain pada layar pemilihan.

## Form admin intake
- Universitas
- Nama intake
- Tahun akademik
- Tanggal dan jam buka
- Tanggal dan jam tutup
- Status dasar
- Manual override (opsional)
- Catatan internal
- Daftar jurusan tersedia

## Tampilan peserta
Card/list universitas menampilkan:
- nama universitas,
- logo jika tersedia,
- kota/lokasi,
- periode pendaftaran,
- status intake,
- daftar jurusan yang dibuka,
- tombol lihat detail/pilih jurusan ketika open.

Jangan menampilkan status `open` jika periode sudah tutup kecuali override admin memang membuka kembali intake.
