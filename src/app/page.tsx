import React from 'react';
import Link from 'next/link';
import HomeSlider from '@/components/HomeSlider';
import PackageCard from '@/components/PackageCard';
import HorizontalScrollStrip from '@/components/HorizontalScrollStrip';
import FaqAccordion from '@/components/FaqAccordion';

export default function Home() {
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
        }
    ];

    const gallerySlides = [
        { url: '/images/sumut/toba_hero.webp', caption: 'Keindahan Danau Toba di pagi hari', category: 'Danau Toba' },
        { url: '/images/home/tour.webp', caption: 'Budaya Batak di Tomok', category: 'Budaya' },
        { url: '/images/sumut/sumatra_panorama.webp', caption: 'Panorama Alam Sumatera', category: 'Alam' },
        { url: '/images/home/tour.webp', caption: 'Resort Pinggir Danau Samosir', category: 'Akomodasi' },
    ];

    const testimonials = [
        { name: 'Budi Santoso', location: 'Jakarta', text: 'Liburan bersama keluarga jadi sangat berkesan. Supir ramah dan sabar.', image: null },
        { name: 'Siti Aminah', location: 'Surabaya', text: 'Harga transparan dan tidak ada pungutan liar. Pelayanan top banget!', image: null },
        { name: 'Ahmad Fauzi', location: 'Bandung', text: 'Pemandu sangat mengerti sejarah Batak, jadi tidak hanya wisata alam tapi juga edukasi.', image: null },
    ];

    const blogs = [
        { slug: '5-tempat-wajib-di-danau-toba', translated_title: '5 Tempat Wajib di Danau Toba', category: 'Destinasi', image_url: '/images/sumut/toba_hero.webp' },
        { slug: 'kuliner-halal-samosir', translated_title: 'Rekomendasi Kuliner Halal di Samosir', category: 'Kuliner', image_url: '/images/sumut/sumatra_panorama.webp' },
        { slug: 'tips-liburan-berastagi', translated_title: 'Tips Liburan Keluarga ke Berastagi', category: 'Tips', image_url: '/images/home/tour.webp' },
    ];

    const faqs = [
        {
            q: 'Bagaimana cara terbaik menuju Danau Toba dari Bandara Kualanamu (KNO)?',
            a: 'Cara terbaik dan paling nyaman adalah menggunakan layanan transfer private (armada premium dengan supir pribadi) yang disediakan oleh Sumatera Explore. Perjalanan darat memakan waktu sekitar 3.5 hingga 4 jam melalui jalan tol Medan-Tebing Tinggi, lalu dilanjutkan ke Parapat, pintu gerbang utama menuju Pulau Samosir.'
        },
        {
            q: 'Apakah makanan halal mudah ditemukan di sekitar Danau Toba?',
            a: 'Ya, sangat mudah. Di Parapat dan Pulau Samosir (terutama daerah wisata Tuk-tuk dan Tomok), terdapat banyak restoran Muslim lokal yang bersertifikat halal atau menyajikan menu ramah Muslim seperti ikan mas bakar, ayam penyet, dan masakan khas Minang/Padang. Supir dan pemandu Sumatera Explore akan selalu mengarahkan Anda ke tempat makan halal pilihan.'
        },
        {
            q: 'Mata uang apa yang digunakan, dan apakah kartu kredit diterima?',
            a: 'Mata uang resmi yang digunakan adalah Rupiah Indonesia (IDR). Di kota besar seperti Medan, kartu kredit/debit internasional diterima secara luas. Namun, di sekitar Danau Toba, disarankan membawa uang tunai Rupiah untuk transaksi kecil di warung makan atau toko suvenir. Anda juga dapat melakukan pembayaran transfer bank internasional via Wise.'
        },
        {
            q: 'Kapan waktu terbaik untuk berkunjung ke Danau Toba?',
            a: 'Danau Toba indah sepanjang tahun karena iklimnya yang sejuk di dataran tinggi. Waktu terbaik adalah antara bulan Mei hingga September saat curah hujan cenderung lebih rendah, memberikan pemandangan langit yang cerah dan danau yang biru. Hindari musim liburan nasional jika Anda menyukai suasana yang tenang.'
        },
        {
            q: 'Apakah tersedia paket kustom (private tour) untuk rombongan keluarga?',
            a: 'Tentu saja! Semua paket wisata kami bersifat private dan dapat disesuaikan (customized) sepenuhnya sesuai keinginan Anda. Mulai dari pemilihan hotel premium, penyesuaian rute perjalanan, hingga akomodasi kebutuhan khusus untuk lansia atau anak-anak.'
        }
    ];

    const pSEOCities = ['Jakarta', 'Surabaya', 'Bandung', 'Bali', 'Batam', 'Palembang', 'Makassar', 'Semarang', 'Yogyakarta', 'Kuala Lumpur', 'Singapore', 'Penang', 'Pekanbaru', 'Padang', 'Malaysia'];

    return (
        <main>
            <h1 className="sr-only">Sumatera Explore — Paket Wisata Danau Toba & Sumatera Utara</h1>

            <HomeSlider />

            {/* Kenapa Memilih Sumatera Explore */}
            <section className="py-6 md:py-10 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-toba-green/30 hover:bg-green-50/40 transition duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-toba-green/10 text-toba-green flex items-center justify-center shrink-0 group-hover:bg-toba-green group-hover:text-white transition duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-2xl">badge</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">Pemandu Asli Danau Toba</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Lahir & tumbuh di Danau Toba, menguasai sejarah, kearifan Batak, dan spot tersembunyi.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-toba-green/30 hover:bg-green-50/40 transition duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-toba-green/10 text-toba-green flex items-center justify-center shrink-0 group-hover:bg-toba-green group-hover:text-white transition duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-2xl">directions_car</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">Armada Bersih & Prima</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Kendaraan ber-AC sejuk, terawat rutin, dengan driver andal rute perbukitan Sumatera.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-toba-green/30 hover:bg-green-50/40 transition duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-toba-green/10 text-toba-green flex items-center justify-center shrink-0 group-hover:bg-toba-green group-hover:text-white transition duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">Harga Jujur & Transparan</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Tanpa pungutan tersembunyi. Tiket wisata, akomodasi, dan rincian fasilitas tertulis jelas.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-toba-green/30 hover:bg-green-50/40 transition duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-toba-green/10 text-toba-green flex items-center justify-center shrink-0 group-hover:bg-toba-green group-hover:text-white transition duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-2xl">support_agent</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">Fleksibel & Konsultasi Ramah</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Bebas custom jadwal untuk keluarga, rombongan, atau gathering. Siap bantu 24/7 via WhatsApp.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Packages */}
            <section className="py-6 md:py-8 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 md:mb-8 gap-6">
                        <div className="max-w-xl">
                            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-toba-green mb-3">
                                <span className="w-6 h-px bg-toba-green"></span>Paket Pilihan
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">Pilihan Liburan Terbaik</h2>
                            <p className="text-slate-600 text-sm md:text-base mt-3 leading-relaxed">Geser untuk menjelajahi destinasi terkurasi di seluruh Sumatera Utara.</p>
                        </div>
                    </div>
                </div>

                <HorizontalScrollStrip>
                    {dummyPackages.map((pkg, i) => (
                        <PackageCard key={i} pkg={pkg} />
                    ))}
                </HorizontalScrollStrip>
            </section>

            {/* Gallery Showcase */}
            <section className="bg-slate-900 py-6 md:py-8 overflow-hidden">
                <div className="max-w-7xl mx-auto px-5 md:px-8 mb-5 md:mb-7 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-toba-orange mb-3">
                            <span className="w-6 h-px bg-toba-orange"></span>Galeri Destinasi
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                            Kenangan Nyata dari Toba
                        </h2>
                    </div>
                    <Link href="/tour/gallery" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-toba-orange hover:border-toba-orange transition duration-300 group">
                        <span className="material-symbols-outlined text-[16px]">photo_library</span>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Lihat Semua</span>
                        <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                <HorizontalScrollStrip itemWidthClass="w-[220px] sm:w-[250px] md:w-[280px]">
                    {gallerySlides.map((slide, i) => (
                        <div key={i} className="group/card py-2 h-full">
                            <div className="relative h-64 md:h-72 rounded-2xl overflow-hidden shadow-lg border border-white/10 transition-all duration-500 ease-out group-hover/card:shadow-2xl group-hover/card:shadow-black/50 group-hover/card:-translate-y-2">
                                <img src={slide.url} alt={slide.caption} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover/card:scale-105" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                                    <span className="inline-block px-2.5 py-0.5 bg-toba-orange text-white text-[9px] font-bold uppercase tracking-wider rounded-full mb-1.5 w-fit shadow-sm">{slide.category}</span>
                                    <p className="text-white text-[13px] font-semibold leading-snug line-clamp-2">{slide.caption}</p>
                                </div>
                                <div className="absolute top-3 left-3 z-10 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-sm">
                                    <span className="text-white text-[10px] font-bold">{(i + 1).toString().padStart(2, '0')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </HorizontalScrollStrip>
            </section>

            {/* Testimonials */}
            <section className="py-6 md:py-8 bg-slate-50/50 border-t border-b border-slate-100 overflow-hidden">
                <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-toba-green mb-3">
                        <span className="w-6 h-px bg-toba-green"></span>Testimoni Wisatawan<span className="w-6 h-px bg-toba-green"></span>
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                        Apa Kata Mereka Tentang Sumatera Explore?
                    </h2>
                </div>

                <HorizontalScrollStrip itemWidthClass="w-[300px] sm:w-[360px] md:w-[420px]" showArrows={false}>
                    {testimonials.map((t, i) => (
                        <figure key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 flex flex-col h-full">
                            <svg className="w-8 h-8 text-toba-green/15 shrink-0 mb-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M9.5 5C6.46 5 4 7.46 4 10.5c0 2.76 2.24 5 5 5 .17 0 .34-.01.5-.03V16c0 1.66-1.34 3-3 3v3c3.31 0 6-2.69 6-6v-5.5C12.5 7.46 10.04 5 9.5 5zm10 0C16.46 5 14 7.46 14 10.5c0 2.76 2.24 5 5 5 .17 0 .34-.01.5-.03V16c0 1.66-1.34 3-3 3v3c3.31 0 6-2.69 6-6v-5.5C22.5 7.46 20.04 5 19.5 5z"/>
                            </svg>
                            <blockquote className="max-h-32 overflow-y-auto pr-2 text-slate-700 text-sm md:text-[15px] leading-relaxed font-medium">
                                {t.text}
                            </blockquote>
                            <div className="flex items-center gap-1 text-amber-400 mt-5">
                                {[...Array(5)].map((_, idx) => (
                                    <svg key={idx} className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                ))}
                            </div>
                            <figcaption className="flex items-center gap-3.5 mt-5 pt-5 border-t border-slate-100">
                                <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0 ring-2 ring-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                    {t.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 leading-tight truncate">{t.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5 font-medium truncate">{t.location}</p>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </HorizontalScrollStrip>
            </section>

            {/* Specialist Banner */}
            <section className="py-6 md:py-8 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
                            <div className="w-14 h-14 rounded-full bg-slate-700 ring-2 ring-toba-green/50 shrink-0 flex items-center justify-center text-white text-xl">
                                S
                            </div>
                            <div>
                                <p className="text-white font-bold text-base md:text-lg leading-tight">Sarah Anggraini</p>
                                <p className="text-slate-300 text-xs md:text-sm font-medium mt-1">Ada pertanyaan? Saya bersedia membantu merancang liburan impian anda.</p>
                            </div>
                        </div>
                        <a href={`https://wa.me/6282166889988?text=Halo Sarah`} target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-2.5 px-6 py-3 bg-toba-green hover:bg-green-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md shrink-0 transform hover:scale-105">
                            <span>WHATSAPP</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Blogs */}
            <section className="py-6 md:py-8 max-w-7xl mx-auto px-5 md:px-8 bg-slate-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 md:mb-8 gap-4">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-toba-green mb-3">
                            <span className="w-6 h-px bg-toba-green"></span>Cerita
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">Jurnal Perjalanan</h2>
                    </div>
                    <Link href="/tour/blog" className="text-[11px] font-bold uppercase tracking-widest text-toba-green underline underline-offset-8 shrink-0">Lihat Semua Cerita</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {blogs.map((blog, i) => (
                        <Link key={i} href={`/tour/blog/${blog.slug}`} className="group block focus-visible:outline-none rounded-[1.5rem] p-4 bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                            <div className="aspect-[16/10] overflow-hidden rounded-xl mb-5 shadow-sm bg-slate-100">
                                <img src={blog.image_url} alt={blog.translated_title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                            </div>
                            <span className="font-sans text-[10px] text-toba-green bg-toba-green/10 px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-4 inline-block">{blog.category}</span>
                            <h3 className="font-sans text-[20px] md:text-[22px] group-hover:text-toba-green transition-colors duration-300 font-bold leading-tight tracking-tight">{blog.translated_title}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="py-6 md:py-8 bg-slate-50 border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-5">
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Pertanyaan Umum</h2>
                        <div className="w-12 h-0.5 bg-toba-green mx-auto"></div>
                    </div>
                    <FaqAccordion faqs={faqs} />
                </div>
            </section>

            {/* Cinema CTA */}
            <section className="py-6 md:py-8 px-5 md:px-8 bg-slate-50">
                <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2rem] md:rounded-[4rem] p-8 md:p-24 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-40">
                        <img src="/images/sumut/sumatra_panorama.webp" alt="Sumatra Panorama" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/60 to-transparent"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-toba-green/10 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-toba-green/10 rounded-full blur-[120px]"></div>

                    <div className="relative z-10 text-center lg:text-left max-w-4xl">
                        <h2 className="text-2xl sm:text-4xl md:text-7xl font-bold text-white mb-5 md:mb-8 tracking-tight leading-[1.1] md:leading-[0.95]">
                            Siap Untuk <br/> <span className="text-white">Petualangan Nyata?</span>
                        </h2>
                        <p className="text-base md:text-xl text-slate-300 mb-5 md:mb-7 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Bergabunglah dengan <span className="text-white font-bold">1.500+</span> wisatawan lainnya yang telah menemukan keindahan Sumatera Utara bersama kami.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                            <Link href="/tour/packages" className="bg-white text-slate-900 px-8 py-4 md:px-12 md:py-6 rounded-2xl md:rounded-[2rem] font-bold text-sm uppercase tracking-[0.2em] hover:bg-toba-green hover:text-white transition duration-500 shadow-2xl flex items-center gap-3 group">
                                <span>Pesan Paket Sekarang</span>
                                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Links */}
            <section className="py-8 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Populer: Paket Wisata dari Berbagai Kota</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {pSEOCities.map((city, i) => (
                            <Link key={i} href={`/tour/packages?origin=${city.toLowerCase()}`} className="text-[11px] text-slate-500 hover:text-toba-green transition-colors">
                                Paket Wisata Danau Toba dari {city}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
