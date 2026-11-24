"use client";

import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

const initial = [{ id: "edu-1", level: "SMA / Sederajat", school: "SMA Negeri 3 Bandung", major: "IPA", year: "2022", status: "Terverifikasi" }, { id: "edu-2", level: "Universitas", school: "Universitas Padjadjaran", major: "Teknik Informatika", year: "2026", status: "Sedang berjalan" }];

export default function PendidikanPage() {
  const [items, setItems] = useState(initial); const [open, setOpen] = useState(false);
  return <div className="space-y-6"><PageHeader title="Riwayat Pendidikan" description="Tambahkan pendidikan formal yang pernah atau sedang ditempuh." action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Tambah Pendidikan</Button>} /><div className="space-y-4">{items.map((item) => <Card key={item.id}><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50"><BookOpen className="h-5 w-5 text-primary-700" /></div><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><p className="font-semibold text-foreground">{item.school}</p><p className="mt-1 text-sm text-muted">{item.level} · {item.major}</p></div><DropdownMenu items={[{ label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: () => setOpen(true) }, { label: "Hapus", icon: <Trash2 className="h-4 w-4" />, variant: "danger", onClick: () => { setItems(items.filter((i) => i.id !== item.id)); toast({ title: "Data dihapus", variant: "success" }); } }]} /></div><div className="mt-4 flex items-center gap-3"><Badge variant="success" dot>{item.status}</Badge><span className="text-xs text-muted">Tahun: {item.year}</span></div></div></div></Card>)}</div><Dialog open={open} onClose={() => setOpen(false)} title="Tambah riwayat pendidikan" description="Masukkan informasi pendidikan kamu." footer={<><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={() => { setOpen(false); toast({ title: "Pendidikan ditambahkan", variant: "success" }); }}>Simpan</Button></>}><div className="space-y-4"><Select label="Jenjang pendidikan" options={[{ value: "sma", label: "SMA / Sederajat" }, { value: "university", label: "Universitas" }]} placeholder="Pilih jenjang" /><Input label="Nama institusi" placeholder="Nama sekolah atau universitas" /><Input label="Jurusan" placeholder="Contoh: IPA" /><Input label="Tahun lulus / perkiraan" placeholder="2026" /></div></Dialog></div>;
}
