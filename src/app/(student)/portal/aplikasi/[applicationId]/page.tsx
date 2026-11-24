import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusTimeline } from "@/components/shared/status-timeline";
import { mockApplications } from "@/lib/mock-data";

export function generateStaticParams() {
  return mockApplications.map((item) => ({ applicationId: item.id }));
}

export default function ApplicationDetailPage({ params }: { params: { applicationId: string } }) { const app = mockApplications.find((item) => item.id === params.applicationId) ?? mockApplications[0]; return <div className="space-y-6"><Link href="/portal/aplikasi" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke aplikasi</Link><PageHeader title="Detail Aplikasi" description={app.id} /><div className="grid gap-6 lg:grid-cols-5"><Card className="lg:col-span-3"><div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50"><GraduationCap className="h-6 w-6 text-primary-700" /></div><div><h2 className="font-semibold">{app.university}</h2><p className="mt-1 text-sm text-muted">{app.major}</p><div className="mt-3"><StatusBadge status={app.status} /></div></div></div><div className="mt-7 grid gap-4 border-t border-border pt-5 sm:grid-cols-2"><div><p className="text-xs text-muted">Nomor aplikasi</p><p className="mt-1 font-mono text-sm">{app.id}</p></div><div><p className="text-xs text-muted">Tanggal pengajuan</p><p className="mt-1 text-sm">{app.submittedAt}</p></div></div></Card><Card className="lg:col-span-2"><h2 className="font-semibold">Perjalanan aplikasi</h2><div className="mt-5"><StatusTimeline items={[{ label: "Aplikasi dibuat", date: app.submittedAt, status: "completed" }, { label: "Dokumen diverifikasi", date: "Sedang diproses", status: "current" }, { label: "Dikirim ke universitas", status: "upcoming" }, { label: "Hasil seleksi", status: "upcoming" }]} /></div></Card></div><Card><h2 className="font-semibold">Instruksi berikutnya</h2><p className="mt-2 text-sm leading-6 text-muted">Tim admissions sedang memeriksa kelengkapan dokumenmu. Tidak ada tindakan yang diperlukan saat ini. Kami akan memberi tahu melalui notifikasi jika ada pembaruan.</p></Card></div>; }
