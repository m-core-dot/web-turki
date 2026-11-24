import { CheckCircle2, FileText, MessageCircle, Send, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

const steps = [
  { icon: MessageCircle, title: "Konsultasi", description: "Diskusikan rencana studi, minat jurusan, dan pilihan kota bersama konsultan kami." },
  { icon: UserCheck, title: "Registrasi Peserta", description: "Isi data diri dan preferensi awal agar kami dapat memahami profilmu." },
  { icon: FileText, title: "Persiapan Dokumen", description: "Lengkapi dokumen akademik dan identitas dengan panduan tim kami." },
  { icon: Send, title: "Aplikasi Universitas", description: "Pilih universitas dan jurusan yang tersedia, lalu kirim aplikasimu." },
  { icon: CheckCircle2, title: "Pendampingan Lanjutan", description: "Ikuti perkembangan aplikasi dan persiapkan keberangkatanmu." },
];

export default function AlurPage() {
  return <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-24"><PageHeader title="Alur Pendaftaran" description="Lima langkah sederhana menuju pendidikanmu di Turki." /><div className="mt-12 space-y-0">{steps.map((step, index) => { const Icon = step.icon; return <div key={step.title} className="relative flex gap-5 pb-10 last:pb-0"><div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-white"><Icon className="h-5 w-5" /></div>{index < steps.length - 1 && <div className="absolute left-6 top-12 h-[calc(100%-2rem)] w-px bg-primary-200" />}<div className="pt-1"><p className="text-xs font-semibold uppercase tracking-widest text-primary-700">Langkah {index + 1}</p><h2 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{step.description}</p></div></div>; })}</div></div>;
}
