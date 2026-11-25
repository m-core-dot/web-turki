"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Pilih...",
      label,
      helperText,
      error,
      id,
      disabled,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
      <div className="space-y-1.5" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={ref}
            id={inputId}
            type="button"
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm transition-colors",
              "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
              "disabled:cursor-not-allowed disabled:bg-background-alt disabled:opacity-60",
              error && "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20",
              open && "border-primary-500 ring-2 ring-primary-500/20",
              className
            )}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${inputId}-options`}
          >
            <span className={selected ? "text-foreground" : "text-muted-foreground"}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted transition-transform",
                open && "rotate-180"
              )}
            />
          </button>

          {open && (
            <ul
              id={`${inputId}-options`}
              role="listbox"
              className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border bg-surface py-1 shadow-dropdown"
            >
              {options.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  aria-disabled={opt.disabled || undefined}
                  tabIndex={opt.disabled ? -1 : 0}
                  onKeyDown={(event) => {
                    if (!opt.disabled && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      onChange?.(opt.value);
                      setOpen(false);
                    }
                  }}
                  onClick={() => {
                    if (!opt.disabled) {
                      onChange?.(opt.value);
                      setOpen(false);
                    }
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between px-3 py-2 text-sm",
                    opt.disabled
                      ? "cursor-not-allowed opacity-40"
                      : "hover:bg-background-alt",
                    opt.value === value && "bg-primary-50 text-primary-700"
                  )}
                >
                  {opt.label}
                  {opt.value === value && <Check className="h-4 w-4" />}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-sm text-danger-600">{error}</p>}
        {!error && helperText && (
          <p className="text-sm text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
