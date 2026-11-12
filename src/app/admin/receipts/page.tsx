"use client";

import React, { useCallback, useEffect, useState } from "react";
import { adminFetch, type ListResult } from "@/lib/admin-client";
import { AdminPageHeader, StatusPill, ToastBanner } from "@/components/admin/AdminUi";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface ReceiptLineItem {
  label: string;
  qty: number;
  unitPrice: number;
}

interface OrderRow {
  id: number;
  booking_code: string;
  package_name: string;
  guest_name: string;
  guest_phone: string;
  guest_origin: string;
  trip_date: string;
  adults_count: number;
  children_count: number;
  vehicle_type: string;
  currency: string;
  estimated_total: number;
  dp_amount: number;
  dp_status: string;
  notes: string;
}

interface SavedReceipt {
  id: number;
  receipt_number: string;
  booking_id: number | null;
  booking_code: string;
  issue_date: string;
  guest_name: string;
  guest_phone: string;
  guest_origin: string;
  package_name: string;
  trip_date: string;
  pax_summary: string;
  vehicle_type: string;
  currency: string;
  items: ReceiptLineItem[];
  total_amount: number;
  dp_amount: number;
  remaining_amount: number;
  payment_status: string;
  payment_method: string;
  notes: string;
  issuer_name: string;
  created_at: string;
}

interface BusinessProfile {
  brandName: string;
  legalName: string;
  legalForm: string;
  decreeNumber: string;
  shortAddress: string;
  whatsappDisplay: string;
  email: string;
  ownerName: string;
}

const DEFAULT_BUSINESS: BusinessProfile = {
  brandName: "Sumatera Explore",
  legalName: "SUJAI TOBA SUMATERA",
  legalForm: "Perseroan Perorangan",
  decreeNumber: "AHU-A122244.AH.01.30.Tahun 2026",
  shortAddress: "Jl. Trimurti 109, Berastagi, Karo, Sumatera Utara",
  whatsappDisplay: "+62 823-6230-2773",
  email: "booking@sumateraexplore.my.id",
  ownerName: "Tim Operasional Berastagi",
};

function makeReceiptNo() {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `KWT-${ymd}-${rnd}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatMoney(currency: string, amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  if (currency === "IDR") {
    return `Rp ${Math.round(safe).toLocaleString("id-ID")}`;
  }
  return `${currency} ${safe.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function normalizeWaPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  return digits;
}

export default function AdminReceiptsPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [receipts, setReceipts] = useState<SavedReceipt[]>([]);
  const [business, setBusiness] = useState<BusinessProfile>(DEFAULT_BUSINESS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [receiptNumber, setReceiptNumber] = useState<string>("KWT-BARU");
  const [issueDate, setIssueDate] = useState<string>("");
  const [bookingCode, setBookingCode] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("Tuan / Puan Tamu");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [guestOrigin, setGuestOrigin] = useState<string>("Malaysia / Indonesia");
  const [packageName, setPackageName] = useState<string>("Paket Private Tour Danau Toba 3D2N");
  const [tripDate, setTripDate] = useState<string>("");
  const [paxSummary, setPaxSummary] = useState<string>("4 Dewasa, 0 Anak");
  const [vehicleType, setVehicleType] = useState<string>("Innova Reborn / SUV");
  const [currency, setCurrency] = useState<string>("MYR");
  const [items, setItems] = useState<ReceiptLineItem[]>([
    { label: "Paket Private Tour Danau Toba (Sesuai Kesepakatan)", qty: 1, unitPrice: 1900 },
  ]);
  const [autoTotal, setAutoTotal] = useState<boolean>(true);
  const [manualTotal, setManualTotal] = useState<number>(1900);
  const [dpAmount, setDpAmount] = useState<number>(570);
  const [paymentStatus, setPaymentStatus] = useState<string>("DP Lunas");
  const [paymentMethod, setPaymentMethod] = useState<string>("Transfer Bank / QRIS");
  const [notes, setNotes] = useState<string>(
    "Sisa pelunasan dibayarkan saat trip selesai sebelum berpisah di Bandara Kualanamu (KNO). Sudah termasuk supir Muslim, BBM, tol & parkir.",
  );
  const [issuerName, setIssuerName] = useState<string>("Sumatera Explore (Admin Berastagi)");

  const itemsTotal = items.reduce(
    (sum, item) => sum + Math.max(0, Number(item.qty) || 0) * Math.max(0, Number(item.unitPrice) || 0),
    0,
  );
  const totalAmount = autoTotal ? itemsTotal : Math.max(0, manualTotal);
  const remainingAmount = Math.max(0, totalAmount - dpAmount);

  const applyOrderToForm = useCallback((order: OrderRow) => {
    setSelectedOrderId(String(order.id));
    setBookingCode(order.booking_code || "");
    setGuestName(order.guest_name || "");
    setGuestPhone(order.guest_phone || "");
    setGuestOrigin(order.guest_origin || "");
    setPackageName(order.package_name || "");
    setTripDate(order.trip_date || "");
    setPaxSummary(`${order.adults_count || 0} Dewasa, ${order.children_count || 0} Anak`);
    setVehicleType(order.vehicle_type || "SUV / MPV Privat");
    setCurrency(order.currency || "MYR");

    const estTotal = Number(order.estimated_total) || 0;
    const estDp = Number(order.dp_amount) || 0;
    setItems([
      {
        label: `${order.package_name || "Paket Wisata"} (${order.adults_count || 1} Dewasa${
          order.children_count ? `, ${order.children_count} Anak` : ""
        })`,
        qty: 1,
        unitPrice: estTotal,
      },
    ]);
    setAutoTotal(true);
    setManualTotal(estTotal);
    setDpAmount(estDp);

    if (order.dp_status === "lunas" || (estTotal > 0 && estDp >= estTotal)) {
      setPaymentStatus("Lunas Penuh");
    } else if (order.dp_status === "dp_lunas" || estDp > 0) {
      setPaymentStatus("DP Lunas");
    } else {
      setPaymentStatus("Menunggu Pembayaran");
    }

    if (order.notes) {
      setNotes(order.notes);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      adminFetch<ListResult<OrderRow>>("/api/admin/orders?pageSize=80"),
      adminFetch<ListResult<SavedReceipt>>("/api/admin/receipts?pageSize=40"),
      adminFetch<Record<string, unknown>>("/api/admin/settings"),
    ])
      .then(([orderRes, receiptRes, settingsRes]) => {
        if (!active) return;
        setOrders(orderRes.items);
        setReceipts(receiptRes.items);
        setReceiptNumber((cur) => (cur === "KWT-BARU" ? makeReceiptNo() : cur));
        setIssueDate((cur) => cur || todayIso());
        setTripDate((cur) => cur || todayIso());

        if (settingsRes.business) {
          const b = settingsRes.business as Partial<BusinessProfile>;
          setBusiness((prev) => ({ ...prev, ...b }));
          if (b.ownerName) {
            setIssuerName(`${b.ownerName} (${b.brandName || "Sumatera Explore"})`);
          }
        }

        if (typeof window !== "undefined") {
          const qs = new URLSearchParams(window.location.search);
          const orderIdParam = qs.get("orderId");
          if (orderIdParam) {
            const found = orderRes.items.find((o) => String(o.id) === orderIdParam);
            if (found) {
              applyOrderToForm(found);
            }
          }
        }
      })
      .catch((err) => {
        if (active) {
          setToast({
            type: "error",
            message: err instanceof Error ? err.message : "Gagal memuat data kwitansi.",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [applyOrderToForm]);

  function loadSavedReceiptIntoEditor(r: SavedReceipt) {
    setEditingId(r.id);
    setReceiptNumber(r.receipt_number);
    setIssueDate(r.issue_date || todayIso());
    setSelectedOrderId(r.booking_id ? String(r.booking_id) : "");
    setBookingCode(r.booking_code || "");
    setGuestName(r.guest_name);
    setGuestPhone(r.guest_phone || "");
    setGuestOrigin(r.guest_origin || "");
    setPackageName(r.package_name);
    setTripDate(r.trip_date || "");
    setPaxSummary(r.pax_summary || "");
    setVehicleType(r.vehicle_type || "");
    setCurrency(r.currency || "MYR");
    setItems(
      Array.isArray(r.items) && r.items.length
        ? r.items
        : [{ label: r.package_name, qty: 1, unitPrice: r.total_amount }],
    );
    const itemsSum = (r.items || []).reduce(
      (s, x) => s + (Number(x.qty) || 0) * (Number(x.unitPrice) || 0),
      0,
    );
    setAutoTotal(Math.abs(itemsSum - r.total_amount) < 0.01);
    setManualTotal(r.total_amount);
    setDpAmount(r.dp_amount);
    setPaymentStatus(r.payment_status);
    setPaymentMethod(r.payment_method || "Transfer Bank / QRIS");
    setNotes(r.notes || "");
    setIssuerName(r.issuer_name || "");
    setToast({
      type: "success",
      message: `Kwitansi ${r.receipt_number} dibuka ke editor. Silakan ubah bagian mana saja.`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetNewReceipt() {
    setEditingId(null);
    setSelectedOrderId("");
    setBookingCode("");
    setReceiptNumber(makeReceiptNo());
    setIssueDate(todayIso());
    setGuestName("Tuan / Puan Tamu");
    setGuestPhone("");
    setGuestOrigin("Malaysia / Indonesia");
    setPackageName("Paket Private Tour Danau Toba 3D2N");
    setTripDate(todayIso());
    setPaxSummary("4 Dewasa, 0 Anak");
    setVehicleType("Innova Reborn / SUV");
    setCurrency("MYR");
    setItems([
      { label: "Paket Private Tour Danau Toba (Sesuai Kesepakatan)", qty: 1, unitPrice: 1900 },
    ]);
    setAutoTotal(true);
    setManualTotal(1900);
    setDpAmount(570);
    setPaymentStatus("DP Lunas");
    setToast({ type: "success", message: "Form dibersihkan untuk kwitansi baru." });
  }

  async function handleSaveReceipt() {
    if (!guestName.trim() || !packageName.trim()) {
      setToast({ type: "error", message: "Nama tamu dan nama paket wajib diisi." });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        receipt_number: receiptNumber.trim() || makeReceiptNo(),
        booking_id: selectedOrderId ? Number(selectedOrderId) : null,
        booking_code: bookingCode.trim(),
        issue_date: issueDate,
        guest_name: guestName.trim(),
        guest_phone: guestPhone.trim(),
        guest_origin: guestOrigin.trim(),
        package_name: packageName.trim(),
        trip_date: tripDate.trim(),
        pax_summary: paxSummary.trim(),
        vehicle_type: vehicleType.trim(),
        currency,
        items,
        total_amount: totalAmount,
        dp_amount: dpAmount,
        remaining_amount: remainingAmount,
        payment_status: paymentStatus,
        payment_method: paymentMethod.trim(),
        notes: notes.trim(),
        issuer_name: issuerName.trim(),
      };

      if (editingId) {
        await adminFetch(`/api/admin/receipts/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setToast({ type: "success", message: `Kwitansi ${payload.receipt_number} diperbarui.` });
      } else {
        const res = await adminFetch<{ item: SavedReceipt }>("/api/admin/receipts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res?.item?.id) {
          setEditingId(res.item.id);
        }
        setToast({
          type: "success",
          message: `Kwitansi ${payload.receipt_number} berhasil disimpan ke riwayat.`,
        });
      }

      const listRes = await adminFetch<ListResult<SavedReceipt>>("/api/admin/receipts?pageSize=40");
      setReceipts(listRes.items);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan kwitansi.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSaved(item: SavedReceipt) {
    if (!window.confirm(`Hapus riwayat kwitansi "${item.receipt_number}"?`)) return;
    try {
      await adminFetch(`/api/admin/receipts/${item.id}`, { method: "DELETE" });
      if (editingId === item.id) setEditingId(null);
      setReceipts((prev) => prev.filter((r) => r.id !== item.id));
      setToast({ type: "success", message: `Kwitansi ${item.receipt_number} dihapus.` });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menghapus kwitansi.",
      });
    }
  }

  function buildReceiptText() {
    const lines = [
      `*KWITANSI RESMI - ${business.brandName.toUpperCase()}*`,
      `${business.legalForm} ${business.legalName} (${business.decreeNumber})`,
      `No. Kwitansi: *${receiptNumber}*`,
      `Tanggal Terbit: ${issueDate}`,
      `Status Pembayaran: *${paymentStatus}*`,
      ``,
      `*Diterima Dari:*`,
      `Nama: ${guestName}`,
      guestPhone ? `WhatsApp: ${guestPhone}` : "",
      guestOrigin ? `Asal: ${guestOrigin}` : "",
      ``,
      `*Detail Perjalanan:*`,
      `Paket: ${packageName}`,
      tripDate ? `Tanggal Trip: ${tripDate}` : "",
      paxSummary ? `Peserta: ${paxSummary}` : "",
      vehicleType ? `Armada: ${vehicleType}` : "",
      bookingCode ? `Kode Order: ${bookingCode}` : "",
      ``,
      `*Rincian Biaya:*`,
      ...items.map(
        (it, i) =>
          `${i + 1}. ${it.label} (${it.qty}x ${formatMoney(currency, it.unitPrice)}) = ${formatMoney(
            currency,
            it.qty * it.unitPrice,
          )}`,
      ),
      `Total Harga: *${formatMoney(currency, totalAmount)}*`,
      `Telah Dibayar (${paymentMethod}): *${formatMoney(currency, dpAmount)}*`,
      `Sisa Pelunasan: *${formatMoney(currency, remainingAmount)}*`,
      notes ? `\nCatatan: ${notes}` : "",
      ``,
      `Hormat kami,\n${issuerName}\n${business.shortAddress}`,
    ].filter(Boolean);

    return lines.join("\n");
  }

  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(buildReceiptText());
      setToast({
        type: "success",
        message: "Teks kwitansi disalin! Tinggal tempel (Paste) di WhatsApp tamu.",
      });
    } catch {
      setToast({ type: "error", message: "Browser memblokir salin otomatis." });
    }
  }

  function handleSendWhatsapp() {
    const digits = normalizeWaPhone(guestPhone);
    const text = encodeURIComponent(buildReceiptText());
    const url = digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleDownloadPng() {
    try {
      const styles = getComputedStyle(document.documentElement);
      const paperColor = styles.getPropertyValue("--color-receipt-paper").trim() || "white";
      const softColor = styles.getPropertyValue("--color-receipt-soft").trim() || "whitesmoke";
      const inkColor = styles.getPropertyValue("--color-receipt-ink").trim() || "black";
      const mutedColor = styles.getPropertyValue("--color-receipt-muted").trim() || "dimgray";
      const ruleColor = styles.getPropertyValue("--color-receipt-rule").trim() || "lightgray";
      const accentColor = styles.getPropertyValue("--color-toba-green").trim() || "seagreen";

      const width = 1080;
      const rowHeight = 44;
      const dynamicRowsHeight = Math.max(1, items.length) * rowHeight;
      const height = 1080 + dynamicRowsHeight;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas tidak didukung di browser ini.");

      ctx.fillStyle = paperColor;
      ctx.fillRect(0, 0, width, height);

      // Top accent bar
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, width, 16);

      // Header brand
      ctx.fillStyle = inkColor;
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(business.brandName, 64, 90);

      ctx.fillStyle = mutedColor;
      ctx.font = "22px sans-serif";
      ctx.fillText(`${business.legalForm} ${business.legalName} (${business.decreeNumber})`, 64, 126);
      ctx.fillText(`${business.shortAddress} | WA: ${business.whatsappDisplay}`, 64, 158);

      // Receipt badge on top right
      ctx.fillStyle = inkColor;
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("KWITANSI RESMI", width - 64, 88);
      ctx.font = "22px monospace";
      ctx.fillText(receiptNumber, width - 64, 124);
      ctx.fillStyle = accentColor;
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(paymentStatus.toUpperCase(), width - 64, 158);
      ctx.textAlign = "left";

      // Divider
      ctx.strokeStyle = ruleColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(64, 188);
      ctx.lineTo(width - 64, 188);
      ctx.stroke();

      // Guest & Trip box
      ctx.fillStyle = softColor;
      ctx.fillRect(64, 212, width - 128, 220);
      ctx.strokeRect(64, 212, width - 128, 220);

      ctx.fillStyle = mutedColor;
      ctx.font = "20px sans-serif";
      ctx.fillText("Diterima Dari Tamu", 92, 252);
      ctx.fillText("Detail Paket & Perjalanan", 560, 252);

      ctx.fillStyle = inkColor;
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(guestName, 92, 290);
      ctx.fillText(packageName.slice(0, 34), 560, 290);

      ctx.fillStyle = mutedColor;
      ctx.font = "21px sans-serif";
      ctx.fillText(`WA: ${guestPhone || "-"}`, 92, 330);
      ctx.fillText(`Asal: ${guestOrigin || "-"}`, 92, 362);
      ctx.fillText(`Tanggal Terbit: ${issueDate}`, 92, 394);

      ctx.fillText(`Tanggal Trip: ${tripDate || "-"}`, 560, 330);
      ctx.fillText(`Peserta: ${paxSummary || "-"}`, 560, 362);
      ctx.fillText(`Armada: ${vehicleType || "-"}`, 560, 394);

      // Items header
      let y = 478;
      ctx.fillStyle = inkColor;
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("Rincian Layanan", 64, y);
      ctx.textAlign = "right";
      ctx.fillText("Subtotal", width - 64, y);
      ctx.textAlign = "left";

      y += 18;
      ctx.beginPath();
      ctx.moveTo(64, y);
      ctx.lineTo(width - 64, y);
      ctx.stroke();

      for (const item of items) {
        y += 38;
        ctx.fillStyle = inkColor;
        ctx.font = "22px sans-serif";
        ctx.fillText(`${item.label.slice(0, 52)} (${item.qty}x)`, 64, y);
        ctx.textAlign = "right";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(formatMoney(currency, item.qty * item.unitPrice), width - 64, y);
        ctx.textAlign = "left";
      }

      // Totals summary box
      y += 36;
      ctx.fillStyle = softColor;
      ctx.fillRect(64, y, width - 128, 176);
      ctx.strokeRect(64, y, width - 128, 176);

      ctx.fillStyle = inkColor;
      ctx.font = "24px sans-serif";
      ctx.fillText("Total Biaya Paket", 92, y + 48);
      ctx.textAlign = "right";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(formatMoney(currency, totalAmount), width - 92, y + 48);

      ctx.textAlign = "left";
      ctx.fillStyle = accentColor;
      ctx.font = "24px sans-serif";
      ctx.fillText(`Sudah Dibayar (${paymentMethod})`, 92, y + 96);
      ctx.textAlign = "right";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(formatMoney(currency, dpAmount), width - 92, y + 96);

      ctx.textAlign = "left";
      ctx.fillStyle = inkColor;
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("Sisa Pelunasan (Saat Trip / KNO)", 92, y + 146);
      ctx.textAlign = "right";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(formatMoney(currency, remainingAmount), width - 92, y + 146);
      ctx.textAlign = "left";

      // Notes & Signatory
      y += 220;
      ctx.fillStyle = mutedColor;
      ctx.font = "20px sans-serif";
      ctx.fillText("Catatan Pembayaran:", 64, y);
      ctx.fillStyle = inkColor;
      ctx.fillText(notes.slice(0, 78), 64, y + 34);
      if (notes.length > 78) {
        ctx.fillText(notes.slice(78, 156), 64, y + 66);
      }

      y += 126;
      ctx.textAlign = "right";
      ctx.fillStyle = mutedColor;
      ctx.font = "20px sans-serif";
      ctx.fillText(`Diterbitkan resmi pada ${issueDate}`, width - 64, y);
      ctx.fillStyle = inkColor;
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(issuerName, width - 64, y + 42);
      ctx.textAlign = "left";

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${receiptNumber || "kwitansi"}-${guestName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.png`;
      a.click();

      setToast({
        type: "success",
        message: "Gambar kwitansi PNG berhasil didownload! Siap dikirim ke WhatsApp tamu.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal membuat gambar kwitansi.",
      });
    }
  }

  function applyDpPreset(pct: number) {
    const val = Math.round((totalAmount * pct) / 100);
    setDpAmount(val);
    if (pct === 0) setPaymentStatus("Menunggu Pembayaran");
    else if (pct >= 100) setPaymentStatus("Lunas Penuh");
    else setPaymentStatus("DP Lunas");
  }

  return (
    <div>
      <AdminPageHeader
        title="Buat & Edit Kwitansi Resmi"
        subtitle="Isi langsung dari daftar order atau ketik manual. Admin bebas mengubah harga, nama tamu, dan rincian lalu kirim sebagai gambar PNG, PDF, atau teks WhatsApp."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={resetNewReceipt}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-rule bg-paper-2 text-sm font-semibold text-ink hover:border-accent"
            >
              <AdminIcon name="receipt_add" className="w-4 h-4" />
              Kwitansi Kosong Baru
            </button>
            <button
              type="button"
              onClick={handleSaveReceipt}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              <AdminIcon name="check_circle" className="w-4 h-4" />
              {saving ? "Menyimpan…" : editingId ? "Simpan Perubahan" : "Simpan ke Riwayat"}
            </button>
          </div>
        }
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      {/* Quick Action Bar for Export */}
      <div className="mb-6 bg-paper-2 border border-rule rounded-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">
            Langkah Cepat Kirim ke Tamu
          </p>
          <p className="text-xs text-muted">
            Setelah data di bawah sesuai, langsung pilih salah satu tombol kirim ini:
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-ink text-xs font-bold whitespace-nowrap hover:bg-accent-hover"
          >
            <AdminIcon name="download" className="w-4 h-4" />
            Download Gambar (WA)
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-md border border-rule bg-paper text-xs font-bold text-ink whitespace-nowrap hover:border-accent"
          >
            <AdminIcon name="printer" className="w-4 h-4" />
            Cetak / PDF
          </button>
          <button
            type="button"
            onClick={handleCopyText}
            className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-rule bg-paper text-xs font-semibold text-ink-2 whitespace-nowrap hover:text-ink"
          >
            <AdminIcon name="content_copy" className="w-4 h-4" />
            Salin Teks
          </button>
          <button
            type="button"
            onClick={handleSendWhatsapp}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-md bg-wa text-wa-ink text-xs font-bold whitespace-nowrap hover:bg-wa-hover"
          >
            <AdminIcon name="whatsapp" className="w-4 h-4" />
            Kirim via WA Tamu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Editable Form */}
        <section className="xl:col-span-7 bg-paper-2 border border-rule rounded-card p-5 space-y-5">
          {/* 1. Ambil dari order */}
          <div className="p-4 rounded-md bg-paper border border-rule space-y-2">
            <label htmlFor="pick-order" className="block text-xs font-bold text-ink">
              1. Ambil Data Otomatis dari Order Masuk (Opsional)
            </label>
            <select
              id="pick-order"
              value={selectedOrderId}
              onChange={(e) => {
                const found = orders.find((o) => String(o.id) === e.target.value);
                if (found) applyOrderToForm(found);
                else setSelectedOrderId("");
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink"
            >
              <option value="">-- Pilih Order Tamu Untuk Isi Otomatis (atau isi manual di bawah) --</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.booking_code}: {o.guest_name} ({o.package_name}, {o.currency}{" "}
                  {o.estimated_total.toLocaleString("en-US")})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted">
              Setelah memilih order, seluruh nama, paket, DP, dan nominal masih bisa Anda ubah bebas di bawah ini.
            </p>
          </div>

          {/* 2. Nomor & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Nomor Kwitansi
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-xs font-mono text-ink"
                />
                <button
                  type="button"
                  onClick={() => setReceiptNumber(makeReceiptNo())}
                  title="Buat nomor baru otomatis"
                  className="px-2.5 py-2 rounded-md border border-rule bg-paper text-xs font-semibold text-ink-2 hover:text-ink shrink-0"
                >
                  Baru
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Tanggal Terbit
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Status Pembayaran
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              >
                <option value="DP Lunas">DP Lunas</option>
                <option value="Lunas Penuh">Lunas Penuh</option>
                <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                <option value="Tagihan Resmi">Tagihan Resmi</option>
              </select>
            </div>
          </div>

          {/* 3. Data Tamu & Perjalanan */}
          <div className="border-t border-rule pt-4 space-y-3">
            <h2 className="font-display text-base text-ink">2. Data Tamu &amp; Perjalanan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Nama Lengkap Tamu / Ketua Rombongan
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Nomor WhatsApp Tamu
                </label>
                <input
                  type="text"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+60123456789 atau 0812..."
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Nama Paket Wisata / Layanan
                </label>
                <input
                  type="text"
                  required
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Tanggal Trip / Kedatangan KNO
                </label>
                <input
                  type="text"
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  placeholder="Contoh: 20 - 23 Des 2026"
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Jumlah Peserta (Dewasa &amp; Anak)
                </label>
                <input
                  type="text"
                  value={paxSummary}
                  onChange={(e) => setPaxSummary(e.target.value)}
                  placeholder="4 Dewasa, 1 Anak"
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Armada / Mobil Yang Dipakai
                </label>
                <input
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Asal Tamu (Kota / Negara)
                </label>
                <input
                  type="text"
                  value={guestOrigin}
                  onChange={(e) => setGuestOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
            </div>
          </div>

          {/* 4. Itemized Rincian */}
          <div className="border-t border-rule pt-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-base text-ink">3. Rincian Item &amp; Harga</h2>
                <p className="text-xs text-muted">
                  Bisa tambah baris untuk hotel tambahan, drone, makan, atau diskon khusus.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setItems((prev) => [
                    ...prev,
                    { label: "Layanan Tambahan", qty: 1, unitPrice: 0 },
                  ])
                }
                className="px-3 py-1.5 rounded-md bg-paper border border-rule text-xs font-bold text-ink hover:border-accent"
              >
                + Tambah Baris Harga
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-paper p-2.5 rounded-md border border-rule"
                >
                  <div className="col-span-12 sm:col-span-6">
                    <input
                      type="text"
                      aria-label={`Keterangan item ${idx + 1}`}
                      value={item.label}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx] = { ...copy[idx], label: e.target.value };
                        setItems(copy);
                      }}
                      placeholder="Contoh: Paket Tour 3D2N"
                      className="w-full px-2.5 py-1.5 rounded-md bg-paper-2 border border-rule text-xs text-ink"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min={1}
                      aria-label={`Jumlah item ${idx + 1}`}
                      value={item.qty}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx] = { ...copy[idx], qty: Math.max(1, Number(e.target.value) || 1) };
                        setItems(copy);
                      }}
                      className="w-full px-2 py-1.5 rounded-md bg-paper-2 border border-rule text-xs text-ink num"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <input
                      type="number"
                      min={0}
                      aria-label={`Harga satuan item ${idx + 1}`}
                      value={item.unitPrice}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx] = { ...copy[idx], unitPrice: Number(e.target.value) || 0 };
                        setItems(copy);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-md bg-paper-2 border border-rule text-xs text-ink num"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label={`Hapus baris ${idx + 1}`}
                      className="p-1.5 rounded-md text-muted hover:text-error disabled:opacity-30"
                    >
                      <AdminIcon name="delete" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Mata Uang, Total & DP */}
          <div className="border-t border-rule pt-4 space-y-3">
            <h2 className="font-display text-base text-ink">4. Total Tagihan &amp; Pembayaran DP</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Mata Uang
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink font-semibold"
                >
                  <option value="MYR">MYR (Ringgit Malaysia)</option>
                  <option value="IDR">IDR (Rupiah Indonesia)</option>
                  <option value="SGD">SGD (Dollar Singapura)</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-ink-2">Total Harga</label>
                  <label className="inline-flex items-center gap-1 text-[11px] text-accent cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTotal}
                      onChange={(e) => {
                        setAutoTotal(e.target.checked);
                        if (!e.target.checked) setManualTotal(itemsTotal);
                      }}
                    />
                    Otomatis
                  </label>
                </div>
                <input
                  type="number"
                  min={0}
                  disabled={autoTotal}
                  value={totalAmount}
                  onChange={(e) => setManualTotal(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm font-bold text-ink num disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Jumlah Yang Sudah Dibayar (DP)
                </label>
                <input
                  type="number"
                  min={0}
                  value={dpAmount}
                  onChange={(e) => setDpAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm font-bold text-accent num"
                />
              </div>
            </div>

            {/* 1-Click DP Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">Pilih cepat DP:</span>
              <button
                type="button"
                onClick={() => applyDpPreset(0)}
                className="px-2.5 py-1 rounded-md border border-rule bg-paper text-xs font-semibold text-ink-2 hover:text-ink"
              >
                Belum Bayar (0)
              </button>
              <button
                type="button"
                onClick={() => applyDpPreset(30)}
                className="px-2.5 py-1 rounded-md border border-rule bg-paper text-xs font-semibold text-ink hover:border-accent"
              >
                DP 30%
              </button>
              <button
                type="button"
                onClick={() => applyDpPreset(50)}
                className="px-2.5 py-1 rounded-md border border-rule bg-paper text-xs font-semibold text-ink hover:border-accent"
              >
                DP 50%
              </button>
              <button
                type="button"
                onClick={() => applyDpPreset(100)}
                className="px-2.5 py-1 rounded-md border border-wa/40 bg-wa/15 text-xs font-bold text-ink hover:border-wa"
              >
                Lunas 100%
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Metode Pembayaran
                </label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="Transfer BCA / Mandiri / DuitNow / Tunai"
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Nama Admin / Penandatangan
                </label>
                <input
                  type="text"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Catatan Pada Kwitansi
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Live Official Receipt Preview */}
        <section className="xl:col-span-5 xl:sticky xl:top-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-ink">
              Pratinjau Kertas Kwitansi (Siap Cetak / Kirim WA)
            </h2>
            <span className="text-xs text-muted">Otomatis berubah saat diketik</span>
          </div>

          <div
            id="receipt-print-sheet"
            className="bg-receipt-paper text-receipt-ink border border-receipt-rule rounded-card p-6 sm:p-7 shadow-card space-y-5"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-receipt-rule pb-4">
              <div>
                <p className="font-display text-xl font-bold text-receipt-ink">
                  {business.brandName}
                </p>
                <p className="text-xs text-receipt-muted mt-0.5">
                  {business.legalForm} {business.legalName}
                </p>
                <p className="text-[11px] text-receipt-muted">
                  SK Kemenkumham: {business.decreeNumber}
                </p>
                <p className="text-[11px] text-receipt-muted mt-1">
                  {business.shortAddress} | WA: {business.whatsappDisplay}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tracking-tight text-receipt-muted">
                  KWITANSI RESMI
                </p>
                <p className="font-mono text-sm font-bold text-receipt-ink mt-0.5">
                  {receiptNumber}
                </p>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-toba-green text-wa-ink">
                  {paymentStatus}
                </span>
              </div>
            </div>

            {/* Guest + Trip Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-receipt-soft border border-receipt-rule rounded-md p-3.5 text-xs">
              <div className="space-y-1">
                <p className="text-receipt-muted font-semibold">Diterima Dari Tamu</p>
                <p className="text-sm font-bold text-receipt-ink">{guestName || "-"}</p>
                {guestPhone ? <p className="text-receipt-muted">WA: {guestPhone}</p> : null}
                {guestOrigin ? <p className="text-receipt-muted">Asal: {guestOrigin}</p> : null}
                <p className="text-receipt-muted">Tanggal Kwitansi: {issueDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-receipt-muted font-semibold">Detail Perjalanan</p>
                <p className="text-sm font-bold text-receipt-ink">{packageName || "-"}</p>
                <p className="text-receipt-muted">Tanggal Trip: {tripDate || "-"}</p>
                <p className="text-receipt-muted">Peserta: {paxSummary || "-"}</p>
                <p className="text-receipt-muted">Armada: {vehicleType || "-"}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-receipt-rule text-receipt-muted text-left">
                    <th className="py-2 font-semibold">Rincian Layanan</th>
                    <th className="py-2 font-semibold text-center">Qty</th>
                    <th className="py-2 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-receipt-rule">
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 pr-2 font-medium text-receipt-ink">
                        {item.label || "Layanan"}
                      </td>
                      <td className="py-2.5 text-center num text-receipt-muted">{item.qty}</td>
                      <td className="py-2.5 text-right font-bold num text-receipt-ink">
                        {formatMoney(currency, item.qty * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="bg-receipt-soft border border-receipt-rule rounded-md p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-receipt-muted">Total Harga Paket</span>
                <span className="font-bold text-sm text-receipt-ink num">
                  {formatMoney(currency, totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-receipt-muted">
                  Telah Dibayar ({paymentMethod || "Transfer"})
                </span>
                <span className="font-bold text-sm text-toba-green num">
                  {formatMoney(currency, dpAmount)}
                </span>
              </div>
              <div className="pt-2 border-t border-receipt-rule flex items-center justify-between">
                <span className="font-bold text-receipt-ink">
                  Sisa Pelunasan (Saat Trip / KNO)
                </span>
                <span className="font-display text-lg font-bold text-receipt-ink num">
                  {formatMoney(currency, remainingAmount)}
                </span>
              </div>
            </div>

            {/* Notes & Signatory */}
            <div className="flex flex-wrap items-end justify-between gap-4 pt-2 border-t border-receipt-rule text-xs">
              <div className="max-w-xs space-y-1">
                <p className="font-semibold text-receipt-muted">Catatan:</p>
                <p className="text-receipt-muted leading-relaxed">{notes || "-"}</p>
              </div>
              <div className="text-right ml-auto">
                <p className="text-[11px] text-receipt-muted">Berastagi, {issueDate}</p>
                <p className="font-bold text-receipt-ink mt-4">{issuerName}</p>
                <p className="text-[11px] text-receipt-muted">{business.email}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Saved History List */}
      <section className="mt-8 bg-paper-2 border border-rule rounded-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg text-ink">Riwayat Kwitansi Tersimpan</h2>
            <p className="text-xs text-muted">
              Klik Buka &amp; Edit jika ingin memperbaiki harga atau nama pada kwitansi lama.
            </p>
          </div>
          <span className="text-xs text-muted num">{receipts.length} kwitansi tersimpan</span>
        </div>

        {loading ? (
          <p className="text-sm text-muted py-4">Memuat riwayat kwitansi…</p>
        ) : receipts.length === 0 ? (
          <div className="p-6 rounded-md bg-paper border border-rule text-center text-sm text-muted">
            Belum ada kwitansi yang disimpan ke riwayat. Klik tombol &ldquo;Simpan ke Riwayat&rdquo; di atas setelah selesai membuat kwitansi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-rule text-xs text-muted">
                  <th className="py-2.5 pr-3 font-medium">No. Kwitansi</th>
                  <th className="py-2.5 px-3 font-medium">Tamu &amp; Paket</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 px-3 font-medium text-right">Total / DP</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {receipts.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-3">
                      <p className="font-mono text-xs font-bold text-accent">
                        {item.receipt_number}
                      </p>
                      <p className="text-[11px] text-muted">{item.issue_date}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-ink">{item.guest_name}</p>
                      <p className="text-xs text-ink-2">{item.package_name}</p>
                    </td>
                    <td className="py-3 px-3">
                      <StatusPill
                        status={
                          item.payment_status.toLowerCase().includes("lunas penuh")
                            ? "lunas"
                            : item.payment_status.toLowerCase().includes("dp")
                              ? "dp_lunas"
                              : "lead"
                        }
                      />
                    </td>
                    <td className="py-3 px-3 text-right num">
                      <p className="font-semibold text-ink">
                        {formatMoney(item.currency, item.total_amount)}
                      </p>
                      <p className="text-xs text-muted">
                        DP: {formatMoney(item.currency, item.dp_amount)}
                      </p>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => loadSavedReceiptIntoEditor(item)}
                          className="px-3 py-1.5 rounded-md bg-accent text-accent-ink text-xs font-bold hover:bg-accent-hover"
                        >
                          Buka &amp; Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSaved(item)}
                          aria-label={`Hapus kwitansi ${item.receipt_number}`}
                          className="p-1.5 rounded-md border border-rule text-muted hover:text-error hover:border-error"
                        >
                          <AdminIcon name="delete" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
