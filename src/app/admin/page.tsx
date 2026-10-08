import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    return (
        <div className="animate-fade-in-up">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Dashboard Overview</h1>
                <p className="text-slate-500">Selamat datang di Panel Admin Sumatera Explore. Kelola semua konten website Anda di sini.</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Paket Tour</p>
                        <h2 className="text-4xl font-black text-slate-900">6</h2>
                    </div>
                    <div className="w-14 h-14 bg-toba-green/10 text-toba-green rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">tour</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Artikel Blog</p>
                        <h2 className="text-4xl font-black text-slate-900">3</h2>
                    </div>
                    <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">article</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Galeri Foto</p>
                        <h2 className="text-4xl font-black text-slate-900">12</h2>
                    </div>
                    <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">collections</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-bold text-slate-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/packages/create" className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition-colors group">
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">add_circle</span>
                    <span className="font-bold text-sm">Tambah Paket Baru</span>
                </Link>
                <Link href="/admin/blog/create" className="bg-white border border-slate-200 text-slate-700 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:text-toba-green transition-colors group shadow-sm">
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">post_add</span>
                    <span className="font-bold text-sm">Tulis Artikel Baru</span>
                </Link>
                <Link href="/admin/gallery" className="bg-white border border-slate-200 text-slate-700 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:text-toba-green transition-colors group shadow-sm">
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">add_photo_alternate</span>
                    <span className="font-bold text-sm">Upload Foto Galeri</span>
                </Link>
                <Link href="/" target="_blank" className="bg-toba-green text-white p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-green-700 transition-colors group shadow-md">
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">visibility</span>
                    <span className="font-bold text-sm">Lihat Website</span>
                </Link>
            </div>
        </div>
    );
}
