"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, FileText, UploadCloud, X, Check } from "lucide-react";
import { getAdminDocumentDetail, reviewAdminDocument } from "./actions";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";

export default function DocumentDetailPage({ params }: { params: Promise<{ documentId: string }> }) {
  const [document, setDocument] = useState<Awaited<ReturnType<typeof getAdminDocumentDetail>>["data"]>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    params.then(({ documentId }) => getAdminDocumentDetail(documentId)).then((result) => { setDocument(result.data); setError(result.error); });
  }, [params]);
  if (error) return <div className="space-y-6"><Link href="/admin/dokumen" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke dokumen</Link><Card><p className="text-sm text-danger-600">{error}</p></Card></div>;
  if (!document) return <div className="space-y-6"><PageHeader title="Detail Dokumen" description="Memuat data dokumen..." /><Card><p className="text-sm text-muted">Memuat...</p></Card></div>;
  const status = document.status === "revision" ? "needs_revision" : document.status;
  const previewUrl = document.drive_url;
  const review = async (nextStatus: "approved" | "rejected" | "revision") => { setBusy(true); const result = await reviewAdminDocument(document.id, nextStatus, nextStatus === "revision" ? window.prompt("Catatan revisi") ?? "" : undefined); setBusy(false); if (result.error) { window.alert(result.error); return; } const refreshed = await getAdminDocumentDetail(document.id); setDocument(refreshed.data); };
  return <div className="space-y-6"><Link href="/admin/dokumen" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke dokumen</Link><PageHeader title="Detail Dokumen" description={document.id} action={status !== "approved" ? <div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => review("approved")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success-600 px-3 text-sm font-medium text-white disabled:opacity-50"><Check className="h-4 w-4" />Setujui</button><button disabled={busy} onClick={() => review("rejected")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-danger-600 px-3 text-sm font-medium text-white disabled:opacity-50"><X className="h-4 w-4" />Tolak</button><button disabled={busy} onClick={() => review("revision")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground disabled:opacity-50"><UploadCloud className="h-4 w-4" />Minta revisi</button></div> : undefined} /><div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-2"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50"><FileText className="h-6 w-6 text-primary-700" /></div><div><h2 className="font-semibold">{document.document_type}</h2><p className="mt-1 text-sm text-muted">{document.student}</p></div><div className="ml-auto"><StatusBadge status={status} /></div></div><div className="mt-7 grid gap-4 border-t border-border pt-5 sm:grid-cols-3"><div><p className="text-xs text-muted">Versi</p><p className="mt-1 text-sm font-medium">v{document.revision_number + 1}</p></div><div><p className="text-xs text-muted">Diunggah</p><p className="mt-1 text-sm font-medium">{document.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString("id-ID") : "-"}</p></div><div><p className="text-xs text-muted">File</p><p className="mt-1 truncate text-sm font-medium">{document.file_name ?? "-"}</p></div></div>{previewUrl && <div className="mt-6 border-t border-border pt-5"><div className="mb-3 flex justify-end"><a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-700"><ExternalLink className="h-4 w-4" />Buka file</a></div><iframe src={previewUrl} title={document.document_type} className="h-[55vh] min-h-96 w-full rounded-lg border border-border" /></div>}</Card><Card><h2 className="font-semibold">Riwayat versi</h2><div className="mt-4 space-y-3"><div className="flex items-center justify-between rounded-lg bg-background-alt p-3"><span className="text-sm">v{document.revision_number + 1} · terbaru</span><Badge variant="info">Aktif</Badge></div></div></Card></div></div>;
}