"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PackageProps {
  id: string | number;
  slug: string;
  name: string;
  translated_name?: string;
  locationTag?: string;
  duration?: string;
  price: number;
  childPrice?: number | null;
  isFeatured?: boolean;
  image_url: string;
  pricingDetails?: unknown;
  includes?: string[];
  excludes?: string[];
  itinerary?: unknown[];
}

function formatTourPrice(
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

export default function PackageCard({
  pkg,
  locationName = "Sumatera Utara",
  priority = false,
  currency = "IDR",
  idrPerUnit = 1,
}: {
  pkg: PackageProps;
  locationName?: string;
  priority?: boolean;
  currency?: "MYR" | "IDR" | "SGD";
  idrPerUnit?: number;
}) {
  const displayLocation = pkg.locationTag || locationName;
  const name = pkg.translated_name || pkg.name || "Paket Tour";
  const image = pkg.image_url || "/images/sumut/toba_hero.webp";
  const slug = pkg.slug || pkg.id.toString();

  const [paxAdults, setPaxAdults] = useState(2);
  const [paxChildren, setPaxChildren] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const basePrice = pkg.price || 0;
  const childPrice =
    pkg.childPrice !== null && pkg.childPrice !== undefined
      ? pkg.childPrice
      : basePrice * 0.75;
  const totalPrice = paxAdults * basePrice + paxChildren * childPrice;

  const formatCurrency = (val: number) =>
    formatTourPrice(val, currency, idrPerUnit);

  return (
    <article className="flex flex-col h-full border-b border-rule pb-6">
      <Link href={`/tour/${slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-paper-2">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading={priority ? undefined : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-grow pt-3 sm:pt-4">
        <div className="flex items-start justify-between gap-1.5 sm:gap-3">
          <Link href={`/tour/${slug}`} className="min-w-0 flex-1 no-underline">
            <h3 className="font-display text-ink text-sm sm:text-xl leading-snug hover:text-accent transition-colors duration-200">
              {name}
            </h3>
          </Link>
          <button
            type="button"
            onClick={() => setIsWishlist((prev) => !prev)}
            aria-label={isWishlist ? "Hapus dari favorit" : "Simpan paket ke favorit"}
            aria-pressed={isWishlist}
            className={`min-w-9 sm:min-w-11 min-h-11 shrink-0 flex items-center justify-center transition-colors duration-200 active:translate-y-px ${
              isWishlist
                ? "text-accent"
                : "text-muted hover:text-ink"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-xs text-muted">
          {pkg.isFeatured ? "Pilihan utama, " : ""}
          {displayLocation}
          {pkg.duration ? `, ${pkg.duration}` : ""}
        </p>

        <div className="mt-4 border-t border-rule pt-3">
          <button
            type="button"
            onClick={() => setDetailsOpen((prev) => !prev)}
            aria-expanded={detailsOpen}
            className="w-full min-h-11 flex items-center justify-between text-sm font-semibold text-ink-2 hover:text-ink transition-colors duration-200 active:translate-y-px whitespace-nowrap"
          >
            <span>Ringkasan paket</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform duration-200 ${detailsOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {detailsOpen && (
            <div className="mt-2 pb-2 text-sm text-ink-2 space-y-2">
              {pkg.includes && pkg.includes.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1">
                  {pkg.includes.slice(0, 3).map((inc, i) => (
                    <li key={i}>{inc}</li>
                  ))}
                </ul>
              ) : (
                <p>Tidak ada rincian tambahan.</p>
              )}
              <Link href={`/tour/${slug}`} className="se-text-link">
                Lihat itinerary lengkap
              </Link>
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 sm:pt-4 border-t border-rule">
          <div className="flex flex-wrap items-baseline justify-between gap-1 sm:gap-2 mb-2.5 sm:mb-3">
            <span className="text-[11px] sm:text-xs text-muted">Estimasi</span>
            <strong className="num text-base sm:text-lg font-extrabold text-ink">
              {formatCurrency(totalPrice)}
            </strong>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-4">
            <div className="border-y border-rule flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPaxAdults((n) => Math.max(1, n - 1))}
                aria-label="Kurangi jumlah dewasa"
                className="w-9 sm:w-10 min-h-11 flex items-center justify-center text-ink font-semibold hover:text-accent active:translate-y-px"
              >
                -
              </button>
              <span className="num text-xs font-semibold text-ink whitespace-nowrap">{paxAdults} Dewasa</span>
              <button
                type="button"
                onClick={() => setPaxAdults((n) => n + 1)}
                aria-label="Tambah jumlah dewasa"
                className="w-9 sm:w-10 min-h-11 flex items-center justify-center text-ink font-semibold hover:text-accent active:translate-y-px"
              >
                +
              </button>
            </div>

            <div className="border-y border-rule flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPaxChildren((n) => Math.max(0, n - 1))}
                aria-label="Kurangi jumlah anak"
                className="w-9 sm:w-10 min-h-11 flex items-center justify-center text-ink font-semibold hover:text-accent active:translate-y-px"
              >
                -
              </button>
              <span className="num text-xs font-semibold text-ink whitespace-nowrap">{paxChildren} Anak</span>
              <button
                type="button"
                onClick={() => setPaxChildren((n) => n + 1)}
                aria-label="Tambah jumlah anak"
                className="w-9 sm:w-10 min-h-11 flex items-center justify-center text-ink font-semibold hover:text-accent active:translate-y-px"
              >
                +
              </button>
            </div>
          </div>

          <Link
            href={`/tour/${slug}?adults=${paxAdults}&children=${paxChildren}`}
            className="se-btn se-btn--primary w-full px-2.5 sm:px-5 text-xs sm:text-sm whitespace-nowrap"
          >
            Detail &amp; pesan
          </Link>
        </div>
      </div>
    </article>
  );
}
