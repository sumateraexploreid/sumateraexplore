import React from "react";
import BlogWrapper from "./BlogWrapper";
import { getLiveBlogs } from "@/lib/cms";

export const metadata = {
  title: "Jurnal Rute, Ferry & Kuliner Halal Danau Toba | Sumatera Explore",
  description:
    "Panduan lengkap rute darat Bandara Kualanamu ke Berastagi dan Danau Toba, penyeberangan ferry Samosir, kuliner halal Medan, serta persiapan trip 2D1N sampai 5D4N.",
};

export async function generateStaticParams() {
  // Ensures this page is statically generated at build time
  return [];
}

export default async function BlogPage() {
  const posts = await getLiveBlogs();
  return <BlogWrapper posts={posts} />;
}
