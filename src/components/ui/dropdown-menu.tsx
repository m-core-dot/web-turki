"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  align?: "left" | "right";
}

export function DropdownMenu({
  items,
  trigger,
  align = "right",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-1.5 text-muted hover:bg-background-alt hover:text-foreground transition-colors"
        aria-label="Aksi"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger ?? <MoreVertical className="h-4 w-4" />}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-44 rounded-xl border border-border bg-surface py-1 shadow-dropdown",
            align === "right" ? "right-0" : "left-0"
          )}
          role="menu"
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.separator && i > 0 && (
                <div className="my-1 border-t border-border" />
              )}
              <button
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  item.variant === "danger"
                    ? "text-danger-600 hover:bg-danger-50"
                    : "text-foreground hover:bg-background-alt",
                  item.disabled && "cursor-not-allowed opacity-40"
                )}
              >
                {item.icon && (
                  <span className="shrink-0">{item.icon}</span>
                )}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
