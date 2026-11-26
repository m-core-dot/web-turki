"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileUp, UserPlus } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { AdminActionMenu } from "@/components/shared/admin-action-menu";
import { NewRegistrationDialog } from "@/components/admin/new-registration-dialog";
import { toast } from "@/components/ui/toast";
import { fetchRegistrations, importRegistrations, updateRegistrationStatus, validateRegistrations } from "./actions";

type RegistrationRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  submittedAt: string;
  status: "pending_review" | "approved" | "needs_revision" | "rejected";
};

export default function RegistrasiPage() {
  const router = useRouter();
  const importRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState<RegistrationRow[]>([]);
  const [loadError, setLoadError] = useState("");
  const [previewRows, setPreviewRows] = useState<Array<{ input: unknown; row: number; valid: boolean; errors: string[] }>>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const importTemplateHeaders = ["fullName", "birthPlace", "birthDate", "gender", "passport", "nik", "telegram", "email", "phone", "fatherName", "fatherPhone", "motherName", "motherPhone", "address", "rtRw", "village", "district", "regency", "province", "postalCode", "school", "schoolCity", "schoolProvince", "major", "preferenceOne", "preferenceTwo", "preferenceThree", "preferenceFour", "preferenceFive", "programLevel"];
  const downloadTemplate = () => {
    const exampleRows = [
      ["Ahmad Fadhil Pratama", "Jakarta", "2005-04-12", "LAKI-LAKI", "A1234567", "3170000000000001", "ahmadfadhil", "ahmad@example.com", "081234567890", "Budi Pratama", "081234567891", "Siti Aminah", "081234567892", "Jl. Melati No. 10", "001/002", "Cilandak", "Cilandak", "Jakarta Selatan", "DKI Jakarta", "12430", "SMA Negeri 1 Jakarta", "Jakarta", "DKI Jakarta", "IPA", "Teknik Informatika", "Ilmu Komputer", "Sistem Informasi", "", "", "S1"],
      ["Siti Nurhaliza Putri", "Bandung", "2000-08-20", "PEREMPUAN", "B2345678", "3270000000000002", "sitinurhaliza", "siti@example.com", "081298765432", "Ahmad Putra", "081298765433", "Rina Putri", "081298765434", "Jl. Kenanga No. 4", "003/005", "Coblong", "Coblong", "Bandung", "Jawa Barat", "40132", "Universitas Pendidikan Indonesia", "Bandung", "Jawa Barat", "Pendidikan Bahasa", "Manajemen Pendidikan", "Teknologi Pendidikan", "Administrasi Pendidikan", "", "", "S2"],
      ["Muhammad Rizki Ramadhan", "Surabaya", "1995-01-10", "LAKI-LAKI", "C3456789", "3570000000000003", "rizkir", "rizki@example.com", "081211223344", "Hasan Ramadhan", "081211223345", "Fatimah Ramadhan", "081211223346", "Jl. Mawar No. 8", "002/004", "Sukolilo", "Sukolilo", "Surabaya", "Jawa Timur", "60111", "Institut Teknologi Sepuluh Nopember", "Surabaya", "Jawa Timur", "Teknik Mesin", "Teknik Mesin", "Teknik Industri", "Energi Terbarukan", "", "", "S3"],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet([importTemplateHeaders, ...exampleRows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrasi");
    XLSX.writeFile(workbook, "template-import-registrasi.xlsx");
  };
  const handleImport = async (file: File) => {
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: false });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });
    const inputs = rows.map((row) => ({
      values: Object.fromEntries(Object.entries(row).map(([key, value]) => [key.trim(), typeof value === "number" && key.trim() === "birthDate" ? new Date(Date.UTC(1899, 11, 30 + value)).toISOString().slice(0, 10) : String(value ?? "").trim()])),
      source: "Import XLSX",
      sourceOther: "",
    }));
    const validation = await validateRegistrations(inputs);
    setPreviewRows(validation.map((item, index) => ({ ...item, input: inputs[index] })));
    setPreviewOpen(true);
    } catch (error) {
      console.error("Failed to import registrations", error);
      setLoadError("File XLSX tidak dapat diproses.");
      toast({ title: "Import gagal", description: "Periksa format file dan coba lagi.", variant: "warning" });
    }
  };
  useEffect(() => {
    fetchRegistrations().then((result) => {
      if (result.ok) {
        setData(result.data.map((item) => ({ id: item.registration_number, name: item.full_name, email: item.email, phone: item.whatsapp_phone, batch: String(item.batch), submittedAt: new Date(item.submitted_at).toLocaleDateString("id-ID"), status: item.status as RegistrationRow["status"] })));
      } else {
        setData([]);
        setLoadError(result.message);
      }
    });
  }, []);
  const refreshRegistrations = async () => {
    const result = await fetchRegistrations();
    if (result.ok) setData(result.data.map((item) => ({ id: item.registration_number, name: item.full_name, email: item.email, phone: item.whatsapp_phone, batch: String(item.batch), submittedAt: new Date(item.submitted_at).toLocaleDateString("id-ID"), status: item.status as RegistrationRow["status"] })));
    else setLoadError(result.message);
  };
  const confirmImport = async () => {
    const validRows = previewRows.filter((row) => row.valid);
    const result = await importRegistrations(validRows.map((row) => row.input));
    setPreviewOpen(false);
    setLoadError(`${result.count} data berhasil diimport.${result.errors.length ? ` ${result.errors.length} baris gagal.` : ""}`);
    const refreshed = await fetchRegistrations();
    if (refreshed.ok) setData(refreshed.data.map((item) => ({ id: item.registration_number, name: item.full_name, email: item.email, phone: item.whatsapp_phone, batch: String(item.batch), submittedAt: new Date(item.submitted_at).toLocaleDateString("id-ID"), status: item.status as RegistrationRow["status"] })));
    const failureCount = result.errors.length;
    toast({ title: result.count > 0 && failureCount === 0 ? "Import berhasil" : result.count > 0 ? "Import sebagian berhasil" : "Import gagal", description: `${result.count} data registrasi berhasil diimport.${failureCount ? ` ${failureCount} baris gagal. Penyebab: ${result.errors[0]?.messages.join(", ") || "tidak diketahui"}` : ""}`, variant: result.count > 0 && failureCount === 0 ? "success" : "warning" });
  };
  return <><input ref={importRef} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImport(file); event.currentTarget.value = ""; }} /><AdminTablePage title="Registrasi" description={loadError || "Kelola dan review pendaftaran calon peserta."} action={<div className="flex flex-wrap gap-2"><Button variant="ghost" onClick={downloadTemplate}><Download className="h-4 w-4" />Download Template</Button><Button variant="outline" onClick={() => importRef.current?.click()}><FileUp className="h-4 w-4" />Import XLSX</Button><Button onClick={() => setDialogOpen(true)}><UserPlus className="h-4 w-4" />Registrasi Baru</Button></div>} data={data} keyExtractor={(item) => item.id} filters={[{ key: "status", label: "Status", options: [{ value: "pending_review", label: "Menunggu Review" }, { value: "approved", label: "Disetujui" }, { value: "needs_revision", label: "Perlu Revisi" }, { value: "rejected", label: "Ditolak" }] }]} searchPlaceholder="Cari nama atau nomor registrasi..." columns={[
    { key: "student", label: "Peserta", render: (item) => <div className="flex items-center gap-3"><Avatar name={item.name} size="sm" /><div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.email}</p></div></div> },
    { key: "id", label: "No. Registrasi", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "batch", label: "Angkatan", render: (item) => <span>{item.batch}</span> },
    { key: "date", label: "Tanggal", render: (item) => <span className="text-muted">{item.submittedAt}</span> },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "actions", label: "", className: "w-12 text-right", render: (item) => <AdminActionMenu viewHref={`/admin/registrasi/${item.id}`} approveLabel="Setujui Registrasi" readOnly={item.status === "approved"} onEdit={() => router.push(`/admin/registrasi/${item.id}?edit=1`)} onConfirmAction={async (action) => { const result = await updateRegistrationStatus(item.id, action === "approve" ? "approved" : "rejected"); if (!result.ok) { toast({ title: "Aksi gagal", description: result.message, variant: "warning" }); return; } toast({ title: action === "approve" ? "Registrasi disetujui" : "Registrasi ditolak", description: "Status berhasil diperbarui di Supabase.", variant: action === "approve" ? "success" : "warning" }); await refreshRegistrations(); }} /> },
  ]} /><NewRegistrationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} /><Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview Import XLSX" description="Periksa baris valid dan kesalahan sebelum menyimpan ke database." size="lg" footer={<><Button variant="outline" onClick={() => setPreviewOpen(false)}>Batal</Button><Button onClick={confirmImport} disabled={!previewRows.some((row) => row.valid)}>Import Baris Valid</Button></>}><div className="space-y-3"><p className="text-sm text-muted">{previewRows.filter((row) => row.valid).length} baris valid, {previewRows.filter((row) => !row.valid).length} baris perlu diperbaiki.</p><div className="max-h-96 space-y-2 overflow-y-auto">{previewRows.map((row) => <div key={row.row} className={`rounded-lg border p-3 text-sm ${row.valid ? "border-success-200 bg-success-50" : "border-danger-200 bg-danger-50"}`}><p className="font-medium">Baris {row.row}: {row.valid ? "Valid" : "Tidak valid"}</p>{!row.valid && <ul className="mt-1 list-disc pl-5 text-danger-700">{row.errors.map((error) => <li key={error}>{error}</li>)}</ul>}</div>)}</div></div></Dialog></>;
}


