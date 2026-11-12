"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { BUSINESS_IDENTITY, SOCIAL_CHANNELS, type SocialChannel } from "@/data/business";
import type { BusinessSettings } from "@/lib/cms";

export default function Footer({
  business = BUSINESS_IDENTITY,
  socialChannels = SOCIAL_CHANNELS,
}: {
  business?: Pick<
    BusinessSettings,
    | "brandName"
    | "legalName"
    | "legalForm"
    | "decreeNumber"
    | "shortAddress"
    | "whatsappNumber"
    | "whatsappDisplay"
    | "email"
  >;
  socialChannels?: SocialChannel[];
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="se-footer">
      <div className="se-footer-inner">
        <div className="se-footer-brand">
          <Link href="/" className="se-footer-logo" aria-label={`${business.brandName}, beranda`}>
            {business.brandName}
          </Link>
          <p>
            Kantor operasional di Berastagi, Kabupaten Karo. Dikelola resmi oleh badan hukum{" "}
            {business.legalForm} {business.legalName} ({business.decreeNumber}).
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3" aria-label="Media sosial resmi">
            {socialChannels.map((channel) => (
              <a
                key={channel.key}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center gap-2 text-sm text-forest-muted hover:text-forest-ink whitespace-nowrap no-underline hover:underline underline-offset-4"
              >
                <Icon name={channel.key} className="w-4 h-4 shrink-0" />
                <span>{channel.label}</span>
              </a>
            ))}
          </div>
        </div>

        <nav className="se-footer-nav" aria-label="Tautan layanan">
          <h2>Jelajahi</h2>
          <Link href="/tour/packages">Paket wisata</Link>
          <Link href="/tour/gallery">Galeri perjalanan</Link>
          <Link href="/tour/blog">Jurnal perjalanan</Link>
          <Link href="/payment">Cara pembayaran</Link>
          <Link href="/about">Tentang &amp; legalitas</Link>
        </nav>

        <div className="se-footer-contact">
          <h2>Kontak &amp; Legalitas</h2>
          <p>{business.shortAddress}</p>
          <a
            href={`https://wa.me/${business.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" className="w-4 h-4" />
            <span>{business.whatsappDisplay}</span>
          </a>
          <a href={`mailto:${business.email}`}>
            <span>{business.email}</span>
          </a>
        </div>
      </div>

      <div className="se-footer-bottom">
        <span>
          © {new Date().getFullYear()} {business.brandName} ({business.legalName})
        </span>
        <div>
          <Link href="/terms">Syarat &amp; ketentuan</Link>
          <Link href="/privacy">Privasi</Link>
        </div>
      </div>
    </footer>
  );
}
