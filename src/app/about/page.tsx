import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Tentang Kami - Sumatera Explore',
  description: 'Sumatera Explore adalah biro perjalanan Danau Toba yang menyusun perjalanan pribadi, rombongan, dan korporat di Samosir, Parapat, Berastagi, dan seluruh Sumatera Utara.',
};

export default function AboutPage() {
    return (
        <main className="bg-surface min-h-screen pb-14 font-sans text-on-background selection:bg-primary-container selection:text-on-primary-container">
            {/* Cinematic Premium Hero Section */}
            <div className="relative h-[60dvh] flex items-center overflow-hidden bg-slate-900">
                <img 
                    src="/images/sumut/toba_hero.webp" 
                    alt="About Hero" 
                    className="absolute inset-0 w-full h-full object-cover opacity-45 animate-subtle-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pt-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center space-x-2 mb-4 animate-fade-in-down">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold uppercase tracking-[0.25em] rounded-full">
                                OUR LEGACY
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6 animate-fade-in-up">
                            Dedikasi Untuk <br />
                            <span className="text-green-300">Pariwisata Sumut</span>
                        </h1>
                        <p className="text-slate-200 text-sm md:text-lg font-normal max-w-2xl leading-relaxed animate-fade-in-up delay-100">
                            Kami membantu orang liburan dengan rapi, nyaman, dan mudah dipahami dari awal sampai selesai.
                        </p>
                    </div>
                </div>
            </div>

            {/* Luxury Story Section */}
            <section className="py-8 md:py-16 relative overflow-hidden bg-surface">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                        
                        {/* Image Side */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative z-10 aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                                <img 
                                    src="/images/sumut/sumatra_panorama.webp" 
                                    alt="Sumatera Explore Story" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
                            </div>
                            
                            {/* Decorative Radial Gradients */}
                            <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                            
                            {/* Floating Testimonial */}
                            <div className="absolute -bottom-10 -left-6 md:-left-10 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-slate-200 max-w-sm z-20 transition-transform duration-500 hover:scale-[1.02]">
                                <div className="flex gap-1.5 mb-4 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined fill-1 text-base">star</span>
                                    ))}
                                </div>
                                <p className="text-slate-700 font-medium italic text-sm md:text-base mb-4 leading-relaxed">
                                    "Layanan terbaik, armada baru, dan guide yang sangat informatif."
                                </p>
                                <p className="text-secondary font-semibold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-4 h-0.5 bg-secondary inline-block"></span>
                                    Pelanggan Setia
                                </p>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="lg:col-span-6 space-y-8">
                            <div className="space-y-4">
                                <span className="text-secondary font-semibold text-xs uppercase tracking-[0.2em] block">
                                    MENGENAL KAMI
                                </span>
                                <h2 className="text-3xl md:text-5xl font-sans font-semibold text-primary leading-tight tracking-tight">
                                    Melayani Dengan Sepenuh Hati Sejak 2012
                                </h2>
                                <div className="text-sm md:text-base text-slate-600 font-normal leading-relaxed space-y-6">
                                    <p>
                                        Berawal dari kecintaan terhadap keindahan alam Sumatera Utara, Sumatera Explore hadir untuk memberikan pengalaman perjalanan yang tak terlupakan bagi setiap wisatawan. Kami percaya bahwa setiap perjalanan memiliki cerita unik yang layak untuk dikenang selamanya.
                                    </p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4 md:gap-8 pt-8 border-t border-outline-variant/40">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition duration-300 shadow-sm">
                                    <p className="text-4xl font-sans font-semibold text-primary mb-1 tracking-tight">
                                        12+
                                    </p>
                                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">
                                        Tahun Pengalaman
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition duration-300 shadow-sm">
                                    <p className="text-4xl font-sans font-semibold text-primary mb-1 tracking-tight">
                                        1.500+
                                    </p>
                                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">
                                        Wisatawan Puas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Luxury Vision & Mission Section */}
            <section className="py-8 md:py-16 bg-surface-container-low relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffe088_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-15"></div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container skew-x-12 translate-x-20"></div>
                
                <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-6 md:mb-10">
                        <span className="text-secondary font-semibold text-xs uppercase tracking-[0.2em] mb-4 block">
                            OUR MISSION & VISION
                        </span>
                        <h2 className="text-3xl md:text-5xl font-sans font-semibold text-primary tracking-tight leading-tight">
                            Visi & Misi <span className="text-secondary">Masa Depan</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                        {/* Vision Card */}
                        <div className="group bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between transition duration-300 hover:-translate-y-1">
                            <div>
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 mb-6 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-3xl font-black">visibility</span>
                                </div>
                                <h3 className="text-2xl font-sans text-slate-900 mb-6 tracking-tight">
                                    Visi Kami
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base font-normal leading-relaxed">
                                    Membawa Anda menikmati keaslian alam dan budaya Sumatera Utara melalui perjalanan yang tenang, aman, dan berkesan.
                                </p>
                            </div>
                            <div className="pt-6 flex justify-end">
                                <span className="text-[9px] font-semibold tracking-widest text-secondary uppercase">EXCELLENCE SERVICE</span>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="group bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between transition duration-300 hover:-translate-y-1">
                            <div>
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-3xl font-black">task_alt</span>
                                </div>
                                <h3 className="text-2xl font-sans text-slate-900 mb-6 tracking-tight">
                                    Misi Kami
                                </h3>
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="material-symbols-outlined text-sm font-black">done</span>
                                        </div>
                                        <span className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
                                            Merancang itinerary yang sesuai dengan ritme liburan Anda.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="material-symbols-outlined text-sm font-black">done</span>
                                        </div>
                                        <span className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
                                            Menyediakan transportasi dan akomodasi lokal terbaik.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="material-symbols-outlined text-sm font-black">done</span>
                                        </div>
                                        <span className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
                                            Memastikan setiap pelanggan pulang dengan cerita yang indah.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-8 md:py-16 bg-surface">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        
                        <div className="lg:col-span-5 space-y-6">
                            <span className="text-secondary font-semibold text-xs uppercase tracking-[0.2em] block">
                                WHY CHOOSE US
                            </span>
                            <h2 className="text-3xl md:text-5xl font-sans font-semibold text-primary tracking-tight leading-tight">
                                Keunggulan <br /> <span className="text-secondary">Sumatera Explore</span>
                            </h2>
                            <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
                                Kami tidak sekadar menjual tiket perjalanan; kami merancang memori indah. Setiap detail kecil dari petualangan Anda dikuratori secara hati-hati oleh tim profesional kami.
                            </p>
                            <div className="pt-4">
                                <Link href="/tour/packages" className="inline-flex items-center gap-3 py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-[10px] uppercase tracking-widest transition duration-300 shadow-sm group">
                                    <span>Lihat Layanan Kami</span>
                                    <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                
                                <div className="card-flat-soft p-8 transition duration-300 hover:-translate-y-1 group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition duration-300 shadow-sm">
                                        <span className="material-symbols-outlined text-2xl">diamond</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Layanan Rapi</h4>
                                    <p className="text-xs text-slate-600 font-normal leading-relaxed">Armada bersih, akomodasi jelas, dan proses yang mudah dipahami.</p>
                                </div>
                                
                                <div className="card-flat-soft p-8 transition duration-300 hover:-translate-y-1 group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition duration-300 shadow-sm">
                                        <span className="material-symbols-outlined text-2xl">badge</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Guide Berpengalaman</h4>
                                    <p className="text-xs text-slate-600 font-normal leading-relaxed">Didampingi pemandu lokal yang ramah dan paham rute.</p>
                                </div>
                                
                                <div className="card-flat-soft p-8 transition duration-300 hover:-translate-y-1 group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition duration-300 shadow-sm">
                                        <span className="material-symbols-outlined text-2xl">verified_user</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Aman & Terpercaya</h4>
                                    <p className="text-xs text-slate-600 font-normal leading-relaxed">Proses pemesanan jelas dan dukungan yang responsif.</p>
                                </div>
                                
                                <div className="p-8 bg-white rounded-3xl border border-outline-variant/20 shadow-lg transition duration-300 hover:border-secondary/40 hover:-translate-y-1 group">
                                    <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition duration-500 shadow-inner">
                                        <span className="material-symbols-outlined text-2xl">support_agent</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-primary mb-2">Support 24/7</h4>
                                    <p className="text-xs text-on-surface-variant font-light leading-relaxed">Tim asisten spesialis kami siap melayani seluruh pertanyaan dan kebutuhan Anda.</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            {/* Omitted or replaced for now if images don't exist, we can use placeholders or remove it. Let's keep it with standard emojis if SVGs are missing */}
            <section className="py-8 md:py-12 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
                    <div className="text-center mb-8">
                        <span className="text-secondary-fixed font-black text-[9px] uppercase tracking-[0.3em] mb-2 block">MITRA &amp; KLIEN</span>
                        <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Mitra &amp; Klien Kami</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center">
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="w-full h-16 flex items-center justify-center opacity-40 group-hover:opacity-100 transition duration-500">
                                <span className="text-2xl font-bold text-white uppercase">MANDIRI</span>
                            </div>
                            <p className="text-on-primary-container text-[8px] font-black uppercase tracking-widest text-center group-hover:text-secondary-fixed transition-colors">
                                Bank Mandiri Taspen
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="w-full h-16 flex items-center justify-center opacity-40 group-hover:opacity-100 transition duration-500">
                                <span className="text-2xl font-bold text-white uppercase">USU</span>
                            </div>
                            <p className="text-on-primary-container text-[8px] font-black uppercase tracking-widest text-center group-hover:text-secondary-fixed transition-colors">
                                Universitas Sumatera Utara
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="w-full h-16 flex items-center justify-center opacity-40 group-hover:opacity-100 transition duration-500">
                                <span className="text-2xl font-bold text-white uppercase">PELINDO</span>
                            </div>
                            <p className="text-on-primary-container text-[8px] font-black uppercase tracking-widest text-center group-hover:text-secondary-fixed transition-colors">
                                Pelindo 1
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="w-full h-16 flex items-center justify-center opacity-40 group-hover:opacity-100 transition duration-500">
                                <span className="text-2xl font-bold text-white uppercase">HYUNDAI</span>
                            </div>
                            <p className="text-on-primary-container text-[8px] font-black uppercase tracking-widest text-center group-hover:text-secondary-fixed transition-colors">
                                Hyundai
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                        <span className="text-white/60 font-bold text-sm tracking-widest uppercase">🇮🇩</span>
                        <div>
                            <p className="text-white font-bold text-sm tracking-tight">Program Wonderful Indonesia</p>
                            <p className="text-on-primary-container text-xs font-light">Kementerian Pariwisata dan Ekonomi Kreatif Republik Indonesia</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Luxury Call to Action Section */}
            <section className="py-8 md:py-16 px-5 md:px-8 bg-surface">
                <div className="max-w-7xl mx-auto bg-surface-container rounded-3xl md:rounded-[2.5rem] p-8 md:p-24 relative overflow-hidden text-center border border-outline-variant/20 shadow-2xl">
                    <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-6xl font-bold text-primary tracking-tight leading-[1.05]">
                            Mulai Cerita Indah <br /> <span className="text-secondary">Anda Bersama Kami</span>
                        </h2>
                        <p className="text-on-surface-variant text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto">
                            Siap untuk menjelajahi keindahan tersembunyi Sumatera Utara? Hubungi spesialis perjalanan kami hari ini untuk merancang liburan impian Anda.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/tour/packages" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-container text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition duration-300 shadow-lg hover:-translate-y-0.5">
                                Pilih Paket Wisata
                            </Link>
                            
                            <a href="https://wa.me/6282166889988" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-white border border-outline-variant/30 text-on-surface hover:bg-surface-container-low rounded-2xl font-black text-[10px] uppercase tracking-widest transition duration-300 shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-toba-green animate-pulse"></span>
                                Chat WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
