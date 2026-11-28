"use client";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Download, FileUp, Plus } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchFacultyMajors, type FacultyMajor } from "./actions";
import * as XLSX from "xlsx";

export default function JurusanPage() {
  const [items, setItems] = useState<FacultyMajor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const downloadTemplate = () => { const worksheet = XLSX.utils.aoa_to_sheet([["type", "name", "university", "faculty", "degree", "status"], ["major", "Computer Engineering", "Istanbul University", "Faculty of Engineering", "Bachelor", "active"]]); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Fakultas dan Jurusan"); XLSX.writeFile(workbook, "template-fakultas-dan-jurusan.xlsx"); };
  useEffect(() => { const timer = window.setTimeout(() => { void fetchFacultyMajors().then((result) => { if (result.ok) setItems(result.data); else setError(result.message); setLoading(false); }); }, 0); return () => window.clearTimeout(timer); }, []);
  const options = (key: keyof FacultyMajor) => [...new Set(items.map((item) => String(item[key])))].filter(Boolean).sort().map((value) => ({ value, label: value }));
  return <div className="space-y-6"><input ref={importRef} type="file" accept=".xlsx" className="hidden" /><PageHeader title="Fakultas dan Jurusan" description="Kelola program studi berdasarkan fakultas dan universitas." action={<div className="flex flex-wrap gap-2"><Button variant="ghost" onClick={downloadTemplate}><Download className="h-4 w-4" />Download Template</Button><Button variant="outline" onClick={() => importRef.current?.click()}><FileUp className="h-4 w-4" />Import Massal XLSX</Button><Button><Plus className="h-4 w-4" />Tambah Data</Button></div>} />{error && <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700">{error}</p>}{loading ? <p className="py-10 text-center text-sm text-muted">Memuat data fakultas dan jurusan...</p> : <DataTable data={items} keyExtractor={(item) => item.id} searchPlaceholder="Cari nama jurusan..." filters={[{ key: "university", label: "Universitas", options: options("university") }]} columns={[{ key: "name", label: "Jurusan", render: (item) => <div className="flex items-center gap-3"><BookOpen className="h-4 w-4 text-primary-700" /><div><p className="font-medium">{item.name}</p><p className="text-xs text-muted">{item.code}</p></div></div> }, { key: "faculty", label: "Fakultas", render: (item) => item.faculty }, { key: "university", label: "Universitas", render: (item) => item.university }, { key: "degree", label: "Jenjang", render: (item) => <Badge variant="outline">{item.degree}</Badge> }, { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "default"} dot>{item.status === "active" ? "Aktif" : "Nonaktif"}</Badge> }]} />}</div>;
}
