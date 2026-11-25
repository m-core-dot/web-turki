"use client";

import { useState } from "react";
import { Pencil, Plus, Shield, Trash2, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

type User = { id: string; name: string; email: string; role: string; status: "active" | "inactive"; lastActive: string };
const initialUsers: User[] = [
  { id: "USR-001", name: "Admin Utama", email: "admin@mumtaza.center", role: "Super Admin", status: "active", lastActive: "Baru saja" },
  { id: "USR-002", name: "Yuni Kartika", email: "yuni@mumtaza.center", role: "Admission Officer", status: "active", lastActive: "5 menit lalu" },
  { id: "USR-003", name: "Fajar Hidayat", email: "fajar@mumtaza.center", role: "Finance Officer", status: "active", lastActive: "Kemarin" },
  { id: "USR-004", name: "Nadia Putri", email: "nadia@mumtaza.center", role: "Admission Officer", status: "inactive", lastActive: "2 minggu lalu" },
];

export default function PenggunaPage() {
  const [users, setUsers] = useState(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Admission Officer" });
  const openForm = (user?: User) => { setEditing(user ?? null); setForm(user ? { name: user.name, email: user.email, role: user.role } : { name: "", email: "", role: "Admission Officer" }); setDialogOpen(true); };
  const save = () => { if (!form.name.trim() || !form.email.trim()) return; setUsers((current) => editing ? current.map((user) => user.id === editing.id ? { ...user, ...form } : user) : [...current, { id: `USR-${String(current.length + 1).padStart(3, "0")}`, ...form, status: "active", lastActive: "Belum pernah" }]); setDialogOpen(false); toast({ title: editing ? "Pengguna diperbarui" : "Pengguna ditambahkan", description: "Data tersimpan sebagai preview UI.", variant: "success" }); };
  const remove = () => { if (deleting) setUsers((current) => current.filter((user) => user.id !== deleting.id)); setDeleting(null); toast({ title: "Pengguna dihapus", variant: "success" }); };
  return <div className="space-y-6"><PageHeader title="Manajemen Pengguna" description="Kelola akun admin, role, dan status akses pengguna." action={<Button onClick={() => openForm()}><UserPlus className="h-4 w-4" />Tambah Pengguna</Button>} /><Card padding="none"><DataTable data={users} keyExtractor={(item) => item.id} searchPlaceholder="Cari nama atau email pengguna..." filters={[{ key: "role", label: "Role", options: [...new Set(users.map((user) => user.role))].map((value) => ({ value, label: value })) }, { key: "status", label: "Status", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Nonaktif" }] }]} columns={[{ key: "name", label: "Pengguna", render: (item) => <div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div> }, { key: "role", label: "Role", render: (item) => <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary-700" />{item.role}</div> }, { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "default"} dot>{item.status === "active" ? "Aktif" : "Nonaktif"}</Badge> }, { key: "lastActive", label: "Aktivitas terakhir", render: (item) => <span className="text-muted">{item.lastActive}</span> }, { key: "actions", label: "", className: "w-24 text-right", render: (item) => <div className="flex justify-end gap-1"><Button size="sm" variant="ghost" aria-label={`Edit ${item.name}`} onClick={() => openForm(item)}><Pencil className="h-4 w-4" /></Button><Button size="sm" variant="ghost" aria-label={`Hapus ${item.name}`} onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4 text-danger-600" /></Button></div> }]} /></Card><Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? "Edit Pengguna" : "Tambah Pengguna"} description="Lengkapi informasi akses pengguna admin." footer={<><Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button onClick={save} disabled={!form.name.trim() || !form.email.trim()}><Plus className="h-4 w-4" />Simpan</Button></>}><div className="space-y-4"><Input label="Nama lengkap" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /><Input label="Email" required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value.toLowerCase() }))} /><Select label="Role" options={[{ value: "Super Admin", label: "Super Admin" }, { value: "Admission Officer", label: "Admission Officer" }, { value: "Finance Officer", label: "Finance Officer" }]} value={form.role} onChange={(role) => setForm((current) => ({ ...current, role }))} /></div></Dialog><ConfirmDialog open={deleting !== null} onClose={() => setDeleting(null)} onConfirm={remove} title="Hapus pengguna?" description={`Akun ${deleting?.name ?? "ini"} akan dihapus dari preview UI.`} confirmLabel="Hapus Pengguna" /></div>;
}
