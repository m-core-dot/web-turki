"use client";

import { PageError } from "@/components/shared/state-views";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError title="Halaman belum siap ditampilkan" description="Terjadi kendala saat memuat halaman. Silakan coba lagi." reset={reset} />;
}
