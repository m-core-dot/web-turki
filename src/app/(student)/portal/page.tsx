import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { StatusTimeline } from "@/components/shared/status-timeline";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function statusLabel(status: string) {
  return status === "approved" ? "Registrasi disetujui" : status === "needs_revision" ? "Perlu revisi" : status === "rejected" ? "Registrasi ditolak" : "Menunggu review";
}

export default async function StudentDashboardPage() {
  await connection();
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: registration } = user
    ? await supabase.from("registrations").select("full_name, registration_number, status, submitted_at").eq("auth_user_id", user.id).maybeSingle()
    : { data: null };

  if (!user || !registration) {
    return <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center"><h1 className="text-xl font-semibold">Portal peserta</h1><p className="mt-2 text-sm text-muted">Silakan masuk menggunakan akun peserta yang telah disetujui untuk melihat data portal.</p><Link href="/login" className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary-700 px-4 text-sm font-medium text-white hover:bg-primary-800">Masuk ke portal</Link></div>;
  }

  return <div className="space-y-6"><div><p className="text-sm font-medium text-primary-700">Selamat datang kembali</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Halo, {registration.full_name}</h1><p className="mt-2 text-sm text-muted">Berikut progres pendaftaranmu di MTAS.</p></div><section className="relative overflow-hidden rounded-2xl bg-primary-800 p-6 text-white sm:p-8"><div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-primary-500/30 blur-2xl" /><div className="relative"><p className="text-sm text-primary-100">Status registrasi</p><div className="mt-3 flex items-end gap-3"><span className="text-2xl font-bold">{statusLabel(registration.status)}</span></div><p className="mt-3 text-sm text-primary-100">Registrasi diajukan pada {formatDate(registration.submitted_at)}.</p><Link href="/portal/biodata" className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-primary-800 hover:bg-primary-50">Lanjutkan <ArrowRight className="h-4 w-4" /></Link></div></section><Card><CardTitle>Belum ada ringkasan</CardTitle><CardDescription className="mt-1">Data dokumen, aplikasi, dan tugas akan tampil setelah tersedia di sistem.</CardDescription></Card><Card><CardTitle>Status pendaftaran</CardTitle><CardDescription className="mt-0.5 mb-5">Registrasi {registration.registration_number}</CardDescription><StatusTimeline items={[{ label: statusLabel(registration.status), date: formatDate(registration.submitted_at), status: registration.status === "approved" ? "completed" : "current" }]} /></Card></div>;
}
