"use server";

import { createRegistration } from "@/lib/registrations";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function checkPublicNik(nik: string) {
  const { data, error } = await getSupabaseAdminClient().from("registrations").select("status").eq("nik", nik).neq("status", "rejected").maybeSingle();
  if (error) return { available: false, message: "NIK tidak dapat diverifikasi saat ini." };
  if (!data) return { available: true, message: "" };
  return data.status === "approved"
    ? { available: false, message: "NIK sudah terdaftar dan registrasinya telah disetujui." }
    : { available: false, message: "NIK sudah terdaftar dan registrasinya masih menunggu review." };
}

export async function getAddressSuggestions() {
  const { data, error } = await getSupabaseAdminClient()
    .from("registrations")
    .select("regency, province")
    .order("province", { ascending: true });
  if (error) return { cities: [] as string[], provinces: [] as string[] };
  const cities = [...new Set((data ?? []).map((item) => item.regency?.trim()).filter(Boolean))].sort();
  const provinces = [...new Set((data ?? []).map((item) => item.province?.trim()).filter(Boolean))].sort();
  return { cities, provinces };
}

export async function getPaymentQuote() {
  const { count, error } = await getSupabaseAdminClient().from("registrations").select("id", { count: "exact", head: true });
  if (error) return { ok: false as const, message: "Nominal pembayaran belum dapat dihitung." };
  const uniqueCode = (count ?? 0) + 1;
  return { ok: true as const, baseAmount: 1500000, uniqueCode, totalAmount: 1500000 + uniqueCode };
}

export async function submitPublicRegistration(values: Record<string, string | string[]>, proof: { name: string; type: string; size: number; data: string }) {
  const majors = Array.isArray(values.majors) ? values.majors : [];
  const input = {
    values: {
      programLevel: String(values.programLevel ?? ""),
      fullName: String(values.fullName ?? ""),
      birthPlace: String(values.birthPlace ?? ""),
      birthDate: String(values.birthDate ?? ""),
      gender: String(values.gender ?? ""),
      passport: String(values.passportNumber ?? ""),
      nik: String(values.nik ?? ""),
      telegram: String(values.telegram ?? ""),
      email: String(values.email ?? ""),
      phone: String(values.phone ?? ""),
      fatherName: String(values.fatherName ?? ""),
      fatherPhone: String(values.parentPhone ?? ""),
      motherName: String(values.motherName ?? ""),
      motherPhone: String(values.parentPhone ?? ""),
      address: String(values.address ?? ""),
      rtRw: `${String(values.rt ?? "").trim() || "-"}/${String(values.rw ?? "").trim() || "-"}`,
      village: String(values.village ?? ""),
      district: String(values.district ?? ""),
      regency: String(values.regency ?? ""),
      province: String(values.province ?? ""),
      postalCode: String(values.postalCode ?? "").trim() || "-",
      school: String(values.school ?? ""),
      schoolCity: String(values.schoolCity ?? ""),
      schoolProvince: String(values.schoolProvince ?? ""),
      major: String(values.schoolMajor ?? ""),
      preferenceOne: String(majors[0] ?? ""),
      preferenceTwo: String(majors[1] ?? ""),
      preferenceThree: String(majors[2] ?? ""),
    },
    source: String(values.source ?? ""),
    sourceOther: String(values.sourceOther ?? ""),
  };

  try {
    if (!proof?.name || !["application/pdf", "image/jpeg", "image/png"].includes(proof.type) || proof.size > 5 * 1024 * 1024) return { ok: false as const, message: "Bukti pembayaran wajib berupa PDF, JPG, atau PNG maksimal 5 MB." };
    const admin = getSupabaseAdminClient();
    const storagePath = `pending/${crypto.randomUUID()}-${proof.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const appsScriptUrl = process.env.GOOGLE_DRIVE_APPS_SCRIPT_URL;
    const token = process.env.GOOGLE_DRIVE_APPS_SCRIPT_TOKEN;
    let driveMetadata: { fileId: string; webViewLink: string; fileName: string } | null = null;
    if (appsScriptUrl && token) {
      const response = await fetch(appsScriptUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, registrationNumber: `pending-${crypto.randomUUID()}`, studentName: String(values.fullName ?? ""), batch: new Date().getFullYear(), category: "bukti_pembayaran", fileName: proof.name, mimeType: proof.type, base64: proof.data }), cache: "no-store" });
      const result = await response.json() as { ok?: boolean; message?: string; fileId?: string; webViewLink?: string; fileName?: string };
      if (!response.ok || !result.ok || !result.fileId || !result.webViewLink) return { ok: false as const, message: result.message || "Bukti pembayaran gagal disimpan ke Google Drive." };
      driveMetadata = { fileId: result.fileId, webViewLink: result.webViewLink, fileName: result.fileName || proof.name };
    } else {
      const upload = await admin.storage.from("registration-proofs").upload(storagePath, Buffer.from(proof.data, "base64"), { contentType: proof.type, upsert: false });
      if (upload.error) return { ok: false as const, message: "Bukti pembayaran gagal diunggah." };
    }
    const { count } = await admin.from("registrations").select("id", { count: "exact", head: true });
    const uniqueCode = (count ?? 0) + 1;
    const amount = 1500000 + uniqueCode;
    const { data, error } = await createRegistration(input, { amount, uniqueCode, proofFileName: driveMetadata?.fileName || proof.name, proofStoragePath: driveMetadata?.webViewLink || storagePath, proofDriveFileId: driveMetadata?.fileId, proofDriveUrl: driveMetadata?.webViewLink });
    if (error?.code === "23505" || error?.code === "NIK_ACTIVE") return { ok: false as const, message: error.message };
    if (error) {
      console.error("Failed to create public registration", {
        code: error.code,
        message: error.message,
        details: "details" in error ? error.details : undefined,
        hint: "hint" in error ? error.hint : undefined,
      });
      if (error.code === "42703" || error.code === "PGRST204") return { ok: false as const, message: "Kolom pembayaran belum tersedia di database. Jalankan migration pembayaran di Supabase terlebih dahulu." };
      if (error.code === "23514") return { ok: false as const, message: "Data pembayaran tidak sesuai aturan database. Pastikan migration pembayaran sudah diterapkan." };
      return { ok: false as const, message: error.message || "Registrasi gagal disimpan. Coba lagi." };
    }
    return { ok: true as const, data };
  } catch (error) {
    console.error("Invalid public registration", error);
    return { ok: false as const, message: "Data registrasi belum lengkap atau tidak valid." };
  }
}
