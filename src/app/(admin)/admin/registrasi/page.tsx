"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { AdminActionMenu } from "@/components/shared/admin-action-menu";
import { NewRegistrationDialog } from "@/components/admin/new-registration-dialog";
import { fetchRegistrations } from "./actions";

type RegistrationRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  submittedAt: string;
  status: "pending_review" | "approved" | "needs_revision" | "rejected";
};

export default function RegistrasiPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState<RegistrationRow[]>([]);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    fetchRegistrations().then((result) => {
      if (result.ok) {
        setData(result.data.map((item) => ({ id: item.registration_number, name: item.full_name, email: item.email, phone: item.whatsapp_phone, batch: String(item.batch), submittedAt: new Date(item.submitted_at).toLocaleDateString("id-ID"), status: item.status as RegistrationRow["status"] })));
      } else {
        setData([]);
        setLoadError(result.message);
      }
    });
  }, []);
  return <><AdminTablePage title="Registrasi" description={loadError || "Kelola dan review pendaftaran calon peserta."} action={<Button onClick={() => setDialogOpen(true)}><UserPlus className="h-4 w-4" />Registrasi Baru</Button>} data={data} keyExtractor={(item) => item.id} filters={[{ key: "status", label: "Status", options: [{ value: "pending_review", label: "Menunggu Review" }, { value: "approved", label: "Disetujui" }, { value: "needs_revision", label: "Perlu Revisi" }, { value: "rejected", label: "Ditolak" }] }]} searchPlaceholder="Cari nama atau nomor registrasi..." columns={[
    { key: "student", label: "Peserta", render: (item) => <div className="flex items-center gap-3"><Avatar name={item.name} size="sm" /><div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div></div> },
    { key: "id", label: "No. Registrasi", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "batch", label: "Angkatan", render: (item) => <span>{item.batch}</span> },
    { key: "date", label: "Tanggal", render: (item) => <span className="text-muted">{item.submittedAt}</span> },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "actions", label: "", className: "w-12 text-right", render: (item) => <AdminActionMenu viewHref={`/admin/registrasi/${item.id}`} approveLabel="Setujui Registrasi" /> },
  ]} /><NewRegistrationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} /></>;
}


