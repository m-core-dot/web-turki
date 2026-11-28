"use client";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, BookOpen, CheckCircle2, Download, FileUp, Plus } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MasterCrudDialog } from "@/components/shared/master-crud-dialog";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { createFacultyMajor, fetchFacultyMajors, fetchUniversitiesForMajorForm, type FacultyMajor } from "./actions";
import * as XLSX from "xlsx";

export default function JurusanPage() {
  const [items, setItems] = useState<FacultyMajor[]>([]);
  const [universities, setUniversities] = useState<Array<{ id: string; name: string; city: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importRows, setImportRows] = useState<Array<Record<string, unknown>>>([]);
  const [importError, setImportError] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const downloadTemplate = () => { const worksheet = XLSX.utils.aoa_to_sheet([["name", "university", "faculty", "degree", "status"], ["Computer Engineering", "Istanbul University", "Faculty of Engineering", "Bachelor", "active"]]); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Fakultas dan Jurusan"); XLSX.writeFile(workbook, "template-fakultas-dan-jurusan.xlsx"); };
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workbook = XLSX.read(reader.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
        const required = ["name", "university", "faculty", "degree", "status"];
        const errors = rows.flatMap((row, index) => required.filter((key) => !String(row[key] ?? "").trim()).map((key) => `Baris ${index + 2}: ${key} wajib diisi.`));
        const validDegrees = new Set(["Bachelor", "Master", "Doctoral"]);
        rows.forEach((row, index) => {
          if (!validDegrees.has(String(row.degree).trim())) errors.push(`Baris ${index + 2}: degree harus Bachelor, Master, atau Doctoral.`);
          if (!new Set(["active", "inactive"]).has(String(row.status).trim())) errors.push(`Baris ${index + 2}: status harus active atau inactive.`);
          if (!universities.some((university) => university.name === String(row.university).trim())) errors.push(`Baris ${index + 2}: universitas tidak ditemukan atau tidak aktif.`);
        });
        setImportRows(rows.map((row, index) => ({ ...row, _valid: errors.filter((error) => error.startsWith(`Baris ${index + 2}:`)).length === 0 })));
        setImportError(errors.join(" "));
        setImportOpen(true);
      } catch {
        setImportRows([]);
        setImportError("File XLSX tidak dapat dibaca.");
        setImportOpen(true);
      }
    };
    reader.readAsArrayBuffer(file);
  };
  useEffect(() => { const timer = window.setTimeout(() => { void Promise.all([fetchFacultyMajors(), fetchUniversitiesForMajorForm()]).then(([majorsResult, universitiesResult]) => { if (majorsResult.ok) setItems(majorsResult.data); else setError(majorsResult.message); if (universitiesResult.ok) setUniversities(universitiesResult.data); else setError(universitiesResult.message); setLoading(false); }); }, 0); return () => window.clearTimeout(timer); }, []);
  const options = (key: keyof FacultyMajor) => [...new Set(items.map((item) => String(item[key])))].filter(Boolean).sort().map((value) => ({ value, label: value }));
  return <div className="space-y-6"><input ref={importRef} type="file" accept=".xlsx" onChange={handleImportFile} className="hidden" /><PageHeader title="Fakultas dan Jurusan" description="Kelola program studi berdasarkan fakultas dan universitas." action={<div className="flex flex-wrap gap-2"><Button variant="ghost" onClick={downloadTemplate}><Download className="h-4 w-4" />Download Template</Button><Button variant="outline" onClick={() => importRef.current?.click()}><FileUp className="h-4 w-4" />Import Massal XLSX</Button><Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" />Tambah Data</Button></div>} />{error && <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700">{error}</p>}{loading ? <p className="py-10 text-center text-sm text-muted">Memuat data fakultas dan jurusan...</p> : <DataTable data={items} keyExtractor={(item) => item.id} searchPlaceholder="Cari nama jurusan..." filters={[{ key: "university", label: "Universitas", options: options("university") }]} columns={[{ key: "name", label: "Jurusan", render: (item) => <div className="flex items-center gap-3"><BookOpen className="h-4 w-4 text-primary-700" /><div><p className="font-medium">{item.name}</p><p className="text-xs text-muted">{item.code}</p></div></div> }, { key: "faculty", label: "Fakultas", render: (item) => item.faculty }, { key: "university", label: "Universitas", render: (item) => item.university }, { key: "degree", label: "Jenjang", render: (item) => <Badge variant="outline">{item.degree}</Badge> }, { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "default"} dot>{item.status === "active" ? "Aktif" : "Nonaktif"}</Badge> }]} />}<MasterCrudDialog open={formOpen} onClose={() => setFormOpen(false)} title="Tambah Fakultas dan Jurusan" description="Isi data program studi baru." initialValues={{ status: "active", degree: "Bachelor" }} fields={[{ name: "name", label: "Nama jurusan", placeholder: "Contoh: Computer Engineering" }, { name: "university", label: "Universitas", type: "select", searchable: true, options: universities.map((university) => ({ value: university.name, label: `${university.name} - ${university.city}` })) }, { name: "faculty", label: "Fakultas", placeholder: "Nama fakultas" }, { name: "degree", label: "Jenjang", type: "select", options: [{ value: "Bachelor", label: "Bachelor" }, { value: "Master", label: "Master" }, { value: "Doctoral", label: "Doctoral" }] }, { name: "status", label: "Status", type: "select", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Nonaktif" }] }]} onSubmit={async (values) => { const university = universities.find((item) => item.name === values.university); if (!university) throw new Error("Pilih universitas yang tersedia."); await createFacultyMajor({ name: values.name, universityId: university.id, faculty: values.faculty, degree: values.degree, status: values.status as "active" | "inactive" }); const result = await fetchFacultyMajors(); if (result.ok) setItems(result.data); setFormOpen(false); toast({ title: "Data disimpan", description: "Fakultas dan jurusan berhasil disimpan ke database.", variant: "success" }); }} /><Dialog open={importOpen} onClose={() => setImportOpen(false)} title="Validasi Import XLSX" description="Periksa data sebelum diimpor ke database." footer={<Button variant="outline" onClick={() => setImportOpen(false)}>Tutup</Button>}><div className="space-y-4">{importError ? <div className="flex gap-2 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>{importError}</p></div> : <div className="flex gap-2 rounded-lg bg-success-50 px-3 py-2 text-sm text-success-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><p>Semua data valid dan siap diproses.</p></div>}<div className="max-h-64 overflow-y-auto rounded-lg border border-border"><table className="w-full text-left text-sm"><thead className="bg-background-alt text-xs text-muted"><tr><th className="px-3 py-2">Baris</th><th className="px-3 py-2">Nama</th><th className="px-3 py-2">Status</th></tr></thead><tbody>{importRows.map((row, index) => <tr key={index} className="border-t border-border"><td className="px-3 py-2">{index + 2}</td><td className="px-3 py-2">{String(row.name)}</td><td className="px-3 py-2">{row._valid ? <span className="text-success-700">Valid</span> : <span className="text-danger-700">Tidak valid</span>}</td></tr>)}</tbody></table></div></div></Dialog></div>;
}
