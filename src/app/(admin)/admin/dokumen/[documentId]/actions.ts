"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function getAdminDocumentDetail(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data: document, error } = await supabase.from("participant_documents").select("id, registration_number, document_type, file_name, drive_url, revision_number, uploaded_at, status, revision_note, created_at").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!document) return { data: null, error: "Dokumen tidak ditemukan." };
  const { data: registration } = await supabase.from("registrations").select("full_name").eq("registration_number", document.registration_number).maybeSingle();
  return { data: { ...document, student: registration?.full_name ?? document.registration_number, status: document.status === "revision" ? "needs_revision" : document.status === "not_uploaded" && document.uploaded_at ? "pending_review" : document.status }, error: null };
}
