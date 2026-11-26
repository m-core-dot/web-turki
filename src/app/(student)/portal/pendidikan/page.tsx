"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import {
  deleteEducation,
  getEducation,
  saveEducation,
  type EducationRecord,
} from "./actions";

export default function PendidikanPage() {
  const [items, setItems] = useState<EducationRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EducationRecord | null>(null);
  const [form, setForm] = useState({
    education_level: "",
    institution_name: "",
    major: "",
    school_city: "",
    school_province: "",
    completion_year: "",
  });
  const load = () =>
    getEducation().then((result) => {
      if (result.error)
        toast({
          title: "Gagal memuat pendidikan",
          description: result.error,
          variant: "danger",
        });
      setItems(result.data);
    });
  useEffect(() => {
    load();
  }, []);
  const start = (item?: EducationRecord) => {
    setEditing(item ?? null);
    setForm({
      education_level: item?.education_level ?? "",
      institution_name: item?.institution_name ?? "",
      major: item?.major ?? "",
      school_city: item?.school_city ?? "",
      school_province: item?.school_province ?? "",
      completion_year: item?.completion_year
        ? String(item.completion_year)
        : "",
    });
    setOpen(true);
  };
  const save = async () => {
    const result = await saveEducation({
      id: editing?.id,
      education_level: editing?.education_level ?? form.education_level,
      institution_name: form.institution_name,
      major: form.major,
      school_city: form.school_city,
      school_province: form.school_province,
      completion_year: form.completion_year
        ? Number(form.completion_year)
        : undefined,
      status: editing?.status,
    });
    if (result.error) {
      toast({
        title: "Gagal menyimpan",
        description: result.error,
        variant: "danger",
      });
      return;
    }
    setOpen(false);
    toast({ title: "Pendidikan tersimpan", variant: "success" });
    load();
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Pendidikan"
        description="Data pendidikan yang tersimpan pada akun kamu."
        action={
          <Button onClick={() => start()}>
            <Plus className="h-4 w-4" />
            Tambah Pendidikan
          </Button>
        }
      />
      <div className="space-y-4">
        {items.length === 0 ? (
          <Card>
            <div className="py-8 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 text-sm font-medium">
                Belum ada riwayat pendidikan
              </p>
              <p className="mt-1 text-sm text-muted">
                Tambahkan data pendidikan untuk melengkapi profil kamu.
              </p>
            </div>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <BookOpen className="h-5 w-5 text-primary-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.institution_name}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {item.education_level}
                        {item.major ? ` · ${item.major}` : ""}
                      </p>
                    </div>
                    <DropdownMenu
                      items={[
                        {
                          label: "Edit",
                          icon: <Pencil className="h-4 w-4" />,
                          onClick: () => start(item),
                        },
                        {
                          label: "Hapus",
                          icon: <Trash2 className="h-4 w-4" />,
                          variant: "danger",
                          onClick: async () => {
                            const result = await deleteEducation(item.id);
                            if (result.error)
                              toast({
                                title: "Gagal menghapus",
                                description: result.error,
                                variant: "danger",
                              });
                            else {
                              toast({
                                title: "Data dihapus",
                                variant: "success",
                              });
                              load();
                            }
                          },
                        },
                      ]}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    {item.completion_year && (
                      <span className="text-xs text-muted">
                        Tahun: {item.completion_year}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={
          editing ? "Edit riwayat pendidikan" : "Tambah riwayat pendidikan"
        }
        description="Masukkan informasi pendidikan kamu."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={save}>Simpan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama institusi"
            value={form.institution_name}
            onChange={(e) =>
              setForm({ ...form, institution_name: e.target.value })
            }
            placeholder="Nama sekolah atau universitas"
          />
          <Input
            label="Kota sekolah"
            value={form.school_city}
            onChange={(e) => setForm({ ...form, school_city: e.target.value })}
            placeholder="Kota atau kabupaten"
          />
          <Input
            label="Provinsi sekolah"
            value={form.school_province}
            onChange={(e) => setForm({ ...form, school_province: e.target.value })}
            placeholder="Provinsi"
          />
          <Input
            label="Jurusan"
            value={form.major}
            onChange={(e) => setForm({ ...form, major: e.target.value })}
            placeholder="Contoh: IPA"
          />
          <Input
            label="Tahun lulus"
            value={form.completion_year}
            onChange={(e) =>
              setForm({ ...form, completion_year: e.target.value })
            }
            placeholder="2026"
          />
        </div>
      </Dialog>
    </div>
  );
}
