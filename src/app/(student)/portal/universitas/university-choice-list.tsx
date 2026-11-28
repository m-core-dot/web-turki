"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, GraduationCap, MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IntakeRow } from "@/app/(admin)/admin/intake/actions";

const statusLabels: Record<IntakeRow["status"], string> = { open: "Dibuka", upcoming: "Akan Dibuka", closed: "Ditutup", draft: "Akan diumumkan", cancelled: "Dibatalkan" };
const formatDate = (value: string) => value ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "Akan diumumkan";

type Filter = "all" | "open" | "closed";

export function UniversityChoiceList({ intakes }: { intakes: IntakeRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const filteredIntakes = useMemo(() => intakes.filter((intake) => {
    const matchesFilter = filter === "all" || (filter === "open" ? intake.status === "open" : intake.status === "closed");
    const query = search.trim().toLocaleLowerCase();
    return matchesFilter && (!query || `${intake.university} ${intake.city} ${intake.name}`.toLocaleLowerCase().includes(query));
  }), [filter, intakes, search]);
  const openCount = intakes.filter((intake) => intake.status === "open").length;
  const closedCount = intakes.filter((intake) => intake.status === "closed").length;
  const filters: Array<{ value: Filter; label: string; count: number }> = [{ value: "all", label: "Semua intake", count: intakes.length }, { value: "open", label: "Intake dibuka", count: openCount }, { value: "closed", label: "Intake ditutup", count: closedCount }];

  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari universitas atau kota..." className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" /></div><div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${filter === item.value ? "border-primary-200 bg-primary-50 text-primary-700" : "border-border bg-white text-muted hover:bg-background-alt"}`}>{item.label} <span className="ml-1 tabular-nums">{item.count}</span></button>)}</div></div>{filteredIntakes.length === 0 ? <Card><p className="py-8 text-center text-sm text-muted">Tidak ada universitas yang sesuai.</p></Card> : <div className="grid gap-5 md:grid-cols-2">{filteredIntakes.map((intake) => <Card key={intake.id} className="group"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50"><GraduationCap className="h-5 w-5 text-primary-700" /></div><Badge variant={intake.status === "open" ? "success" : intake.status === "closed" ? "default" : "info"} dot>{statusLabels[intake.status]}</Badge></div><h2 className="mt-5 font-semibold">{intake.university}</h2><p className="mt-1 text-sm text-muted">{intake.isPrimary ? "Primer" : intake.name}</p><div className="mt-5 space-y-2 text-xs text-muted"><p className="flex gap-2"><CalendarDays className="h-4 w-4" />{formatDate(intake.openDate)} – {formatDate(intake.closeDate)}</p><p className="flex gap-2"><CalendarDays className="h-4 w-4" />Pengumuman: {intake.announcement || "Akan diumumkan"}</p><p className="flex gap-2"><MapPin className="h-4 w-4" />{intake.city}, Turki · {intake.majors} jurusan tersedia</p></div>{intake.status === "open" && <Link href={`/portal/universitas/${intake.id}`} className="mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-700 text-sm font-medium text-white hover:bg-primary-800">Lihat Jurusan <ArrowRight className="h-4 w-4" /></Link>}</Card>)}</div>}</div>;
}
