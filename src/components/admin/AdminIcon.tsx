"use client";

import React from "react";

const ICON_PATHS: Record<string, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  receipt_long: (
    <>
      <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  tour: (
    <>
      <path d="M4 21V4M4 4h11l-1.5 3.5L15 11H4" />
    </>
  ),
  article: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  gallery_thumbnail: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="m7 14 3.5-3.5 3 3L16 11l3 3" />
      <circle cx="8.5" cy="8.5" r="1.2" />
    </>
  ),
  collections: (
    <>
      <rect x="6" y="4" width="15" height="13" rx="2" />
      <path d="M3 8v10a2 2 0 0 0 2 2h12" />
      <path d="m10 13 2.5-2.5L15 13l2.5-2.5L20 13" />
    </>
  ),
  currency_exchange: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v10M14.5 9.5c0-1.1-1.1-1.8-2.5-1.8S9.5 8.4 9.5 9.5s1 1.7 2.5 2 2.5.9 2.5 2-1.1 1.8-2.5 1.8-2.5-.7-2.5-1.8" />
    </>
  ),
  verified_user: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  admin_panel_settings: (
    <>
      <path d="M12 3 5 6v5.2c0 4.2 3 7.7 7 9 4-1.3 7-4.8 7-9V6l-7-3Z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  explore: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5 15.5 8.5" />
    </>
  ),
  open_in_new: (
    <>
      <path d="M14 5h5v5M19 5l-9 9" />
      <path d="M17 13v5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 18V8.5A1.5 1.5 0 0 1 6.5 7H11" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  login: (
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="m10 17 5-5-5-5M15 12H3" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>
  ),
  check_circle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.3 2.3 4.7-4.8" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m21 16-5-5-6 6-3-3-4 4" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 17v2a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-2" />
    </>
  ),
  photo_library: (
    <>
      <rect x="6" y="4" width="15" height="13" rx="2" />
      <path d="M3 8v10a2 2 0 0 0 2 2h12" />
      <circle cx="10.5" cy="8.5" r="1.2" />
      <path d="m9 14 3-3 3 3 3-3 3 3" />
    </>
  ),
  add_photo_alternate: (
    <>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="m6 15 3-3 3 3 2.5-2.5L17 15" />
      <path d="M19 3v5M16.5 5.5h5" />
    </>
  ),
  add_circle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  add_shopping_cart: (
    <>
      <path d="M3 4h2l2.4 10.5a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 7H6" />
      <circle cx="9.5" cy="19" r="1.3" />
      <circle cx="17" cy="19" r="1.3" />
    </>
  ),
  sell: (
    <>
      <path d="M3 12V4h8l9 9-8 8-9-9Z" />
      <circle cx="7.5" cy="8.5" r="1.2" />
    </>
  ),
  post_add: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
      <path d="M19 3v5M16.5 5.5h5M8 12h8M8 16h5" />
    </>
  ),
  person_add: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
      <path d="M19 8v6M16 11h6" />
    </>
  ),
  delete: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  visibility: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  visibility_off: (
    <>
      <path d="M3 3l18 18M10.6 10.6a2.8 2.8 0 0 0 3.8 3.8" />
      <path d="M6.5 6.8C4 8.4 2 12 2 12s3.5 6 10 6c1.9 0 3.6-.5 5-1.3M9.5 6.3A11 11 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-2.8 3.6" />
    </>
  ),
  arrow_back: (
    <>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </>
  ),
};

export function AdminIcon({
  name,
  className = "w-[18px] h-[18px]",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {ICON_PATHS[name] || ICON_PATHS.dashboard}
    </svg>
  );
}

