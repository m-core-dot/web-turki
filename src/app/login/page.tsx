"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await getSupabaseBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError("Email atau password tidak valid.");
      setLoading(false);
      return;
    }
    const next = searchParams.get("next");
    router.replace(next?.startsWith("/") ? next : "/admin");
    router.refresh();
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10"><div className="w-full max-w-md"><div className="mb-8 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-700 text-white"><LockKeyhole className="h-5 w-5" /></div><p className="mt-5 text-sm font-semibold text-primary-700">MTAS Admin</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Masuk ke dashboard</h1><p className="mt-2 text-sm text-muted">Gunakan akun staf yang terdaftar untuk melanjutkan.</p></div><form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8"><Input label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@mumtaza.center" autoComplete="email" /><Input label="Password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" autoComplete="current-password" error={error} /><Button type="submit" className="w-full" isLoading={loading}>Masuk <ArrowRight className="h-4 w-4" /></Button></form><p className="mt-6 text-center text-sm text-muted"><Link href="/" className="font-medium text-primary-700 hover:underline">Kembali ke website</Link></p><div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted"><Mail className="h-3.5 w-3.5" />Akses dibatasi untuk pengguna terautentikasi</div></div></main>;
}

export default function LoginPage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-background"><p className="text-sm text-muted">Memuat halaman login...</p></main>}><LoginForm /></Suspense>;
}
