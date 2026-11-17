"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { adminFetch, type ListResult } from "@/lib/admin-client";
import {
  AdminPageHeader,
  StatusPill,
  ToastBanner,
} from "@/components/admin/AdminUi";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminErrorBoundary } from "@/components/admin/ErrorBoundary";

interface AuditRow {
  id: number;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  summary: string;
  created_at: string;
}

const ACTION_LABELS: Record<string, { label: string; cls: string }> = {
  CREATE: { label: "Buat", cls: "bg-success/15 text-success border-success/30" },
  UPDATE: { label: "Ubah", cls: "bg-accent/15 text-accent border-accent/30" },
  DELETE: { label: "Hapus", cls: "bg-error/15 text-error border-error/30" },
  LOGIN: { label: "Login", cls: "bg-wa/15 text-success border-wa/35" },
  LOGOUT: { label: "Keluar", cls: "bg-paper-3 text-ink-2 border-rule" },
  SETTINGS: { label: "Aturan", cls: "bg-paper-3 text-ink-2 border-rule" },
};

const ACTION_OPTIONS = ["CREATE", "UPDATE", "DELETE", "LOGIN", "SETTINGS"];
const ENTITY_OPTIONS = [
  "booking",
  "package",
  "blog",
  "gallery_item",
  "media_asset",
  "admin_user",
  "settings",
  "login",
];

function ActionBadge({ action }: { action: string }) {
  const meta = ACTION_LABELS[action];
  if (!meta) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap bg-paper-3 text-ink-2 border-rule">
        {action}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}

const PAGE_SIZE = 50;

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setQ(searchInput.trim()), 350);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const qs = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (actionFilter !== "all") sp.set("action", actionFilter);
    if (entityFilter !== "all") sp.set("entity_type", entityFilter);
    if (dateFrom) sp.set("date_from", dateFrom);
    if (dateTo) sp.set("date_to", dateTo);
    sp.set("page", String(page));
    sp.set("pageSize", String(PAGE_SIZE));
    return sp.toString();
  }, [q, actionFilter, entityFilter, dateFrom, dateTo, page]);

  const loadAudit = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<ListResult<AuditRow>>(
        `/api/admin/audit?${qs}`,
      );
      setRows(data.items);
      setTotal(data.meta.total);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memuat riwayat audit.",
      });
    } finally {
      setLoading(false);
    }
  }, [qs]);

  useEffect(() => {
    void loadAudit();
  }, [loadAudit]);

  function handleFilterChange() {
    setPage(1);
  }

  function exportCSV() {
    if (!rows.length) {
      setToast({ type: "error", message: "Tidak ada data untuk diekspor." });
      return;
    }
    const header = [
      "id",
      "created_at",
      "admin_email",
      "action",
      "entity_type",
      "entity_id",
      "summary",
    ];
    const escape = (value: string) => {
      const v = value.replace(/\r?\n/g, " ");
      return /[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    };
    const lines = rows.map((r) =>
      [
        String(r.id),
        r.created_at,
        r.admin_email,
        r.action,
        r.entity_type,
        r.entity_id,
        r.summary,
      ]
        .map(escape)
        .join(","),
    );
    const csv = [header.join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `audit-log-${stamp}-p${page}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setSearchInput("");
    setActionFilter("all");
    setEntityFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  const hasFilters =
    searchInput || actionFilter !== "all" || entityFilter !== "all" || dateFrom || dateTo;

  return (
    <AdminErrorBoundary>
      <div>
        <AdminPageHeader
          title="Log Audit & Riwayat Aktivitas"
          subtitle="Telusuri seluruh aksi admin (login, buat, ubah, hapus) untuk kepatuhan & keamanan sistem."
          actions={
            <button
              type="button"
              onClick={exportCSV}
              disabled={loading || !rows.length}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-card bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              <AdminIcon name="download" className="w-[18px] h-[18px]" />
              Ekspor CSV
            </button>
          }
        />

        <ToastBanner toast={toast} onClose={() => setToast(null)} />

        {/* Filters */}
        <div className="mb-5 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex flex-wrap gap-2 flex-1">
              <select
                aria-label="Filter aksi"
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  handleFilterChange();
                }}
                className="px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              >
                <option value="all">Semua Aksi</option>
                {ACTION_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {ACTION_LABELS[a]?.label || a}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter tipe entitas"
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value);
                  handleFilterChange();
                }}
                className="px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              >
                <option value="all">Semua Entitas</option>
                {ENTITY_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-card bg-paper-2 border border-rule">
                <AdminIcon name="calendar" className="w-4 h-4 text-muted" />
                <input
                  type="date"
                  aria-label="Dari tanggal"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    handleFilterChange();
                  }}
                  className="bg-transparent text-sm text-ink"
                />
                <span className="text-xs text-muted">–</span>
                <input
                  type="date"
                  aria-label="Sampai tanggal"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    handleFilterChange();
                  }}
                  className="bg-transparent text-sm text-ink"
                />
              </div>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-card bg-paper-2 border border-rule text-xs font-semibold text-ink-2 hover:text-ink hover:border-accent"
                >
                  <AdminIcon name="sync" className="w-3.5 h-3.5" />
                  Reset
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari email, entitas, ID, atau ringkasan…"
                className="w-full lg:w-80 px-3.5 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted">
            <span className="num">
              Menampilkan {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, total)} dari {total} log
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-card border border-rule text-xs font-semibold text-ink-2 hover:text-ink hover:border-accent disabled:opacity-40"
              >
                ← Sebelumnya
              </button>
              <span className="num">
                Halaman {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-card border border-rule text-xs font-semibold text-ink-2 hover:text-ink hover:border-accent disabled:opacity-40"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 rounded-card bg-paper-2 border border-rule text-sm text-muted text-center">
            Memuat riwayat audit…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 rounded-card bg-paper-2 border border-rule text-sm text-muted text-center">
            Tidak ada log audit sesuai filter saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-card border border-rule">
            <table className="w-full text-sm">
              <thead className="bg-paper-2 text-ink-2">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    Waktu
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    Admin
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    Aksi
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    Entitas
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Ringkasan
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-rule bg-paper-2 hover:bg-paper-3 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-ink-2 num">
                      {new Date(row.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-ink">
                      {row.admin_email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ActionBadge action={row.action} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-ink-2">
                      {row.entity_type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-ink-2">
                      {row.entity_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">
                      {row.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminErrorBoundary>
  );
}