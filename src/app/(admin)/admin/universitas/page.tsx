"use client";
import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { MasterCrudDialog } from "@/components/shared/master-crud-dialog";
import { toast } from "@/components/ui/toast";
import {
  deleteUniversity,
  fetchUniversities,
  saveUniversity,
  type University,
} from "./actions";

export default function UniversitasPage() {
  const [items, setItems] = useState<University[]>([]);
  const [selected, setSelected] = useState<University | null>(null);
  const [editing, setEditing] = useState<University | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    const result = await fetchUniversities();
    if (result.ok) {
      setItems(result.data);
      setError("");
    } else setError(result.message);
    setLoading(false);
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const save = async (values: Record<string, string>) => {
    const result = await saveUniversity({
      id: editing?.id,
      name: values.name,
      city: values.city,
      status: values.status as University["status"],
    });
    if (!result.ok) {
      toast({
        title: "Gagal menyimpan universitas",
        description: result.message,
        variant: "warning",
      });
      return;
    }
    setOpen(false);
    toast({
      title: editing ? "Universitas diperbarui" : "Universitas ditambahkan",
      variant: "success",
    });
    await load();
  };
  const confirmDelete = async () => {
    if (!deleting) return;
    const result = await deleteUniversity(deleting.id);
    if (!result.ok)
      toast({
        title: "Gagal menghapus universitas",
        description: result.message,
        variant: "warning",
      });
    else {
      setDeleting(null);
      toast({ title: "Universitas dihapus", variant: "success" });
      await load();
    }
  };
  const cities = useMemo(
    () =>
      [...new Set(items.map((item) => item.city))].map((city) => ({
        value: city,
        label: city,
      })),
    [items],
  );
  return (
    <div className="space-y-6">
      <PageHeader
        title="Universitas"
        description="Kelola master universitas mitra di Turki."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Tambah Universitas
          </Button>
        }
      />
      {error && (
        <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700">
          {error}
        </p>
      )}
      {loading ? (
        <p className="py-10 text-center text-sm text-muted">
          Memuat data universitas...
        </p>
      ) : (
        <DataTable
          data={items}
          keyExtractor={(x) => x.id}
          searchPlaceholder="Cari universitas atau kota..."
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "active", label: "Aktif" },
                { value: "inactive", label: "Nonaktif" },
              ],
            },
            { key: "city", label: "Kota", options: cities },
          ]}
          columns={[
            {
              key: "name",
              label: "Universitas",
              render: (x) => (
                <div>
                  <p className="font-medium">{x.name}</p>
                  <p className="text-xs text-muted">{x.code}</p>
                </div>
              ),
            },
            { key: "city", label: "Kota", render: (x) => x.city },
            { key: "faculties", label: "Fakultas", render: () => 0 },
            { key: "majors", label: "Jurusan", render: () => 0 },
            { key: "intakes", label: "Intake", render: () => 0 },
            {
              key: "status",
              label: "Status",
              render: (x) => (
                <Badge
                  variant={x.status === "active" ? "success" : "default"}
                  dot
                >
                  {x.status === "active" ? "Aktif" : "Nonaktif"}
                </Badge>
              ),
            },
            {
              key: "actions",
              label: "",
              className: "w-12",
              render: (x) => (
                <DropdownMenu
                  items={[
                    {
                      label: "Detail",
                      icon: <Eye className="h-4 w-4" />,
                      onClick: () => setSelected(x),
                    },
                    {
                      label: "Hapus",
                      icon: <Trash2 className="h-4 w-4" />,
                      variant: "danger",
                      separator: true,
                      onClick: () => setDeleting(x),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      )}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? "Detail"}
        description="Informasi universitas dan program akademik yang tersedia."
        size="lg"
      >
        <div className="space-y-5">
          {selected && (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background-alt/40 p-4">
                  <p className="text-xs text-muted">Kode</p>
                  <p className="mt-1 font-semibold">{selected.code}</p>
                </div>
                <div className="rounded-lg border border-border bg-background-alt/40 p-4">
                  <p className="text-xs text-muted">Kota</p>
                  <p className="mt-1 font-semibold">{selected.city}</p>
                </div>
                <div className="rounded-lg border border-border bg-background-alt/40 p-4">
                  <p className="text-xs text-muted">Status</p>
                  <p className="mt-1">
                    <Badge
                      variant={
                        selected.status === "active" ? "success" : "default"
                      }
                      dot
                    >
                      {selected.status === "active" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-4">
                  <p className="font-semibold">Fakultas</p>
                  <p className="mt-2 text-2xl font-bold">0</p>
                  <p className="text-xs text-muted">Belum ada data fakultas</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <p className="font-semibold">Jurusan</p>
                  <p className="mt-2 text-2xl font-bold">0</p>
                  <p className="text-xs text-muted">Belum ada data jurusan</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <p className="font-semibold">Intake</p>
                  <p className="mt-2 text-2xl font-bold">0</p>
                  <p className="text-xs text-muted">Belum ada data intake</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={() => setSelected(null)}>
            Tutup
          </Button>
          <Button
            onClick={() => {
              if (selected) {
                setEditing(selected);
                setSelected(null);
                setOpen(true);
              }
            }}
          >
            Edit Universitas
          </Button>
        </div>
      </Dialog>
      <MasterCrudDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit universitas" : "Tambah universitas"}
        description="Data universitas disimpan ke Supabase."
        initialValues={
          editing
            ? { name: editing.name, city: editing.city, status: editing.status }
            : { status: "active" }
        }
        fields={[
          {
            name: "name",
            label: "Nama universitas",
            placeholder: "Contoh: Istanbul University",
          },
          { name: "city", label: "Kota", placeholder: "Contoh: Istanbul" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "active", label: "Aktif" },
              { value: "inactive", label: "Nonaktif" },
            ],
          },
        ]}
        onSubmit={save}
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
        title="Hapus universitas?"
        description={`Universitas ${deleting?.name ?? "ini"} akan dihapus dari database.`}
        confirmLabel="Hapus Universitas"
      />
    </div>
  );
}
