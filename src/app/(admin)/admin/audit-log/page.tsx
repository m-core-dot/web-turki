"use client";

import { useEffect, useState } from "react";
import { Eye, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { fetchAuditLogs, type AuditLog } from "./actions";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadError, setLoadError] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchAuditLogs().then((result) => {
      if (result.ok) setLogs(result.data);
      else setLoadError(result.message);
    });
  }, []);

  const actors = [...new Set(logs.map((item) => item.actor))].map((value) => ({ value, label: value }));

  return <>
    <AdminTablePage title="Audit Log" description={loadError || "Jejak perubahan dan aktivitas penting dalam sistem."} data={logs} keyExtractor={(item) => item.id} filters={[{ key: "actor", label: "Aktor", options: actors }]} searchPlaceholder="Cari aktor, aksi, atau target..." columns={[
      { key: "id", label: "ID Log", render: (item) => <span className="font-mono text-xs text-muted" title={item.id}>AUD-{item.id.slice(0, 6).toUpperCase()}</span> },
      { key: "actor", label: "Aktor", render: (item) => <span className="font-medium text-foreground">{item.actor}</span> },
      { key: "action", label: "Aksi", render: (item) => <div className="flex items-center gap-2"><ScrollText className="h-4 w-4 text-primary-600" /><span className="max-w-md truncate">{item.action}</span></div> },
      { key: "target", label: "Target", render: (item) => <Badge variant="outline">{item.target}</Badge> },
      { key: "time", label: "Waktu", render: (item) => <span className="text-muted">{new Date(item.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span> },
      { key: "detail", label: "Detail", render: (item) => <button type="button" onClick={() => setSelectedLog(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background-alt"><Eye className="h-3.5 w-3.5" />Lihat</button> },
    ]} />
    <Dialog open={Boolean(selectedLog)} onClose={() => setSelectedLog(null)} title="Detail Audit Log" description={selectedLog ? `${selectedLog.actor} · ${selectedLog.target}` : undefined}>
      {selectedLog && <div className="space-y-4"><div className="rounded-xl bg-background-alt p-4"><p className="text-xs font-medium uppercase tracking-wide text-muted">Aksi</p><p className="mt-1 text-sm font-semibold text-foreground">{selectedLog.action}</p></div>{selectedLog.metadata.changes?.length ? <div className="overflow-hidden rounded-xl border border-border"><div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border bg-background-alt px-4 py-3 text-xs font-semibold text-muted"><span>Field</span><span>Sebelum</span><span>Sesudah</span></div>{selectedLog.metadata.changes.map((change) => <div key={change.field} className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border px-4 py-3 text-sm last:border-0"><span className="font-medium">{change.label}</span><span className="break-words text-danger-700">{change.before}</span><span className="break-words text-success-700">{change.after}</span></div>)}</div> : <p className="rounded-xl border border-border px-4 py-6 text-center text-sm text-muted">Log ini tidak memiliki detail perubahan terstruktur.</p>}</div>}
    </Dialog>
  </>;
}
