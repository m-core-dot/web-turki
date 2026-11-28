"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
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
  noOptionsMessage?: string;
};

function SearchableField({ field, value, onChange }: { field: CrudField; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);
  const options = (field.options ?? []).filter((option) => option.label.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
  return <div ref={containerRef} className="space-y-1.5"><label className="block text-sm font-medium text-foreground">{field.label}</label><div className="relative"><div className="relative"><input value={value} onFocus={() => setOpen(true)} onChange={(event) => { onChange(event.target.value); setOpen(true); }} placeholder={field.placeholder ?? "Ketik untuk mencari..."} className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 pr-9 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /></div>{open && <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-card">{options.length > 0 ? options.map((option) => <button type="button" key={option.value} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option.value); setOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground hover:bg-background-alt"><span><span className="block">{option.value}</span><span className="block text-xs text-muted">{option.label.replace(`${option.value} - `, "")}</span></span>{value === option.value && <Check className="h-4 w-4 text-primary-700" />}</button>) : <p className="px-3 py-2 text-sm text-muted">{field.noOptionsMessage ?? "Data tidak ditemukan."}</p>}</div>}</div></div>;
}

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
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? {});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const submit = async () => {
    const missing = fields.find((field) => !values[field.name]?.trim());
    if (missing) {
      setError(`${missing.label} wajib diisi.`);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Data gagal disimpan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={title} description={description} footer={<><Button variant="outline" onClick={onClose} disabled={submitting}>Batal</Button><Button onClick={submit} disabled={submitting}>{submitting ? "Menyimpan..." : submitLabel}</Button></>}>
      <div className="space-y-4">
        {fields.map((field) => field.type === "select" && field.searchable ? (
                  <SearchableField key={field.name} field={field} value={values[field.name] ?? ""} onChange={(value) => update(field.name, value)} />
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
