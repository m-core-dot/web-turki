"use client";

import { Send } from "lucide-react";
import { AdminActionMenu } from "@/components/shared/admin-action-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockApplications } from "@/lib/mock-data";

export default function AplikasiPage() {
  return <AdminTablePage title="Aplikasi Universitas" description="Pantau dan kelola aplikasi peserta ke universitas." action={<Button><Send className="h-4 w-4" />Export Aplikasi</Button>} data={mockApplications} keyExtractor={(item) => item.id} filters={[{ key: "status", label: "Status", options: [{ value: "submitted", label: "Dikirim" }, { value: "under_review", label: "Sedang Direview" }, { value: "accepted", label: "Diterima" }, { value: "rejected", label: "Ditolak" }] }, { key: "university", label: "Universitas", options: [{ value: "Istanbul University", label: "Istanbul University" }, { value: "Ankara University", label: "Ankara University" }, { value: "Sakarya University", label: "Sakarya University" }] }]} searchPlaceholder="Cari peserta, universitas, atau jurusan..." columns={[
    { key: "id", label: "ID Aplikasi", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "student", label: "Peserta", render: (item) => <span className="font-medium text-foreground">{item.student}</span> },
    { key: "university", label: "Universitas", render: (item) => <span>{item.university}</span> },
    { key: "major", label: "Jurusan", render: (item) => <span className="text-muted">{item.major}</span> },
    { key: "date", label: "Tanggal", render: (item) => <span className="text-muted">{item.submittedAt}</span> },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "actions", label: "", className: "w-12 text-right", render: (item) => <AdminActionMenu viewHref={`/admin/aplikasi/${item.id}`} approveLabel="Perbarui Status" /> },
  ]} />;
}



