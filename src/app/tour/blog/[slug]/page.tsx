import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = dummyPosts.find(p => p.slug === params.slug);
    if (!post) return { title: 'Not Found' };
    
    return {
        title: `${post.title} - Sumatera Explore`,
        description: post.excerpt,
    };
}

const dummyPosts = [
    {
        id: '1', slug: 'pesona-danau-toba-yang-wajib-dikunjungi',
        title: 'Pesona Danau Toba yang Wajib Dikunjungi Sekali Seumur Hidup',
        excerpt: 'Danau Toba bukan sekadar danau vulkanik terbesar di dunia, tapi juga pusat kebudayaan Batak yang kaya sejarah dan keindahan alam.',
        content: `Danau Toba adalah salah satu keajaiban alam dunia yang terletak di Provinsi Sumatera Utara. Membentang sepanjang 100 kilometer dan lebar 30 kilometer, danau ini merupakan danau vulkanik terbesar di dunia. \n\nKeindahannya tidak hanya terletak pada bentang alamnya yang memukau dengan perbukitan hijau yang mengelilinginya, tetapi juga kekayaan budaya Batak Toba yang sangat kental. Saat mengunjungi Danau Toba, Anda wajib singgah di Pulau Samosir yang terletak tepat di tengah-tengah danau. Di sana, Anda bisa mengunjungi Desa Tomok untuk melihat Makam Raja Sidabutar, atau ke Huta Siallagan untuk melihat batu persidangan peninggalan masa lampau.\n\nJangan lewatkan juga menikmati kuliner khas seperti Ikan Mas Arsik atau Mie Gomak sambil memandangi hamparan air danau yang tenang. Waktu terbaik mengunjungi Danau Toba adalah pada bulan Mei hingga September saat cuaca sedang cerah.`,
        category: 'Destinasi',
        image_url: '/images/sumut/sumatra_panorama.webp',
        createdAt: '2025-06-15T08:00:00Z',
        tags: ['Danau Toba', 'Samosir', 'Budaya Batak', 'Liburan']
    },
    {
        id: '2', slug: 'kuliner-khas-medan-halal',
        title: '5 Kuliner Khas Medan Halal yang Wajib Dicoba',
        excerpt: 'Berwisata ke Sumatera Utara kurang lengkap tanpa mencicipi kulinernya. Berikut rekomendasi makanan halal di Medan.',
        content: `Medan dikenal sebagai surga kuliner di Indonesia. Bagi wisatawan muslim, mencari makanan halal yang lezat di Medan sangatlah mudah. Berikut adalah 5 kuliner khas Medan yang halal dan wajib Anda coba saat berkunjung:\n\n1. Lontong Medan\nBerbeda dengan lontong sayur pada umumnya, Lontong Medan memiliki kuah santan yang lebih kaya bumbu dengan tambahan tauco, ikan teri, dan bihun.\n\n2. Mie Gomak\nSering disebut sebagai spaghettinya orang Batak. Mie berukuran besar ini disajikan dengan kuah santan kuning yang kaya akan bumbu andaliman yang memberikan sensasi getir di lidah.\n\n3. Soto Medan\nCiri khas Soto Medan adalah kuah santannya yang kental dan berwarna kuning kehijauan. Biasanya disajikan dengan suwiran ayam atau daging sapi.\n\n4. Durian Ucok\nBelum ke Medan rasanya kalau belum makan durian. Kedai Durian Ucok buka 24 jam dan menjamin kualitas durian yang manis dan legit.\n\n5. Kari Bihun Tabona\nKari bihun dengan kuah kaldu yang pekat dan irisan daging sapi yang sangat empuk. Sangat cocok dinikmati sebagai menu sarapan.`,
        category: 'Kuliner',
        image_url: '/images/home/tour.webp',
        createdAt: '2025-06-10T10:30:00Z',
        tags: ['Kuliner Medan', 'Makanan Halal', 'Soto Medan', 'Mie Gomak']
    },
    {
        id: '3', slug: 'tips-liburan-keluarga-ke-berastagi',
        title: 'Tips Liburan Keluarga yang Menyenangkan ke Berastagi',
        excerpt: 'Berastagi menawarkan udara sejuk dan wisata petik stroberi yang ramah anak. Ini tips agar liburan keluarga makin seru.',
        content: `Berastagi, dengan ketinggian sekitar 1.300 meter di atas permukaan laut, menawarkan cuaca sejuk yang menjadikannya destinasi favorit untuk liburan keluarga di Sumatera Utara. Berikut adalah beberapa tips agar liburan keluarga Anda di Berastagi semakin menyenangkan:\n\n1. Pilih Waktu Kunjungan yang Tepat\nHindari musim hujan (November-Januari) jika ingin bebas beraktivitas di luar ruangan. Datang pagi hari jika ingin melihat pemandangan Gunung Sinabung dan Sibayak tanpa tertutup kabut.\n\n2. Kunjungi Peternakan dan Kebun Stroberi\nAnak-anak pasti akan senang dengan aktivitas memetik stroberi langsung dari kebunnya atau mengunjungi Gundaling Farm untuk melihat pemerasan susu sapi segar.\n\n3. Bawa Pakaian Hangat\nSuhu di Berastagi bisa turun hingga 16 derajat Celcius di malam hari. Pastikan membawa jaket tebal, kaus kaki, dan pakaian hangat lainnya, terutama untuk anak-anak.\n\n4. Berburu Oleh-oleh di Pasar Buah\nPasar Buah Berastagi sangat terkenal dengan buah-buahan segar, bunga, dan sayuran. Jangan lupa mencoba markisa dan jeruk manis khas Berastagi.\n\n5. Kunjungi Taman Alam Lumbini\nLihat replika Pagoda Shwedagon Myanmar berlapis warna emas yang megah. Taman di sekelilingnya juga sangat indah dan tertata rapi.`,
        category: 'Tips Liburan',
        image_url: '/images/sumut/toba_hero.webp',
        createdAt: '2025-06-05T09:15:00Z',
        tags: ['Berastagi', 'Liburan Keluarga', 'Tips Travel', 'Gunung Sibayak']
    }
];

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
    const post = dummyPosts.find(p => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const relatedPosts = dummyPosts.filter(p => p.id !== post.id).slice(0, 3);
    const encodeUrl = `https://sumateraexplore.my.id/tour/blog/${post.slug}`;

    return (
        <div className="bg-slate-50 min-h-screen pb-14 font-sans text-slate-900 selection:bg-toba-green/20 selection:text-toba-green">

            {/* ====== IMMERSIVE CINEMATIC HERO ====== */}
            <div className="relative h-[55dvh] w-full overflow-hidden bg-slate-900">
                <img src={post.image_url} alt={post.title} fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 transition-transform duration-[20s]" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/20 to-transparent"></div>

                <div className="relative z-10 h-full max-w-5xl mx-auto px-5 md:px-8 flex flex-col justify-center pt-8">
                    <div className="animate-fade-in-up duration-1000">
                        <Link href="/tour/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-xs uppercase tracking-wider mb-8 transition group">
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-toba-green group-hover:border-toba-green transition">
                                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                            </div>
                            Kembali ke Jurnal
                        </Link>
                        
                        <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-5">
                            <Link href="/tour/blog" className="hover:text-white transition">Blog</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">{post.title}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-toba-green text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                {post.category}
                            </span>
                            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                {formatDate(post.createdAt)}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-sm">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ====== READING AREA ====== */}
            <div className="max-w-7xl mx-auto px-5 md:px-8 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

                    {/* Main article body */}
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-3xl p-6 md:p-14 shadow-sm border border-slate-200">
                            
                            {/* Author meta */}
                            <div className="flex items-center gap-4 mb-6 pb-8 border-b border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                                    S
                                </div>
                                <div>
                                    <p className="text-[9px] text-toba-green uppercase tracking-wider mb-0.5 font-bold">Ditulis Oleh</p>
                                    <p className="text-base font-bold text-slate-900 tracking-tight">Tim Redaksi Sumatera Explore</p>
                                </div>
                            </div>

                            {/* Article body */}
                            <div className="prose prose-lg md:prose-xl max-w-none break-words text-slate-700 leading-[1.8] tracking-[0.01em]">
                                {post.content.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4">{paragraph}</p>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="mt-6 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-200 cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Share bar */}
                            <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 tracking-tight mb-1">Bagikan Inspirasi Ini</h4>
                                    <p className="text-xs text-slate-500">Bantu orang lain menemukan petualangan impian mereka.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a href={`https://wa.me/?text=Baca%20artikel%20ini%20dari%20Sumatera%20Explore:%20${post.title}%20${encodeUrl}`} 
                                       target="_blank" rel="noopener noreferrer"
                                       className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition">
                                        <span className="material-symbols-outlined text-[18px]">whatsapp</span>
                                    </a>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-8 animate-fade-in-up duration-1000">
                            
                            {/* CTA Card (dark) */}
                            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl border border-white/5 relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-toba-green/20 rounded-full blur-[80px]"></div>
                                <div className="relative z-10">
                                    <span className="text-[10px] text-toba-green uppercase tracking-wider mb-4 block font-bold">Eksplorasi Sekarang</span>
                                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight leading-tight">
                                        Siap Untuk <br/>Menjelajah?
                                    </h3>
                                    <p className="text-slate-300 text-xs mb-8 leading-relaxed">
                                        Wujudkan cerita petualangan Anda sendiri. Pilih paket wisata yang paling sesuai dengan jiwa petualang Anda.
                                    </p>
                                    <Link href="/tour/packages" 
                                       className="w-full flex items-center justify-center gap-2 py-3.5 bg-toba-green text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-green-700 transition duration-300 shadow-md group">
                                        Lihat Paket Wisata
                                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Author box */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-4 font-bold">Penulis Resmi</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-toba-green/10 text-toba-green flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Sumatera Explore</p>
                                        <p className="text-[9px] text-toba-green uppercase tracking-wider font-bold">Editorial Team</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Kami berdedikasi untuk memberikan panduan perjalanan paling akurat dan inspiratif di Sumatera Utara.
                                </p>
                            </div>

                            {/* Quick links */}
                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-4 font-bold">Jelajahi</p>
                                <div className="space-y-2">
                                    <Link href="/tour/packages" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors group">
                                        <span className="text-xs text-slate-600 group-hover:text-slate-900 font-bold">Paket Wisata</span>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-toba-green text-sm transition-colors">arrow_forward</span>
                                    </Link>
                                    <Link href="/tour/gallery" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors group">
                                        <span className="text-xs text-slate-600 group-hover:text-slate-900 font-bold">Galeri Foto</span>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-toba-green text-sm transition-colors">arrow_forward</span>
                                    </Link>
                                    <Link href="/about" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors group">
                                        <span className="text-xs text-slate-600 group-hover:text-slate-900 font-bold">Tentang Kami</span>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-toba-green text-sm transition-colors">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ====== RELATED POSTS ====== */}
                {relatedPosts.length > 0 && (
                    <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-200">
                        <div className="flex items-center gap-3 mb-6 md:mb-6">
                            <span className="w-10 h-px bg-toba-green"></span>
                            <span className="text-[10px] font-bold text-toba-green uppercase tracking-[0.25em]">Inspirasi Lainnya</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {relatedPosts.map(rp => (
                                <Link key={rp.id} href={`/tour/blog/${rp.slug}`} className="group block">
                                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-5 border border-slate-200 shadow-sm">
                                        <img src={rp.image_url} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-5">
                                            <span className="text-[9px] text-white uppercase tracking-widest flex items-center gap-1 font-bold">
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                Baca Artikel
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-toba-green uppercase tracking-wider mb-2 block font-bold">{rp.category}</span>
                                        <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-toba-green transition-colors leading-tight tracking-tight line-clamp-2">
                                            {rp.title}
                                        </h4>
                                        <span className="text-xs text-slate-500 group-hover:text-toba-green transition flex items-center gap-1 font-bold">
                                            Selanjutnya
                                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
