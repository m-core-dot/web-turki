import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { fetchIntakes } from "@/app/(admin)/admin/intake/actions";
import { UniversityChoiceList } from "./university-choice-list";

async function UniversityChoicesContent() {
  const result = await fetchIntakes();
  const intakes = result.ok ? result.data.filter((intake) => intake.status !== "cancelled") : [];
  return <div className="space-y-6"><PageHeader title="Pilihan Universitas" description="Pilih intake dan jurusan yang sesuai dengan rencana studimu." />{!result.ok && <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700">Data universitas belum dapat dimuat.</p>}<UniversityChoiceList intakes={intakes} /></div>;
}

export default function StudentUniversitasPage() {
  return <Suspense fallback={<div className="space-y-6"><PageHeader title="Pilihan Universitas" description="Memuat pilihan universitas..." /><div className="grid gap-5 md:grid-cols-2"><Card><div className="h-40 animate-pulse rounded-lg bg-background-alt" /></Card><Card><div className="h-40 animate-pulse rounded-lg bg-background-alt" /></Card></div></div>}><UniversityChoicesContent /></Suspense>;
}
