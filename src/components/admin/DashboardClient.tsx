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
  const [showGuide, setShowGuide] = useState<boolean>(true);

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
        <div className="h-20 bg-paper-2 rounded-card motion-safe:animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-paper-2 rounded-card motion-safe:animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const maxTrend = Math.max(1, ...data.trend14Days.map((d) => d.count));

  return (
    <div>
      <AdminPageHeader
        title="Beranda Admin Sumatera Explore"
        subtitle="Kelola order tamu, cetak kwitansi resmi, ubah harga paket, unggah foto galeri, dan atur nomor WhatsApp dari satu tempat yang mudah."
        actions={
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-paper-2 border border-rule text-xs">
            <AdminIcon
              name={data.dbHealth.connected ? "check_circle" : "error"}
              className={`w-4 h-4 ${data.dbHealth.connected ? "text-success" : "text-error"}`}
            />
            <span className="text-ink-2">
              Server Data: {data.dbHealth.connected ? `Aktif (${data.dbHealth.latencyMs}ms)` : "Terputus"}
            </span>
          </div>
        }
      />

      {/* Friendly Beginner Guide Banner */}
      <section className="mb-6 bg-paper-2 border border-rule rounded-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <AdminIcon name="help" className="w-5 h-5 text-accent" />
            <h2 className="font-display text-base text-ink">
              Panduan Singkat Operator (4 Langkah Mudah)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className="px-3 py-1 rounded-md border border-rule bg-paper text-xs font-semibold text-ink-2 hover:text-ink"
          >
            {showGuide ? "Sembunyikan Panduan" : "Tampilkan Panduan"}
          </button>
        </div>

        {showGuide ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-md bg-paper border border-rule space-y-1">
              <p className="font-bold text-accent">1. Cek Tamu Masuk</p>
              <p className="text-ink-2 leading-relaxed">
                Setiap tamu yang klik pesan di website otomatis tercatat di menu Order &amp; Data Tamu.
              </p>
            </div>
            <div className="p-3 rounded-md bg-paper border border-rule space-y-1">
              <p className="font-bold text-accent">2. Tandai DP &amp; Supir</p>
              <p className="text-ink-2 leading-relaxed">
                Setelah tamu transfer DP, cukup klik tombol &ldquo;DP Lunas&rdquo; dan isi nama supirnya.
              </p>
            </div>
            <div className="p-3 rounded-md bg-paper border border-rule space-y-1">
              <p className="font-bold text-accent">3. Buat &amp; Kirim Kwitansi</p>
              <p className="text-ink-2 leading-relaxed">
                Klik tombol &ldquo;Buat Kwitansi&rdquo;, sesuaikan harga bila perlu, lalu download gambar PNG untuk dikirim ke WhatsApp tamu.
              </p>
            </div>
            <div className="p-3 rounded-md bg-paper border border-rule space-y-1">
              <p className="font-bold text-accent">4. Ubah Harga / Foto Kapan Saja</p>
              <p className="text-ink-2 leading-relaxed">
                Ubah kurs RM atau harga paket sekali klik, seluruh harga di website tamu langsung ter-update otomatis.
              </p>
            </div>
          </div>
        ) : null}
      </section>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-paper-2 p-5 rounded-card border border-rule">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold">
              Total Nilai Pemesanan
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
            <span className="text-xs font-semibold">
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
            <span className="text-xs font-semibold">
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
            <span className="text-xs font-semibold">
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
                      className={`w-full rounded-t transition-colors ${
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
                  className="flex items-center justify-between p-2.5 rounded-md bg-paper border border-rule"
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

      {/* Quick Actions: Expanded 8 Visual Shortcut Buttons */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-display text-lg text-ink">Tombol Jalan Pintas (1 Klik)</h2>
          <span className="text-xs text-muted">Pilih tugas yang ingin langsung dikerjakan</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Link
            href="/admin/orders?action=new"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="add_shopping_cart" className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">+ Catat Order Baru</p>
              <p className="text-[11px] text-muted">Masukkan nama tamu &amp; DP</p>
            </div>
          </Link>
          <Link
            href="/admin/receipts"
            className="p-4 rounded-card bg-paper-2 border border-accent/60 hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="receipt_add" className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Buat Kwitansi Resmi</p>
              <p className="text-[11px] text-muted">Edit harga, simpan PDF/PNG ke WA</p>
            </div>
          </Link>
          <Link
            href="/admin/packages?action=new"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="sell" className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Tambah / Edit Paket</p>
              <p className="text-[11px] text-muted">Ubah tarif 1-20 orang &amp; rute</p>
            </div>
          </Link>
          <Link
            href="/admin/gallery?action=new"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="add_photo_alternate" className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Upload Foto Wisata</p>
              <p className="text-[11px] text-muted">Pilih foto dari galeri HP/PC</p>
            </div>
          </Link>
          <Link
            href="/admin/blog?action=new"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="post_add" className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Tulis Artikel Wisata</p>
              <p className="text-[11px] text-muted">Tambah panduan rute &amp; kuliner</p>
            </div>
          </Link>
          <Link
            href="/admin/finance"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="currency_exchange" className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Ubah Kurs &amp; Aturan DP</p>
              <p className="text-[11px] text-muted">Otomatis ke kalkulator web</p>
            </div>
          </Link>
          <Link
            href="/admin/business"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="verified_user" className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Ganti No WA &amp; Profil</p>
              <p className="text-[11px] text-muted">WA, Medsos, Armada, FAQ</p>
            </div>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="p-4 rounded-card bg-paper-2 border border-rule hover:border-accent flex items-center gap-3 transition-colors"
          >
            <AdminIcon name="open_in_new" className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-bold text-ink">Lihat Website Utama</p>
              <p className="text-[11px] text-muted">Cek hasil perubahan di depan</p>
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
                className="p-3 rounded-md bg-paper border border-rule flex items-center justify-between gap-3"
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
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <StatusPill status={b.dp_status} />
                    <Link
                      href={`/admin/receipts?orderId=${b.id}`}
                      className="px-2 py-0.5 rounded-md bg-paper-2 border border-rule text-[11px] font-bold text-accent hover:border-accent"
                    >
                      Kwitansi
                    </Link>
                  </div>
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
                  className="p-3 rounded-md bg-paper border border-rule text-xs"
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

