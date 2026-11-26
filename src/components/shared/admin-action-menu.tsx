"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Pencil, X } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

interface AdminActionMenuProps {
  viewHref?: string;
  approveLabel?: string;
  onView?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onConfirmAction?: (action: "approve" | "reject") => Promise<void>;
  readOnly?: boolean;
}

export function AdminActionMenu({ viewHref, approveLabel = "Setujui", onView, onEdit, onApprove, onReject, onConfirmAction, readOnly = false }: AdminActionMenuProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
  const detailAction = onView ?? (viewHref ? () => router.push(viewHref) : () => undefined);
  const finish = async () => {
    if (onConfirmAction && confirm) {
      await onConfirmAction(confirm);
    } else {
      const message = confirm === "approve" ? `${approveLabel} berhasil` : "Data ditolak";
      toast({ title: message, description: "Perubahan berhasil disimpan.", variant: confirm === "reject" ? "warning" : "success" });
      if (confirm === "approve") onApprove?.();
      if (confirm === "reject") onReject?.();
    }
    setConfirm(null);
  };
  const items = [{ label: "Lihat detail", icon: <Eye className="h-4 w-4" />, onClick: detailAction }, ...(readOnly ? [] : [{ label: "Edit data", icon: <Pencil className="h-4 w-4" />, onClick: onEdit }, { label: approveLabel, icon: <Check className="h-4 w-4" />, onClick: () => setConfirm("approve") }, { label: "Tolak", icon: <X className="h-4 w-4" />, variant: "danger" as const, onClick: () => setConfirm("reject") }])];
  return <><DropdownMenu items={items} /><ConfirmDialog open={confirm !== null} onClose={() => setConfirm(null)} onConfirm={finish} title={confirm === "approve" ? `Konfirmasi ${approveLabel.toLowerCase()}` : "Tolak data"} description={confirm === "approve" ? "Pastikan data sudah diperiksa sebelum menyetujui." : "Data akan ditandai sebagai ditolak dalam preview."} confirmLabel={confirm === "approve" ? approveLabel : "Tolak Data"} /></>;
}
