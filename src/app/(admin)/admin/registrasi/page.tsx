"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockRegistrations } from "@/lib/mock-data";
import { AdminActionMenu } from "@/components/shared/admin-action-menu";

export default function RegistrasiPage() {
  return <AdminTablePage title="Registrasi" description="Kelola dan review pendaftaran calon peserta." action={<Button><UserPlus className="h-4 w-4" />Registrasi Baru</Button>} data={mockRegistrations} keyExtractor={(item) => item.id} filters={[{ key: "status", label: "Status", options: [{ value: "pending_review", label: "Menunggu Review" }, { value: "approved", label: "Disetujui" }, { value: "needs_revision", label: "Perlu Revisi" }, { value: "rejected", label: "Ditolak" }] }]} searchPlaceholder="Cari nama atau nomor registrasi..." columns={[
    { key: "student", label: "Peserta", render: (item) => <div className="flex items-center gap-3"><Avatar name={item.name} size="sm" /><div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div></div> },
    { key: "id", label: "No. Registrasi", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "batch", label: "Angkatan", render: (item) => <span>{item.batch}</span> },
    { key: "date", label: "Tanggal", render: (item) => <span className="text-muted">{item.submittedAt}</span> },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "actions", label: "", className: "w-12 text-right", render: (item) => <AdminActionMenu viewHref={`/admin/registrasi/${item.id}`} approveLabel="Setujui Registrasi" /> },
  ]} />;
}


