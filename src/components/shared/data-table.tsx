"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ListEmptyState } from "@/components/shared/state-views";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

export interface DataTableFilter<T> {
  key: keyof T;
  label: string;
  options: Array<{ value: string; label: string }>;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  filters?: DataTableFilter<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchable?: boolean;
  pageSize?: number;
  searchKeys?: Array<keyof T>;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  filters = [],
  keyExtractor,
  searchPlaceholder = "Cari...",
  searchable = true,
  pageSize = 10,
  searchKeys,
  emptyMessage = "Tidak ada data yang cocok dengan pencarian.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const values = searchKeys?.length
        ? searchKeys.map((key) => item[key])
        : Object.values(item as object);
      const matchesSearch = !normalizedSearch || values.some((value) =>
        String(value ?? "").toLocaleLowerCase("id-ID").includes(normalizedSearch)
      );
      const matchesFilters = filters.every((filter) => {
        const selected = filterValues[String(filter.key)];
        return !selected || String(item[filter.key]) === selected;
      });
      return matchesSearch && matchesFilters;
    });
  }, [data, filters, filterValues, normalizedSearch, searchKeys]);

  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const safePage = page > totalPages
    ? totalPages > 0
      ? totalPages
      : 1
    : totalPages > 0
      ? page
      : 1;
  const startIdx = (safePage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIdx, startIdx + pageSize);

  return (
    <div>
      {/* Search bar */}
      {(searchable || filters.length > 0) && (
        <div className="flex flex-col gap-3 border-b border-border px-5 py-3 sm:flex-row sm:flex-wrap sm:items-end">
          {searchable && <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>}
          {filters.map((filter) => (
            <label key={String(filter.key)} className="flex min-w-40 flex-col gap-1 text-xs font-medium text-muted">
              {filter.label}
              <select
                value={filterValues[String(filter.key)] ?? ""}
                onChange={(event) => {
                  setFilterValues((current) => ({ ...current, [String(filter.key)]: event.target.value }));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Semua</option>
                {filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          ))}
          {activeFilterCount > 0 && <button type="button" onClick={() => { setFilterValues({}); setPage(1); }} className="h-9 px-2 text-sm font-medium text-primary-700 hover:underline">Reset filter</button>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background-alt/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-3 font-medium text-muted",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="transition-colors hover:bg-background-alt/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-5 py-3.5", col.className)}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <ListEmptyState
                    title={data.length === 0 ? "Belum ada data" : emptyMessage}
                    description={data.length > 0 ? "Coba ubah kata kunci atau filter yang dipilih." : "Data akan muncul di sini setelah tersedia."}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-sm text-muted">
            Menampilkan {startIdx + 1}–
            {Math.min(startIdx + pageSize, filteredData.length)} dari {filteredData.length}
            {filteredData.length !== data.length && ` (dari ${data.length} total)`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="rounded-lg p-1.5 text-muted hover:bg-background-alt disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-sm tabular-nums text-foreground">
            {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="rounded-lg p-1.5 text-muted hover:bg-background-alt disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
