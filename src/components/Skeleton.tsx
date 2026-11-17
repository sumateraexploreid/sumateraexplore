"use client";

import React from "react";
import Link from "next/link";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  animation?: "pulse" | "wave";
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseStyles = `
    bg-gradient-to-r from-paper-2 via-paper-3 to-paper-2
    bg-[length:200%_100%]
    ${animation === "pulse" ? "animate-pulse" : "animate-[shimmer_1.5s_infinite]"}
    rounded
  `;

  const variantStyles = {
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded-card",
  };

  const sizeStyles = `
    ${width ? `w-${width}` : "w-full"}
    ${height ? `h-${height}` : variant === "text" ? "h-4" : ""}
  `;

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles} ${className}`}
      aria-hidden="true"
      role="status"
      aria-label="Memuat konten"
    />
  );
}

export function PackageCardSkeleton() {
  return (
    <article className="flex flex-col h-full border-b border-rule pb-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-paper-2">
        <Skeleton variant="rectangular" className="w-full h-full" />
      </div>
      <div className="flex flex-col flex-grow pt-3 sm:pt-4">
        <div className="flex items-start justify-between gap-1.5 sm:gap-3">
          <div className="min-w-0 flex-1">
            <Skeleton variant="text" width="3/4" className="mb-2" />
            <Skeleton variant="text" width="1/2" />
          </div>
          <Skeleton variant="circular" width="11" height="11" />
        </div>
        <Skeleton variant="text" width="2/3" className="mt-2" />
        <div className="mt-4 border-t border-rule pt-3">
          <Skeleton variant="text" width="1/3" className="mb-2" />
          <div className="space-y-2">
            <Skeleton variant="text" width="1/2" />
            <Skeleton variant="text" width="1/3" />
          </div>
        </div>
        <div className="mt-auto pt-3 sm:pt-4 border-t border-rule">
          <div className="flex flex-wrap items-baseline justify-between gap-1 sm:gap-2 mb-2.5 sm:mb-3">
            <Skeleton variant="text" width="1/4" />
            <Skeleton variant="text" width="1/3" className="text-right" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-4">
            <Skeleton variant="rectangular" height="11" className="h-11" />
            <Skeleton variant="rectangular" height="11" className="h-11" />
          </div>
          <Skeleton variant="rectangular" height="11" className="w-full h-11" />
        </div>
      </div>
    </article>
  );
}

export function BlogCardSkeleton() {
  return (
    <article className="flex flex-col border-b border-rule pb-6">
      <Link href="#" className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-paper-2">
          <Skeleton variant="rectangular" className="w-full h-full" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between pt-4">
        <div>
          <Skeleton variant="text" width="3/4" className="mb-2" />
          <Skeleton variant="text" width="1/2" className="text-sm" />
          <Skeleton variant="text" width="full" className="mt-3 text-sm line-clamp-3" />
        </div>
        <Skeleton variant="rectangular" height="10" className="mt-5 min-h-[44px]" />
      </div>
    </article>
  );
}

export function GalleryCardSkeleton() {
  return (
    <figure className="flex flex-col border-b border-rule pb-5">
      <button className="block w-full aspect-[4/3] overflow-hidden rounded-card bg-paper-2">
        <Skeleton variant="rectangular" className="w-full h-full" />
      </button>
      <figcaption className="flex flex-1 flex-col justify-between gap-2 pt-4">
        <div>
          <Skeleton variant="text" width="3/4" className="mb-1" />
          <Skeleton variant="text" width="1/2" className="text-sm" />
        </div>
        <Skeleton variant="rectangular" height="10" className="min-h-[44px]" />
      </figcaption>
    </figure>
  );
}

export function AdminTableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-paper-2/50 border-b border-rule/50">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" className={i === 0 ? "col-span-4" : i === 1 ? "col-span-3" : "col-span-5"} />
      ))}
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-paper-2 border border-rule rounded-card p-6">
      <Skeleton variant="text" width="1/3" className="mb-2" />
      <Skeleton variant="text" width="2/3" className="text-3xl font-bold" />
    </div>
  );
}

export function BlogDetailSkeleton() {
  return (
    <article className="se-article">
      <header className="se-article-header">
        <Skeleton variant="text" width="1/2" className="mb-4" />
        <Skeleton variant="text" width="1/4" className="mb-2" />
        <Skeleton variant="text" width="3/4" className="mb-4 text-2xl" />
        <Skeleton variant="rectangular" className="w-full aspect-[16/9] mb-4" />
      </header>
      <div className="se-article-body grid gap-12 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <section key={i} className="space-y-4">
              <Skeleton variant="text" width="1/3" className="text-xl" />
              <Skeleton variant="text" width="full" className="h-8" />
              <Skeleton variant="text" width="full" className="h-8" />
            </section>
          ))}
        </div>
        <aside className="hidden lg:block">
          <Skeleton variant="rectangular" className="sticky top-24 h-64" />
        </aside>
      </div>
    </article>
  );
}