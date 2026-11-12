"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import type { Locale } from "@/i18n";
import { BUSINESS_IDENTITY } from "@/data/business";

const contactWhatsapp = BUSINESS_IDENTITY.whatsappNumber;

const headerDirectLinks = [
  {
    key: "instagram",
    label: "Instagram Sumatera Explore",
    href: "https://www.instagram.com/sumatera.explore",
  },
  {
    key: "whatsapp",
    label: "WhatsApp Sumatera Explore",
    href: `https://wa.me/${BUSINESS_IDENTITY.whatsappNumber}`,
  },
  {
    key: "threads",
    label: "Threads Sumatera Explore",
    href: "https://www.threads.com/@sumatera.explore",
  },
  {
    key: "tiktok",
    label: "TikTok Sumatera Explore",
    href: "https://www.tiktok.com/@sumatera.explore",
  },
] as const;

const locales: Record<string, string> = {
  id: "IDR (Indonesia)",
  my: "MYR (Melayu)",
  en: "SGD (English)",
};

const localeShort: Record<string, string> = {
  id: "IDR",
  my: "MYR",
  en: "SGD",
};

export default function Navbar({
  activeLocale,
  brandName = BUSINESS_IDENTITY.brandName,
  whatsappNumber = contactWhatsapp,
}: {
  activeLocale: Locale;
  brandName?: string;
  whatsappNumber?: string;
}) {
  const pathname = usePathname();
  const [openLang, setOpenLang] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const liveDirectLinks = headerDirectLinks.map((item) =>
    item.key === "whatsapp"
      ? { ...item, href: `https://wa.me/${whatsappNumber}` }
      : item,
  );

  const isHome = pathname === "/";
  const isPkg = pathname?.startsWith("/tour/packages") || (pathname?.startsWith("/tour/") && !pathname?.startsWith("/tour/gallery") && !pathname?.startsWith("/tour/blog"));
  const isGallery = pathname?.startsWith("/tour/gallery");
  const isBlog = pathname?.startsWith("/tour/blog");
  const isAbout = pathname === "/about";

  const links = [
    { label: "Beranda", url: "/", active: isHome },
    { label: "Paket wisata", url: "/tour/packages", active: isPkg },
    { label: "Galeri", url: "/tour/gallery", active: isGallery },
    { label: "Jurnal", url: "/tour/blog", active: isBlog },
    { label: "Tentang", url: "/about", active: isAbout },
  ];

  return (
    <header
      className="se-nav"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpenLang(false);
        }
      }}
    >
      <div className="se-nav-inner">
        <div className="se-brand-bar">
          <Link href="/" className="se-wordmark inline-flex items-center" aria-label={`${brandName}, beranda`}>
            <span>{brandName}</span>
          </Link>

          <div className="se-nav-social" aria-label="Tautan media sosial dan WhatsApp">
            {liveDirectLinks.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
                className="se-nav-social-link"
              >
                <Icon name={item.key} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <nav className="se-nav-links" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              aria-current={link.active ? "page" : undefined}
              className="se-nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="se-nav-actions">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenLang((prev) => !prev)}
              aria-expanded={openLang}
              aria-haspopup="true"
              aria-label={`${localeShort[activeLocale] ?? "IDR"} — Pilih bahasa dan mata uang`}
              className="se-locale-btn"
            >
              <span>{localeShort[activeLocale] ?? "IDR"}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openLang && (
              <>
                <div
                  className="fixed inset-0 z-[90]"
                  onClick={() => setOpenLang(false)}
                  aria-hidden="true"
                />
                <div className="se-locale-menu" role="menu">
                  {Object.entries(locales).map(([code, label]) => (
                    <a
                      key={code}
                      href={`/change-locale/${code}`}
                      onClick={() => setOpenLang(false)}
                      role="menuitem"
                      className={`se-locale-item ${activeLocale === code ? "is-active" : ""}`}
                    >
                      <span>{label}</span>
                      {activeLocale === code && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden="true"
                        >
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="se-nav-cta se-nav-cta-desktop"
          >
            <Icon name="whatsapp" className="w-4 h-4" />
            <span>Konsultasi</span>
          </a>
        </div>
      </div>

      <nav className="se-nav-mobile-strip" aria-label="Navigasi ponsel">
        <ul className="se-nav-mobile-list no-scrollbar">
          {links.map((link) => (
            <li key={link.url} className="shrink-0">
              <Link
                href={link.url}
                aria-current={link.active ? "page" : undefined}
                className="se-nav-link"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
