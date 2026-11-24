"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Upload, X, FileText, Image as ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  accept?: string;
  helperText?: string;
  error?: string;
  onChange?: (file: File | null) => void;
  maxSizeMB?: number;
}

export function FileUpload({
  label,
  accept = ".pdf,.jpg,.jpeg,.png",
  helperText,
  error: externalError,
  onChange,
  maxSizeMB = 5,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const error = externalError ?? internalError;

  function handleFile(f: File | null) {
    setInternalError(null);
    if (f && f.size > maxSizeMB * 1024 * 1024) {
      setInternalError(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }
    setFile(f);
    onChange?.(f);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0] ?? null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }

  const isImage = file?.type.startsWith("image/");

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>
      )}

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
            dragging
              ? "border-primary-500 bg-primary-50"
              : "border-border hover:border-primary-400 hover:bg-background-alt",
            error && "border-danger-400"
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background-alt">
            <Upload className="h-5 w-5 text-muted" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Klik atau seret file ke sini
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {accept.replace(/\./g, "").toUpperCase()} hingga {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
            {isImage ? (
              <ImageIcon aria-hidden="true" className="h-5 w-5 text-primary-700" />
            ) : (
              <FileText className="h-5 w-5 text-primary-700" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-muted">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Check className="h-5 w-5 text-success-600 shrink-0" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
              onChange?.(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="rounded-lg p-1 text-muted hover:bg-background-alt hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
      />

      {error && <p className="text-sm text-danger-600">{error}</p>}
      {!error && helperText && (
        <p className="text-sm text-muted">{helperText}</p>
      )}
    </div>
  );
}
