"use client";

import React, { useEffect, useState } from "react";
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

export default function AdminFinancePage() {
  const [form, setForm] = useState<FinanceSettings>({
    myrToIdr: 4400,
    sgdToIdr: 11500,
    dpPercentage: 30,
    dpRuleNote: "",
    weekdayDisclaimer: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  useEffect(() => {
    adminFetch<Record<string, unknown>>("/api/admin/finance")
      .then((data) => {
        if (data.finance) {
          setForm(data.finance as FinanceSettings);
        }
        if (data.updatedAt) {
          setLastUpdated(data.updatedAt as string);
        }
      })
      .catch((err) =>
        setToast({
          type: "error",
          message: err instanceof Error ? err.message : "Gagal memuat kurs.",
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

  return (
    <AdminErrorBoundary>
      <div>
        <AdminPageHeader
        title="Kurs Mata Uang & Aturan DP"
        subtitle="Ubah nilai tukar RM dan SGD di sini. Seluruh harga pada kalkulator website dan halaman Pembayaran otomatis ikut berubah."
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      {loading ? (
        <p className="text-sm text-muted py-8">Memuat konfigurasi…</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl bg-paper-2 border border-rule rounded-card p-6 space-y-5"
        >
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
              className="px-4 py-2 rounded-md bg-paper-2 border border-rule text-ink font-bold text-xs hover:bg-paper disabled:opacity-50"
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
      )}
    </div>
    </AdminErrorBoundary>
  );
}

