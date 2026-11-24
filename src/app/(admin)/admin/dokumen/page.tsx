"use client";

import { FileUp } from "lucide-react";
import { AdminActionMenu } from "@/components/shared/admin-action-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockDocuments } from "@/lib/mock-data";

export default function DokumenPage() {
  return <AdminTablePage title="Dokumen" description="Periksa dan kelola dokumen peserta." action={<Button><FileUp className="h-4 w-4" />Export Data</Button>} data={mockDocuments} keyExtractor={(item) => item.id} filters={[{ key: "status", label: "Status", options: [{ value: "pending_review", label: "Menunggu Review" }, { value: "approved", label: "Disetujui" }, { value: "needs_revision", label: "Perlu Revisi" }, { value: "rejected", label: "Ditolak" }] }, { key: "type", label: "Jenis", options: [{ value: "Paspor", label: "Paspor" }, { value: "KTP", label: "KTP" }, { value: "Ijazah", label: "Ijazah" }, { value: "Transkrip", label: "Transkrip" }] }]} searchPlaceholder="Cari peserta atau jenis dokumen..." columns={[
    { key: "id", label: "ID Dokumen", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "student", label: "Peserta", render: (item) => <span className="font-medium text-foreground">{item.student}</span> },
    { key: "type", label: "Jenis Dokumen", render: (item) => <span>{item.type}</span> },
    { key: "version", label: "Versi", render: (item) => <span className="rounded bg-background-alt px-2 py-1 text-xs">{item.version}</span> },
    { key: "date", label: "Diunggah", render: (item) => <span className="text-muted">{item.uploadedAt}</span> },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "actions", label: "", className: "w-12 text-right", render: (item) => <AdminActionMenu viewHref={`/admin/dokumen/${item.id}`} approveLabel="Setujui Dokumen" /> },
  ]} />;
}



