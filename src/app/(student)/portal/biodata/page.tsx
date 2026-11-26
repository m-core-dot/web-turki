"use client";

import { useEffect, useState } from "react";
import { getParticipantBiodata, updateParticipantBiodata, type ParticipantBiodata } from "./actions";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function BiodataPage() {
  const [data, setData] = useState<ParticipantBiodata | null>(null);
  const [form, setForm] = useState({ birth_place: "", birth_date: "", gender: "", whatsapp_phone: "", address: "", regency: "", province: "", postal_code: "", source_other: "" });
  const [saved, setSaved] = useState(false);
  useEffect(() => { getParticipantBiodata().then((result) => { if (result.data) { setData(result.data); setForm({ birth_place: result.data.birth_place ?? "", birth_date: result.data.birth_date ?? "", gender: result.data.gender ?? "", whatsapp_phone: result.data.whatsapp_phone ?? "", address: result.data.address ?? "", regency: result.data.regency ?? "", province: result.data.province ?? "", postal_code: result.data.postal_code ?? "", source_other: result.data.source_other ?? "" }); } }); }, []);
  const setField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  if (!data) return <div className="space-y-6"><PageHeader title="Biodata" description="Memuat data biodata..." /></div>;
  return <div className="space-y-6"><PageHeader title="Biodata" description="Pastikan informasi pribadi kamu selalu terbaru." /><Card><div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><h2 className="font-semibold">Identitas diri</h2><p className="mt-1 text-sm text-muted">Data ini akan digunakan dalam proses pendaftaran.</p></div><Input label="Nama lengkap" value={data.full_name} disabled /><Input label="NIK" value={data.nik ?? "Belum diisi"} disabled helperText="NIK hanya dapat diubah melalui admin." /><Input label="Tempat lahir" value={form.birth_place} onChange={(e) => setField("birth_place", e.target.value)} /><Input label="Tanggal lahir" type="date" value={form.birth_date} onChange={(e) => setField("birth_date", e.target.value)} /><Select label="Jenis kelamin" options={[{ value: "LAKI-LAKI", label: "Laki-laki" }, { value: "PEREMPUAN", label: "Perempuan" }]} value={form.gender} onChange={(value) => setField("gender", value)} placeholder="Pilih jenis kelamin" /><Input label="Nomor WhatsApp" value={form.whatsapp_phone} onChange={(e) => setField("whatsapp_phone", e.target.value)} /><div className="sm:col-span-2 mt-3 border-t border-border pt-5"><h2 className="font-semibold">Alamat</h2></div><Input label="Alamat lengkap" value={form.address} onChange={(e) => setField("address", e.target.value)} /><Input label="Kota" value={form.regency} onChange={(e) => setField("regency", e.target.value)} /><Input label="Provinsi" value={form.province} onChange={(e) => setField("province", e.target.value)} /><Input label="Kode pos" value={form.postal_code} onChange={(e) => setField("postal_code", e.target.value)} /><div className="sm:col-span-2"><Textarea label="Catatan tambahan" value={form.source_other} onChange={(e) => setField("source_other", e.target.value)} placeholder="Informasi lain yang ingin disampaikan..." /></div></div><div className="mt-7 flex justify-end border-t border-border pt-5"><Button onClick={async () => { const result = await updateParticipantBiodata(form); if (result.error) { toast({ title: "Gagal menyimpan", description: result.error, variant: "danger" }); return; } setSaved(true); toast({ title: "Biodata tersimpan", description: "Perubahan berhasil disimpan.", variant: "success" }); }}><Save className="h-4 w-4" />{saved ? "Tersimpan" : "Simpan Perubahan"}</Button></div></Card></div>;
}
