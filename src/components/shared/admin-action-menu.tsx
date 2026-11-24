"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Pencil, RotateCcw, X } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

interface AdminActionMenuProps {
  viewHref?: string;
  approveLabel?: string;
  onView?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onRevision?: () => void;
  onReject?: () => void;
}

export function AdminActionMenu({ viewHref, approveLabel = "Setujui", onView, onEdit, onApprove, onRevision, onReject }: AdminActionMenuProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<"approve" | "revision" | "reject" | null>(null);
  const detailAction = onView ?? (viewHref ? () => router.push(viewHref) : () => undefined);
  const finish = () => {
    const message = confirm === "approve" ? `${approveLabel} berhasil` : confirm === "revision" ? "Permintaan revisi dikirim" : "Data ditolak";
    toast({ title: message, description: "Perubahan ini masih berupa preview UI.", variant: confirm === "reject" ? "warning" : "success" });
    if (confirm === "approve") onApprove?.();
    if (confirm === "revision") onRevision?.();
    if (confirm === "reject") onReject?.();
    setConfirm(null);
  };
  return <><DropdownMenu items={[{ label: "Lihat detail", icon: <Eye className="h-4 w-4" />, onClick: detailAction }, { label: "Edit data", icon: <Pencil className="h-4 w-4" />, onClick: onEdit }, { label: approveLabel, icon: <Check className="h-4 w-4" />, onClick: () => setConfirm("approve"), separator: true }, { label: "Minta revisi", icon: <RotateCcw className="h-4 w-4" />, onClick: () => setConfirm("revision") }, { label: "Tolak", icon: <X className="h-4 w-4" />, variant: "danger", onClick: () => setConfirm("reject") }]} /><ConfirmDialog open={confirm !== null} onClose={() => setConfirm(null)} onConfirm={finish} title={confirm === "approve" ? `Konfirmasi ${approveLabel.toLowerCase()}` : confirm === "revision" ? "Minta revisi data" : "Tolak data"} description={confirm === "approve" ? "Pastikan data sudah diperiksa sebelum menyetujui." : confirm === "revision" ? "Peserta akan menerima pemberitahuan untuk memperbaiki data." : "Data akan ditandai sebagai ditolak dalam preview."} confirmLabel={confirm === "approve" ? approveLabel : confirm === "revision" ? "Kirim Revisi" : "Tolak Data"} /></>;
}
