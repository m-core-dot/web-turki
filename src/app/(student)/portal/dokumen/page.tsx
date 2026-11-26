"use client";

import { useEffect, useState } from "react";
import { getDocuments, makeDocumentPublic, uploadDocument, type StudentDocument } from "./actions";
import { CheckCircle2, Clock3, ExternalLink, Eye, FileText, UploadCloud } from "lucide-react";

function documentPreviewUrl(doc: StudentDocument) {
  if (doc.drive_file_id) return `https://drive.google.com/uc?export=download&id=${doc.drive_file_id}`;
  return doc.drive_url;
}
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const status = { approved: { label: "Disetujui", variant: "success" as const, icon: CheckCircle2 }, pending_review: { label: "Menunggu review", variant: "warning" as const, icon: Clock3 }, needs_revision: { label: "Perlu revisi", variant: "info" as const, icon: UploadCloud }, not_uploaded: { label: "Belum diunggah", variant: "default" as const, icon: UploadCloud } };

export default function DokumenStudentPage() {
  const [docs, setDocs] = useState<StudentDocument[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<StudentDocument | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const load = () => getDocuments().then((result) => { if (result.error) toast({ title: "Gagal memuat dokumen", description: result.error, variant: "danger" }); setDocs(result.data); });
  useEffect(() => { load(); }, []);
  const submit = async () => { if (!file || !selected) return; const formData = new FormData(); formData.append("file", file); const result = await uploadDocument(selected, formData); if (result.error) { toast({ title: "Gagal mengunggah", description: result.error, variant: "danger" }); return; } setSelected(null); setFile(null); toast({ title: "Dokumen berhasil diunggah", description: "Dokumen masuk ke antrean review.", variant: "success" }); load(); };
  const completed = docs.filter((doc) => doc.status === "approved").length;
  const openPreview = async (doc: StudentDocument) => { if (doc.drive_file_id) { const result = await makeDocumentPublic(doc.drive_file_id); if (result.error) { toast({ title: "Preview tidak tersedia", description: result.error, variant: "danger" }); return; } } setPreview(doc); };
  return <div className="space-y-6"><PageHeader title="Dokumen" description="Unggah dokumen yang diperlukan untuk proses aplikasi." /><div className="rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm text-primary-800"><strong>{completed} dari {docs.length} dokumen selesai.</strong> Pastikan dokumen terbaca jelas dan belum kedaluwarsa.</div><div className="grid gap-4 sm:grid-cols-2">{docs.map((doc) => { const config = status[doc.status]; const Icon = config.icon; return <Card key={doc.document_type}><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-alt"><FileText className="h-5 w-5 text-muted" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="font-medium text-foreground">{doc.document_type}</p><p className="mt-1 text-xs leading-5 text-muted">{doc.description}</p></div><Icon className="h-4 w-4 shrink-0 text-muted" /></div><div className="mt-4 flex items-center justify-between gap-2"><Badge variant={config.variant} dot>{config.label}</Badge>{doc.file_name && <span className="truncate text-xs text-muted">{doc.file_name}</span>}</div>{doc.status === "needs_revision" && doc.revision_note && <div className="mt-4 rounded-lg border border-info-100 bg-info-50 px-3 py-2.5"><p className="text-xs font-semibold text-info-800">Catatan revisi</p><p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-info-700">{doc.revision_note}</p></div>}{doc.drive_url && <div className="mt-4 flex gap-2"><Button size="sm" variant="outline" className="flex-1" onClick={() => openPreview(doc)}><Eye className="h-4 w-4" />Preview</Button><Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(documentPreviewUrl(doc)!, "_blank", "noopener,noreferrer")}><ExternalLink className="h-4 w-4" />Buka tab baru</Button></div>}{doc.status !== "approved" && <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => setSelected(doc.document_type)}><UploadCloud className="h-4 w-4" />{doc.file_name ? "Ganti Dokumen" : "Unggah Dokumen"}</Button>}</div></div></Card>; })}</div><Dialog open={selected !== null} onClose={() => { setSelected(null); setFile(null); }} title={`Unggah ${selected ?? "dokumen"}`} description="Pastikan file sesuai format dan ukuran yang ditentukan." footer={<><Button variant="outline" onClick={() => setSelected(null)}>Batal</Button><Button disabled={!file} onClick={submit}>Kirim untuk Review</Button></>}><FileUpload label="File dokumen" onChange={setFile} helperText="PDF, JPG, atau PNG. Maksimal 5MB." />  </Dialog><Dialog open={preview !== null} onClose={() => setPreview(null)} title={`Preview ${preview?.document_type ?? "dokumen"}`} description={preview?.file_name ?? "Dokumen peserta"} footer={<><Button variant="outline" onClick={() => setPreview(null)}>Tutup</Button>{preview && documentPreviewUrl(preview) && <Button onClick={() => window.open(documentPreviewUrl(preview)!, "_blank", "noopener,noreferrer")}><ExternalLink className="h-4 w-4" />Buka di tab baru</Button>}</>}>
          {preview && documentPreviewUrl(preview) && <iframe src={documentPreviewUrl(preview)!} title={`Preview ${preview.document_type}`} className="h-[60vh] min-h-96 w-full rounded-lg border border-border" />}
        </Dialog></div>;
}
