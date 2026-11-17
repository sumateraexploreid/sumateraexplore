"use client";

import React, { useState, useEffect } from "react";
import BlogClient from "./BlogClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BlogCardSkeleton } from "@/components/Skeleton";
import type { BlogPost } from "@/data/blog";

interface BlogWrapperProps {
  posts: BlogPost[];
}

export default function BlogWrapper({ posts }: BlogWrapperProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <ErrorBoundary>
      {!hydrated ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <BlogClient posts={posts} />
      )}
    </ErrorBoundary>
  );
}