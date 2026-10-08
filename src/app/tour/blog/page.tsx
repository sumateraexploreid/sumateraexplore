import React from 'react';
import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog & Inspirasi Wisata - Sumatera Explore',
  description: 'Tips, panduan, dan cerita menarik untuk rencana liburan Anda ke Sumatera Utara.',
};

export default function BlogPage() {
    const posts = [
        {
            id: 1,
            slug: 'pesona-danau-toba-yang-wajib-dikunjungi',
            title: 'Pesona Danau Toba yang Wajib Dikunjungi Sekali Seumur Hidup',
            excerpt: 'Danau Toba bukan sekadar danau vulkanik terbesar di dunia, tapi juga pusat kebudayaan Batak yang kaya sejarah dan keindahan alam.',
            category: 'Destinasi',
            image_url: '/images/sumut/sumatra_panorama.webp',
            createdAt: '2025-06-15T08:00:00Z'
        },
        {
            id: 2,
            slug: 'kuliner-khas-medan-halal',
            title: '5 Kuliner Khas Medan Halal yang Wajib Dicoba',
            excerpt: 'Berwisata ke Sumatera Utara kurang lengkap tanpa mencicipi kulinernya. Berikut rekomendasi makanan halal di Medan.',
            category: 'Kuliner',
            image_url: '/images/home/tour.webp',
            createdAt: '2025-06-10T10:30:00Z'
        },
        {
            id: 3,
            slug: 'tips-liburan-keluarga-ke-berastagi',
            title: 'Tips Liburan Keluarga yang Menyenangkan ke Berastagi',
            excerpt: 'Berastagi menawarkan udara sejuk dan wisata petik stroberi yang ramah anak. Ini tips agar liburan keluarga makin seru.',
            category: 'Tips Liburan',
            image_url: '/images/sumut/toba_hero.webp',
            createdAt: '2025-06-05T09:15:00Z'
        }
    ];

    return (
        <BlogClient posts={posts} />
    );
}
