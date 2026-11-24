# Notifikasi WhatsApp

## Status
Provider WhatsApp belum ditentukan. Buat adapter provider agar implementasi tidak mengikat seluruh sistem ke satu vendor.

## Event notifikasi
1. Registrasi disetujui / aktivasi akun.
2. Dokumen perlu revisi.
3. Dokumen disetujui.
4. Hasil seleksi universitas.

## Arsitektur
Gunakan pola outbox:
1. Transaksi bisnis menyimpan perubahan dan event notifikasi.
2. Worker membaca event pending.
3. Worker mengirim melalui adapter provider.
4. Simpan response dan status.
5. Retry dengan backoff untuk kegagalan sementara.
6. Hindari mengirim duplikat dengan idempotency key.

## Status log
Contoh: `queued`, `processing`, `sent`, `failed`, `retrying`, `cancelled`.

## Keamanan
- API key provider hanya di server environment.
- Redaksi data sensitif pada log.
- Jangan mengirim password plaintext.
- Untuk aktivasi akun, kirim secure invite atau link set-password dengan masa berlaku.
- Batasi isi pesan pada informasi yang diperlukan.

## Operasional
- Simpan template pesan dan versi.
- Catat provider message ID.
- Simpan waktu pengiriman dan error.
- Sediakan mekanisme retry terbatas dan manual requeue untuk petugas berwenang.
