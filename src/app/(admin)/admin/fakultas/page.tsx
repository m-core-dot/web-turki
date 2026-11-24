"use client";

import { useMemo, useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { mockFaculties, mockUniversities, type MockFaculty } from "@/lib/mock-data";

export default function FakultasPage() {
  const [university, setUniversity] = useState("all");
  const [items, setItems] = useState(mockFaculties);
  const [editing, setEditing] = useState<MockFaculty | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<MockFaculty | null>(null);
  const filtered = useMemo(() => university === "all" ? items : items.filter((item) => item.university === university), [items, university]);
  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item: MockFaculty) => { setEditing(item); setFormOpen(true); };
  const save = () => { setFormOpen(false); toast({ title: editing ? "Fakultas diperbarui" : "Fakultas ditambahkan", description: "Perubahan ini masih berupa preview UI.", variant: "success" }); };
  const remove = () => { if (deleteItem) setItems((current) => current.filter((item) => item.id !== deleteItem.id)); setDeleteItem(null); toast({ title: "Fakultas dihapus", variant: "success" }); };
  return <div className="space-y-6"><PageHeader title="Fakultas" description="Kelola fakultas yang tersedia pada setiap universitas." action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Tambah Fakultas</Button>} /><Card padding="none"><div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end"><div className="w-full sm:max-w-xs"><Select label="Filter universitas" options={[{ value: "all", label: "Semua universitas" }, ...mockUniversities.map((item) => ({ value: item.name, label: item.name }))]} value={university} onChange={setUniversity} /></div><p className="pb-2 text-sm text-muted">{filtered.length} fakultas ditampilkan</p></div><DataTable data={filtered} keyExtractor={(item) => item.id} searchPlaceholder="Cari nama fakultas..." columns={[{ key: "name", label: "Fakultas", render: (item) => <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50"><Building2 className="h-4 w-4 text-primary-700" /></div><div><p className="font-medium text-foreground">{item.name}</p><p className="font-mono text-xs text-muted">{item.id}</p></div></div> }, { key: "university", label: "Universitas", render: (item) => <span>{item.university}</span> }, { key: "majors", label: "Jurusan", render: (item) => <span>{item.majors} program</span> }, { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "default"} dot>{item.status === "active" ? "Aktif" : "Nonaktif"}</Badge> }, { key: "actions", label: "", className: "w-12 text-right", render: (item) => <DropdownMenu items={[{ label: "Edit fakultas", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(item) }, { label: "Hapus fakultas", icon: <Trash2 className="h-4 w-4" />, variant: "danger", separator: true, onClick: () => setDeleteItem(item) }]} /> }]} /></Card><Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit fakultas" : "Tambah fakultas"} description="Data ini masih disimpan sebagai mock preview." footer={<><Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button><Button onClick={save}>Simpan Fakultas</Button></>}><div className="space-y-4"><Input label="Nama fakultas" defaultValue={editing?.name} placeholder="Contoh: Faculty of Engineering" /><Select label="Universitas" options={mockUniversities.map((item) => ({ value: item.name, label: item.name }))} value={editing?.university} placeholder="Pilih universitas" /><Select label="Status" options={[{ value: "active", label: "Aktif" }, { value: "inactive", label: "Nonaktif" }]} value={editing?.status} placeholder="Pilih status" /></div></Dialog><ConfirmDialog open={deleteItem !== null} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Hapus fakultas?" description={`Fakultas ${deleteItem?.name ?? "ini"} akan dihapus dari preview.`} confirmLabel="Hapus Fakultas" /></div>;
}

