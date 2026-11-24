"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

const faqs = [
  ["Apakah konsultasi awal berbayar?", "Konsultasi awal bersama tim Mumtaza Center tidak dipungut biaya. Kami ingin memahami rencana studimu terlebih dahulu sebelum menyusun langkah yang tepat."],
  ["Kapan saya bisa mulai mendaftar?", "Kamu dapat mengisi registrasi kapan saja. Tim kami akan menghubungi dan membantu menyesuaikan dengan periode intake universitas yang tersedia."],
  ["Dokumen apa saja yang dibutuhkan?", "Dokumen utama meliputi identitas, paspor, ijazah, transkrip nilai, dan foto. Persyaratan dapat berbeda untuk setiap universitas dan program."],
  ["Apakah saya bisa memilih lebih dari satu universitas?", "Ya. Setelah profil dan dokumenmu siap, kamu dapat mengajukan aplikasi ke beberapa universitas dan program yang sesuai."],
  ["Bagaimana cara memantau proses pendaftaran?", "Peserta yang sudah aktif akan mendapatkan akses ke portal MTAS untuk melihat kelengkapan dokumen, aplikasi, dan pembaruan status."],
];

export default function FaqPage() {
  const [active, setActive] = useState<number | null>(0);
  return <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24"><PageHeader title="Pertanyaan Umum" description="Jawaban untuk pertanyaan yang sering ditanyakan calon peserta." /><div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface">{faqs.map(([question, answer], index) => <div key={question} className="px-5 sm:px-6"><button className="flex w-full items-center justify-between gap-4 py-5 text-left" onClick={() => setActive(active === index ? null : index)}><span className="font-medium text-foreground">{question}</span><ChevronDown className={cn("h-5 w-5 shrink-0 text-muted transition-transform", active === index && "rotate-180 text-primary-700")} /></button>{active === index && <p className="-mt-1 pb-5 pr-8 text-sm leading-6 text-muted">{answer}</p>}</div>)}</div></div>;
}
