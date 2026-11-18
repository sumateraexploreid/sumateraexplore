"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { formatWaLink } from "@/lib/whatsapp";

export default function FloatingWhatsApp({
  whatsappNumber = "6289502472594",
}: {
  whatsappNumber?: string;
}) {
  const pathname = usePathname();

  // Hide on admin routes and on package detail (which has its own bottom sticky action)
  if (pathname?.startsWith("/admin") || (pathname?.startsWith("/tour/") && pathname.split("/").length > 3 && !pathname.includes("/blog"))) {
    return null;
  }

  const href = formatWaLink(
    whatsappNumber,
    "Halo Sumatera Explore, saya ingin tanya info paket private trip Danau Toba & Berastagi."
  );

  return (
    <aside
      aria-label="Kontak Cepat WhatsApp"
      className="fixed bottom-5 right-5 z-[80] flex items-center group"
    >
      <span className="hidden sm:inline-block mr-2 px-3 py-1.5 rounded-full bg-paper-2/95 border border-rule text-xs font-medium text-ink shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat WhatsApp Kami
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami melalui WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-6 h-6 sm:w-7 sm:h-7"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zM17.46 16.47c-.24.67-1.39 1.29-1.93 1.37-.5.08-1.15.11-3.69-.94-3.25-1.34-5.34-4.64-5.5-4.86-.16-.22-1.32-1.76-1.32-3.36 0-1.6 0.84-2.39 1.14-2.72.3-.33.66-.41.88-.41.22 0 .44 0 .63.01.2.01.47-.08.73.55.27.65.92 2.25 1 2.42.08.17.14.37.03.6-.11.23-.17.37-.34.57-.17.2-.36.45-.51.61-.17.17-.35.36-.15.7.2.34.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.76 1.7.34.17.55.14.75-.09.2-.23.86-1 1.09-1.35.23-.34.46-.29.77-.17.31.11 1.99.94 2.33 1.11.34.17.57.26.66.4.08.14.08.83-.16 1.5z" />
        </svg>
      </a>
    </aside>
  );
}
