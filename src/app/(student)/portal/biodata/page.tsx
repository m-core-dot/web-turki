"use client";

import { useEffect, useState } from "react";
import { Pencil, Save } from "lucide-react";
import { getParticipantBiodata, updateParticipantBiodata, type ParticipantBiodata } from "./actions";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

function displayValue(value: string | number | null | undefined) {
  return value === null || value === undefined || value === "" ? "Belum diisi" : String(value);
}

function ReadOnlyField({ label, value, className = "" }: { label: string; value: string | number | null | undefined; className?: string }) {
  return <div className={`rounded-xl bg-background-alt/60 px-4 py-3 ${className}`}><p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p><p className="mt-1 break-words text-sm font-semibold text-foreground">{displayValue(value)}</p></div>;
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return <div className="border-b border-border pb-4"><h2 className="font-semibold text-foreground">{title}</h2>{description && <p className="mt-1 text-sm text-muted">{description}</p>}</div>;
}

export default function BiodataPage() {
  const [data, setData] = useState<ParticipantBiodata | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getParticipantBiodata().then((result) => { if (result.data) setData(result.data); }); }, []);
  useEffect(() => { if (!saved) return; const timeout = window.setTimeout(() => setSaved(false), 4000); return () => window.clearTimeout(timeout); }, [saved]);

  const setField = (field: keyof ParticipantBiodata, value: string | string[]) => setData((current) => current ? { ...current, [field]: value } : current);

  if (!data) return <div className="space-y-6"><PageHeader title="Biodata" description="Memuat data biodata..." /></div>;

  const save = async () => {
    const { registration_number, program_level, batch, status, school, school_city, school_province, major, source, preferences, ...editable } = data;
    const result = await updateParticipantBiodata({ ...editable, preferences: preferences ?? [] });
    if (result.error) { toast({ title: "Gagal menyimpan", description: result.error, variant: "danger" }); return; }
    setSaved(true);
    setEditing(false);
    toast({ title: "Biodata tersimpan", description: "Perubahan berhasil disimpan.", variant: "success" });
  };

  return <div className="space-y-6">
    <PageHeader title="Biodata" description="Informasi lengkap peserta yang tersimpan di sistem." action={editing ? <div className="flex gap-2"><Button variant="outline" onClick={() => { setEditing(false); setSaved(false); }} >Batal</Button><Button onClick={save}><Save className="h-4 w-4" />Simpan Perubahan</Button></div> : <Button onClick={() => { setEditing(true); setSaved(false); }}><Pencil className="h-4 w-4" />Edit Biodata</Button>} />
    {saved && <div className="rounded-xl border border-success-100 bg-success-50 px-4 py-3 text-sm text-success-700">Perubahan biodata berhasil disimpan.</div>}
    <Card>
      <div className="space-y-8">
        <section className="space-y-4"><SectionHeader title="Informasi registrasi" description="Informasi sistem dan status pendaftaran kamu." /><div className="grid gap-3 sm:grid-cols-3"><ReadOnlyField label="Nomor registrasi" value={data.registration_number} /><ReadOnlyField label="Program" value={data.program_level} /><ReadOnlyField label="Angkatan" value={data.batch} /></div></section>
        <section className="space-y-4"><SectionHeader title="Identitas diri" /><div className="grid gap-5 sm:grid-cols-2">{editing ? <><div className="sm:col-span-2"><Input label="Nama lengkap" value={data.full_name} onChange={(e) => setField("full_name", e.target.value)} /></div><Input label="Email" type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} /><Input label="NIK" value={data.nik ?? ""} onChange={(e) => setField("nik", e.target.value)} /><Input label="Nomor paspor" value={data.passport_number ?? ""} onChange={(e) => setField("passport_number", e.target.value)} /><Input label="Tempat lahir" value={data.birth_place ?? ""} onChange={(e) => setField("birth_place", e.target.value)} /><Input label="Tanggal lahir" type="date" value={data.birth_date ?? ""} onChange={(e) => setField("birth_date", e.target.value)} /><Select label="Jenis kelamin" options={[{ value: "LAKI-LAKI", label: "Laki-laki" }, { value: "PEREMPUAN", label: "Perempuan" }]} value={data.gender ?? ""} onChange={(value) => setField("gender", value)} placeholder="Pilih jenis kelamin" /><Input label="Nomor WhatsApp" value={data.whatsapp_phone ?? ""} onChange={(e) => setField("whatsapp_phone", e.target.value)} /><Input label="Telegram" value={data.telegram_username ?? ""} onChange={(e) => setField("telegram_username", e.target.value)} /></> : <><ReadOnlyField label="Nama lengkap" value={data.full_name} className="sm:col-span-2" /><ReadOnlyField label="Email" value={data.email} /><ReadOnlyField label="NIK" value={data.nik} /><ReadOnlyField label="Nomor paspor" value={data.passport_number} /><ReadOnlyField label="Tempat lahir" value={data.birth_place} /><ReadOnlyField label="Tanggal lahir" value={data.birth_date} /><ReadOnlyField label="Jenis kelamin" value={data.gender} /><ReadOnlyField label="Nomor WhatsApp" value={data.whatsapp_phone} /><ReadOnlyField label="Telegram" value={data.telegram_username} /></>}</div></section>
        <section className="space-y-4"><SectionHeader title="Keluarga dan alamat" /><div className="grid gap-5 sm:grid-cols-2">{editing ? <><Input label="Nama ayah" value={data.father_name ?? ""} onChange={(e) => setField("father_name", e.target.value)} /><Input label="Nomor telepon ayah" value={data.father_phone ?? ""} onChange={(e) => setField("father_phone", e.target.value)} /><Input label="Nama ibu" value={data.mother_name ?? ""} onChange={(e) => setField("mother_name", e.target.value)} /><Input label="Nomor telepon ibu" value={data.mother_phone ?? ""} onChange={(e) => setField("mother_phone", e.target.value)} /><div className="sm:col-span-2"><Input label="Alamat lengkap" value={data.address ?? ""} onChange={(e) => setField("address", e.target.value)} /></div><Input label="RT/RW" value={data.rt_rw ?? ""} onChange={(e) => setField("rt_rw", e.target.value)} /><Input label="Kelurahan/Desa" value={data.village ?? ""} onChange={(e) => setField("village", e.target.value)} /><Input label="Kecamatan" value={data.district ?? ""} onChange={(e) => setField("district", e.target.value)} /><Input label="Kota/Kabupaten" value={data.regency ?? ""} onChange={(e) => setField("regency", e.target.value)} /><Input label="Provinsi" value={data.province ?? ""} onChange={(e) => setField("province", e.target.value)} /><Input label="Kode pos" value={data.postal_code ?? ""} onChange={(e) => setField("postal_code", e.target.value)} /></> : <><ReadOnlyField label="Nama ayah" value={data.father_name} /><ReadOnlyField label="Telepon ayah" value={data.father_phone} /><ReadOnlyField label="Nama ibu" value={data.mother_name} /><ReadOnlyField label="Telepon ibu" value={data.mother_phone} /><ReadOnlyField label="Alamat lengkap" value={data.address} className="sm:col-span-2" /><ReadOnlyField label="RT/RW" value={data.rt_rw} /><ReadOnlyField label="Kelurahan/Desa" value={data.village} /><ReadOnlyField label="Kecamatan" value={data.district} /><ReadOnlyField label="Kota/Kabupaten" value={data.regency} /><ReadOnlyField label="Provinsi" value={data.province} /><ReadOnlyField label="Kode pos" value={data.postal_code} /></>}</div></section>
      </div>
    </Card>
  </div>;
}
