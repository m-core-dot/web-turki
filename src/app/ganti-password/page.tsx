"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword } from "./actions";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    const result = await changePassword(newPassword);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-warning-500 text-white">
            <KeyRound className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
            Ganti Password
          </h1>
          <p className="mt-2 text-sm text-muted">
            Ini adalah login pertama Anda. Silakan buat password baru untuk melanjutkan.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="relative">
            <Input
              label="Password Baru"
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Input
            label="Konfirmasi Password"
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik ulang password baru"
            autoComplete="new-password"
            error={error}
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            Simpan Password Baru
          </Button>
        </form>
      </div>
    </main>
  );
}
