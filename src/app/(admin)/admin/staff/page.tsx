"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { fetchStaff, removeStaff, saveStaff } from "./actions";

type Staff = {
  id: string;
  name: string;
  email: string;
  gender: "LAKI-LAKI" | "PEREMPUAN";
  phone: string;
  address: string;
  department: string;
  role: string;
  status: "active" | "inactive";
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [actorRole, setActorRole] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStaff().then((result) => {
      if (result.ok) { setStaff(result.data as Staff[]); setActorRole(result.actorRole); }
      else setLoadError(result.message);
    });
  }, []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [deleting, setDeleting] = useState<Staff | null>(null);
  const [form, setForm] = useState({ name: "", email: "", gender: "LAKI-LAKI" as Staff["gender"], phone: "", address: "", department: "Admission", role: "Admission Officer", status: "active" as Staff["status"] });


  const openForm = (member?: Staff) => {
    setEditing(member ?? null);
    setForm(member ? { name: member.name ?? "", email: member.email ?? "", gender: member.gender, phone: member.phone, address: member.address, department: member.department, role: member.role, status: member.status } : { name: "", email: "", gender: "LAKI-LAKI", phone: "", address: "", department: "Admission", role: "Admission Officer", status: "active" });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return;
    setSaving(true);
    saveStaff(form, editing?.id).then((result) => {
      setSaving(false);
      if (!result.ok) {
        toast({ title: "Gagal menyimpan staff", description: result.message, variant: "warning" });
        return;
      }
      setStaff((current) => editing ? current.map((member) => member.id === editing.id ? result.data as Staff : member) : [result.data as Staff, ...current]);
      setDialogOpen(false);
      toast({ title: editing ? "Staff diperbarui" : "Staff ditambahkan", description: editing ? "Data berhasil disimpan ke Supabase." : "Akun login Staff berhasil dibuat dengan password awal unik. Ganti password setelah login.", variant: "success" });
    });
    return;
    toast({ title: editing ? "Staff diperbarui" : "Staff ditambahkan", description: "Data tersimpan sebagai preview UI.", variant: "success" });
  };

  const remove = () => {
    if (deleting) {
      removeStaff(deleting.id).then((result) => {
        if (!result.ok) {
          toast({ title: "Gagal menghapus staff", description: result.message, variant: "warning" });
          return;
        }
        setStaff((current) => current.filter((member) => member.id !== deleting.id));
        setDeleting(null);
        toast({ title: "Staff dihapus", variant: "success" });
      });
      return;
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Staff" description={loadError || "Kelola anggota staff operasional MTAS."} action={<Button onClick={() => openForm()}><UserPlus className="h-4 w-4" />Tambah Staff</Button>} />
      <Card padding="none">
        <DataTable
          data={staff}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Cari nama atau nomor WhatsApp staff..."
          filters={[
            { key: "department", label: "Departemen", options: [...new Set(staff.map((member) => member.department))].map((value) => ({ value, label: value })) },
            { key: "status", label: "Status", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Nonaktif" }] },
          ]}
          columns={[
            { key: "name", label: "Staff", render: (item) => <div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.phone}</p></div> },
                        { key: "gender", label: "Jenis Kelamin", render: (item) => <span>{item.gender === "LAKI-LAKI" ? "Laki-laki" : "Perempuan"}</span> },
            { key: "department", label: "Departemen", render: (item) => <span>{item.department}</span> },
            { key: "role", label: "Role", render: (item) => <span>{item.role}</span> },
            { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "active" ? "success" : "default"} dot>{item.status === "active" ? "Aktif" : "Nonaktif"}</Badge> },
            { key: "actions", label: "", className: "w-24 text-right", render: (item) => {
              const cannotEdit = actorRole === "Super Admin" && item.role === "Super Admin";
              return <div className="flex justify-end gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={cannotEdit ? `${item.name} tidak dapat diedit` : `Edit ${item.name}`}
                  title={cannotEdit ? "Akun Super Admin tidak dapat diedit oleh Super Admin lain" : "Edit staff"}
                  disabled={cannotEdit}
                  onClick={() => openForm(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {item.email?.toLowerCase() !== "muafihimam@mumtazacenter.com" && <Button size="sm" variant="ghost" aria-label={`Hapus ${item.name}`} onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4 text-danger-600" /></Button>}
              </div>;
            } },
          ]}
        />
      </Card>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} size="xl" title={editing ? "Edit Staff" : "Tambah Staff"} description="Lengkapi informasi staff operasional." footer={<><Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button onClick={save} disabled={saving || !(form.name ?? "").trim() || !(form.email ?? "").trim() || !(form.phone ?? "").trim() || !(form.address ?? "").trim()} isLoading={saving}><Plus className="h-4 w-4" />Simpan</Button></>}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nama lengkap" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <Input label="Email login" required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <Select label="Jenis kelamin" options={[{ value: "LAKI-LAKI", label: "Laki-laki" }, { value: "PEREMPUAN", label: "Perempuan" }]} value={form.gender} onChange={(gender) => setForm((current) => ({ ...current, gender: gender as Staff["gender"] }))} />
            <Input label="Nomor telepon aktif (WhatsApp)" required type="tel" inputMode="numeric" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "") }))} />
            <Textarea label="Alamat" required value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
          </div>
          {editing?.email?.toLowerCase() !== "muafihimam@mumtazacenter.com" && <>
            <Select label="Departemen" options={[{ value: "Admission", label: "Admission" }, { value: "Finance", label: "Finance" }, { value: "University", label: "University" }]} value={form.department} onChange={(department) => setForm((current) => ({ ...current, department }))} />
            <Select label="Role" options={[{ value: "Admission Officer", label: "Admission Officer" }, { value: "Finance Officer", label: "Finance Officer" }, { value: "University Officer", label: "University Officer" }]} value={form.role} onChange={(role) => setForm((current) => ({ ...current, role }))} />
            <Select label="Status" options={[{ value: "active", label: "Aktif" }, { value: "inactive", label: "Nonaktif" }]} value={form.status} onChange={(status) => setForm((current) => ({ ...current, status: status as Staff["status"] }))} />
          </>}
        </div>
      </Dialog>
      <ConfirmDialog open={deleting !== null} onClose={() => setDeleting(null)} onConfirm={remove} title="Hapus staff?" description={`Akun staff ${deleting?.name ?? "ini"} akan dihapus dari preview UI.`} confirmLabel="Hapus Staff" />
    </div>
  );
}
