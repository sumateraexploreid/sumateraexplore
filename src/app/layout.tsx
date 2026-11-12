import type { Metadata, Viewport } from "next";
import { getLocale, HTML_LANG } from "@/i18n";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sumatera Explore | Private Trip Danau Toba, Samosir, Paropo & Berastagi",
  description:
    "Private trip Danau Toba, Pulau Samosir, Silalahi, Paropo, dan Berastagi langsung dari Medan & Kualanamu dengan supir Muslim & gratis dokumentasi iPhone 4K siap posting.",
  keywords: "tour danau toba, private trip samosir, wisata silalahi paropo, paket wisata sumatera utara",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.png", apple: "/icons/icon-192x192.png" },
  appleWebApp: { capable: true, title: "Sumatera Explore", statusBarStyle: "default" },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c0f0e",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html lang={HTML_LANG[locale]} className="antialiased">
      <body>
        <Navbar activeLocale={locale} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
