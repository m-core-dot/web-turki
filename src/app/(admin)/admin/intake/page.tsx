"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockIntakes } from "@/lib/mock-data";

const intakeStatus: Record<string, { label: string; variant: "default" | "success" | "warning" | "info" }> = { upcoming: { label: "Akan Dibuka", variant: "info" }, open: { label: "Dibuka", variant: "success" }, closed: { label: "Ditutup", variant: "default" }, draft: { label: "Draft", variant: "warning" } };
export default function IntakePage() {
  return <AdminTablePage title="Intake" description="Atur periode pendaftaran setiap universitas." action={<Button><Plus className="h-4 w-4" />Tambah Intake</Button>} data={mockIntakes} keyExtractor={(item) => item.id} filters={[{ key: "status", label: "Status", options: [{ value: "open", label: "Dibuka" }, { value: "upcoming", label: "Akan Dibuka" }, { value: "closed", label: "Ditutup" }] }, { key: "university", label: "Universitas", options: [{ value: "Istanbul University", label: "Istanbul University" }, { value: "Ankara University", label: "Ankara University" }, { value: "Sakarya University", label: "Sakarya University" }] }]} searchPlaceholder="Cari universitas atau periode..." columns={[
    { key: "university", label: "Universitas", render: (item) => <div><p className="font-medium text-foreground">{item.university}</p><p className="text-xs text-muted">{item.id}</p></div> },
    { key: "name", label: "Periode", render: (item) => <span>{item.name}</span> },
    { key: "open", label: "Mulai", render: (item) => <span className="text-muted">{item.openDate}</span> },
    { key: "close", label: "Berakhir", render: (item) => <span className="text-muted">{item.closeDate}</span> },
    { key: "majors", label: "Jurusan", render: (item) => <span>{item.majors}</span> },
    { key: "status", label: "Status", render: (item) => <Badge variant={intakeStatus[item.status].variant} dot>{intakeStatus[item.status].label}</Badge> },
  ]} />;
}



