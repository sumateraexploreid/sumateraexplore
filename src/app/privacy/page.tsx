import React from 'react';

export const metadata = {
  title: 'Kebijakan Privasi - Sumatera Explore',
  description: 'Kebijakan privasi Sumatera Explore.',
};

export default function PrivacyPage() {
    return (
        <div className="bg-slate-50 min-h-screen pt-14 pb-12 font-sans">
            <div className="max-w-4xl mx-auto px-5">
                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 animate-fade-in-up duration-1000">
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Kebijakan <span className="text-toba-green">Privasi</span></h1>
                    
                    <div className="prose prose-slate max-w-none text-slate-600 text-sm font-normal leading-relaxed">
                        <p className="mb-8 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Terakhir diperbarui: Juni 2025</p>
                        
                        <h3 className="text-slate-900 font-bold text-base mb-3 tracking-tight">Perlindungan Data</h3>
                        <p className="mb-6">Sumatera Explore berkomitmen untuk melindungi privasi pelanggan kami. Kami hanya mengumpulkan informasi yang diperlukan untuk memproses pemesanan Anda dan meningkatkan layanan kami.</p>
                        
                        <h3 className="text-slate-900 font-bold text-base mb-3 tracking-tight">Informasi yang Kami Kumpulkan</h3>
                        <p className="mb-6">Informasi yang kami kumpulkan meliputi nama, alamat email, nomor telepon, dan detail perjalanan yang diperlukan untuk koordinasi tour.</p>
                        
                        <h3 className="text-slate-900 font-bold text-base mb-3 tracking-tight">Penggunaan Informasi</h3>
                        <p className="mb-6">Data Anda tidak akan pernah dijual atau dibagikan kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan eksplisit dari Anda.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
