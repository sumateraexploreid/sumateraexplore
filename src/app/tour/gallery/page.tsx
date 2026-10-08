import React from 'react';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Galeri Foto Wisata - Sumatera Explore',
  description: 'Koleksi momen perjalanan dan foto-foto eksklusif wisata Danau Toba, Samosir, dan destinasi Sumatera Utara lainnya.',
};

export default function GalleryPage() {
    const images = [
        {
            id: 1,
            image_url: '/images/sumut/toba_hero.webp',
            caption: 'Keindahan Danau Toba di pagi hari',
            category: 'Danau Toba',
            type: 'package',
            slug: 'danau-toba-3-hari-2-malam'
        },
        {
            id: 2,
            image_url: '/images/home/tour.webp',
            caption: 'Budaya Batak di Tomok',
            category: 'Budaya'
        },
        {
            id: 3,
            image_url: '/images/sumut/sumatra_panorama.webp',
            caption: 'Panorama Alam Sumatera',
            category: 'Alam',
            type: 'package',
            slug: 'berastagi-tangkahan-3-hari'
        },
        {
            id: 4,
            image_url: '/images/home/tour.webp',
            caption: 'Eksplorasi Hutan',
            category: 'Alam'
        },
        {
            id: 5,
            image_url: '/images/sumut/toba_hero.webp',
            caption: 'Kesenian Tradisional',
            category: 'Budaya'
        },
        {
            id: 6,
            image_url: '/images/sumut/sumatra_panorama.webp',
            caption: 'Resort Pinggir Danau Samosir',
            category: 'Akomodasi'
        }
    ];

    return (
        <GalleryClient images={images} />
    );
}
