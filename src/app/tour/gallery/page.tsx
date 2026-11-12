import React from "react";
import GalleryClient from "./GalleryClient";
import { getLiveGallery } from "@/lib/cms";

export const metadata = {
  title: "Galeri Foto Wisata - Sumatera Explore",
  description:
    "Koleksi momen perjalanan dan foto-foto eksklusif wisata Danau Toba, Samosir, dan destinasi Sumatera Utara lainnya.",
};

export default async function GalleryPage() {
  const images = await getLiveGallery();
  return <GalleryClient images={images} />;
}
