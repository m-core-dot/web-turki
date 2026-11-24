"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminTablePage } from "@/components/shared/admin-table-page";
import { mockNotifications } from "@/lib/mock-data";

export default function NotifikasiPage() {
  return <AdminTablePage title="Notifikasi" description="Pantau riwayat pengiriman notifikasi peserta." action={<Button><Send className="h-4 w-4" />Kirim Notifikasi</Button>} data={mockNotifications} keyExtractor={(item) => item.id} searchPlaceholder="Cari penerima atau template..." columns={[
    { key: "id", label: "ID", render: (item) => <span className="font-mono text-xs text-muted">{item.id}</span> },
    { key: "recipient", label: "Penerima", render: (item) => <span className="font-medium text-foreground">{item.recipient}</span> },
    { key: "template", label: "Template", render: (item) => <span>{item.template}</span> },
    { key: "channel", label: "Kanal", render: (item) => <span>{item.channel}</span> },
    { key: "sent", label: "Dikirim", render: (item) => <span className="text-muted">{item.sentAt}</span> },
    { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "sent" ? "success" : "danger"} dot>{item.status === "sent" ? "Terkirim" : "Gagal"}</Badge> },
  ]} />;
}

