"use client";

import React, { useCallback, useEffect, useState } from "react";
import { adminFetch, type ListResult } from "@/lib/admin-client";
import { AdminPageHeader, ToastBanner } from "@/components/admin/AdminUi";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminErrorBoundary } from "@/components/admin/ErrorBoundary";

interface AuditLogRow {
  id: number;
  admin_email: string;
  action: "LOGIN" | "CREATE" | "UPDATE" | "DELETE" | string;
  entity_type: string;
  entity_id: number | null;
  summary: string;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      const qs = new URLSearchParams();
      if (q.trim()) qs.set("q", q.trim());
      if (actionFilter !== "all") qs.set("action", actionFilter);
      qs.set("pageSize", "100");

      const res = await adminFetch<ListResult<AuditLogRow>>(`/api/admin/audit-logs?${qs.toString()}`);
      setLogs(res.items || []);
      setTotal(res.meta.total || 0);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memuat riwayat aktivitas.",
      });
    } finally {
      setLoading(false);
    }
  }, [q, actionFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadLogs]);

  function getActionBadge(action: string) {
    switch (action) {
      case "CREATE":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-success/15 text-success border border-success/30">TAMBAH</span>;
      case "UPDATE":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">UBAH</span>;
      case "DELETE":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-error/15 text-error border border-error/30">HAPUS</span>;
      case "LOGIN":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">MASUK</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-paper-3 text-muted border border-rule">{action}</span>;
    }
  }

  return (
    <AdminErrorBoundary>
      <div>
        <AdminPageHeader
          title="Riwayat Aktivitas & Audit Log"
          subtitle="Catatan jejak seluruh perubahan data: siapa yang mengubah harga paket, mencetak kwitansi, mengubah kurs, atau login ke sistem."
        />

        <ToastBanner toast={toast} onClose={() => setToast(null)} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-paper-2 p-3 rounded-card border border-rule">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              ["all", "Semua"],
              ["LOGIN", "Login"],
              ["CREATE", "Tambah Data"],
              ["UPDATE", "Perubahan Data"],
              ["DELETE", "Penghapusan"],
            ].map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setActionFilter(k)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  actionFilter === k
                    ? "bg-forest text-forest-ink shadow-xs"
                    : "bg-paper text-ink hover:bg-paper-3"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="search"
              placeholder="Cari aktivitas, admin, entitas…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-paper border border-rule text-xs text-ink placeholder:text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Activity Table */}
        <div className="bg-paper-2 border border-rule rounded-card overflow-hidden">
          <div className="px-4 py-3 border-b border-rule flex items-center justify-between">
            <p className="text-xs font-semibold text-ink">
              Total Catatan: <span className="text-accent font-bold">{total}</span>
            </p>
            <p className="text-[11px] text-muted">
              Menampilkan {logs.length} catatan aktivitas terbaru
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-muted py-12 text-center">Memuat riwayat aktivitas…</p>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <AdminIcon name="history" className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-sm font-semibold text-ink">Belum ada riwayat aktivitas yang tercatat.</p>
              <p className="text-xs text-muted mt-1">Setiap tindakan yang dilakukan pengelola akan otomatis muncul di sini.</p>
            </div>
          ) : (
            <div className="divide-y divide-rule">
              {logs.map((log) => {
                const date = new Date(log.created_at);
                const formattedDate = date.toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={log.id} className="p-4 hover:bg-paper-3/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5">{getActionBadge(log.action)}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{log.summary}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted">
                          <span className="font-mono text-ink-2">{log.admin_email}</span>
                          <span>•</span>
                          <span className="capitalize px-1.5 py-0.5 rounded bg-paper border border-rule text-[11px]">
                            {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs text-muted">{formattedDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminErrorBoundary>
  );
}
