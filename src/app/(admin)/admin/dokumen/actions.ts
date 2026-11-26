"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type AdminDocument = {
  id: string;
  student: string;
  type: string;
  version: string;
  uploadedAt: string;
  status: "pending_review" | "approved" | "needs_revision" | "rejected" | "not_uploaded";
};

export async function getAdminDocuments() {
  const supabase = getSupabaseAdminClient();
  const [{ data: documents, error: documentError }, { data: registrations, error: registrationError }] = await Promise.all([
    supabase.from("participant_documents").select("id, registration_number, document_type, revision_number, uploaded_at, status" ).order("uploaded_at", { ascending: false }),
    supabase.from("registrations").select("registration_number, full_name"),
  ]);
  if (documentError) return { data: [] as AdminDocument[], error: documentError.message };
  if (registrationError) return { data: [] as AdminDocument[], error: registrationError.message };
  const names = new Map((registrations ?? []).map((registration) => [registration.registration_number, registration.full_name]));
  return {
    data: (documents ?? []).map((document) => ({
      id: document.id,
      student: names.get(document.registration_number) ?? document.registration_number,
      type: document.document_type,
      version: `v${document.revision_number + 1}`,
      uploadedAt: document.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-",
      status: document.status === "revision" ? "needs_revision" : document.status === "not_uploaded" && document.uploaded_at ? "pending_review" : document.status,
    })) as AdminDocument[],
    error: null,
  };
}
