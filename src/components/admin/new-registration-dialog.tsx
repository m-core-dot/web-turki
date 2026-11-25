"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

const sections = [
  { title: "Data Pribadi", fields: [["fullName", "Nama Lengkap (Sesuai Paspor)"], ["birthPlace", "Tempat Lahir (Sesuai Paspor)"], ["birthDate", "Tanggal Lahir"], ["gender", "Jenis Kelamin"], ["passport", "Nomor Paspor"], ["nik", "NIK KTP"], ["telegram", "Username Telegram"], ["email", "Alamat Email Aktif"], ["phone", "Nomor Telepon (WhatsApp)"]] },
  { title: "Data Keluarga & Kontak", fields: [["fatherName", "Nama Ayah"], ["fatherPhone", "Nomor Telepon Ayah"], ["motherName", "Nama Ibu"], ["motherPhone", "Nomor Telepon Ibu"]] },
  { title: "Alamat Domisili Saat Ini", fields: [["address", "Alamat Lengkap"], ["rtRw", "RT / RW"], ["village", "Kelurahan / Desa"], ["district", "Kecamatan"], ["regency", "Kota / Kabupaten"], ["province", "Provinsi"], ["postalCode", "Kode Pos"]] },
  { title: "Data Pendidikan", fields: [["school", "Asal Sekolah"], ["schoolCity", "Kota / Kabupaten Asal Sekolah"], ["schoolProvince", "Provinsi Asal Sekolah"], ["major", "Jurusan"]] },
];

export function NewRegistrationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [source, setSource] = useState("");
  const [sourceOther, setSourceOther] = useState("");
  const update = (key: string, value: string, type = "text") => setValues((current) => ({ ...current, [key]: type === "email" ? value.toLowerCase() : type === "date" ? value : value.toUpperCase() }));
  const submit = () => { const required = sections.flatMap((section) => section.fields).every(([key]) => values[key]); if (!required || !source || (source === "Lainnya" && !sourceOther)) return; onClose(); toast({ title: "Registrasi baru ditambahkan", description: "Data tersimpan sebagai preview UI.", variant: "success" }); };
  return <Dialog open={open} onClose={onClose} title="Registrasi Baru" description="Isi data peserta untuk membuat registrasi baru." size="lg" footer={<><Button variant="outline" onClick={onClose}>Batal</Button><Button onClick={submit}>Simpan Registrasi</Button></>}><div className="max-h-[65vh] space-y-6 overflow-y-auto pr-1">{sections.map((section) => <section key={section.title} className="space-y-4"><h3 className="border-b border-border pb-2 text-sm font-semibold text-foreground">{section.title}</h3><div className="grid gap-4 sm:grid-cols-2">{section.fields.map(([key, label]) => <Input key={key} label={label} required value={values[key] ?? ""} type={key === "birthDate" ? "date" : key === "email" ? "email" : "text"} onChange={(event) => update(key, event.target.value, key === "birthDate" ? "date" : key === "email" ? "email" : "text")} />)}</div></section>)}<section className="space-y-4"><h3 className="border-b border-border pb-2 text-sm font-semibold text-foreground">Sumber Informasi</h3><Select label="Mengetahui MTAS dari" options={["Instagram", "WhatsApp", "Facebook", "Teman", "Orang tua", "Sekolah", "Alumni", "Website", "Lainnya"].map((value) => ({ value, label: value }))} value={source} onChange={setSource} placeholder="Pilih sumber informasi" />{source === "Lainnya" && <Input label="Sebutkan sumber lainnya" required value={sourceOther} onChange={(event) => setSourceOther(event.target.value)} />}</section></div></Dialog>;
}
