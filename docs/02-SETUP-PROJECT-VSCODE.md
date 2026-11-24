# Setup Project MTAS di VS Code

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase: PostgreSQL, Auth, Storage
- Vercel
- Zod untuk validasi
- React Hook Form untuk form kompleks (opsional)
- Vitest/Jest dan Playwright untuk testing

## Prasyarat
Install Node.js versi LTS, Git, VS Code, dan package manager npm. Pastikan terminal VS Code dapat menjalankan `node -v`, `npm -v`, dan `git --version`.

## Membuat aplikasi
```bash
npx create-next-app@latest mtas --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd mtas
npm install @supabase/supabase-js @supabase/ssr zod lucide-react
npm install -D prettier prettier-plugin-tailwindcss
```

Jika project sudah dibuat, jangan jalankan `create-next-app` lagi. Sesuaikan dependency dengan `package.json` yang ada.

## Environment
Buat `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Buat `.env.example` dengan key kosong dan commit file tersebut. Jangan commit `.env.local`.

**Penting:** `SUPABASE_SERVICE_ROLE_KEY` hanya boleh digunakan di server-only module. Jangan gunakan prefix `NEXT_PUBLIC_` untuk secret. Jangan kirim key atau password ke chat.

## Scripts yang disarankan
Tambahkan script sesuai dependency yang dipasang:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

## Struktur folder awal
```text
src/
  app/
    (public)/
      page.tsx
      registrasi/
      login/
    (student)/
      portal/
    (admin)/
      admin/
    api/
  components/
    ui/
    layout/
    forms/
    data-table/
  features/
    auth/
    registration/
    students/
    documents/
    universities/
    applications/
    finance/
    notifications/
  lib/
    supabase/
    validations/
    permissions/
    utils/
  types/
  styles/
docs/
supabase/
  migrations/
  seed/
```

## Supabase client
Pisahkan client browser, server, dan admin/service role. Ikuti pola resmi `@supabase/ssr` untuk Next.js. Jangan membuat satu singleton service-role client yang dapat ter-import oleh komponen client.

## Git workflow
- `main`: production.
- `develop`: integrasi (opsional).
- `feature/nama-fitur`: pekerjaan fitur.
- Setiap perubahan schema harus menyertakan migration.
- Gunakan pull request atau minimal review diff sebelum merge.

## Pemeriksaan lokal
```bash
npm run lint
npm run typecheck
npm run build
```

## Checklist
- [ ] Aplikasi jalan di `localhost:3000`.
- [ ] `.env.local` tidak terlacak Git.
- [ ] `.env.example` tersedia.
- [ ] Secret hanya di server.
- [ ] Build sukses.
