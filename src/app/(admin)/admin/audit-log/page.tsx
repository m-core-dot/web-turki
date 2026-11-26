"use client";

import { useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { fetchAuditLogs, type AuditLog } from "./actions";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchAuditLogs().then((result) => {
      if (result.ok) setLogs(result.data);
      else setLoadError(result.message);
    });
  }, []);

  const actors = [...new Set(logs.map((item) => item.actor))].map((value) => ({ value, label: value }));

  return <AdminTablePage title="Audit Log" description={loadError || "Jejak perubahan dan aktivitas penting dalam sistem."} data={logs} keyExtractor={(item) => item.id} filters={[{ key: "actor", label: "Aktor", options: actors }]} searchPlaceholder="Cari aktor, aksi, atau target..." columns={[
    { key: "id", label: "ID Log", render: (item) => <span className="font-mono text-xs text-muted" title={item.id}>AUD-{item.id.slice(0, 6).toUpperCase()}</span> },
    { key: "actor", label: "Aktor", render: (item) => <span className="font-medium text-foreground">{item.actor}</span> },
    { key: "action", label: "Aksi", render: (item) => <div className="flex items-center gap-2"><ScrollText className="h-4 w-4 text-primary-600" /><span>{item.action}</span></div> },
    { key: "target", label: "Target", render: (item) => <Badge variant="outline">{item.target}</Badge> },
    { key: "time", label: "Waktu", render: (item) => <span className="text-muted">{new Date(item.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span> },
  ]} />;
}



