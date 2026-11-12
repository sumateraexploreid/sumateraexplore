"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface NavGroup {
  label: string;
  items: Array<{
    href: string;
    label: string;
    icon: string;
    exact?: boolean;
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Ringkasan",
    items: [{ href: "/admin", label: "Beranda Admin", icon: "dashboard", exact: true }],
  },
  {
    label: "Order & Kwitansi",
    items: [
      { href: "/admin/orders", label: "Order & Data Tamu", icon: "add_shopping_cart" },
      { href: "/admin/receipts", label: "Buat Kwitansi", icon: "receipt_long" },
    ],
  },
  {
    label: "Isi Website",
    items: [
      { href: "/admin/packages", label: "Paket & Harga", icon: "tour" },
      { href: "/admin/blog", label: "Artikel Wisata", icon: "article" },
      { href: "/admin/gallery", label: "Galeri Foto", icon: "gallery_thumbnail" },
    ],
  },
  {
    label: "Pengaturan & WA",
    items: [
      { href: "/admin/finance", label: "Kurs & Aturan DP", icon: "currency_exchange" },
      { href: "/admin/business", label: "Profil Bisnis & WA", icon: "verified_user" },
      { href: "/admin/users", label: "Akun Pengelola", icon: "admin_panel_settings" },
    ],
  },
];

export default function AdminShell({
  user,
  children,
}: {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login" || !user) {
    return <>{children}</>;
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const sidebarBody = (
    <>
      <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-forest-rule">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent text-accent-ink rounded-md flex items-center justify-center shrink-0">
            <AdminIcon name="explore" className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-sm font-bold text-forest-ink block leading-tight">
              Sumatera Explore
            </span>
            <span className="text-[11px] text-forest-muted">Back-Office CMS</span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Tutup navigasi"
          className="md:hidden p-1.5 text-forest-muted hover:text-ink"
        >
          <AdminIcon name="close" className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-5 overflow-y-auto" aria-label="Menu admin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-xs font-semibold text-forest-muted">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex min-h-[42px] items-center gap-3 px-3.5 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-accent text-accent-ink font-bold"
                        : "text-forest-muted hover:bg-forest hover:text-forest-ink font-medium"
                    }`}
                  >
                    <AdminIcon name={item.icon} className="w-[18px] h-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-forest-rule space-y-3">
        <div className="px-3 py-2 rounded-md bg-paper-2 border border-rule">
          <p className="text-xs font-bold text-ink truncate">{user.name}</p>
          <p className="text-[11px] text-muted truncate">{user.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex min-h-[38px] items-center justify-center gap-1.5 px-2.5 rounded-md border border-forest-rule text-xs font-medium text-forest-muted hover:text-ink hover:border-accent transition-colors"
          >
            <AdminIcon name="open_in_new" className="w-4 h-4" />
            Lihat Web
          </Link>
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex min-h-[38px] items-center justify-center gap-1.5 px-2.5 rounded-md border border-forest-rule text-xs font-medium text-forest-muted hover:bg-error/15 hover:text-error hover:border-error/40 transition-colors"
          >
            <AdminIcon name="logout" className="w-4 h-4" />
            {loggingOut ? "…" : "Keluar"}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-dvh bg-paper flex flex-col md:flex-row">
      {/* Top Bar Mobile */}
      <div className="md:hidden sticky top-0 z-30 bg-forest-deep border-b border-forest-rule px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent text-accent-ink rounded-md flex items-center justify-center">
            <AdminIcon name="explore" className="w-4 h-4" />
          </div>
          <span className="font-display text-sm font-bold text-forest-ink">
            Admin Sumatera Explore
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Buka menu admin"
          className="min-w-10 min-h-10 rounded-md border border-forest-rule flex items-center justify-center text-ink"
        >
          <AdminIcon name="menu" className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-forest-deep text-forest-ink flex-col fixed inset-y-0 left-0 z-40 border-r border-forest-rule">
        {sidebarBody}
      </aside>

      {/* Drawer Mobile */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-forest-deep/80"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-forest-deep text-forest-ink flex flex-col h-full border-r border-forest-rule z-10">
            {sidebarBody}
          </aside>
        </div>
      ) : null}

      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
        {/* Global Shortcut Strip */}
        <nav
          aria-label="Jalan pintas cepat admin"
          className="mb-5 pb-4 border-b border-rule flex flex-wrap items-center gap-2"
        >
          <span className="text-xs font-semibold text-muted mr-1">Pintasan:</span>
          <Link
            href="/admin/orders?action=new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-accent-ink text-xs font-bold hover:bg-accent-hover transition-colors"
          >
            <AdminIcon name="add_circle" className="w-3.5 h-3.5" />
            + Catat Order Baru
          </Link>
          <Link
            href="/admin/receipts"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-paper-2 border border-rule text-xs font-bold text-ink hover:border-accent transition-colors"
          >
            <AdminIcon name="receipt_long" className="w-3.5 h-3.5 text-accent" />
            Buat Kwitansi
          </Link>
          <Link
            href="/admin/packages?action=new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-paper-2 border border-rule text-xs font-semibold text-ink-2 hover:text-ink hover:border-accent transition-colors"
          >
            <AdminIcon name="tour" className="w-3.5 h-3.5 text-accent" />
            + Tambah Paket
          </Link>
          <Link
            href="/admin/gallery?action=new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-paper-2 border border-rule text-xs font-semibold text-ink-2 hover:text-ink hover:border-accent transition-colors"
          >
            <AdminIcon name="add_photo_alternate" className="w-3.5 h-3.5 text-accent" />
            + Upload Foto
          </Link>
          <Link
            href="/admin/finance"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-paper-2 border border-rule text-xs font-semibold text-ink-2 hover:text-ink hover:border-accent transition-colors"
          >
            <AdminIcon name="currency_exchange" className="w-3.5 h-3.5 text-accent" />
            Ubah Kurs
          </Link>
          <Link
            href="/"
            target="_blank"
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-rule text-xs font-semibold text-muted hover:text-ink hover:border-accent transition-colors"
          >
            <AdminIcon name="open_in_new" className="w-3.5 h-3.5" />
            Buka Web Tamu
          </Link>
        </nav>

        {children}
      </main>
    </div>
  );
}

