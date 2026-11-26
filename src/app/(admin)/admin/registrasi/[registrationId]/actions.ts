"use server";

import { getSupabaseAdminClient, participantDefaultPasswordPrefix } from "@/lib/supabase/server";

export async function fetchRegistration(id: string) {
  const { data, error } = await getSupabaseAdminClient()
    .from("registrations")
    .select("*")
    .eq("registration_number", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch registration", error);
    return { ok: false as const, message: `Detail registrasi gagal dimuat: ${error.message}` };
  }
  if (!data) return { ok: false as const, message: "Registrasi tidak ditemukan." };
  return { ok: true as const, data };
}

function getDriveFileId(value: string) {
  const match = value.match(/[?&]id=([^&]+)/) || value.match(/\/d\/([^/]+)/);
  return match?.[1] || value;
}

export async function getRegistrationProofUrl(fileUrl: string) {
  if (!fileUrl) return { ok: false as const, message: "Bukti pendaftaran tidak tersedia." };
  const fileId = getDriveFileId(fileUrl);
  return { ok: true as const, url: `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1200` };
}

export async function uploadRegistrationProof(registrationNumber: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false as const, message: "Pilih file bukti pendaftaran terlebih dahulu." };
  if (file.size > 10 * 1024 * 1024) return { ok: false as const, message: "Ukuran file maksimal 10 MB." };
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) return { ok: false as const, message: "Format file harus PDF, JPG, atau PNG." };

  const supabase = getSupabaseAdminClient();
  const { data: registration, error: lookupError } = await supabase
    .from("registrations")
    .select("full_name, batch")
    .eq("registration_number", registrationNumber)
    .single();
  if (lookupError || !registration) return { ok: false as const, message: "Data registrasi tidak ditemukan." };

  const appsScriptUrl = process.env.GOOGLE_DRIVE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzccmR7MuKcjs4Zhh_1FSk2W0fJuKI0CPsmgvv0slJy4qldEImrrgrhhRAb3n81M8ko/exec";
  const token = process.env.GOOGLE_DRIVE_APPS_SCRIPT_TOKEN;
  if (!token) return { ok: false as const, message: "Token Google Drive Apps Script belum dikonfigurasi di server." };

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const response = await fetch(appsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, registrationNumber, studentName: registration.full_name, batch: registration.batch, category: "bukti_pendaftaran", fileName: file.name, mimeType: file.type, base64 }),
    cache: "no-store",
  });
  const result = await response.json() as { ok?: boolean; message?: string; fileId?: string; webViewLink?: string; fileName?: string };
  if (!response.ok || !result.ok || !result.fileId || !result.webViewLink) return { ok: false as const, message: result.message || "File gagal disimpan ke Google Drive." };

  const { error } = await supabase.from("registrations").update({ proof_file_name: result.fileName || file.name, proof_drive_file_id: result.fileId, proof_drive_url: result.webViewLink }).eq("registration_number", registrationNumber);
  if (error) return { ok: false as const, message: `Metadata file gagal disimpan: ${error.message}` };
  return { ok: true as const, fileName: result.fileName || file.name, storagePath: result.webViewLink, proofUrl: result.webViewLink };
}

export async function approveRegistration(registrationNumber: string) {
  const supabase = getSupabaseAdminClient();
  const { data: registration, error: lookupError } = await supabase.from("registrations").select("id, email, nik, status").eq("registration_number", registrationNumber).single();
  if (lookupError || !registration) return { ok: false as const, message: "Registrasi tidak ditemukan." };
  if (registration.status === "approved") return { ok: false as const, message: "Registrasi sudah disetujui sebelumnya." };

  const email = registration.email.trim().toLowerCase();
  const password = `${participantDefaultPasswordPrefix}${registrationNumber.replace(/^REG-\\d{4}-/, "")}`;
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (authError && authError.message.toLowerCase().includes("already been registered")) return { ok: false as const, message: "Email peserta sudah memiliki akun portal." };
  if (authError || !authUser.user) return { ok: false as const, message: authError?.message || "Akun portal gagal dibuat." };

  const { error: updateError } = await supabase.from("registrations").update({ status: "approved", auth_user_id: authUser.user.id, must_change_password: true }).eq("id", registration.id);
  if (updateError) {
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return { ok: false as const, message: `Status registrasi gagal diperbarui: ${updateError.message}` };
  }

  return { ok: true as const, login: email, temporaryPassword: password, nik: registration.nik };
}

export async function updateInternalNote(registrationNumber: string, note: string) {
  const { error } = await getSupabaseAdminClient()
    .from("registrations")
    .update({ internal_notes: note.trim() || null })
    .eq("registration_number", registrationNumber);

  if (error) {
    console.error("Failed to update internal note", error);
    return { ok: false as const, message: "Catatan internal gagal disimpan." };
  }

  return { ok: true as const };
}
