import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { mockApplications } from "@/lib/mock-data";

export default function StudentAplikasiPage() { return <div className="space-y-6"><PageHeader title="Aplikasi Saya" description="Pantau status aplikasi universitas yang kamu ajukan." /><div className="space-y-4">{mockApplications.slice(0, 3).map((app) => <Card key={app.id}><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50"><GraduationCap className="h-5 w-5 text-primary-700" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{app.university}</h2><StatusBadge status={app.status} /></div><p className="mt-1 text-sm text-muted">{app.major} · {app.id}</p><p className="mt-2 text-xs text-muted">Dikirim pada {app.submittedAt}</p></div><Link href={`/portal/aplikasi/${app.id}`} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-background-alt">Detail <ArrowRight className="h-4 w-4" /></Link></div></Card>)}</div></div>; }
