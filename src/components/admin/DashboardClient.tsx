"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-client";
import { AdminPageHeader, StatusPill } from "@/components/admin/AdminUi";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface DashboardData {
  dbHealth: { connected: boolean; latencyMs: number; error?: string };
  counts: {
    total_packages: number;
    active_packages: number;
    total_blogs: number;
    published_blogs: number;
    total_gallery: number;
    total_media: number;
    total_admins: number;
  };
  bookings: {
    total: number;
    totalPipelineMyr: number;
    totalDpCollectedMyr: number;
    byStatus: Record<string, { count: number; estTotal: number; dpTotal: number }>;
  };
  trend14Days: Array<{ day: string; count: number; totalMyr: number }>;
  finance: { myrToIdr: number; sgdToIdr: number; dpPercentage?: number };
  recentBookings: Array<{
    id: number;
    booking_code: string;
    guest_name: string;
    package_name: string;
    adults_count: number;
    children_count: number;
    estimated_total: number;
    dp_amount: number;
    dp_status: string;
    created_at: string;
  }>;
  recentAuditLogs: Array<{
    id: number;
    admin_email: string;
    action: string;
    entity_type: string;
    entity_id: string;
    summary: string;
    created_at: string;
  }>;
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<DashboardData>("/api/admin/dashboard")
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Gagal memuat dashboard."),
      );
  }, []);

  if (error) {
    return (
      <div className="p-6 rounded-card bg-error/15 border border-error/40 text-ink">
        <p className="font-bold">Gagal memuat Dashboard</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-paper-2 rounded-card animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-paper-2 rounded-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const maxTrend = Math.max(1, ...data.trend14Days.map((d) => d.count));

  return (
    <div>
      <AdminPageHeader
        title="Dashboard Operasional & CMS"
        subtitle="Kendali penuh seluruh paket trip, order & DP WhatsApp, artikel rute, galeri media, kurs mata uang, dan legalitas PT SUJAI TOBA SUMATERA."
        actions={
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-2 border border-rule text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                data.dbHealth.connected ? "bg-success" : "bg-error"
              }`}
            />
            <span className="text-ink-2">
              Supabase Postgres: {data.dbHealth.connected ? `${data.dbHealth.latencyMs}ms` : "Offline"}
            </span>
          </div>
        }
      />

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-paper-2 p-5 rounded-card border border-rule">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pipeline Order
            </span>
            <AdminIcon name="receipt_long" className="w-5 h-5 text-accent" />
          </div>
          <p className="font-display text-2xl text-ink num">
            RM {data.bookings.totalPipelineMyr.toLocaleString("en-US")}
          </p>
          <p className="text-xs text-muted mt-1">
            {data.bookings.total} order • DP masuk RM{" "}
            {data.bookings.totalDpCollectedMyr.toLocaleString("en-US")}
          </p>
        </div>

        <div className="bg-paper-2 p-5 rounded-card border border-rule">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Paket Wisata Aktif
            </span>
            <AdminIcon name="tour" className="w-5 h-5 text-accent" />
          </div>
          <p className="font-display text-2xl text-ink num">
            {data.counts.active_packages} / {data.counts.total_packages}
          </p>
          <p className="text-xs text-muted mt-1">
            Tersinkron langsung ke katalog publik
          </p>
        </div>

        <div className="bg-paper-2 p-5 rounded-card border border-rule">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Kurs Aktif Web
            </span>
            <AdminIcon name="currency_exchange" className="w-5 h-5 text-accent" />
          </div>
          <p className="font-display text-2xl text-ink num">
            1 RM = Rp {Number(data.finance.myrToIdr || 4400).toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-muted mt-1">
            1 SGD = Rp {Number(data.finance.sgdToIdr || 11500).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-paper-2 p-5 rounded-card border border-rule">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Konten & Media
            </span>
            <AdminIcon name="collections" className="w-5 h-5 text-accent" />
          </div>
          <p className="font-display text-2xl text-ink num">
            {data.counts.published_blogs} Jurnal • {data.counts.total_gallery} Foto
          </p>
          <p className="text-xs text-muted mt-1">
            {data.counts.total_media} upload tersimpan di database
          </p>
        </div>
      </div>

      {/* 14-Day Trend + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <section className="lg:col-span-2 bg-paper-2 border border-rule rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg text-ink">
                Tren Inquiry & Order 14 Hari Terakhir
              </h2>
              <p className="text-xs text-muted">
                Gabungan inquiry langsung WhatsApp dan pengisian form paket
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Kelola Order
            </Link>
          </div>

          <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-4">
            {data.trend14Days.map((d) => {
              const pct = Math.max(8, Math.round((d.count / maxTrend) * 100));
              return (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-1.5 group"
                  title={`${d.day}: ${d.count} order (RM ${d.totalMyr})`}
                >
                  <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity num">
                    {d.count}
                  </span>
                  <div className="w-full bg-paper-3 rounded-t flex items-end h-28 overflow-hidden">
                    <div
                      className={`w-full rounded-t transition-all ${
                        d.count > 0 ? "bg-accent" : "bg-rule/60"
                      }`}
                      style={{ height: `${d.count > 0 ? pct : 6}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted num">{d.day.slice(0, 2)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-paper-2 border border-rule rounded-card p-5">
          <h2 className="font-display text-lg text-ink mb-4">Status Pembayaran DP</h2>
          <div className="space-y-3">
            {(
              [
                "pending_inquiry",
                "waiting_dp",
                "dp_paid",
                "completed",
                "cancelled",
              ] as const
            ).map((st) => {
              const row = data.bookings.byStatus[st] || { count: 0, estTotal: 0 };
              return (
                <div
                  key={st}
                  className="flex items-center justify-between p-2.5 rounded-card bg-paper border border-rule"
                >
                  <StatusPill status={st} />
                  <div className="text-right">
                    <p className="text-sm font-bold text-ink num">{row.count} trip</p>
                    <p className="text-[11px] text-muted num">
                      RM {row.estTotal.toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="mb-6">
        <h2 className="font-display text-lg text-ink mb-3">Aksi Cepat Integrasi</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/orders"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="add_shopping_cart" className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Catat Order WA</p>
              <p className="text-[11px] text-muted">Pantau DP & sopir</p>
            </div>
          </Link>
          <Link
            href="/admin/packages"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="sell" className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Ubah Harga Tier</p>
              <p className="text-[11px] text-muted">Update tarif 1-20 pax</p>
            </div>
          </Link>
          <Link
            href="/admin/finance"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="currency_exchange" className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Update Kurs MYR</p>
              <p className="text-[11px] text-muted">Otomatis ke kalkulator</p>
            </div>
          </Link>
          <Link
            href="/admin/business"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="verified_user" className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Bisnis & Legal PT</p>
              <p className="text-[11px] text-muted">WA, Medsos, Armada, FAQ</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Bookings & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-paper-2 border border-rule rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-ink">Order & Lead Terbaru</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Semua order
            </Link>
          </div>
          <div className="space-y-2.5">
            {data.recentBookings.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-card bg-paper border border-rule flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {b.guest_name}{" "}
                    <span className="text-xs font-normal text-muted">({b.booking_code})</span>
                  </p>
                  <p className="text-xs text-muted truncate">
                    {b.package_name} • {b.adults_count} dws
                    {b.children_count ? `, ${b.children_count} ank` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <StatusPill status={b.dp_status} />
                  <p className="text-xs font-semibold text-ink num">
                    RM {b.estimated_total.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-paper-2 border border-rule rounded-card p-5">
          <h2 className="font-display text-lg text-ink mb-4">Log Aktivitas Admin</h2>
          {data.recentAuditLogs.length === 0 ? (
            <p className="text-sm text-muted">Belum ada catatan aktivitas.</p>
          ) : (
            <div className="space-y-2.5">
              {data.recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-card bg-paper border border-rule text-xs"
                >
                  <div className="flex items-center justify-between text-muted mb-1">
                    <span className="font-semibold text-accent">{log.action}</span>
                    <span>
                      {new Date(log.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-ink">{log.summary}</p>
                  <p className="text-[11px] text-muted mt-0.5">{log.admin_email}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

