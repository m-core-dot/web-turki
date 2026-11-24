import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  mockRecentRegistrations,
  registrationStatusConfig,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export function RecentRegistrations() {
  return (
    <Card padding="none">
      <CardHeader className="border-b border-border px-5 py-4">
        <CardTitle>Registrasi Terbaru</CardTitle>
        <Button variant="ghost" size="sm">
          Lihat Semua
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>

      <div className="divide-y divide-border">
        {mockRecentRegistrations.map((reg) => {
          const statusInfo = registrationStatusConfig[reg.status];
          return (
            <div
              key={reg.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-background-alt/50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={reg.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {reg.name}
                  </p>
                  <p className="text-xs text-muted">
                    {reg.id} · {formatDate(reg.date)}
                  </p>
                </div>
              </div>

              <Badge variant={statusInfo.variant} dot>
                {statusInfo.label}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
