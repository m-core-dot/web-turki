import {
  UserPlus,
  Clock,
  FileSearch,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { mockStats, type DashboardStat } from "@/lib/mock-data";

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  Clock,
  FileSearch,
  GraduationCap,
};

function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = iconMap[stat.icon];

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted">{stat.label}</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {stat.value.toLocaleString("id-ID")}
          </p>
          {stat.change && (
            <div className="flex items-center gap-1">
              {stat.changeType === "positive" && (
                <TrendingUp className="h-3.5 w-3.5 text-success-600" />
              )}
              {stat.changeType === "negative" && (
                <TrendingDown className="h-3.5 w-3.5 text-danger-600" />
              )}
              <span
                className={
                  stat.changeType === "positive"
                    ? "text-xs text-success-600"
                    : stat.changeType === "negative"
                      ? "text-xs text-danger-600"
                      : "text-xs text-muted"
                }
              >
                {stat.change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
            <Icon className="h-5 w-5 text-primary-700" />
          </div>
        )}
      </div>
    </Card>
  );
}

export function StatsSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {mockStats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
