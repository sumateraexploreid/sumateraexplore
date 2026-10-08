import React from 'react';
import Link from 'next/link';
import PackageCard from '@/components/PackageCard';

export const metadata = {
  title: 'Paket Wisata Sumatera Utara - Sumatera Explore',
  description: 'Pilihan paket wisata Danau Toba terbaik mulai dari private tour, group gathering, hingga corporate outing dengan layanan premium.',
};

export default function PackagesPage() {
    const dummyPackages = [
        {
            id: '1', slug: 'danau-toba-3-hari-2-malam', name: 'Danau Toba 3 Hari 2 Malam',
            duration: '3 Hari 2 Malam', locationTag: 'Danau Toba', price: 1500000,
            image_url: '/images/home/tour.webp', isFeatured: true,
            includes: ['Hotel Bintang 3', 'Transportasi AC', 'Makan sesuai jadwal']
        },
        {
            id: '2', slug: 'samosir-4-hari-3-malam', name: 'Eksplorasi Samosir 4 Hari',
            duration: '4 Hari 3 Malam', locationTag: 'Samosir', price: 2200000,
            image_url: '/images/sumut/toba_hero.webp', isFeatured: false,
            includes: ['Resort Tepi Danau', 'Ferry Penyeberangan', 'Guide Lokal']
        },
        {
            id: '3', slug: 'berastagi-tangkahan-3-hari', name: 'Berastagi & Tangkahan 3 Hari',
            duration: '3 Hari 2 Malam', locationTag: 'Berastagi', price: 1800000,
            image_url: '/images/sumut/sumatra_panorama.webp', isFeatured: true,
            includes: ['Penginapan Alam', 'Trekking Gajah', 'Air Panas Berastagi']
        },
        {
            id: '4', slug: 'bukit-lawang-2-hari', name: 'Jelajah Orangutan Bukit Lawang',
            duration: '2 Hari 1 Malam', locationTag: 'Bukit Lawang', price: 1200000,
            image_url: '/images/sumut/toba_hero.webp', isFeatured: false,
            includes: ['Ecolodge', 'Jungle Trekking', 'Guide Hutan']
        },
        {
            id: '5', slug: 'medan-city-tour', name: 'Medan Heritage & Culinary Tour',
            duration: '1 Hari', locationTag: 'Medan', price: 500000,
            image_url: '/images/home/tour.webp', isFeatured: false,
            includes: ['Transportasi VIP', 'Makan Siang', 'Tiket Masuk Maimun']
        },
        {
            id: '6', slug: 'samosir-toba-5-hari', name: 'Premium Samosir & Toba 5 Hari',
            duration: '5 Hari 4 Malam', locationTag: 'Samosir, Toba', price: 3500000,
            image_url: '/images/sumut/sumatra_panorama.webp', isFeatured: true,
            includes: ['Resort Bintang 4', 'Kapal Pribadi', 'Makan Malam Seafood']
        }
    ];

    const heroImg = dummyPackages.length > 0 ? dummyPackages[0].image_url : '/images/sumut/sumatra_panorama.webp';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative h-[55dvh] min-h-[320px] flex items-end overflow-hidden">
                    <img 
                        src={heroImg} 
                        alt="Packages Hero" 
                        className="absolute inset-0 w-full h-full object-cover" 
                        fetchPriority="high" 
                        decoding="async" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/50 to-slate-50"></div>
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pb-6 md:pb-8">
                        <div className="animate-fade-in-up duration-1000">
                            {/* Breadcrumb replacement */}
                            <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-4">
                                <Link href="/" className="hover:text-white transition">Beranda</Link>
                                <span className="mx-2">/</span>
                                <span className="text-white">Paket Wisata</span>
                            </div>

                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-toba-green/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full mb-4">
                                Eksplorasi Indonesia & Dunia
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                                Paket Wisata <span className="text-toba-green">Pilihan Terbaik</span>
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="max-w-7xl mx-auto px-5 md:px-8 mt-8 md:mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-0.5">Menampilkan Hasil</h2>
                            <p className="text-slate-500 font-normal text-xs">Ditemukan <span className="text-toba-green font-bold">{dummyPackages.length}</span> paket wisata</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                        {dummyPackages.map((pkg, i) => (
                            <div key={pkg.id} className="animate-fade-in-up duration-1000 h-full" style={{ animationDelay: `${i * 100}ms` }}>
                                <PackageCard pkg={pkg} />
                            </div>
                        ))}
                    </div>

                    {dummyPackages.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm animate-fade-in-up duration-700 mt-8">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <span className="material-symbols-outlined text-3xl">search_off</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Paket Belum Tersedia</h3>
                            <p className="text-slate-500 text-xs font-normal max-w-xs mx-auto mb-8 leading-relaxed">Daftar paket sedang kami perbarui. Ceritakan rencana Anda dan kami susunkan penawarannya.</p>
                            <a href="https://wa.me/6282166889988"
                               target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-toba-green transition-colors duration-300">
                                Tanya lewat WhatsApp
                            </a>
                        </div>
                    )}
                </div>

                {/* Custom CTA Section */}
                <div className="max-w-7xl mx-auto px-5 md:px-8 mt-8 md:mt-12 mb-8 md:mb-12">
                    <div className="bg-gradient-to-r from-toba-green to-primary-container rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-sm">
                        <div className="absolute inset-0 opacity-10">
                            <img src="/images/sumut/sumatra_panorama.webp" alt="Paket wisata - destinasi" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Tidak Menemukan Paket yang Cocok?</h3>
                            <p className="text-white/80 text-sm font-normal mb-8 max-w-lg mx-auto">Kami siap merancang itinerary khusus sesuai kebutuhan dan budget Anda.</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a href="https://wa.me/6282166889988" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-toba-green px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                                    Konsultasi Gratis
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
