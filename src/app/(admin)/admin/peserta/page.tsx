"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { AdminActionMenu } from "@/components/shared/admin-action-menu";
import { fetchParticipantCompleteness, fetchRegistrations } from "../registrasi/actions";

type Participant = {
  id: string;
  name: string;
  email: string;
  registration: string;
  completeness: number;
  applications: number;
  status: "active" | "incomplete";
};

export default function PesertaPage() {
  const router = useRouter();
  const [data, setData] = useState<Participant[]>([]);
  const [description, setDescription] = useState("Daftar peserta dan kelengkapan profil.");

  useEffect(() => {
    fetchRegistrations().then(async (result) => {
      if (!result.ok) {
        setDescription(result.message);
        return;
      }
      const approved = result.data.filter((item) => item.status === "approved");
      const completenessResult = await fetchParticipantCompleteness(approved.map((item) => item.registration_number));
      const completeness = completenessResult.ok ? completenessResult.data : {};
      setData(approved.map((item) => ({
        id: item.registration_number,
        name: item.full_name,
        email: item.email,
        registration: String(item.batch),
        completeness: completeness[item.registration_number] ?? 0,
        applications: 0,
        status: (completeness[item.registration_number] ?? 0) === 50 ? "active" : "incomplete",
      })));
    });
  }, []);

  return <AdminTablePage title="Peserta" description={description} data={data} keyExtractor={(item) => item.id} filters={[{ key: "status", label: "Status", options: [{ value: "active", label: "Aktif" }, { value: "incomplete", label: "Belum Lengkap" }] }, { key: "registration", label: "Angkatan", options: [{ value: "2026", label: "2026" }, { value: "2025", label: "2025" }] }]} searchPlaceholder="Cari nama atau email peserta..." columns={[
    { key: "student", label: "Peserta", render: (item) => <div className="flex items-center gap-3"><Avatar name={item.name} size="sm" /><div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div></div> },
    { key: "id", label: "ID Peserta", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "batch", label: "Angkatan", render: (item) => <span>{item.registration}</span> },
    { key: "complete", label: "Kelengkapan", render: (item) => <div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-background-alt"><div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${item.completeness}%` }} /></div><span className="text-xs tabular-nums text-muted">{item.completeness}%</span></div> },
    { key: "apps", label: "Aplikasi", render: (item) => <span>{item.applications}</span> },
    { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "warning"} dot>{item.status === "active" ? "Aktif" : "Belum Lengkap"}</Badge> },
    { key: "actions", label: "", className: "w-12 text-right", render: (item) => <AdminActionMenu viewHref={`/admin/peserta/${item.id}`} readOnly /> },
  ]} onRowClick={(item) => router.push(`/admin/peserta/${item.id}`)} />;
}



