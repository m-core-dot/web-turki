"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, KeyRound, Pencil, X } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

interface AdminActionMenuProps {
  viewHref?: string;
  approveLabel?: string;
  onView?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onResetPassword?: () => void;
  onReject?: () => void;
}

export function AdminActionMenu({ viewHref, approveLabel = "Setujui", onView, onEdit, onApprove, onResetPassword, onReject }: AdminActionMenuProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<"approve" | "reset" | "reject" | null>(null);
  const detailAction = onView ?? (viewHref ? () => router.push(viewHref) : () => undefined);
  const finish = () => {
    const message = confirm === "approve" ? `${approveLabel} berhasil` : confirm === "reset" ? "Password berhasil direset" : "Data ditolak";
    toast({ title: message, description: "Perubahan ini masih berupa preview UI.", variant: confirm === "reject" ? "warning" : "success" });
    if (confirm === "approve") onApprove?.();
    if (confirm === "reset") onResetPassword?.();
    if (confirm === "reject") onReject?.();
    setConfirm(null);
  };
  return <><DropdownMenu items={[{ label: "Lihat detail", icon: <Eye className="h-4 w-4" />, onClick: detailAction }, { label: "Edit data", icon: <Pencil className="h-4 w-4" />, onClick: onEdit }, { label: "Reset password", icon: <KeyRound className="h-4 w-4" />, onClick: () => setConfirm("reset"), separator: true }, { label: approveLabel, icon: <Check className="h-4 w-4" />, onClick: () => setConfirm("approve") }, { label: "Tolak", icon: <X className="h-4 w-4" />, variant: "danger", onClick: () => setConfirm("reject") }]} /><ConfirmDialog open={confirm !== null} onClose={() => setConfirm(null)} onConfirm={finish} title={confirm === "approve" ? `Konfirmasi ${approveLabel.toLowerCase()}` : confirm === "reset" ? "Reset password peserta?" : "Tolak data"} description={confirm === "approve" ? "Pastikan data sudah diperiksa sebelum menyetujui." : confirm === "reset" ? "Password peserta akan dibuat ulang dan dikirim melalui kanal yang aman." : "Data akan ditandai sebagai ditolak dalam preview."} confirmLabel={confirm === "approve" ? approveLabel : confirm === "reset" ? "Reset Password" : "Tolak Data"} /></>;
}
