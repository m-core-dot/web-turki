"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
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
  const [step, setStep] = useState(0);
  const update = (key: string, value: string, type = "text") => setValues((current) => ({ ...current, [key]: type === "email" ? value.toLowerCase() : type === "date" ? value : value.toUpperCase() }));
  const currentSection = sections[step];
  const canContinue = currentSection.fields.every(([key]) => values[key]);
  const submit = () => { const required = sections.flatMap((section) => section.fields).every(([key]) => values[key]); if (!required || !source || (source === "Lainnya" && !sourceOther)) return; onClose(); setStep(0); toast({ title: "Registrasi baru ditambahkan", description: "Data tersimpan sebagai preview UI.", variant: "success" }); };
  return <Dialog open={open} onClose={onClose} title="Registrasi Baru" description="Lengkapi data peserta melalui beberapa tahap." size="lg" footer={<><Button variant="outline" onClick={onClose}>Batal</Button>{step > 0 && <Button variant="ghost" onClick={() => setStep((value) => value - 1)}><ArrowLeft className="h-4 w-4" />Kembali</Button>}{step < sections.length ? <Button disabled={!canContinue} onClick={() => setStep((value) => value + 1)}>Lanjut <ArrowRight className="h-4 w-4" /></Button> : <Button onClick={submit}><Check className="h-4 w-4" />Simpan Registrasi</Button>}</>}><div className="mb-6 flex items-center justify-between gap-2 overflow-x-auto pb-1">{[...sections.map((section) => section.title), "Sumber Informasi"].map((title, index) => <div key={title} className="flex min-w-max items-center gap-2 text-xs"><span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 font-semibold ${index < step ? "border-primary-700 bg-primary-700 text-white" : index === step ? "border-primary-700 bg-primary-50 text-primary-700" : "border-border text-muted"}`}>{index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span className={index === step ? "font-semibold text-primary-700" : "text-muted"}>{title}</span></div>)}</div><div className="max-h-[55vh] overflow-y-auto pr-1">{step < sections.length ? <section className="space-y-4"><h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">{currentSection.title}</h3><div className="grid gap-4 sm:grid-cols-2">{currentSection.fields.map(([key, label]) => <Input key={key} label={label} required value={values[key] ?? ""} type={key === "birthDate" ? "date" : key === "email" ? "email" : "text"} onChange={(event) => update(key, event.target.value, key === "birthDate" ? "date" : key === "email" ? "email" : "text")} />)}</div></section> : <section className="space-y-4"><h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">Sumber Informasi</h3><Select label="Mengetahui MTAS dari" options={["Instagram", "WhatsApp", "Facebook", "Teman", "Orang tua", "Sekolah", "Alumni", "Website", "Lainnya"].map((value) => ({ value, label: value }))} value={source} onChange={setSource} placeholder="Pilih sumber informasi" />{source === "Lainnya" && <Input label="Sebutkan sumber lainnya" required value={sourceOther} onChange={(event) => setSourceOther(event.target.value)} />}</section>}</div></Dialog>;
}
