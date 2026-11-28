"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "date" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  searchable?: boolean;
};

export function MasterCrudDialog({
  open,
  title,
  description,
  fields,
  initialValues,
  onClose,
  onSubmit,
  submitLabel = "Simpan",
}: {
  open: boolean;
  title: string;
  description: string;
  fields: CrudField[];
  initialValues?: Record<string, string>;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? {});
  const [error, setError] = useState("");

  const update = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const submit = () => {
    const missing = fields.find((field) => !values[field.name]?.trim());
    if (missing) {
      setError(`${missing.label} wajib diisi.`);
      return;
    }
    setError("");
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} title={title} description={description} footer={<><Button variant="outline" onClick={onClose}>Batal</Button><Button onClick={submit}>{submitLabel}</Button></>}>
      <div className="space-y-4">
        {fields.map((field) => field.type === "select" && field.searchable ? (
                  <div key={field.name} className="space-y-1.5"><label className="block text-sm font-medium text-foreground">{field.label}</label><input list={`${field.name}-suggestions`} value={values[field.name] ?? ""} onChange={(event) => update(field.name, event.target.value)} placeholder={field.placeholder ?? "Ketik untuk mencari..."} className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" /><datalist id={`${field.name}-suggestions`}>{(field.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</datalist></div>
                ) : field.type === "select" ? (
          <Select key={field.name} label={field.label} options={field.options ?? []} value={values[field.name] ?? ""} onChange={(value) => update(field.name, value)} placeholder={field.placeholder ?? "Pilih..."} />
        ) : (
          <Input key={field.name} label={field.label} type={field.type ?? "text"} value={values[field.name] ?? ""} onChange={(event) => update(field.name, event.target.value)} placeholder={field.placeholder} />
        ))}
        {error && <p className="text-sm text-danger-700">{error}</p>}
      </div>
    </Dialog>
  );
}
