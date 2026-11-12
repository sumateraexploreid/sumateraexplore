import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { getLocale, HTML_LANG } from "@/i18n";
import { getLiveSiteBundle } from "@/lib/cms";
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
  themeColor: "#141d1b",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, bundle] = await Promise.all([getLocale(), getLiveSiteBundle()]);
  const gaId = bundle.integrations.gaMeasurementId.trim();
  const validGa = /^G-[A-Z0-9]{6,16}$/i.test(gaId) ? gaId : null;
  const pixelId = bundle.integrations.metaPixelId.trim();
  const validPixel = /^[0-9]{6,22}$/.test(pixelId) ? pixelId : null;

  return (
    <html lang={HTML_LANG[locale]} className="antialiased">
      <body>
        <Navbar
          activeLocale={locale}
          brandName={bundle.business.brandName}
          whatsappNumber={bundle.business.whatsappNumber}
        />
        {children}
        <Footer business={bundle.business} socialChannels={bundle.socialChannels} />
        {validGa ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${validGa}`}
              strategy="afterInteractive"
            />
            <Script id="se-ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${validGa}');`}
            </Script>
          </>
        ) : null}
        {validPixel ? (
          <Script id="se-meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${validPixel}');fbq('track','PageView');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
