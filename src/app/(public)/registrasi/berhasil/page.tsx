import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function RegistrationSuccessPage() {
  return <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50"><CheckCircle2 className="h-8 w-8 text-success-600" /></div><h1 className="mt-6 text-2xl font-bold text-foreground">Registrasi berhasil dikirim</h1><p className="mt-3 leading-7 text-muted">Terima kasih telah mempercayakan langkah awalmu kepada Mumtaza Center. Tim kami akan menghubungi dalam 1–2 hari kerja.</p><Link href="/" className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-primary-700 px-5 text-sm font-medium text-white hover:bg-primary-800">Kembali ke Beranda <ArrowRight className="h-4 w-4" /></Link></div>;
}
