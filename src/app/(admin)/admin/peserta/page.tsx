"use client";

import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockStudents } from "@/lib/mock-data";

export default function PesertaPage() {
  return <AdminTablePage title="Peserta" description="Daftar peserta dan kelengkapan profil." action={<Button><Users className="h-4 w-4" />Tambah Peserta</Button>} data={mockStudents} keyExtractor={(item) => item.id} searchPlaceholder="Cari nama atau email peserta..." columns={[
    { key: "student", label: "Peserta", render: (item) => <div className="flex items-center gap-3"><Avatar name={item.name} size="sm" /><div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div></div> },
    { key: "id", label: "ID Peserta", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "batch", label: "Angkatan", render: (item) => <span>{item.registration}</span> },
    { key: "complete", label: "Kelengkapan", render: (item) => <div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-background-alt"><div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${item.completeness}%` }} /></div><span className="text-xs tabular-nums text-muted">{item.completeness}%</span></div> },
    { key: "apps", label: "Aplikasi", render: (item) => <span>{item.applications}</span> },
    { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "warning"} dot>{item.status === "active" ? "Aktif" : "Belum Lengkap"}</Badge> },
  ]} />;
}

