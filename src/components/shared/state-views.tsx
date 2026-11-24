"use client";

import Link from "next/link";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";

export function PageLoading({ variant = "cards" }: { variant?: "cards" | "table" }) {
  return variant === "table" ? (
    <div className="space-y-6" aria-label="Memuat halaman" role="status">
      <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-72" /></div>
      <SkeletonTable rows={6} />
    </div>
  ) : (
    <div className="space-y-6" aria-label="Memuat halaman" role="status">
      <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-72" /></div>
      <div className="grid gap-4 sm:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
    </div>
  );
}

export function PageError({ title = "Halaman tidak dapat dimuat", description = "Terjadi kendala saat menyiapkan halaman. Silakan coba lagi.", reset }: { title?: string; description?: string; reset: () => void }) {
  return <div className="flex min-h-[26rem] flex-col items-center justify-center px-5 text-center" role="alert"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-50"><AlertCircle className="h-6 w-6 text-danger-600" /></div><h1 className="mt-4 text-lg font-semibold text-foreground">{title}</h1><p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p><Button variant="outline" className="mt-5" onClick={reset}><RefreshCw className="h-4 w-4" />Coba Lagi</Button></div>;
}

export function ListEmptyState({ title = "Belum ada data", description = "Data akan muncul di sini setelah tersedia.", action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return <div className="flex flex-col items-center justify-center px-5 py-14 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background-alt"><Inbox className="h-6 w-6 text-muted" /></div><h2 className="mt-4 text-sm font-semibold text-foreground">{title}</h2><p className="mt-1 max-w-sm text-sm leading-6 text-muted">{description}</p>{action && <div className="mt-4">{action}</div>}</div>;
}

export function NotFoundState({ backHref = "/", label = "Kembali" }: { backHref?: string; label?: string }) {
  return <div className="flex min-h-[26rem] flex-col items-center justify-center text-center"><p className="text-6xl font-bold text-primary-100">404</p><h1 className="mt-3 text-xl font-semibold">Halaman tidak ditemukan</h1><p className="mt-2 text-sm text-muted">Halaman yang kamu cari tidak tersedia.</p><Link href={backHref} className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary-700 px-4 text-sm font-medium text-white hover:bg-primary-800">{label}</Link></div>;
}
