"use client";

import React, { useCallback, useEffect, useState } from "react";
import { adminFetch, type ListResult } from "@/lib/admin-client";
import {
  AdminPageHeader,
  ModalDialog,
  StatusPill,
  ToastBanner,
} from "@/components/admin/AdminUi";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface BookingRow {
  id: number;
  booking_code: string;
  package_slug: string;
  package_name: string;
  guest_name: string;
  guest_phone: string;
  guest_origin: string;
  trip_date: string | null;
  adults_count: number;
  children_count: number;
  vehicle_type: string;
  currency: string;
  estimated_total: number;
  dp_amount: number;
  dp_status: string;
  assigned_driver: string | null;
  notes: string;
  source: string;
  created_at: string;
}

interface PackageOption {
  slug: string;
  name: string;
  price_myr: number;
}

const EMPTY_FORM = {
  package_slug: "danau-toba-3d2n",
  package_name: "Private Trip Danau Toba 3 Days 2 Nights",
  guest_name: "",
  guest_phone: "",
  guest_origin: "Malaysia",
  trip_date: "",
  adults_count: 4,
  children_count: 0,
  vehicle_type: "Innova / SUV",
  currency: "MYR",
  estimated_total: 2200,
  dp_amount: 600,
  dp_status: "waiting_dp",
  assigned_driver: "",
  notes: "",
};

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [pkgOptions, setPkgOptions] = useState<PackageOption[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const qs = new URLSearchParams();
      if (q.trim()) qs.set("q", q.trim());
      if (statusFilter !== "all") qs.set("status", statusFilter);
      qs.set("pageSize", "50");

      const data = await adminFetch<ListResult<BookingRow>>(
        `/api/admin/orders?${qs.toString()}`,
      );
      setRows(data.items);
      setTotal(data.meta.total);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memuat order.",
      });
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter]);

  useEffect(() => {
    let active = true;
    const qs = new URLSearchParams();
    if (q.trim()) qs.set("q", q.trim());
    if (statusFilter !== "all") qs.set("status", statusFilter);
    qs.set("pageSize", "50");
    adminFetch<ListResult<BookingRow>>(`/api/admin/orders?${qs.toString()}`)
      .then((data) => {
        if (active) {
          setRows(data.items);
          setTotal(data.meta.total);
        }
      })
      .catch((err) => {
        if (active) {
          setToast({
            type: "error",
            message: err instanceof Error ? err.message : "Gagal memuat order.",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [q, statusFilter]);

  useEffect(() => {
    adminFetch<ListResult<PackageOption>>("/api/admin/packages?pageSize=50")
      .then((res) => setPkgOptions(res.items))
      .catch(() => {});
  }, []);

  function openCreate() {
    setEditingId(null);
    const first = pkgOptions[0];
    setForm({
      ...EMPTY_FORM,
      package_slug: first?.slug || EMPTY_FORM.package_slug,
      package_name: first?.name || EMPTY_FORM.package_name,
    });
    setModalOpen(true);
  }

  function openEdit(row: BookingRow) {
    setEditingId(row.id);
    setForm({
      package_slug: row.package_slug,
      package_name: row.package_name,
      guest_name: row.guest_name,
      guest_phone: row.guest_phone,
      guest_origin: row.guest_origin,
      trip_date: row.trip_date || "",
      adults_count: row.adults_count,
      children_count: row.children_count,
      vehicle_type: row.vehicle_type,
      currency: row.currency,
      estimated_total: row.estimated_total,
      dp_amount: row.dp_amount,
      dp_status: row.dp_status,
      assigned_driver: row.assigned_driver || "",
      notes: row.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminFetch(`/api/admin/orders/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
        setToast({ type: "success", message: "Data order berhasil diperbarui." });
      } else {
        await adminFetch("/api/admin/orders", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setToast({ type: "success", message: "Order baru berhasil dicatat." });
      }
      setModalOpen(false);
      await loadOrders();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan order.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickStatus(row: BookingRow, nextStatus: string) {
    try {
      await adminFetch(`/api/admin/orders/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ dp_status: nextStatus }),
      });
      setToast({
        type: "success",
        message: `Status ${row.booking_code} diperbarui.`,
      });
      await loadOrders();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal ubah status.",
      });
    }
  }

  function waFollowUpUrl(row: BookingRow) {
    const cleanPhone = row.guest_phone.replace(/[^0-9]/g, "");
    const balance = Math.max(0, row.estimated_total - row.dp_amount);
    const msg = `Halo ${row.guest_name}, kami dari Sumatera Explore (${row.booking_code}) untuk ${row.package_name}. Estimasi total: ${row.currency} ${row.estimated_total}, DP tercatat: ${row.currency} ${row.dp_amount}, baki pelunasan di Bandara KNO: ${row.currency} ${balance}.`;
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/6289502472594?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div>
      <AdminPageHeader
        title="Order, Lead WhatsApp & DP Tracker"
        subtitle="Pantau seluruh inquiry tamu website & WhatsApp, status uang muka (DP), penugasan supir Muslim lokal, dan sisa pelunasan di Bandara KNO."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-card bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover transition-colors"
          >
            <AdminIcon name="add_circle" className="w-[18px] h-[18px]" />
            Catat Order / DP Baru
          </button>
        }
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      {/* Search & Status Filters */}
      <div className="mb-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {[
            ["all", "Semua"],
            ["pending_inquiry", "Lead Baru"],
            ["waiting_dp", "Menunggu DP"],
            ["dp_paid", "DP Lunas"],
            ["completed", "Trip Selesai"],
            ["cancelled", "Batal"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                statusFilter === key
                  ? "bg-accent text-accent-ink border-accent"
                  : "bg-paper-2 text-ink-2 border-rule hover:border-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kode booking, nama tamu, WA..."
            className="w-full md:w-72 px-3.5 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent"
          />
          <span className="text-xs text-muted whitespace-nowrap num">
            {total} order
          </span>
        </div>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="p-8 rounded-card bg-paper-2 border border-rule text-sm text-muted text-center">
          Memuat data order...
        </div>
      ) : rows.length === 0 ? (
        <div className="p-8 rounded-card bg-paper-2 border border-rule text-sm text-muted text-center">
          Tidak ada order sesuai filter saat ini.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const balance = Math.max(0, row.estimated_total - row.dp_amount);
            return (
              <div
                key={row.id}
                className="p-4 sm:p-5 rounded-card bg-paper-2 border border-rule flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent">
                      {row.booking_code}
                    </span>
                    <StatusPill status={row.dp_status} />
                    <span className="text-xs text-muted">
                      {row.guest_origin} • {row.source === "web_form" ? "Web Lead" : "Admin/WA"}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg text-ink">
                    {row.guest_name}{" "}
                    <span className="text-sm font-normal text-ink-2">
                      ({row.guest_phone})
                    </span>
                  </h3>

                  <p className="text-xs text-ink-2">
                    {row.package_name} • {row.adults_count} Dewasa
                    {row.children_count ? `, ${row.children_count} Anak` : ""} •{" "}
                    {row.vehicle_type}
                    {row.trip_date ? ` • Tgl: ${row.trip_date}` : ""}
                  </p>

                  {row.assigned_driver ? (
                    <p className="text-xs text-success">
                      Supir: {row.assigned_driver}
                    </p>
                  ) : null}

                  {row.notes ? (
                    <p className="text-xs text-muted italic">{row.notes}</p>
                  ) : null}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-rule">
                  <div className="text-left lg:text-right">
                    <p className="text-sm font-bold text-ink num">
                      Total: {row.currency} {row.estimated_total.toLocaleString("en-US")}
                    </p>
                    <p className="text-xs text-muted num">
                      DP: {row.currency} {row.dp_amount.toLocaleString("en-US")} • Sisa KNO:{" "}
                      <span className="text-ink-2 font-semibold">
                        {row.currency} {balance.toLocaleString("en-US")}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label={`Ubah status ${row.booking_code}`}
                      value={row.dp_status}
                      onChange={(e) => handleQuickStatus(row, e.target.value)}
                      className="px-2.5 py-1.5 rounded-card bg-paper border border-rule text-xs text-ink"
                    >
                      <option value="pending_inquiry">Lead Baru</option>
                      <option value="waiting_dp">Menunggu DP</option>
                      <option value="dp_paid">DP Lunas</option>
                      <option value="completed">Trip Selesai</option>
                      <option value="cancelled">Batal</option>
                    </select>

                    <a
                      href={waFollowUpUrl(row)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-card bg-wa text-wa-ink text-xs font-semibold hover:bg-wa-hover transition-colors"
                    >
                      WA Tamu
                    </a>

                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-card bg-paper border border-rule text-xs font-semibold text-ink hover:border-accent"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ModalDialog
        open={modalOpen}
        title={editingId ? "Edit Data Order & DP" : "Catat Order / Inquiry Baru"}
        subtitle="Kelola konfirmasi jadwal, jumlah DP, armada, dan penugasan supir Muslim lokal."
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Nama Tamu / Pemesan
              </label>
              <input
                type="text"
                required
                value={form.guest_name}
                onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                placeholder="Contoh: Pn. Aisyah & Keluarga"
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Nomor WhatsApp Tamu
              </label>
              <input
                type="text"
                required
                value={form.guest_phone}
                onChange={(e) => setForm({ ...form, guest_phone: e.target.value })}
                placeholder="60123456789 / 62812..."
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Asal Negara Tamu
              </label>
              <select
                value={form.guest_origin}
                onChange={(e) => setForm({ ...form, guest_origin: e.target.value })}
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              >
                <option value="Malaysia">Malaysia</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Singapura">Singapura</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Tanggal Trip
              </label>
              <input
                type="date"
                value={form.trip_date}
                onChange={(e) => setForm({ ...form, trip_date: e.target.value })}
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Paket Wisata
              </label>
              <select
                value={form.package_slug}
                onChange={(e) => {
                  const found = pkgOptions.find((p) => p.slug === e.target.value);
                  setForm({
                    ...form,
                    package_slug: e.target.value,
                    package_name: found?.name || e.target.value,
                  });
                }}
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              >
                {pkgOptions.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Dewasa / Anak (usia 5 thn ke bawah gratis)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={1}
                  value={form.adults_count}
                  onChange={(e) =>
                    setForm({ ...form, adults_count: Number(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
                />
                <input
                  type="number"
                  min={0}
                  value={form.children_count}
                  onChange={(e) =>
                    setForm({ ...form, children_count: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Armada & Supir Muslim
              </label>
              <select
                value={form.vehicle_type}
                onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              >
                <option value="Innova / SUV">Innova / SUV (1-6 Pax)</option>
                <option value="Van Hiace">Van Hiace (6-10 Pax)</option>
                <option value="ELF (15 Pax)">Isuzu ELF (15 Pax)</option>
                <option value="2 Van Hiace (20 Pax)">2 Van Hiace (20 Pax)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Mata Uang & Estimasi Total
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="px-2 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
                >
                  <option value="MYR">MYR</option>
                  <option value="IDR">IDR</option>
                  <option value="SGD">SGD</option>
                </select>
                <input
                  type="number"
                  min={0}
                  value={form.estimated_total}
                  onChange={(e) =>
                    setForm({ ...form, estimated_total: Number(e.target.value) || 0 })
                  }
                  className="col-span-2 px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Nominal DP Diterima & Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={form.dp_amount}
                  onChange={(e) =>
                    setForm({ ...form, dp_amount: Number(e.target.value) || 0 })
                  }
                  className="px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
                />
                <select
                  value={form.dp_status}
                  onChange={(e) => setForm({ ...form, dp_status: e.target.value })}
                  className="px-2 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
                >
                  <option value="pending_inquiry">Lead Baru</option>
                  <option value="waiting_dp">Menunggu DP</option>
                  <option value="dp_paid">DP Lunas</option>
                  <option value="completed">Trip Selesai</option>
                  <option value="cancelled">Batal</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Penugasan Supir / Pendamping
              </label>
              <input
                type="text"
                value={form.assigned_driver}
                onChange={(e) =>
                  setForm({ ...form, assigned_driver: e.target.value })
                }
                placeholder="Contoh: Bang Suja'i (Driver Muslim + iPhone 4K)"
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Catatan Jadwal Penerbangan, Hotel & Request Halal/Drone
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-rule flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-card border border-rule text-sm text-ink-2 hover:text-ink"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-card bg-accent text-accent-ink text-sm font-bold hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Order"}
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
