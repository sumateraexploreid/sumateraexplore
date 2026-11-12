"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { TourPackage } from "@/data/packages";
import { DOCUMENTATION_GEAR, OPERATOR_NOTES } from "@/data/packages";
import { BUSINESS_IDENTITY } from "@/data/business";

const subscribeLocation = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};

function formatDetailPrice(
  idrAmount: number,
  currency: "MYR" | "IDR" | "SGD",
  idrPerUnit: number
) {
  const safeRate = idrPerUnit > 0 ? idrPerUnit : 1;
  const converted = Math.round(idrAmount / safeRate);
  if (currency === "MYR") {
    return `RM ${converted.toLocaleString("en-US")}`;
  }
  if (currency === "SGD") {
    return `S$ ${converted.toLocaleString("en-US")}`;
  }
  return `Rp ${converted.toLocaleString("id-ID")}`;
}

export default function PackageDetailClient({
  pkg,
  currency = "MYR",
  idrPerUnit = 4400,
  myrToIdr = 4400,
  whatsappNumber = BUSINESS_IDENTITY.whatsappNumber,
  whatsappDisplay = BUSINESS_IDENTITY.whatsappDisplay,
}: {
  pkg: TourPackage;
  currency?: "MYR" | "IDR" | "SGD";
  idrPerUnit?: number;
  myrToIdr?: number;
  whatsappNumber?: string;
  whatsappDisplay?: string;
}) {
  const [activeTab, setActiveTab] = useState<"itinerary" | "pricelist" | "includes" | "excludes">("itinerary");
  const searchStr = useSyncExternalStore(
    subscribeLocation,
    () => window.location.search,
    () => ""
  );
  const [adultsOverride, setAdultsOverride] = useState<number | null>(null);
  const [childrenOverride, setChildrenOverride] = useState<number | null>(null);
  const [variantChoiceIdx, setVariantChoiceIdx] = useState<number>(0);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const params = new URLSearchParams(searchStr);
  const parsedAdults = Number(params.get("adults"));
  const parsedChildren = Number(params.get("children"));
  const maxTierPax = Math.max(...pkg.tiers.map((t) => t.pax), 10);
  const paxAdults =
    adultsOverride ?? (Number.isInteger(parsedAdults) && parsedAdults >= 1 ? parsedAdults : 4);
  const paxChildren =
    childrenOverride ??
    (Number.isInteger(parsedChildren) && parsedChildren >= 0 ? parsedChildren : 0);

  const clampedPax = Math.min(maxTierPax, Math.max(1, paxAdults));
  const exactMatches = pkg.tiers.filter((t) => t.pax === clampedPax);
  const fallbackTier =
    exactMatches.length > 0
      ? exactMatches[Math.min(variantChoiceIdx, exactMatches.length - 1)]
      : [...pkg.tiers].reverse().find((t) => t.pax <= clampedPax) ?? pkg.tiers[0];
  const tierLookup = fallbackTier;

  const unitMyr = tierLookup?.priceMyr ?? pkg.priceMyr;
  const unitIdr = unitMyr * myrToIdr;
  const totalPriceIdr = paxAdults * unitIdr + paxChildren * (unitIdr * 0.75);

  const formatCurrency = (valIdr: number) =>
    formatDetailPrice(valIdr, currency, idrPerUnit);

  const handleCopySummary = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `${BUSINESS_IDENTITY.siteUrl}/tour/${pkg.slug}`;
    const summaryLines = [
      `*${pkg.name}* (${pkg.duration} · Harga Weekday)`,
      `Rute: ${pkg.locationTag}`,
      `Peserta: ${paxAdults} Dewasa${paxChildren > 0 ? `, ${paxChildren} Anak` : ""}`,
      `Armada: ${tierLookup?.vehicle || "Innova / SUV"} (supir Muslim, restoran dijamin halal)`,
      `Harga: ${formatCurrency(unitIdr)} /orang | Total estimasi: ${formatCurrency(totalPriceIdr)}`,
      `Pilihan hotel: ${pkg.hotels.join(" atau ")}`,
      `Sudah termasuk: ${pkg.includes.slice(0, 4).join("; ")}`,
      `Info & DP via WhatsApp (${whatsappDisplay}): ${shareUrl}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summaryLines);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
    } catch {
      setCopiedSummary(false);
    }
  };

  const trackWebLead = () => {
    try {
      const payload = JSON.stringify({
        package_slug: pkg.slug,
        package_name: pkg.name,
        guest_name: "Tamu Kalkulator Paket",
        guest_phone: "Klik WhatsApp Web",
        guest_origin: currency === "MYR" ? "Malaysia" : currency === "SGD" ? "Singapura" : "Indonesia",
        adults_count: paxAdults,
        children_count: paxChildren,
        vehicle_type: tierLookup?.vehicle || "Innova / SUV",
        currency,
        estimated_total: Math.round(totalPriceIdr / (idrPerUnit > 0 ? idrPerUnit : 1)),
        notes: `Klik CTA Pesan WA (${tierLookup?.label || tierLookup?.vehicle || "SUV"})`,
      });
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/bookings", new Blob([payload], { type: "application/json" }));
      } else {
        void fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {}
  };

  const bookingWaHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Sumatera Explore, saya ingin memesan paket ${pkg.name} (Harga Weekday) untuk ${paxAdults} Dewasa dan ${paxChildren} Anak (${tierLookup?.label ?? tierLookup?.vehicle ?? "SUV"}, estimasi ${formatCurrency(totalPriceIdr)}). Mohon info konfirmasi DP & jadwal.`
  )}`;

  return (
    <main className="se-page min-h-dvh pb-24 lg:pb-16">
      <section className="se-subhero" aria-labelledby="pkg-title">
        <div className="se-subhero-inner">
          <div>
            <nav className="se-breadcrumb" aria-label="Navigasi halaman">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <Link href="/tour/packages">Paket wisata</Link>
              <span aria-hidden="true">/</span>
              <span>{pkg.shortLabel}</span>
            </nav>
            <h1 id="pkg-title">{pkg.name}</h1>
            <p className="mt-3 sm:mt-4 text-sm text-muted">
              {pkg.duration} di {pkg.locationTag}
            </p>
          </div>
          <p>{pkg.description}</p>
        </div>
      </section>

      <div className="se-section">
        <div className="mb-6 sm:mb-10 rounded-card overflow-hidden border border-rule bg-paper-2 aspect-[16/10] sm:aspect-[16/7]">
          <img
            src={pkg.image_url}
            alt={pkg.name}
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="order-2 lg:order-1 lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="bg-paper-2 border border-rule rounded-card overflow-hidden">
              <div className="grid grid-cols-4 sm:flex border-b border-rule" role="tablist" aria-label="Rincian paket">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "itinerary"}
                  onClick={() => setActiveTab("itinerary")}
                  className={`min-w-0 sm:flex-1 min-h-12 px-1.5 sm:px-4 text-xs sm:text-sm font-semibold text-center leading-tight transition-colors duration-200 active:translate-y-px ${
                    activeTab === "itinerary"
                      ? "bg-paper-3 text-ink border-b-2 border-accent"
                      : "text-muted hover:text-ink hover:bg-paper-3"
                  }`}
                >
                  Itinerary
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "pricelist"}
                  onClick={() => setActiveTab("pricelist")}
                  className={`min-w-0 sm:flex-1 min-h-12 px-1.5 sm:px-4 text-xs sm:text-sm font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-200 active:translate-y-px ${
                    activeTab === "pricelist"
                      ? "bg-paper-3 text-ink border-b-2 border-accent"
                      : "text-muted hover:text-ink hover:bg-paper-3"
                  }`}
                >
                  Pricelist
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "includes"}
                  onClick={() => setActiveTab("includes")}
                  className={`min-w-0 sm:flex-1 min-h-12 px-1.5 sm:px-4 text-xs sm:text-sm font-semibold text-center leading-tight transition-colors duration-200 active:translate-y-px ${
                    activeTab === "includes"
                      ? "bg-paper-3 text-ink border-b-2 border-accent"
                      : "text-muted hover:text-ink hover:bg-paper-3"
                  }`}
                >
                  Termasuk
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "excludes"}
                  onClick={() => setActiveTab("excludes")}
                  className={`min-w-0 sm:flex-1 min-h-12 px-1.5 sm:px-4 text-xs sm:text-sm font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-200 active:translate-y-px ${
                    activeTab === "excludes"
                      ? "bg-paper-3 text-ink border-b-2 border-accent"
                      : "text-muted hover:text-ink hover:bg-paper-3"
                  }`}
                >
                  Non-paket
                </button>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
                {activeTab === "itinerary" && (
                  <ol className="divide-y divide-rule">
                    {pkg.itinerary.map((day) => (
                      <li key={day.day} className="py-5 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-3">
                          <span className="num text-sm font-bold text-accent block">
                            Hari {day.day}
                          </span>
                          {day.subtitle && (
                            <span className="text-xs text-muted block mt-1">
                              {day.subtitle}
                            </span>
                          )}
                        </div>
                        <div className="sm:col-span-9 space-y-2">
                          <h2 className="font-display font-bold text-xl text-ink">{day.title}</h2>
                          <p className="text-ink-2 text-sm leading-relaxed">{day.description}</p>
                          {day.stops && day.stops.length > 0 && (
                            <ul className="mt-3 space-y-1.5 border-l-2 border-rule pl-4">
                              {day.stops.map((stop, idx) => (
                                <li key={`${stop.time}-${idx}`} className="text-sm text-ink-2 flex gap-3">
                                  <span className="num text-xs font-semibold text-accent min-w-[52px] pt-0.5">
                                    {stop.time}
                                  </span>
                                  <span>{stop.place}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}

                {activeTab === "pricelist" && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted">
                      Harga Weekday per orang. Ketuk baris untuk menerapkan ke kalkulator:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="se-tier-table">
                        <thead>
                          <tr>
                            <th>Peserta</th>
                            <th>Armada</th>
                            <th>Harga / Org</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pkg.tiers.map((tier, idx) => {
                            const isSelected = tier === tierLookup;
                            const matchingIdx = exactMatches.indexOf(tier);
                            return (
                              <tr
                                key={`${tier.pax}-${tier.vehicle}-${idx}`}
                                className={
                                  isSelected
                                    ? "bg-paper-3 border-l-2 border-accent cursor-pointer"
                                    : "cursor-pointer hover:bg-paper-3/60"
                                }
                                onClick={() => {
                                  setAdultsOverride(tier.pax);
                                  if (matchingIdx >= 0) {
                                    setVariantChoiceIdx(matchingIdx);
                                  } else {
                                    const samePaxList = pkg.tiers.filter((x) => x.pax === tier.pax);
                                    setVariantChoiceIdx(Math.max(0, samePaxList.indexOf(tier)));
                                  }
                                }}
                              >
                                <td className="num font-semibold text-ink">{tier.label ?? `${tier.pax} Orang`}</td>
                                <td className="text-ink-2">{tier.vehicle}</td>
                                <td className="num font-bold text-accent">
                                  {formatCurrency(tier.priceMyr * myrToIdr)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "includes" && (
                  <ul className="divide-y divide-rule">
                    {pkg.includes.map((inc, i) => (
                      <li key={i} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 text-ink-2 text-sm">
                        <span className="text-success font-semibold shrink-0" aria-hidden="true">Ya</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "excludes" && (
                  <ul className="divide-y divide-rule">
                    {pkg.excludes.map((exc, i) => (
                      <li key={i} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 text-ink-2 text-sm">
                        <span className="text-muted font-semibold shrink-0" aria-hidden="true">Tidak</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-paper-2 border border-rule rounded-card p-6 space-y-3">
                <h2 className="font-display font-bold text-lg text-ink">Pilihan Hotel</h2>
                <ul className="space-y-2 text-sm text-ink-2">
                  {pkg.hotels.map((hotel) => (
                    <li key={hotel}>{hotel}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-paper-2 border border-rule rounded-card p-6 space-y-3">
                <h2 className="font-display font-bold text-lg text-ink">Perlengkapan Dokumentasi</h2>
                <ul className="space-y-1.5 text-sm text-ink-2">
                  {DOCUMENTATION_GEAR.map((gear) => (
                    <li key={gear}>{gear}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-paper-2 border border-rule rounded-card p-6 space-y-3">
              <h2 className="font-display font-bold text-lg text-ink">Catatan Lapangan &amp; Ketentuan</h2>
              <ul className="space-y-1.5 text-sm text-ink-2">
                {pkg.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
                {OPERATOR_NOTES.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="order-1 lg:order-2 lg:col-span-4">
            <div className="bg-paper-2 border border-rule rounded-card p-4 sm:p-6 md:p-7 lg:sticky lg:top-24">
              <div className="pb-4 mb-4 sm:pb-5 sm:mb-5 border-b border-rule flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs text-muted mb-0.5">
                    {paxAdults} dewasa ({tierLookup?.vehicle || "SUV"})
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <strong className="num text-2xl sm:text-3xl font-extrabold text-accent">
                      {formatCurrency(unitIdr)}
                    </strong>
                    <span className="text-xs sm:text-sm text-muted">/orang</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-ink-2 bg-paper-3 px-2.5 py-1 rounded">
                  Harga Weekday
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-5">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-ink mb-1.5">
                      Dewasa (1–{maxTierPax})
                    </label>
                    <div className="flex items-center justify-between border-y border-rule">
                      <button
                        type="button"
                        onClick={() => {
                          setAdultsOverride(Math.max(1, paxAdults - 1));
                          setVariantChoiceIdx(0);
                        }}
                        aria-label="Kurangi peserta dewasa"
                        className="w-10 min-h-11 flex items-center justify-center text-ink font-semibold hover:text-accent active:translate-y-px"
                      >
                        -
                      </button>
                      <span className="num text-sm sm:text-base font-semibold text-ink">{paxAdults}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdultsOverride(paxAdults + 1);
                          setVariantChoiceIdx(0);
                        }}
                        aria-label="Tambah peserta dewasa"
                        className="w-10 min-h-11 flex items-center justify-center text-ink font-semibold hover:text-accent active:translate-y-px"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-ink mb-1.5">
                      Anak (6–11 thn)
                    </label>
                    <div className="flex items-center justify-between border-y border-rule">
                      <button
                        type="button"
                        onClick={() => setChildrenOverride(Math.max(0, paxChildren - 1))}
                        aria-label="Kurangi peserta anak"
                        className="w-10 min-h-11 flex items-center justify-center text-ink font-semibold hover:text-accent active:translate-y-px"
                      >
                        -
                      </button>
                      <span className="num text-sm sm:text-base font-semibold text-ink">{paxChildren}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenOverride(paxChildren + 1)}
                        aria-label="Tambah peserta anak"
                        className="w-10 min-h-11 flex items-center justify-center text-ink font-semibold hover:text-accent active:translate-y-px"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {exactMatches.length > 1 && (
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih tipe armada atau paket">
                    {exactMatches.map((variant, vIdx) => (
                      <button
                        key={`${variant.label || variant.vehicle}-${vIdx}`}
                        type="button"
                        onClick={() => setVariantChoiceIdx(vIdx)}
                        className={`min-h-10 text-xs px-3 py-1.5 rounded border transition-colors ${
                          variantChoiceIdx === vIdx
                            ? "border-accent text-accent font-semibold bg-paper-3"
                            : "border-rule text-ink-2 hover:text-ink"
                        }`}
                      >
                        {variant.label ?? variant.vehicle}
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted">
                  Anak di bawah 5 tahun gratis · Supir Muslim &amp; makanan halal.
                </p>
              </div>

              <div className="pt-4 mb-4 border-t border-rule flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-ink">Total estimasi</span>
                <strong className="num text-xl font-extrabold text-ink">
                  {formatCurrency(totalPriceIdr)}
                </strong>
              </div>

              <a
                href={bookingWaHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWebLead}
                className="se-btn se-btn--wa w-full"
              >
                Pesan lewat WhatsApp
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="se-btn se-btn--quiet w-full mt-2.5 whitespace-nowrap"
              >
                {copiedSummary ? "Tersalin ke clipboard" : "Salin ke Grup WA"}
              </button>
              <p className="mt-2 text-xs text-muted text-center min-h-[1.25rem]" aria-live="polite">
                {copiedSummary
                  ? "Tempel langsung ringkasan harga dan hotel ke grup keluarga Anda."
                  : "Simpan format rincian grup tanpa perlu tangkapan layar."}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[120] border-t border-rule bg-paper/95 backdrop-blur-md px-4 pt-2.5 safe-area-bottom">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[11px] text-muted truncate">
              {paxAdults} Dewasa{paxChildren > 0 ? ` + ${paxChildren} Anak` : ""} · {formatCurrency(unitIdr)}/org
            </span>
            <strong className="num block text-base font-extrabold text-ink">
              Total {formatCurrency(totalPriceIdr)}
            </strong>
          </div>
          <a
            href={bookingWaHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWebLead}
            className="se-btn se-btn--primary min-h-11 px-4 shrink-0"
          >
            Pesan WA
          </a>
        </div>
      </div>
    </main>
  );
}
