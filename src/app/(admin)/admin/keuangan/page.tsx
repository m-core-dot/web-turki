"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockPayments } from "@/lib/mock-data";

export default function KeuanganPage() {
  return <AdminTablePage title="Keuangan" description="Kelola tagihan dan verifikasi pembayaran peserta." action={<Button><Wallet className="h-4 w-4" />Catat Pembayaran</Button>} data={mockPayments} keyExtractor={(item) => item.id} searchPlaceholder="Cari peserta atau nomor pembayaran..." columns={[
    { key: "id", label: "No. Pembayaran", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "student", label: "Peserta", render: (item) => <span className="font-medium text-foreground">{item.student}</span> },
    { key: "category", label: "Kategori", render: (item) => <span>{item.category}</span> },
    { key: "amount", label: "Nominal", render: (item) => <span className="font-medium tabular-nums text-foreground">{item.amount}</span> },
    { key: "due", label: "Jatuh Tempo", render: (item) => <span className="text-muted">{item.dueDate}</span> },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ]} />;
}

