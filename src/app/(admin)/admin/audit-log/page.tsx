"use client";

import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockAuditLogs } from "@/lib/mock-data";

export default function AuditLogPage() {
  return <AdminTablePage title="Audit Log" description="Jejak perubahan dan aktivitas penting dalam sistem." data={mockAuditLogs} keyExtractor={(item) => item.id} searchPlaceholder="Cari aktor, aksi, atau target..." columns={[
    { key: "id", label: "ID Log", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "actor", label: "Aktor", render: (item) => <span className="font-medium text-foreground">{item.actor}</span> },
    { key: "action", label: "Aksi", render: (item) => <div className="flex items-center gap-2"><ScrollText className="h-4 w-4 text-primary-600" /><span>{item.action}</span></div> },
    { key: "target", label: "Target", render: (item) => <Badge variant="outline">{item.target}</Badge> },
    { key: "time", label: "Waktu", render: (item) => <span className="text-muted">{item.time}</span> },
  ]} />;
}

