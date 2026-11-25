"use client";

import { useState } from "react";
import { KeyRound, Pencil, Plus, Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { STAFF_PREVIEW_STORAGE_KEY, type StaffPreview } from "@/lib/staff-preview";

type User = { id: string; name: string; email: string; role: string; status: "active" | "inactive"; lastActive: string };

const initialUsers: User[] = [
  { id: "USR-001", name: "Admin Utama", email: "admin@mumtaza.center", role: "Super Admin", status: "active", lastActive: "Baru saja" },
  { id: "USR-002", name: "Yuni Kartika", email: "yuni@mumtaza.center", role: "Admission Officer", status: "active", lastActive: "5 menit lalu" },
  { id: "USR-003", name: "Fajar Hidayat", email: "fajar@mumtaza.center", role: "Finance Officer", status: "active", lastActive: "Kemarin" },
  { id: "USR-004", name: "Nadia Putri", email: "nadia@mumtaza.center", role: "Admission Officer", status: "inactive", lastActive: "2 minggu lalu" },
];

export default function PenggunaPage() {
  const [users, setUsers] = useState(() => {
    if (typeof window === "undefined") return initialUsers;
    const stored = window.localStorage.getItem(STAFF_PREVIEW_STORAGE_KEY);
    if (!stored) return initialUsers;
    const staff = JSON.parse(stored) as StaffPreview[];
    const syncedUsers = staff.map((member) => ({ id: member.id, name: member.name, email: `${member.name.toLowerCase().replace(/\\s+/g, ".")}@staff.mumtaza.center`, role: member.role, status: member.status, lastActive: "Belum pernah" }));
    const staffNames = new Set(staff.map((member) => member.name));
    return [...initialUsers.filter((user) => !staffNames.has(user.name)), ...syncedUsers];
  });
  const [resetting, setResetting] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ role: "Admission Officer" });
  const openRoleEditor = (user: User) => { setEditing(user); setForm({ role: user.role }); setDialogOpen(true); };
  const saveRole = () => { if (!editing) return; setUsers((current) => current.map((user) => user.id === editing.id ? { ...user, role: form.role } : user)); setDialogOpen(false); toast({ title: "Role diperbarui", description: `Role ${editing.name} berhasil diperbarui.`, variant: "success" }); };
  const resetPassword = () => { if (resetting) toast({ title: "Reset password diproses", description: `Link reset password untuk ${resetting.name} siap dikirim.`, variant: "success" }); setResetting(null); };
  return <div className="space-y-6"><PageHeader title="Manajemen Pengguna" description="Kelola akun admin, role, dan status akses pengguna." action={undefined} /><Card padding="none"><DataTable data={users} keyExtractor={(item) => item.id} searchPlaceholder="Cari nama atau email pengguna..." filters={[{ key: "role", label: "Role", options: [...new Set(users.map((user) => user.role))].map((value) => ({ value, label: value })) }, { key: "status", label: "Status", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Nonaktif" }] }]} columns={[{ key: "name", label: "Pengguna", render: (item) => <div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div> }, { key: "role", label: "Role", render: (item) => <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary-700" />{item.role}</div> }, { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "default"} dot>{item.status === "active" ? "Aktif" : "Nonaktif"}</Badge> }, { key: "lastActive", label: "Aktivitas terakhir", render: (item) => <span className="text-muted">{item.lastActive}</span> }, { key: "actions", label: "", className: "w-24 text-right", render: (item) => <div className="flex justify-end gap-1"><Button size="sm" variant="ghost" aria-label={`Edit role ${item.name}`} onClick={() => openRoleEditor(item)}><Pencil className="h-4 w-4" /></Button><Button size="sm" variant="ghost" aria-label={`Reset password ${item.name}`} onClick={() => setResetting(item)}><KeyRound className="h-4 w-4 text-primary-700" /></Button></div> }]} /></Card><Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} size="md" title="Edit Role" description={`Pilih role akses untuk ${editing?.name ?? "pengguna"}.`} footer={<><Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button onClick={saveRole}><Plus className="h-4 w-4" />Simpan Role</Button></>}><div className="space-y-4"><div className="rounded-lg bg-background-alt p-3 text-sm"><p className="font-medium text-foreground">{editing?.name}</p><p className="text-muted">{editing?.email}</p></div><Select label="Role" menuPlacement="top" className="relative z-[60]" options={[{ value: "Super Admin", label: "Super Admin" }, { value: "Admission Officer", label: "Admission Officer" }, { value: "Finance Officer", label: "Finance Officer" }]} value={form.role} onChange={(role) => setForm((current) => ({ ...current, role }))} /></div></Dialog><ConfirmDialog open={resetting !== null} onClose={() => setResetting(null)} onConfirm={resetPassword} title="Reset password?" description={`Link reset password akan disiapkan untuk ${resetting?.name ?? "pengguna ini"}.`} confirmLabel="Reset Password" variant="primary" /></div>;
}
