"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-client";
import { AdminPageHeader, ToastBanner } from "@/components/admin/AdminUi";
import { AdminErrorBoundary } from "@/components/admin/ErrorBoundary";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface FinanceSettings {
  myrToIdr: number;
  sgdToIdr: number;
  dpPercentage: number;
  dpRuleNote: string;
  weekdayDisclaimer: string;
}

interface FinanceAnalytics {
  summary: {
    total_bookings: number;
    total_estimated: number;
    total_dp: number;
    total_ar: number;
  };
  monthly: Array<{
    month_label: string;
    order_count: number;
    revenue: number;
  }>;
  packageDistribution: Array<{
    package_name: string;
    booking_count: number;
  }>;
  outstandingOrders: Array<{
    id: number;
    booking_code: string;
    guest_name: string;
    package_name: string;
    currency: string;
    estimated_total: number;
    dp_amount: number;
    balance: number;
  }>;
}

export default function AdminFinancePage() {
  const [form, setForm] = useState<FinanceSettings>({
    myrToIdr: 4400,
    sgdToIdr: 11500,
    dpPercentage: 30,
    dpRuleNote: "",
    weekdayDisclaimer: "",
  });
  const [analytics, setAnalytics] = useState<FinanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  useEffect(() => {
    adminFetch<{
      finance?: FinanceSettings;
      updatedAt?: string;
      analytics?: FinanceAnalytics;
    }>("/api/admin/finance")
      .then((data) => {
        if (data.finance) {
          setForm(data.finance);
        }
        if (data.updatedAt) {
          setLastUpdated(data.updatedAt);
        }
        if (data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch((err) =>
        setToast({
          type: "error",
          message: err instanceof Error ? err.message : "Gagal memuat data keuangan.",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleAutoFetch() {
    setFetching(true);
    try {
      const res = await adminFetch<{
        myrToIdr: number;
        sgdToIdr: number;
        source: string;
        fetchedAt: string;
      }>("/api/admin/finance/fetch-rates");
      setForm((prev) => ({ ...prev, myrToIdr: res.myrToIdr, sgdToIdr: res.sgdToIdr }));
      setLastUpdated(res.fetchedAt);
      setToast({
        type: "success",
        message: `Kurs otomatis diperbarui dari ${res.source} — MYR/SGD ke IDR diisi ke form.`,
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal mengambil kurs otomatis.",
      });
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ key: "finance", value: form }),
      });
      setToast({
        type: "success",
        message:
          "Kurs MYR/SGD dan kebijakan DP disimpan. Seluruh kalkulator harga & /payment otomatis mengikuti kurs baru.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan pengaturan.",
      });
    } finally {
      setSaving(false);
    }
  }

  const maxMonthlyRevenue = analytics?.monthly.length
    ? Math.max(...analytics.monthly.map((m) => m.revenue), 1)
    : 1;

  const totalDistBookings = analytics?.packageDistribution.length
    ? analytics.packageDistribution.reduce((acc, curr) => acc + curr.booking_count, 0)
    : 1;

  return (
    <AdminErrorBoundary>
      <div className="space-y-8">
        <AdminPageHeader
          title="Dashboard Keuangan & Kurs"
          subtitle="Pantau volume transaksi, estimasi pelunasan tamu di Bandara Kualanamu, serta kelola acuan kurs MYR/SGD."
        />

        <ToastBanner toast={toast} onClose={() => setToast(null)} />

        {loading ? (
          <p className="text-sm text-muted py-8">Memuat data keuangan…</p>
        ) : (
          <>
            {/* Summary KPI Cards */}
            {analytics?.summary && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-paper-2 border border-rule rounded-card p-5">
                  <span className="text-xs font-medium text-muted block mb-1">Total Permintaan / Order</span>
                  <div className="flex items-baseline justify-between">
                    <strong className="text-2xl font-bold text-ink num">
                      {analytics.summary.total_bookings}
                    </strong>
                    <span className="text-xs text-accent">Order Aktif</span>
                  </div>
                </div>

                <div className="bg-paper-2 border border-rule rounded-card p-5">
                  <span className="text-xs font-medium text-muted block mb-1">Volume Nilai Trip</span>
                  <div className="flex items-baseline justify-between">
                    <strong className="text-2xl font-bold text-ink num">
                      Rp {analytics.summary.total_estimated.toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <span className="text-[11px] text-muted mt-1 block">
                    ~ RM {Math.round(analytics.summary.total_estimated / (form.myrToIdr || 4400)).toLocaleString("en-US")}
                  </span>
                </div>

                <div className="bg-paper-2 border border-rule rounded-card p-5">
                  <span className="text-xs font-medium text-muted block mb-1">Total DP Diterima</span>
                  <div className="flex items-baseline justify-between">
                    <strong className="text-2xl font-bold text-success num">
                      Rp {analytics.summary.total_dp.toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <span className="text-[11px] text-muted mt-1 block">Terkonfirmasi Masuk Rekening</span>
                </div>

                <div className="bg-paper-2 border border-rule rounded-card p-5">
                  <span className="text-xs font-medium text-muted block mb-1">Piutang Pelunasan (AR di KNO)</span>
                  <div className="flex items-baseline justify-between">
                    <strong className="text-2xl font-bold text-accent num">
                      Rp {analytics.summary.total_ar.toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <span className="text-[11px] text-muted mt-1 block">Pelunasan Tunai/Wise saat Ketemu</span>
                </div>
              </div>
            )}

            {/* Charts & Distribution Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <div className="bg-paper-2 border border-rule rounded-card p-5">
                <h3 className="text-sm font-semibold text-ink mb-4 flex items-center justify-between">
                  <span>Tren Pendapatan Bulanan</span>
                  <span className="text-xs text-muted font-normal">6 Bulan Terakhir</span>
                </h3>
                {analytics?.monthly && analytics.monthly.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.monthly.map((m) => {
                      const pct = Math.round((m.revenue / maxMonthlyRevenue) * 100);
                      return (
                        <div key={m.month_label} className="space-y-1">
                          <div className="flex justify-between text-xs text-ink-2">
                            <span className="font-medium">{m.month_label}</span>
                            <span className="num font-semibold text-ink">
                              Rp {m.revenue.toLocaleString("id-ID")}{" "}
                              <span className="text-muted font-normal">({m.order_count} trip)</span>
                            </span>
                          </div>
                          <div className="w-full h-3 bg-paper rounded-full overflow-hidden border border-rule/50">
                            <div
                              className="h-full bg-accent rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted py-6 text-center">Belum ada riwayat pesanan bulanan.</p>
                )}
              </div>

              {/* Package Distribution */}
              <div className="bg-paper-2 border border-rule rounded-card p-5">
                <h3 className="text-sm font-semibold text-ink mb-4 flex items-center justify-between">
                  <span>Distribusi Paket Terpopuler</span>
                  <span className="text-xs text-muted font-normal">Berdasarkan Jumlah Booking</span>
                </h3>
                {analytics?.packageDistribution && analytics.packageDistribution.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.packageDistribution.map((p) => {
                      const pct = Math.round((p.booking_count / totalDistBookings) * 100);
                      return (
                        <div key={p.package_name} className="space-y-1">
                          <div className="flex justify-between text-xs text-ink-2">
                            <span className="font-medium truncate max-w-[220px]">{p.package_name}</span>
                            <span className="num font-semibold text-ink">
                              {p.booking_count} trip ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-3 bg-paper rounded-full overflow-hidden border border-rule/50">
                            <div
                              className="h-full bg-wa rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted py-6 text-center">Belum ada data paket terbooking.</p>
                )}
              </div>
            </div>

            {/* Outstanding Accounts Receivable (AR) */}
            {analytics?.outstandingOrders && analytics.outstandingOrders.length > 0 && (
              <div className="bg-paper-2 border border-rule rounded-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Daftar Tagihan Pelunasan Tamu (AR)</h3>
                    <p className="text-xs text-muted">Tamu yang sudah membayar DP dan memiliki sisa pelunasan saat tiba di KNO.</p>
                  </div>
                  <Link href="/admin/orders" className="text-xs text-accent hover:underline font-semibold">
                    Lihat Semua Order →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="border-b border-rule text-muted">
                      <tr>
                        <th className="py-2 px-3 font-medium">Kode</th>
                        <th className="py-2 px-3 font-medium">Tamu</th>
                        <th className="py-2 px-3 font-medium">Paket</th>
                        <th className="py-2 px-3 font-medium text-right">Total</th>
                        <th className="py-2 px-3 font-medium text-right">DP</th>
                        <th className="py-2 px-3 font-medium text-right">Sisa Tagihan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rule/50">
                      {analytics.outstandingOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-paper/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-accent">{ord.booking_code}</td>
                          <td className="py-2.5 px-3 font-medium text-ink">{ord.guest_name}</td>
                          <td className="py-2.5 px-3 text-ink-2 truncate max-w-[200px]">{ord.package_name}</td>
                          <td className="py-2.5 px-3 text-right num text-ink font-medium">
                            {ord.currency} {ord.estimated_total.toLocaleString("en-US")}
                          </td>
                          <td className="py-2.5 px-3 text-right num text-success font-medium">
                            {ord.currency} {ord.dp_amount.toLocaleString("en-US")}
                          </td>
                          <td className="py-2.5 px-3 text-right num text-accent font-bold">
                            {ord.currency} {ord.balance.toLocaleString("en-US")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Currency & DP Settings Form */}
            <div className="bg-paper-2 border border-rule rounded-card p-6 space-y-5">
              <div className="border-b border-rule pb-3">
                <h3 className="font-display text-lg text-ink">Pengaturan Kurs & Aturan Uang Muka</h3>
                <p className="text-xs text-muted">
                  Ubah nilai tukar RM dan SGD di sini. Seluruh harga pada kalkulator website dan halaman Pembayaran otomatis ikut berubah.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-muted">
                    Terakhir diperbarui:{" "}
                    <span className="text-ink-2 font-semibold">
                      {lastUpdated
                        ? new Date(lastUpdated).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                        : "—"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFetch}
                    disabled={fetching}
                    className="px-4 py-2 rounded-md bg-paper border border-rule text-ink font-bold text-xs hover:border-accent disabled:opacity-50"
                  >
                    {fetching ? "Mengambil…" : "Auto-fetch Kurs"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                      Kurs 1 MYR ke IDR (Rp)
                    </label>
                    <input
                      type="number"
                      min={1000}
                      required
                      value={form.myrToIdr}
                      onChange={(e) =>
                        setForm({ ...form, myrToIdr: Number(e.target.value) || 4400 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-card bg-paper border border-rule text-base font-bold text-ink num"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                      Kurs 1 SGD ke IDR (Rp)
                    </label>
                    <input
                      type="number"
                      min={5000}
                      required
                      value={form.sgdToIdr}
                      onChange={(e) =>
                        setForm({ ...form, sgdToIdr: Number(e.target.value) || 11500 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-card bg-paper border border-rule text-base font-bold text-ink num"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                      Acuan DP Standar (%)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={form.dpPercentage}
                      onChange={(e) =>
                        setForm({ ...form, dpPercentage: Number(e.target.value) || 30 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-card bg-paper border border-rule text-base font-bold text-ink num"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-md bg-paper border border-rule text-xs text-ink-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted block">Simulasi Paket 3D2N (4 Pax = RM 550/org):</span>
                    <span className="font-bold text-accent text-sm num">
                      Rp {(550 * form.myrToIdr).toLocaleString("id-ID")} / pax
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block">Simulasi SGD (4 Pax = RM 550/org):</span>
                    <span className="font-bold text-accent text-sm num">
                      S$ {Math.round((550 * form.myrToIdr) / (form.sgdToIdr || 11500)).toLocaleString("en-US")} / pax
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                    Kebijakan DP & Pelunasan (KNO)
                  </label>
                  <textarea
                    rows={3}
                    value={form.dpRuleNote}
                    onChange={(e) => setForm({ ...form, dpRuleNote: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-card bg-paper border border-rule text-sm text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                    Catatan Tarif Weekday Resmi
                  </label>
                  <textarea
                    rows={2}
                    value={form.weekdayDisclaimer}
                    onChange={(e) => setForm({ ...form, weekdayDisclaimer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-card bg-paper border border-rule text-sm text-ink"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      if (!confirm(`Hitung ulang harga IDR seluruh paket wisata berdasarkan kurs 1 MYR = Rp ${form.myrToIdr.toLocaleString("id-ID")}?`)) return;
                      setSaving(true);
                      try {
                        const res = await adminFetch<{ message: string }>("/api/admin/system/sync", {
                          method: "POST",
                          body: JSON.stringify({ action: "recalculate_package_idr" }),
                        });
                        setToast({ type: "success", message: res.message });
                      } catch (err) {
                        setToast({ type: "error", message: err instanceof Error ? err.message : "Gagal menghitung ulang." });
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="px-4 py-2.5 rounded-md border border-rule bg-paper text-ink font-semibold text-xs hover:border-accent flex items-center justify-center gap-2"
                  >
                    <AdminIcon name="sync" className="w-4 h-4 text-accent" />
                    <span>Selaraskan Harga IDR Semua Paket</span>
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
                  >
                    {saving ? "Menyimpan…" : "Simpan & Sinkronkan Kurs"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </AdminErrorBoundary>
  );
}
