import {
  UserPlus,
  FileText,
  Send,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRecentActivities, type RecentActivity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeConfig: Record<
  RecentActivity["type"],
  { icon: LucideIcon; color: string; bg: string }
> = {
  registration: {
    icon: UserPlus,
    color: "text-primary-700",
    bg: "bg-primary-50",
  },
  document: {
    icon: FileText,
    color: "text-info-700",
    bg: "bg-info-50",
  },
  application: {
    icon: Send,
    color: "text-accent-700",
    bg: "bg-accent-50",
  },
  payment: {
    icon: Wallet,
    color: "text-success-700",
    bg: "bg-success-50",
  },
  system: {
    icon: Settings,
    color: "text-muted",
    bg: "bg-background-alt",
  },
};

export function RecentActivities() {
  return (
    <Card padding="none">
      <CardHeader className="border-b border-border px-5 py-4">
        <CardTitle>Aktivitas Terbaru</CardTitle>
      </CardHeader>

      <div className="divide-y divide-border">
        {mockRecentActivities.map((activity) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="flex gap-3 px-5 py-3.5">
              <div
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  config.bg
                )}
              >
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.actor}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
