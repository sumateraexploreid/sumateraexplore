import React from 'react';
import PackageDetailClient from './PackageDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pkg = dummyPackages.find(p => p.slug === slug);
    if (!pkg) return { title: 'Not Found' };
    
    return {
        title: `${pkg.name} - Sumatera Explore`,
        description: pkg.description,
    };
}

const dummyPackages = [
    {
        id: '1', slug: 'danau-toba-3-hari-2-malam', name: 'Danau Toba 3 Hari 2 Malam',
        duration: '3 Hari 2 Malam', locationTag: 'Danau Toba', price: 1500000,
        image_url: '/images/home/tour.webp',
        description: 'Paket wisata populer untuk menikmati keindahan Danau Toba dan budaya Batak di Samosir dalam waktu 3 hari 2 malam.',
        includes: ['Hotel Bintang 3', 'Transportasi AC', 'Makan sesuai jadwal', 'Tiket Masuk Wisata', 'Pemandu Lokal'],
        excludes: ['Tiket Pesawat', 'Pengeluaran Pribadi', 'Tipping', 'Asuransi Perjalanan'],
        itinerary: [
            { day: 1, title: 'Tiba di Kualanamu - Parapat', description: 'Penjemputan di bandara Kualanamu, perjalanan menuju Parapat via Pematang Siantar, makan malam dan istirahat di Parapat.' },
            { day: 2, title: 'Samosir Tour', description: 'Menyeberang ke Pulau Samosir, mengunjungi Tomok (Makam Raja Sidabutar) dan Ambarita (Kursi Batu Raja Siallagan). Kembali ke Parapat.' },
            { day: 3, title: 'Parapat - Kualanamu', description: 'Perjalanan kembali ke Medan/Kualanamu via rute Berastagi. Singgah di Air Terjun Sipiso-piso. Tour selesai.' }
        ]
    },
    {
        id: '2', slug: 'samosir-4-hari-3-malam', name: 'Eksplorasi Samosir 4 Hari',
        duration: '4 Hari 3 Malam', locationTag: 'Samosir', price: 2200000,
        image_url: '/images/sumut/toba_hero.webp',
        description: 'Lebih santai dan mendalam menjelajahi setiap sudut Pulau Samosir dengan menginap langsung di resort tepi danau.',
        includes: ['Resort Tepi Danau', 'Ferry Penyeberangan', 'Guide Lokal', 'Transportasi', 'Semua Tiket Masuk'],
        excludes: ['Tiket Pesawat', 'Pengeluaran Pribadi', 'Tipping'],
        itinerary: [
            { day: 1, title: 'Kualanamu - Samosir', description: 'Penjemputan dan perjalanan panjang menuju pelabuhan Tiga Ras, menyeberang langsung ke Samosir.' },
            { day: 2, title: 'Pusuk Buhit & Huta Siallagan', description: 'Eksplorasi budaya dan asal usul suku Batak di kaki Gunung Pusuk Buhit.' },
            { day: 3, title: 'Menikmati Danau Toba', description: 'Acara bebas, bisa bermain kayak atau bersantai menikmati panorama danau dari resort.' },
            { day: 4, title: 'Samosir - Kualanamu', description: 'Kembali ke bandara via penyeberangan Tomok-Ajibata.' }
        ]
    },
    {
        id: '3', slug: 'berastagi-tangkahan-3-hari', name: 'Berastagi & Tangkahan 3 Hari',
        duration: '3 Hari 2 Malam', locationTag: 'Berastagi', price: 1800000,
        image_url: '/images/sumut/sumatra_panorama.webp',
        description: 'Kombinasi dataran tinggi pegunungan Berastagi dengan wisata ekologi hutan Tangkahan melihat gajah.',
        includes: ['Penginapan Alam', 'Trekking Gajah', 'Air Panas Berastagi', 'Transportasi Jeep/Van'],
        excludes: ['Tiket Pesawat', 'Pengeluaran Pribadi'],
        itinerary: [
            { day: 1, title: 'Medan - Tangkahan', description: 'Perjalanan ke Tangkahan, memandikan gajah di sungai.' },
            { day: 2, title: 'Tangkahan - Berastagi', description: 'Perjalanan ke Berastagi, singgah di Pasar Buah.' },
            { day: 3, title: 'Berastagi - Kualanamu', description: 'Mengunjungi Pagoda Lumbini dan kembali ke bandara.' }
        ]
    },
    {
        id: '4', slug: 'bukit-lawang-2-hari', name: 'Jelajah Orangutan Bukit Lawang',
        duration: '2 Hari 1 Malam', locationTag: 'Bukit Lawang', price: 1200000,
        image_url: '/images/sumut/toba_hero.webp',
        description: 'Trekking singkat di Taman Nasional Gunung Leuser untuk melihat Orangutan Sumatera.',
        includes: ['Ecolodge', 'Jungle Trekking', 'Guide Hutan'],
        excludes: ['Tiket Pesawat'],
        itinerary: [
            { day: 1, title: 'Medan - Bukit Lawang', description: 'Tiba di Bukit Lawang, persiapan trekking.' },
            { day: 2, title: 'Jungle Trekking', description: 'Trekking mencari orangutan liar.' }
        ]
    },
    {
        id: '5', slug: 'medan-city-tour', name: 'Medan Heritage & Culinary Tour',
        duration: '1 Hari', locationTag: 'Medan', price: 500000,
        image_url: '/images/home/tour.webp',
        description: 'Keliling kota Medan menikmati peninggalan sejarah dan kulinernya yang legendaris.',
        includes: ['Transportasi VIP', 'Makan Siang', 'Tiket Masuk Maimun'],
        excludes: ['Penginapan'],
        itinerary: [
            { day: 1, title: 'City Tour', description: 'Istana Maimun, Masjid Raya, Tjong A Fie Mansion, Kuliner Durian.' }
        ]
    },
    {
        id: '6', slug: 'samosir-toba-5-hari', name: 'Premium Samosir & Toba 5 Hari',
        duration: '5 Hari 4 Malam', locationTag: 'Samosir, Toba', price: 3500000,
        image_url: '/images/sumut/sumatra_panorama.webp',
        description: 'Paket super lengkap dan mewah untuk mengelilingi seluruh penjuru Danau Toba.',
        includes: ['Resort Bintang 4', 'Kapal Pribadi', 'Makan Malam Seafood'],
        excludes: ['Tiket Pesawat'],
        itinerary: [
            { day: 1, title: 'KNO - Parapat', description: 'Menuju Parapat, check-in hotel mewah.' },
            { day: 2, title: 'Samosir Selatan', description: 'Jelajah sisi selatan Samosir.' },
            { day: 3, title: 'Samosir Utara', description: 'Jelajah sisi utara Samosir.' },
            { day: 4, title: 'Taman Simalem', description: 'Menginap di Taman Simalem Resort.' },
            { day: 5, title: 'Kepulangan', description: 'Kembali ke bandara KNO.' }
        ]
    }
];

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pkg = dummyPackages.find(p => p.slug === slug);

    if (!pkg) {
        notFound();
    }

    return (
        <PackageDetailClient pkg={pkg} />
    );
}
