"use client";

import { PageError } from "@/components/shared/state-views";

export default function StudentError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError title="Portal peserta tidak dapat dimuat" description="Kami belum dapat menampilkan data portalmu. Coba muat ulang halaman." reset={reset} />;
}
