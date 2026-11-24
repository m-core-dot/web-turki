# API dan Server Actions

## Prinsip
Gunakan server actions atau route handlers untuk operasi yang membutuhkan secret, validasi kompleks, transaksi, atau integrasi pihak ketiga. Semua operasi harus memeriksa session dan permission di server.

## Pola fungsi
```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string[]> } };
```

Setiap action:
1. parse input dengan schema Zod,
2. ambil user session dari server,
3. periksa permission,
4. jalankan operasi database,
5. tulis audit/event jika relevan,
6. kembalikan response aman tanpa data sensitif.

## Contoh kelompok endpoint
| Method/Action | Tujuan | Akses |
|---|---|---|
| `submitPublicRegistration` | Submit pendaftaran publik | Anonymous + rate limit |
| `reviewRegistration` | Setujui/tolak registrasi | admin_registration |
| `activateStudentAccount` | Buat/tautkan akun | Server-only, authorized admin |
| `updateStudentProfile` | Update biodata | Student sendiri / admin |
| `uploadDocumentVersion` | Tambah versi dokumen | Student pemilik |
| `reviewDocument` | Review/revisi dokumen | admin_documents |
| `createStudentApplication` | Ajukan jurusan | Student pemilik + intake open |
| `updateApplicationStatus` | Update status aplikasi | admin_university |
| `verifyPayment` | Verifikasi pembayaran | finance |
| `enqueueNotification` | Buat event notifikasi | Server-only |

## Error handling
- Gunakan kode error stabil.
- Jangan mengembalikan stack trace ke browser.
- Log error teknis di server.
- Beri pesan yang dapat ditindaklanjuti.
- Hindari membocorkan keberadaan NIK/email/nomor paspor dalam endpoint publik.

## Idempotency
Operasi yang dapat diulang (registrasi, pembayaran, notifikasi) harus mempertimbangkan idempotency key atau unique constraint agar retry tidak membuat duplikat.
