"use client";

import React, { useState, useEffect } from "react";
import GalleryClient from "./GalleryClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GalleryCardSkeleton } from "@/components/Skeleton";

interface GalleryWrapperProps {
  images: {
    id: number;
    image_url: string;
    caption: string;
    category: string;
    type?: string;
    slug?: string;
  }[];
}

export default function GalleryWrapper({ images }: GalleryWrapperProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <ErrorBoundary>
      {!hydrated ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GalleryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <GalleryClient images={images} />
      )}
    </ErrorBoundary>
  );
}