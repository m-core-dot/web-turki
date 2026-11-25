"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/components/ui/toast";
import { REGISTRATION_PREVIEW_STORAGE_KEY, type RegistrationPreview } from "@/lib/registration-preview";

type Field = {
  key: string;
  label: string;
  required?: boolean;
  type?: "text" | "email" | "date" | "tel" | "number" | "select";
  inputMode?: "numeric";
  maxLength?: number;
  placeholder?: string;
  colSpan?: "full";
};
type Section = { title: string; fields: Field[] };

const sections: Section[] = [
  {
    title: "Data Pribadi",
    fields: [
      { key: "fullName", label: "Nama Lengkap", colSpan: "full" },
      { key: "birthPlace", label: "Tempat Lahir" },
      { key: "birthDate", label: "Tanggal Lahir", type: "date" },
      { key: "gender", label: "Jenis Kelamin", type: "select" },
      { key: "passport", label: "Nomor Paspor", required: false },
      {
        key: "nik",
        label: "NIK KTP",
        inputMode: "numeric",
        maxLength: 16,
        placeholder: "16 angka",
      },
      { key: "telegram", label: "Username Telegram", required: false },
      {
        key: "email",
        label: "Alamat Email Aktif",
        type: "email",
        placeholder: "nama@email.com",
      },
      {
        key: "phone",
        label: "Nomor Telepon (WhatsApp)",
        type: "tel",
        inputMode: "numeric",
        placeholder: "08xxxxxxxxxx",
      },
    ],
  },
  {
    title: "Data Keluarga & Kontak",
    fields: [
      { key: "fatherName", label: "Nama Ayah" },
      {
        key: "fatherPhone",
        label: "Nomor Telepon Ayah",
        required: false,
        type: "tel",
        inputMode: "numeric",
      },
      { key: "motherName", label: "Nama Ibu" },
      {
        key: "motherPhone",
        label: "Nomor Telepon Ibu",
        type: "tel",
        inputMode: "numeric",
      },
    ],
  },
  {
    title: "Alamat Domisili Saat Ini",
    fields: [
      { key: "address", label: "Alamat Lengkap" },
      {
        key: "rtRw",
        label: "RT / RW",
        required: false,
        placeholder: "001 / 002",
      },
      { key: "village", label: "Kelurahan / Desa" },
      { key: "district", label: "Kecamatan" },
      { key: "regency", label: "Kota / Kabupaten" },
      { key: "province", label: "Provinsi" },
      { key: "postalCode", label: "Kode Pos", inputMode: "numeric" },
    ],
  },
  {
    title: "Data Pendidikan",
    fields: [
      { key: "school", label: "Sekolah / Universitas" },
      { key: "schoolCity", label: "Asal Sekolah / Universitas" },
      { key: "schoolProvince", label: "Provinsi Asal Sekolah / Universitas" },
      { key: "major", label: "Jurusan", required: false },
    ],
  },
  {
    title: "Preferensi Jurusan",
    fields: [
      { key: "preferenceOne", label: "Pilihan Jurusan 1" },
      { key: "preferenceTwo", label: "Pilihan Jurusan 2" },
      { key: "preferenceThree", label: "Pilihan Jurusan 3" },
      { key: "preferenceFour", label: "Pilihan Jurusan 4", required: false },
      { key: "preferenceFive", label: "Pilihan Jurusan 5", required: false },
    ],
  },
];

const sourceOptions = [
  "Instagram",
  "WhatsApp",
  "Facebook",
  "Teman",
  "Orang tua",
  "Sekolah",
  "Alumni",
  "Website",
  "Lainnya",
];

export function NewRegistrationDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [source, setSource] = useState("");
  const [sourceOther, setSourceOther] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const currentSection = sections[step];
  const update = (field: Field, value: string) => {
    let normalized = value;
    if (field.inputMode === "numeric") normalized = value.replace(/\D/g, "");
    else if (field.type === "email")
      normalized = value.toLowerCase().replace(/\s/g, "");
    else if (field.type !== "date") normalized = value.toUpperCase();
    setValues((current) => ({ ...current, [field.key]: normalized }));
    setError("");
  };
  const validateFields = (fields: Field[]) =>
    fields.every(
      (field) => !field.required || Boolean(values[field.key]?.trim()),
    );
  const validateStep = () => {
    if (step < sections.length && !validateFields(currentSection.fields))
      return false;
    if (
      step === sections.length &&
      (!source || (source === "Lainnya" && !sourceOther.trim()))
    )
      return false;
    if (values.nik && values.nik.length !== 16) return false;
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      return false;
    return true;
  };
  const submit = () => {
    const savePreview = (dataUrl = "") => {
      const preview: RegistrationPreview = { id: "REG-2026-001", values, source, sourceOther, submittedAt: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }), proofFile: proofFile ? { name: proofFile.name, size: proofFile.size, type: proofFile.type, dataUrl } : undefined };
      window.localStorage.setItem(REGISTRATION_PREVIEW_STORAGE_KEY, JSON.stringify(preview));
    };
    if (proofFile) { const reader = new FileReader(); reader.onload = () => savePreview(typeof reader.result === "string" ? reader.result : ""); reader.readAsDataURL(proofFile); } else savePreview();
    if (!validateStep()) {
      setError("Periksa kembali data yang wajib diisi dan formatnya.");
      return;
    }
    onClose();
    setStep(0);
    setError("");
    toast({
      title: "Registrasi baru ditambahkan",
      description: "Data tersimpan sebagai preview UI.",
      variant: "success",
    });
  };
  const isSourceStep = step === sections.length;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Registrasi Baru"
      description="Lengkapi data peserta melalui beberapa tahap."
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          {step > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                setStep((value) => value - 1);
                setError("");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          )}
          {!isSourceStep ? (
            <Button
              disabled={!validateStep()}
              onClick={() => {
                setStep((value) => value + 1);
                setError("");
              }}
            >
              Lanjut <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit}>
              <Check className="h-4 w-4" />
              Simpan Registrasi
            </Button>
          )}
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between sm:gap-2 sm:overflow-x-visible pb-1">
        {[...sections.map((section) => section.title), "Sumber Informasi"].map(
          (title, index) => (
            <div
              key={title}
              className="flex min-w-max items-center gap-2 text-xs"
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 font-semibold ${index < step ? "border-primary-700 bg-primary-700 text-white" : index === step ? "border-primary-700 bg-primary-50 text-primary-700" : "border-border text-muted"}`}
              >
                {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={
                  index === step
                    ? "font-semibold text-primary-700"
                    : "text-muted"
                }
              >
                {title}
              </span>
            </div>
          ),
        )}
      </div>
      <div className="pr-1">
        {!isSourceStep && currentSection ? (
          <section className="space-y-4">
            <h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">
              {currentSection.title}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {currentSection.fields.map((field) =>
                field.type === "select" ? (
                  <div
                    key={field.key}
                    className={field.colSpan === "full" ? "sm:col-span-2" : ""}
                  >
                    <Select
                      label={field.label}
                      options={[
                        { value: "LAKI-LAKI", label: "Laki-laki" },
                        { value: "PEREMPUAN", label: "Perempuan" },
                      ]}
                      value={values[field.key] ?? ""}
                      onChange={(value) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: value,
                        }))
                      }
                      placeholder="Pilih jenis kelamin"
                    />
                  </div>
                ) : (
                  <div
                    key={field.key}
                    className={field.colSpan === "full" ? "sm:col-span-2" : ""}
                  >
                    <Input
                      label={field.label}
                      required={field.required !== false}
                      value={values[field.key] ?? ""}
                      type={field.type ?? "text"}
                      inputMode={field.inputMode}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      onChange={(event) => update(field, event.target.value)}
                      error={
                        field.key === "nik" &&
                        values.nik &&
                        values.nik.length !== 16
                          ? "NIK harus terdiri dari tepat 16 angka."
                          : field.key === "email" &&
                              values.email &&
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
                            ? "Masukkan email yang valid."
                            : undefined
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">
              Sumber Informasi
            </h3>
            <FileUpload label="Bukti pendaftaran" onChange={setProofFile} helperText="PDF, JPG, atau PNG. Maksimal 5MB." />
            <Select
              label="Mengetahui MTAS dari"
              options={sourceOptions.map((value) => ({ value, label: value }))}
              value={source}
              onChange={(value) => {
                setSource(value);
                setError("");
              }}
              placeholder="Pilih sumber informasi"
            />
            {source === "Lainnya" && (
              <Input
                label="Sebutkan sumber lainnya"
                required
                value={sourceOther}
                onChange={(event) =>
                  setSourceOther(event.target.value.toUpperCase())
                }
              />
            )}
          </section>
        )}
        {error && <p className="mt-4 text-sm text-danger-600">{error}</p>}
      </div>
    </Dialog>
  );
}
