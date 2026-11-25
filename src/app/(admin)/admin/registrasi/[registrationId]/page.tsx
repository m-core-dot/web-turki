"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, FileText, Mail, Phone, RotateCcw, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchRegistration } from "./actions";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

type Registration = Record<string, unknown> & {
  registration_number: string;
  full_name: string;
  email: string;
  whatsapp_phone: string;
  status: string;
  batch: number;
  submitted_at: string;
  preferences: string[];
};

const statusLabels: Record<string, string> = {
  pending_review: "Menunggu Review",
  approved: "Disetujui",
  needs_revision: "Perlu Revisi",
  rejected: "Ditolak",
};

export default function RegistrationDetailPage() {
  const { registrationId } = useParams<{ registrationId: string }>();
  const [item, setItem] = useState<Registration | null>(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<"approve" | "reject" | "revision" | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchRegistration(registrationId).then((result) => {
        if (result.ok) setItem(result.data as Registration);
        else setError(result.message);
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [registrationId]);

  const display = (key: string, fallback = "-") => String(item?.[key] ?? fallback);
  const action = () => {
    toast({ title: confirm === "approve" ? "Registrasi disetujui" : confirm === "revision" ? "Permintaan revisi dikirim" : "Registrasi ditolak", description: "Tindakan review akan dihubungkan ke server action berikutnya.", variant: confirm === "reject" ? "warning" : "success" });
    setConfirm(null);
  };

  if (error || !item) return <div className="space-y-6"><Link href="/admin/registrasi" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke registrasi</Link><Card><p className="text-sm text-muted">{error || "Memuat detail registrasi..."}</p></Card></div>;

  return <div className="space-y-6"><Link href="/admin/registrasi" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke registrasi</Link><PageHeader title="Detail Registrasi" description={item.registration_number} action={<Badge variant="outline" dot>{statusLabels[item.status] ?? item.status}</Badge>} /><div className="grid gap-6 lg:grid-cols-5"><div className="space-y-6 lg:col-span-3"><Card><div className="flex items-center gap-3 border-b border-border pb-5"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50"><UserCheck className="h-5 w-5 text-primary-700" /></div><div><h2 className="font-semibold">Data calon peserta</h2><p className="text-sm text-muted">Informasi yang tersimpan di Supabase.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Info label="Nama lengkap" value={item.full_name} /><Info label="Tempat lahir" value={display("birth_place")} /><Info label="Tanggal lahir" value={display("birth_date")} /><Info label="Jenis kelamin" value={display("gender")} /><Info label="Nomor paspor" value={display("passport_number")} /><Info label="NIK KTP" value={display("nik")} /><Info label="Username Telegram" value={display("telegram_username")} /><Info label="Email" value={item.email} icon={<Mail className="h-4 w-4" />} /><Info label="Nomor WhatsApp" value={item.whatsapp_phone} icon={<Phone className="h-4 w-4" />} /><Info label="Nama Ayah" value={display("father_name")} /><Info label="Nomor Telepon Ayah" value={display("father_phone")} /><Info label="Nama Ibu" value={display("mother_name")} /><Info label="Nomor Telepon Ibu" value={display("mother_phone")} /><Info label="Alamat lengkap" value={display("address")} /><Info label="RT / RW" value={display("rt_rw")} /><Info label="Kelurahan / Desa" value={display("village")} /><Info label="Kecamatan" value={display("district")} /><Info label="Kota / Kabupaten" value={display("regency")} /><Info label="Provinsi" value={display("province")} /><Info label="Kode Pos" value={display("postal_code")} /><Info label="Sekolah / Universitas" value={display("school")} /><Info label="Kota sekolah" value={display("school_city")} /><Info label="Provinsi sekolah" value={display("school_province")} /><Info label="Jurusan" value={display("major")} /><Info label="Program" value={display("program_level")} /><Info label="Sumber informasi" value={display("source")} /><Info label="Angkatan" value={String(item.batch)} /><Info label="Tanggal daftar" value={new Date(item.submitted_at).toLocaleDateString("id-ID")} /></div></Card><Card><div className="flex items-center gap-3 border-b border-border pb-5"><FileText className="h-5 w-5 text-primary-700" /><div><h2 className="font-semibold">Preferensi jurusan</h2><p className="text-sm text-muted">Pilihan awal calon peserta.</p></div></div><div className="mt-5 flex flex-wrap gap-2">{item.preferences.map((value) => <Badge key={value} variant="outline">{value}</Badge>)}</div></Card><Card><p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">Bukti pendaftaran belum terhubung ke database.</p></Card><Card><Textarea label="Catatan internal" placeholder="Tambahkan catatan untuk tim internal..." helperText="Catatan ini tidak terlihat oleh peserta." /></Card></div><Card className="h-fit lg:col-span-2"><h2 className="font-semibold">Review registrasi</h2><p className="mt-2 text-sm leading-6 text-muted">Periksa data calon peserta sebelum menentukan tindakan.</p><div className="mt-6 space-y-2"><Button className="w-full" onClick={() => setConfirm("approve")}><Check className="h-4 w-4" />Setujui Registrasi</Button><Button variant="outline" className="w-full" onClick={() => setConfirm("revision")}><RotateCcw className="h-4 w-4" />Minta Revisi</Button><Button variant="destructive" className="w-full" onClick={() => setConfirm("reject")}><X className="h-4 w-4" />Tolak Registrasi</Button></div></Card></div><ConfirmDialog open={confirm !== null} onClose={() => setConfirm(null)} onConfirm={action} title="Konfirmasi tindakan" description="Tindakan review ini akan diproses pada integrasi berikutnya." confirmLabel="Konfirmasi" /></div>;
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) { return <div><p className="text-xs text-muted">{label}</p><p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">{icon}{value}</p></div>; }
