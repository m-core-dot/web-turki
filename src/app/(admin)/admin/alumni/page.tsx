"use client";

import { GraduationCap } from "lucide-react";
import { AdminActionMenu } from "@/components/shared/admin-action-menu";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { StatusBadge } from "@/components/shared/status-badge";
import { mockStudents } from "@/lib/mock-data";

const alumni = mockStudents.map((student, index) => ({
  ...student,
  graduationYear: String(Number(student.registration) + 4),
  destination: ["Istanbul University", "Ankara University", "Middle East Technical University"][index % 3],
  studyStatus: index % 2 === 0 ? "Lulus" : "Sedang Berjalan",
}));

export default function AlumniPage() {
  return <AdminTablePage title="Alumni" description="Kelola data alumni dan pantau riwayat pendidikan peserta MTAS." data={alumni} keyExtractor={(item) => item.id} filters={[{ key: "graduationYear", label: "Tahun Lulus", options: [...new Set(alumni.map((item) => item.graduationYear))].map((value) => ({ value, label: value })) }, { key: "studyStatus", label: "Status", options: [{ value: "Lulus", label: "Lulus" }, { value: "Sedang Berjalan", label: "Sedang Berjalan" }] }]} searchPlaceholder="Cari nama atau email alumni..." columns={[
    { key: "id", label: "ID Alumni", render: (item) => <span className="font-mono text-xs text-muted">ALM-{item.id.replace("STD-", "")}</span> },
    { key: "name", label: "Alumni", render: (item) => <div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div> },
    { key: "destination", label: "Universitas", render: (item) => <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary-700" /><span>{item.destination}</span></div> },
    { key: "graduationYear", label: "Tahun Lulus", render: (item) => <span className="text-muted">{item.graduationYear}</span> },
    { key: "studyStatus", label: "Status", render: (item) => <StatusBadge status={item.studyStatus === "Lulus" ? "approved" : "under_review"} /> },
    { key: "actions", label: "", className: "w-12 text-right", render: (item) => <AdminActionMenu viewHref={`/admin/peserta/${item.id}`} /> },
  ]} />;
}
