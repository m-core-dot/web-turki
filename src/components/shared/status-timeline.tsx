import { cn } from "@/lib/utils";

interface StatusTimelineItem {
  label: string;
  date?: string;
  description?: string;
  status: "completed" | "current" | "upcoming";
}

interface StatusTimelineProps {
  items: StatusTimelineItem[];
  className?: string;
}

const statusStyles: Record<StatusTimelineItem["status"], { dot: string; line: string }> = {
  completed: {
    dot: "bg-success-500 border-success-200",
    line: "bg-success-200",
  },
  current: {
    dot: "bg-primary-500 border-primary-200 ring-4 ring-primary-100",
    line: "bg-border",
  },
  upcoming: {
    dot: "bg-background-alt border-border",
    line: "bg-border",
  },
};

export function StatusTimeline({ items, className }: StatusTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => {
        const style = statusStyles[item.status];
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-3 w-3 shrink-0 rounded-full border-2",
                  style.dot
                )}
              />
              {!isLast && (
                <div className={cn("w-0.5 flex-1 min-h-8", style.line)} />
              )}
            </div>

            {/* Content */}
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-medium -mt-0.5",
                  item.status === "upcoming"
                    ? "text-muted"
                    : "text-foreground"
                )}
              >
                {item.label}
              </p>
              {item.date && (
                <p className="text-xs text-muted mt-0.5">{item.date}</p>
              )}
              {item.description && (
                <p className="text-xs text-muted mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
