"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export type StudentDocument = {
  document_type: string;
  description: string;
  file_name: string | null;
  drive_url: string | null;
  drive_file_id: string | null;
  status: "approved" | "pending_review" | "needs_revision" | "not_uploaded";
  revision_note: string | null;
};

const documentTypes = [
  { type: "Foto", description: "Pas foto formal terbaru" },
  { type: "Paspor", description: "Paspor dengan masa berlaku minimal 1 tahun" },
  { type: "KTP", description: "Kartu Tanda Penduduk" },
  { type: "Ijazah", description: "Ijazah pendidikan terakhir" },
  { type: "Transkrip Nilai", description: "Transkrip nilai pendidikan terakhir" },
  { type: "Surat Rekomendasi", description: "Opsional untuk program tertentu" },
] as const;

async function getRegistration() {
  const server = await getSupabaseServerClient();
  const { data: { user } } = await server.auth.getUser();
  if (!user) return null;
  const admin = getSupabaseAdminClient();
  const { data } = await admin.from("registrations").select("id, registration_number, full_name, batch").eq("auth_user_id", user.id).maybeSingle();
  return data;
}

export async function makeDocumentPublic(fileId: string) {
  const appsScriptUrl = process.env.GOOGLE_DRIVE_APPS_SCRIPT_URL;
  const token = process.env.GOOGLE_DRIVE_APPS_SCRIPT_TOKEN;
  if (!appsScriptUrl || !token) return { error: "Integrasi Google Drive belum dikonfigurasi di server." };
  const response = await fetch(appsScriptUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, operation: "make_public", fileId }), cache: "no-store" });
  const result = await response.json() as { ok?: boolean; message?: string };
  return !response.ok || !result.ok ? { error: result.message || "Akses file gagal diperbarui." } : { error: null };
}

export async function getDocuments() {
  const registration = await getRegistration();
  if (!registration) return { data: [], error: "Sesi peserta tidak ditemukan." };
  const { data: stored, error } = await getSupabaseAdminClient()
    .from("participant_documents")
    .select("document_type, file_name, drive_url, drive_file_id, status, revision_note")
    .eq("registration_number", registration.registration_number);
  if (error) return { data: [], error: error.message };

  const documents = documentTypes.map((definition) => {
    const document = stored?.find((item) => item.document_type === definition.type);
    const status: StudentDocument["status"] = document?.status === "revision" || document?.status === "rejected"
      ? "needs_revision"
      : document?.status === "approved" ? "approved"
      : document?.file_name ? "pending_review" : "not_uploaded";
    return { document_type: definition.type, description: definition.description, file_name: document?.file_name ?? null, drive_url: document?.drive_url ?? null, drive_file_id: document?.drive_file_id ?? null, status, revision_note: document?.revision_note ?? null };
  });
  return { data: documents, error: null };
}

export async function uploadDocument(documentType: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Pilih file dokumen terlebih dahulu." };
  if (file.size > 5 * 1024 * 1024) return { error: "Ukuran file maksimal 5 MB." };
  if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) return { error: "Format file harus PDF, JPG, atau PNG." };

  const registration = await getRegistration();
  if (!registration) return { error: "Sesi peserta tidak ditemukan." };
  const admin = getSupabaseAdminClient();
  const { data: previous } = await admin.from("participant_documents").select("revision_number").eq("registration_number", registration.registration_number).eq("document_type", documentType).maybeSingle();
  const revisionNumber = previous?.revision_number ?? 0;
  const extension = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
  const fileName = `${registration.full_name} - ${documentType}${revisionNumber > 0 ? ` - revisi ${revisionNumber}` : ""}${extension}`;
  const appsScriptUrl = process.env.GOOGLE_DRIVE_APPS_SCRIPT_URL;
  const token = process.env.GOOGLE_DRIVE_APPS_SCRIPT_TOKEN;
  if (!appsScriptUrl || !token) return { error: "Integrasi Google Drive belum dikonfigurasi di server." };
  const response = await fetch(appsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, registrationNumber: registration.registration_number, studentName: registration.full_name, batch: registration.batch, category: "dokumen_peserta", fileName, mimeType: file.type, base64: Buffer.from(await file.arrayBuffer()).toString("base64") }),
    cache: "no-store",
  });
  const result = await response.json() as { ok?: boolean; message?: string; fileId?: string; webViewLink?: string; fileName?: string };
  if (!response.ok || !result.ok || !result.fileId) return { error: result.message || "File gagal disimpan." };
  const { error } = await admin.from("participant_documents").upsert({ registration_number: registration.registration_number, document_type: documentType, file_name: result.fileName || fileName, drive_file_id: result.fileId, drive_url: result.webViewLink || null, status: "pending_review", revision_number: revisionNumber, uploaded_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: "registration_number,document_type" });
  return error ? { error: error.message } : { error: null };
}
