"use server";

import { createRegistration } from "@/lib/registrations";

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
      rtRw: `${String(values.rt ?? "").trim()}/${String(values.rw ?? "").trim()}`,
      village: String(values.village ?? ""),
      district: String(values.district ?? ""),
      regency: String(values.regency ?? ""),
      province: String(values.province ?? ""),
      postalCode: String(values.postalCode ?? ""),
      school: String(values.school ?? ""),
      schoolCity: String(values.schoolCity ?? ""),
      schoolProvince: String(values.schoolProvince ?? ""),
      major: String(values.schoolMajor ?? ""),
      preferenceOne: String(majors[0] ?? ""),
      preferenceTwo: String(majors[1] ?? ""),
      preferenceThree: String(majors[2] ?? ""),
    },
    source: "Website",
    sourceOther: "",
  };

  try {
    const { data, error } = await createRegistration(input);
    if (error?.code === "23505") return { ok: false as const, message: "NIK atau data registrasi sudah terdaftar." };
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
