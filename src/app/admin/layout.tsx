import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Dashboard - Sumatera Explore',
  description: 'Sistem manajemen konten Sumatera Explore.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-toba-green rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-sm font-bold">admin_panel_settings</span>
          </div>
          <span className="font-bold tracking-wider text-sm uppercase">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium text-sm transition-colors">
            <span className="material-symbols-outlined text-lg">dashboard</span>
            Dashboard
          </Link>
          <Link href="/admin/packages" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white font-medium text-sm transition-colors">
            <span className="material-symbols-outlined text-lg">tour</span>
            Paket Tour
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white font-medium text-sm transition-colors">
            <span className="material-symbols-outlined text-lg">article</span>
            Blog / Artikel
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white font-medium text-sm transition-colors">
            <span className="material-symbols-outlined text-lg">gallery_thumbnail</span>
            Galeri Foto
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-medium text-sm transition-all group">
            <span>Keluar</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
