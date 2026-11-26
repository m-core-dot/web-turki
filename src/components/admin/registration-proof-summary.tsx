"use client";

import { useState } from "react";
import { ExternalLink, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { getRegistrationProofUrl } from "@/app/(admin)/admin/registrasi/[registrationId]/actions";

export function RegistrationProofSummary({ fileName, fileUrl }: { fileName: string | null; fileUrl: string | null }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isPdf = fileName?.toLowerCase().endsWith(".pdf") ?? false;

  const openPreview = async () => {
    if (!fileUrl) return;
    const result = await getRegistrationProofUrl(fileUrl, fileName ?? undefined);
    if (result.ok) setPreviewUrl(result.url);
  };

  return <>
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50"><FileText className="h-5 w-5 text-primary-700" /></div>
          <div><h2 className="font-semibold">Bukti pendaftaran</h2><p className="mt-1 text-sm text-muted">Dokumen pendaftaran yang diunggah admin.</p></div>
        </div>
        <Badge variant={fileName ? "success" : "default"} dot>{fileName ? "Tersedia" : "Belum tersedia"}</Badge>
      </div>
      {fileName && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background-alt/50 p-3"><span className="truncate text-sm text-muted">{fileName}</span>{fileUrl && <Button size="sm" variant="outline" onClick={() => void openPreview()}><Eye className="h-3.5 w-3.5" />Preview</Button>}</div>}
    </Card>
    <Dialog open={previewUrl !== null} onClose={() => setPreviewUrl(null)} title="Preview Bukti pendaftaran" description={fileName ?? "Dokumen pendaftaran"} footer={<><Button variant="outline" onClick={() => setPreviewUrl(null)}>Tutup</Button>{previewUrl && <Button onClick={() => window.open(previewUrl, "_blank", "noopener,noreferrer")}><ExternalLink className="h-3.5 w-3.5" />Buka di tab baru</Button>}</>}>
      {previewUrl && (isPdf ? <iframe title="Preview bukti pendaftaran" src={previewUrl} className="h-96 w-full rounded-lg bg-white" /> : <img src={previewUrl} alt={`Preview ${fileName ?? "bukti pendaftaran"}`} className="max-h-96 w-full rounded-lg bg-background-alt object-contain" />)}
    </Dialog>
  </>;
}
