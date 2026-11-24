"use client";

import { PageError } from "@/components/shared/state-views";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError title="Dashboard admin tidak dapat dimuat" description="Data operasional belum bisa ditampilkan. Coba muat ulang halaman." reset={reset} />;
}
