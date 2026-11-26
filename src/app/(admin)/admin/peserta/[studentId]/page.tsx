import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, FileText, Mail, Phone, UploadCloud } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { DocumentReviewGrid } from "@/components/admin/document-review-grid";
import { type ParticipantDocument } from "@/app/(admin)/admin/registrasi/[registrationId]/actions";

export const instant = false;

type Registration = {
  registration_number: string;
  full_name: string;
  email: string;
  whatsapp_phone: string;
  batch: number;
  status: string;
  birth_place: string | null;
  birth_date: string | null;
  gender: string | null;
  passport_number: string | null;
  nik: string | null;
  telegram_username: string | null;
  father_name: string | null;
  father_phone: string | null;
  mother_name: string | null;
  mother_phone: string | null;
  address: string | null;
  rt_rw: string | null;
  village: string | null;
  district: string | null;
  regency: string | null;
  province: string | null;
  postal_code: string | null;
  school: string | null;
  school_city: string | null;
  school_province: string | null;
  major: string | null;
  program_level: string | null;
  source: string | null;
  source_other: string | null;
  proof_file_name: string | null;
  preferences: string[];
};

export default async function StudentDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const { data: student, error } = await getSupabaseAdminClient()
    .from("registrations")
    .select("registration_number, full_name, email, whatsapp_phone, batch, status, birth_place, birth_date, gender, passport_number, nik, telegram_username, father_name, father_phone, mother_name, mother_phone, address, rt_rw, village, district, regency, province, postal_code, school, school_city, school_province, major, program_level, source, source_other, proof_file_name, preferences")
    .eq("registration_number", studentId)
    .maybeSingle<Registration>();

  if (error || !student) {
    return <div className="rounded-xl border border-border bg-surface p-6"><h1 className="font-semibold">Peserta tidak ditemukan</h1><p className="mt-2 text-sm text-muted">Data peserta tidak tersedia di Supabase.</p><Link href="/admin/peserta" className="mt-4 inline-flex text-sm font-medium text-primary-700 hover:underline">Kembali ke peserta</Link></div>;
  }

  const { data: storedDocuments } = await getSupabaseAdminClient().from("participant_documents").select("*").eq("registration_number", student.registration_number).order("document_type");
  const statusLabel = student.status === "approved" ? "Aktif" : student.status === "needs_revision" ? "Perlu revisi" : student.status === "rejected" ? "Ditolak" : "Menunggu review";
  const statusVariant = student.status === "approved" ? "success" : student.status === "rejected" ? "danger" : "warning";
  const value = (item: string | number | null | undefined) => item || "—";

  return <div className="space-y-6"><Link href="/admin/peserta" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke peserta</Link><Card><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><Avatar name={student.full_name} size="lg" /><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold">{student.full_name}</h1><Badge variant={statusVariant} dot>{statusLabel}</Badge></div><p className="mt-1 font-mono text-xs text-muted">{student.registration_number} · Angkatan {student.batch}</p><div className="mt-3 flex flex-wrap gap-4 text-sm text-muted"><span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{student.email}</span><span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{student.whatsapp_phone}</span></div></div><div className="rounded-xl bg-primary-50 px-5 py-3 text-center"><p className="text-2xl font-bold text-primary-700">—</p><p className="text-xs text-primary-700">Kelengkapan profil</p></div></div></Card><Tabs defaultValue="ringkasan"><TabsList><TabsTrigger value="ringkasan">Ringkasan</TabsTrigger><TabsTrigger value="biodata">Biodata</TabsTrigger><TabsTrigger value="pendidikan">Pendidikan</TabsTrigger><TabsTrigger value="dokumen">Dokumen</TabsTrigger><TabsTrigger value="aplikasi">Aplikasi</TabsTrigger></TabsList><TabsContent value="ringkasan"><div className="grid gap-4 sm:grid-cols-3"><Card><FileText className="h-5 w-5 text-primary-700" /><p className="mt-4 text-2xl font-bold">—</p><p className="text-sm text-muted">Dokumen disetujui</p></Card><Card><FileText className="h-5 w-5 text-primary-700" /><p className="mt-4 text-2xl font-bold">—</p><p className="text-sm text-muted">Aplikasi aktif</p></Card><Card><FileText className="h-5 w-5 text-primary-700" /><p className="mt-4 text-2xl font-bold">—</p><p className="text-sm text-muted">Pembayaran berjalan</p></Card></div></TabsContent><TabsContent value="biodata"><InfoCard rows={[["Nama lengkap", student.full_name], ["Email", student.email], ["Nomor WhatsApp", student.whatsapp_phone], ["Tempat lahir", value(student.birth_place)], ["Tanggal lahir", value(student.birth_date)], ["Jenis kelamin", value(student.gender)], ["Nomor paspor", value(student.passport_number)], ["NIK KTP", value(student.nik)], ["Username Telegram", value(student.telegram_username)], ["Nama ayah", value(student.father_name)], ["Nomor telepon ayah", value(student.father_phone)], ["Nama ibu", value(student.mother_name)], ["Nomor telepon ibu", value(student.mother_phone)], ["Alamat lengkap", value(student.address)], ["RT / RW", value(student.rt_rw)], ["Kelurahan / Desa", value(student.village)], ["Kecamatan", value(student.district)], ["Kota / Kabupaten", value(student.regency)], ["Provinsi", value(student.province)], ["Kode pos", value(student.postal_code)], ["Sumber informasi", value(student.source)], ["Sumber informasi lainnya", value(student.source_other)]]} /></TabsContent><TabsContent value="pendidikan"><InfoCard rows={[["Sekolah / Universitas", value(student.school)], ["Kota sekolah", value(student.school_city)], ["Provinsi sekolah", value(student.school_province)], ["Jurusan", value(student.major)]]} /></TabsContent><TabsContent value="dokumen"><DocumentReviewGrid registrationNumber={student.registration_number} proofFileName={student.proof_file_name} documents={(storedDocuments || []) as ParticipantDocument[]} /></TabsContent><TabsContent value="aplikasi"><InfoCard rows={[["Status registrasi", statusLabel], ["Program", value(student.program_level)], ["Pilihan jurusan", student.preferences.join(", ") || "—"], ["Aplikasi universitas", "Belum tersedia di database"]]} highlightedLabels={["Program"]} /></TabsContent></Tabs></div>;
}

function InfoCard({ rows, highlightedLabels = [] }: { rows: Array<[string, string | number]>; highlightedLabels?: string[] }) { return <Card><div className="divide-y divide-border">{rows.map(([label, item]) => <div key={label} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-4"><span className="text-sm text-muted">{label}</span><span className={highlightedLabels.includes(label) ? "rounded-md bg-primary-100 px-2 py-0.5 text-sm font-bold text-primary-800 sm:text-right" : "text-sm font-medium text-foreground sm:text-right"}>{item}</span></div>)}</div></Card>; }
