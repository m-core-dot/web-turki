"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockUniversities } from "@/lib/mock-data";

export default function UniversitasPage() {
  return <AdminTablePage title="Universitas" description="Kelola master universitas mitra di Turki." action={<Button><Plus className="h-4 w-4" />Tambah Universitas</Button>} data={mockUniversities} keyExtractor={(item) => item.id} searchPlaceholder="Cari universitas atau kota..." columns={[
    { key: "name", label: "Universitas", render: (item) => <div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.id}</p></div> },
    { key: "city", label: "Kota", render: (item) => <span>{item.city}</span> },
    { key: "faculties", label: "Fakultas", render: (item) => <span>{item.faculties}</span> },
    { key: "intakes", label: "Intake", render: (item) => <span>{item.intakes}</span> },
    { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "default"} dot>{item.status === "active" ? "Aktif" : "Nonaktif"}</Badge> },
  ]} />;
}

