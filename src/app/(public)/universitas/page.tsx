import { MapPin, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { mockUniversities } from "@/lib/mock-data";

export default function PublicUniversitiesPage() {
  return <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><PageHeader title="Universitas Mitra" description="Temukan pilihan universitas dan program yang sesuai dengan rencana studimu." /><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{mockUniversities.filter((item) => item.status === "active").map((university) => <Card key={university.id} className="group transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-card"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-lg font-bold text-primary-700">{university.name.charAt(0)}</div><ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-primary-700" /></div><h2 className="mt-5 font-semibold text-foreground">{university.name}</h2><p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><MapPin className="h-4 w-4" />{university.city}, Turki</p><div className="mt-5 flex gap-2"><Badge variant="outline">{university.faculties} Fakultas</Badge><Badge variant="info">{university.intakes} Intake</Badge></div></Card>)}</div></div>;
}
