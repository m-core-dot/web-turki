"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export async function reviewAdminDocument(id: string, status: "approved" | "rejected" | "revision", revisionNote?: string) {
  const admin = getSupabaseAdminClient();
  const { data: document, error: lookupError } = await admin.from("participant_documents").select("registration_number, document_type, revision_number").eq("id", id).single();
  if (lookupError || !document) return { error: "Dokumen tidak ditemukan." };
  const { error } = await admin.from("participant_documents").update({ status, revision_note: status === "revision" ? revisionNote?.trim() || null : null, revision_number: status === "revision" ? document.revision_number + 1 : document.revision_number, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  const server = await getSupabaseServerClient();
  const { data: { user } } = await server.auth.getUser();
  const { data: registration } = await admin.from("registrations").select("full_name").eq("registration_number", document.registration_number).maybeSingle();
  await admin.from("audit_logs").insert({ actor_id: user?.id ?? null, actor_name: user?.email ?? "Admin", action: `${status === "approved" ? "Menyetujui" : status === "rejected" ? "Menolak" : "Meminta revisi"} dokumen ${document.document_type}`, target: document.registration_number, metadata: { type: "participant_document_review", status, document_type: document.document_type, revision_note: revisionNote ?? null } });
  return { error: null };
}

export async function getAdminDocumentDetail(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data: document, error } = await supabase.from("participant_documents").select("id, registration_number, document_type, file_name, drive_url, revision_number, uploaded_at, status, revision_note, created_at").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!document) return { data: null, error: "Dokumen tidak ditemukan." };
  const { data: registration } = await supabase.from("registrations").select("full_name").eq("registration_number", document.registration_number).maybeSingle();
  return { data: { ...document, student: registration?.full_name ?? document.registration_number, status: document.status === "revision" ? "needs_revision" : document.status === "not_uploaded" && document.uploaded_at ? "pending_review" : document.status }, error: null };
}
