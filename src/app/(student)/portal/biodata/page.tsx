"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function BiodataPage() {
  const [saved, setSaved] = useState(false);
  return <div className="space-y-6"><PageHeader title="Biodata" description="Pastikan informasi pribadi kamu selalu terbaru." /><Card><div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><h2 className="font-semibold">Identitas diri</h2><p className="mt-1 text-sm text-muted">Data ini akan digunakan dalam proses pendaftaran.</p></div><Input label="Nama lengkap" defaultValue="Ahmad Fadhil Pratama" /><Input label="NIK" defaultValue="3273••••••••••01" disabled helperText="NIK hanya dapat diubah melalui admin." /><Input label="Tempat lahir" defaultValue="Bandung" /><Input label="Tanggal lahir" type="date" defaultValue="2004-05-12" /><Select label="Jenis kelamin" options={[{ value: "male", label: "Laki-laki" }, { value: "female", label: "Perempuan" }]} value="male" onChange={() => undefined} /><Input label="Nomor WhatsApp" defaultValue="0812 3456 7890" /><div className="sm:col-span-2 mt-3 border-t border-border pt-5"><h2 className="font-semibold">Alamat</h2></div><Input label="Alamat lengkap" defaultValue="Jl. Cendana No. 12" /><Input label="Kota" defaultValue="Bandung" /><Input label="Provinsi" defaultValue="Jawa Barat" /><Input label="Kode pos" defaultValue="40123" /><div className="sm:col-span-2"><Textarea label="Catatan tambahan" placeholder="Informasi lain yang ingin disampaikan..." /></div></div><div className="mt-7 flex justify-end border-t border-border pt-5"><Button onClick={() => { setSaved(true); toast({ title: "Biodata tersimpan", description: "Perubahan berhasil disimpan dalam preview.", variant: "success" }); }}><Save className="h-4 w-4" />{saved ? "Tersimpan" : "Simpan Perubahan"}</Button></div></Card></div>;
}
