import type { Metadata, Viewport } from "next";
import { getLocale, HTML_LANG } from "@/i18n";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Padanan <head> di layouts/app.blade.php. Nilai teks akan diganti dengan
// siteSettings.general (seo_meta_title dll) begitu lapisan data Supabase siap.
export const metadata: Metadata = {
  title: "Sumatera Explore | Premium Tour Travel",
  description:
    "Portal utama Sumatera Explore. Pilih layanan premium Tour Travel Sumatera Utara.",
  keywords: "tour danau toba, travel sumatera utara",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.png", apple: "/icons/icon-192x192.png" },
  appleWebApp: { capable: true, title: "Sumatera Explore", statusBarStyle: "default" },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#166534",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html lang={HTML_LANG[locale]} className="antialiased">
      {/* situs-publik: penanda agar aturan kerapatan & ukuran huruf ponsel di
          globals.css hanya mengenai halaman publik, bukan panel admin. */}
      <body className="situs-publik font-sans text-slate-900 bg-white selection:bg-green-100 selection:text-green-900 overflow-x-hidden pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
