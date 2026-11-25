"use client";

import { useState } from "react";
import { ArrowLeft, Check, Shield, Users } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const permissions = ["Melihat dashboard", "Mengelola registrasi", "Mengelola peserta", "Mengelola dokumen", "Mengelola universitas", "Memproses pembayaran", "Mengirim notifikasi", "Melihat audit log"];
const initialRoles = [
  { id: "super-admin", name: "Super Admin", description: "Akses penuh ke seluruh modul MTAS.", members: 2, permissions },
  { id: "admission", name: "Admission Officer", description: "Mengelola registrasi, peserta, dan dokumen.", members: 4, permissions: permissions.slice(0, 4) },
  { id: "finance", name: "Finance Officer", description: "Mengelola pembayaran dan laporan keuangan.", members: 2, permissions: [permissions[0], permissions[5]] },
];

export default function RolePermissionPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedId, setSelectedId] = useState(initialRoles[0].id);
  const selected = roles.find((role) => role.id === selectedId) ?? roles[0];
  const togglePermission = (permission: string) => setRoles((current) => current.map((role) => role.id === selected.id ? { ...role, permissions: role.permissions.includes(permission) ? role.permissions.filter((item) => item !== permission) : [...role.permissions, permission] } : role));
  const save = () => toast({ title: "Permission diperbarui", description: `${selected.name} berhasil disimpan pada preview UI.`, variant: "success" });
  return <div className="space-y-6"><Link href="/admin/pengaturan" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke pengaturan</Link><PageHeader title="Role & Permission" description="Kelola role dan hak akses pengguna admin." action={<Button onClick={save}><Check className="h-4 w-4" />Simpan Perubahan</Button>} /><div className="grid gap-6 lg:grid-cols-3"><Card padding="none" className="overflow-hidden"><div className="border-b border-border px-5 py-4"><h2 className="font-semibold">Daftar Role</h2><p className="mt-1 text-sm text-muted">Pilih role untuk mengatur permission.</p></div><div className="divide-y divide-border">{roles.map((role) => <button key={role.id} type="button" onClick={() => setSelectedId(role.id)} className={`w-full px-5 py-4 text-left transition-colors ${role.id === selected.id ? "bg-primary-50" : "hover:bg-background-alt"}`}><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt"><Shield className="h-4 w-4 text-primary-700" /></div><div className="min-w-0 flex-1"><p className="font-medium text-foreground">{role.name}</p><p className="mt-1 text-xs leading-5 text-muted">{role.description}</p><div className="mt-2 flex items-center gap-1.5 text-xs text-muted"><Users className="h-3.5 w-3.5" />{role.members} pengguna</div></div></div></button>)}</div></Card><Card className="lg:col-span-2"><div className="flex items-start justify-between gap-4 border-b border-border pb-5"><div><p className="text-xs font-medium uppercase tracking-wider text-muted">Role aktif</p><h2 className="mt-1 text-lg font-semibold">{selected.name}</h2><p className="mt-1 text-sm text-muted">{selected.description}</p></div><Badge variant="info">{selected.permissions.length} permission</Badge></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{permissions.map((permission) => { const enabled = selected.permissions.includes(permission); return <button key={permission} type="button" onClick={() => togglePermission(permission)} className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${enabled ? "border-primary-200 bg-primary-50 text-primary-800" : "border-border bg-white text-muted hover:bg-background-alt"}`}><span>{permission}</span><span className={`flex h-5 w-5 items-center justify-center rounded border ${enabled ? "border-primary-700 bg-primary-700 text-white" : "border-border"}`}>{enabled && <Check className="h-3.5 w-3.5" />}</span></button>; })}</div></Card></div></div>;
}
