"use client";

import { useEffect, useState } from "react";
import { KeyRound, Pencil, Plus, Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { fetchStaff, resetStaffPassword } from "../staff/actions";

type User = { id: string; name: string; email: string; role: string; status: "active" | "inactive"; lastActive: string };

export default function PenggunaPage() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetchStaff().then((result) => {
      if (!result.ok) return;
      setUsers(result.data.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.email?.toLowerCase() === "muafihimam@mumtazacenter.com" ? "Super Admin" : member.role,
        status: member.status,
        lastActive: "Belum pernah",
      })));
    });
  }, []);
  const [resetting, setResetting] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ role: "Admission Officer" });
  const openRoleEditor = (user: User) => { setEditing(user); setForm({ role: user.role }); setDialogOpen(true); };
  const saveRole = () => { if (!editing) return; if (editing.email.toLowerCase() === "muafihimam@mumtazacenter.com" && form.role !== "Super Admin") { toast({ title: "Role tidak dapat diubah", description: "Akun Super Admin utama harus tetap memiliki role Super Admin.", variant: "warning" }); return; } setUsers((current) => current.map((user) => user.id === editing.id ? { ...user, role: form.role } : user)); setDialogOpen(false); toast({ title: "Role diperbarui", description: `Role ${editing.name} berhasil diperbarui.`, variant: "success" }); };
  const resetPassword = async () => {
    if (!resetting) return;
    const result = await resetStaffPassword(resetting.id);
    toast({ title: result.ok ? "Password berhasil direset" : "Reset password gagal", description: result.ok ? `Password baru untuk ${resetting.name}: ${result.password}` : result.message, variant: result.ok ? "success" : "warning" });
    setResetting(null);
  };
  return <div className="space-y-6"><PageHeader title="Manajemen Pengguna" description="Kelola akun admin, role, dan status akses pengguna." action={undefined} /><Card padding="none"><DataTable data={users} keyExtractor={(item) => item.id} searchPlaceholder="Cari nama atau email pengguna..." filters={[{ key: "role", label: "Role", options: [...new Set(users.map((user) => user.role))].map((value) => ({ value, label: value })) }, { key: "status", label: "Status", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Nonaktif" }] }]} columns={[{ key: "name", label: "Pengguna", render: (item) => <div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div> }, { key: "role", label: "Role", render: (item) => <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary-700" />{item.role}</div> }, { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "default"} dot>{item.status === "active" ? "Aktif" : "Nonaktif"}</Badge> }, { key: "lastActive", label: "Aktivitas terakhir", render: (item) => <span className="text-muted">{item.lastActive}</span> }, { key: "actions", label: "", className: "w-24 text-right", render: (item) => <div className="flex justify-end gap-1">{item.email.toLowerCase() !== "muafihimam@mumtazacenter.com" && <Button size="sm" variant="ghost" aria-label={`Edit role ${item.name}`} onClick={() => openRoleEditor(item)}><Pencil className="h-4 w-4" /></Button>}<Button size="sm" variant="ghost" aria-label={`Reset password ${item.name}`} onClick={() => setResetting(item)}><KeyRound className="h-4 w-4 text-primary-700" /></Button></div> }]} /></Card><Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} size="md" title="Edit Role" description={`Pilih role akses untuk ${editing?.name ?? "pengguna"}.`} footer={<><Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button onClick={saveRole}><Plus className="h-4 w-4" />Simpan Role</Button></>}><div className="space-y-4"><div className="rounded-lg bg-background-alt p-3 text-sm"><p className="font-medium text-foreground">{editing?.name}</p><p className="text-muted">{editing?.email}</p></div><Select label="Role" menuPlacement="top" className="relative z-[60]" options={[{ value: "Super Admin", label: "Super Admin" }, { value: "Admission Officer", label: "Admission Officer" }, { value: "Finance Officer", label: "Finance Officer" }]} value={form.role} onChange={(role) => setForm((current) => ({ ...current, role }))} /></div></Dialog><ConfirmDialog open={resetting !== null} onClose={() => setResetting(null)} onConfirm={resetPassword} title="Reset password?" description={`Link reset password akan disiapkan untuk ${resetting?.name ?? "pengguna ini"}.`} confirmLabel="Reset Password" variant="primary" /></div>;
}
