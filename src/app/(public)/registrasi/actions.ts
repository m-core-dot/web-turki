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

export async function submitPublicRegistration(values: Record<string, string | string[]>) {
  const majors = Array.isArray(values.majors) ? values.majors : [];
  const input = {
    values: {
      programLevel: "S1",
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
    const { data, error } = await createRegistration(input);
    if (error?.code === "23505" || error?.code === "NIK_ACTIVE") return { ok: false as const, message: error.message };
    if (error) {
      console.error("Failed to create public registration", error);
      return { ok: false as const, message: "Registrasi gagal disimpan. Coba lagi." };
    }
    return { ok: true as const, data };
  } catch (error) {
    console.error("Invalid public registration", error);
    return { ok: false as const, message: "Data registrasi belum lengkap atau tidak valid." };
  }
}
