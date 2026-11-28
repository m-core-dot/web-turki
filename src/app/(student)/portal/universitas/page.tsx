import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { fetchIntakes, type IntakeRow } from "@/app/(admin)/admin/intake/actions";

const statusLabels: Record<IntakeRow["status"], string> = { open: "Dibuka", upcoming: "Akan Dibuka", closed: "Ditutup", draft: "Akan diumumkan", cancelled: "Dibatalkan" };
const formatDate = (value: string) => value ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "Akan diumumkan";

async function UniversityChoicesContent() {
  const result = await fetchIntakes();
  const intakes = result.ok ? result.data.filter((intake) => intake.status !== "closed" && intake.status !== "cancelled") : [];
  const openCount = intakes.filter((intake) => intake.status === "open").length;
  return <div className="space-y-6"><PageHeader title="Pilihan Universitas" description="Pilih intake dan jurusan yang sesuai dengan rencana studimu." />{!result.ok && <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700">Data universitas belum dapat dimuat.</p>}<div className="flex flex-wrap gap-2"><Badge variant="success" dot>{openCount} intake dibuka</Badge><Badge variant="info">{intakes.length} intake tersedia</Badge></div>{intakes.length === 0 ? <Card><p className="py-8 text-center text-sm text-muted">Belum ada intake yang tersedia.</p></Card> : <div className="grid gap-5 md:grid-cols-2">{intakes.map((intake) => <Card key={intake.id} className="group"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50"><GraduationCap className="h-5 w-5 text-primary-700" /></div><Badge variant={intake.status === "open" ? "success" : "info"} dot>{statusLabels[intake.status]}</Badge></div><h2 className="mt-5 font-semibold">{intake.university}</h2><p className="mt-1 text-sm text-muted">{intake.name}</p><div className="mt-5 space-y-2 text-xs text-muted"><p className="flex gap-2"><CalendarDays className="h-4 w-4" />{formatDate(intake.openDate)} – {formatDate(intake.closeDate)}</p><p className="flex gap-2"><MapPin className="h-4 w-4" />Turki · {intake.majors} jurusan tersedia</p></div>{intake.status === "open" && <Link href={`/portal/universitas/${intake.id}`} className="mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-700 text-sm font-medium text-white hover:bg-primary-800">Lihat Jurusan <ArrowRight className="h-4 w-4" /></Link>}</Card>)}</div>}</div>;
}

export default function StudentUniversitasPage() {
  return <Suspense fallback={<div className="space-y-6"><PageHeader title="Pilihan Universitas" description="Memuat pilihan universitas..." /><div className="grid gap-5 md:grid-cols-2"><Card><div className="h-40 animate-pulse rounded-lg bg-background-alt" /></Card><Card><div className="h-40 animate-pulse rounded-lg bg-background-alt" /></Card></div></div>}><UniversityChoicesContent /></Suspense>;
}
