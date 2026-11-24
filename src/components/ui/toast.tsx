"use client";

import { useEffect, useState, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "danger" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-success-600" />,
  danger: <AlertCircle className="h-5 w-5 text-danger-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning-600" />,
  info: <Info className="h-5 w-5 text-info-600" />,
};

const variantBg: Record<ToastVariant, string> = {
  success: "border-success-100 bg-success-50",
  danger: "border-danger-100 bg-danger-50",
  warning: "border-warning-100 bg-warning-50",
  info: "border-info-100 bg-info-50",
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastItem;
  onRemove: (id: string) => void;
}) {
  const variant = toast.variant ?? "info";

  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(t);
  }, [toast, onRemove]);

  return (
    <div
      className={cn(
        "flex w-80 items-start gap-3 rounded-xl border p-4 shadow-modal",
        variantBg[variant]
      )}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-sm text-muted">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 rounded p-0.5 text-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

let globalAdd: ((toast: Omit<ToastItem, "id">) => void) | null = null;

export function toast(options: Omit<ToastItem, "id">) {
  globalAdd?.(options);
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    globalAdd = (options) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, ...options }]);
    };
    return () => { globalAdd = null; };
  }, []);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  );
}
