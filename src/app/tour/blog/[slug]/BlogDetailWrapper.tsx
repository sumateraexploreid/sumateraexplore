"use client";

import React from "react";
import Image from "next/image";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { BlogPost } from "@/data/blog";

interface BlogDetailContentProps {
  post: BlogPost;
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="se-article">
      <header className="se-article-header">
        <nav aria-label="Breadcrumb" className="se-breadcrumb">
          <a href="/">Beranda</a>
          <span aria-hidden="true">/</span>
          <a href="/tour/blog">Jurnal</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{post.title}</span>
        </nav>

        <div className="se-article-meta">
          <span className="se-chip se-chip--category">{post.category}</span>
          <time dateTime={post.createdAt} className="text-sm text-muted">
            {formatDate(post.createdAt)}
          </time>
          {post.readTime && (
            <>
              <span aria-hidden="true" className="text-muted mx-2">·</span>
              <span className="text-sm text-muted">{post.readTime}</span>
            </>
          )}
        </div>

        <h1 className="se-article-title">{post.title}</h1>

        <figure className="se-article-hero">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover rounded-card"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </figure>

        {post.tags.length > 0 && (
          <div className="se-article-tags" role="list" aria-label="Tag artikel">
            {post.tags.map((tag) => (
              <span key={tag} className="se-tag" role="listitem">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="se-article-body grid gap-12 lg:grid-cols-[1fr_280px]">
        <div className="se-article-content prose prose-invert max-w-none">
          {post.sections.map((section, idx) => (
            <section key={section.heading} className="se-article-section" aria-labelledby={`section-${idx}`}>
              <h2 id={`section-${idx}`} className="se-article-heading">
                {section.heading}
              </h2>
              <div className="se-article-paragraphs space-y-4">
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-base leading-relaxed text-ink-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <div className="se-article-footer mt-12 pt-8 border-t border-rule">
            <h3 className="font-display text-xl text-ink mb-4">Paket Terkait</h3>
            <a
              href={`/tour/${post.relatedPackageSlug}`}
              className="inline-flex items-center gap-2 text-accent hover:text-ink font-medium"
            >
              Lihat paket <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <aside className="se-article-sidebar hidden lg:block" aria-label="Navigasi artikel">
          <nav className="sticky top-24 space-y-2 bg-paper-2 rounded-card p-4" aria-label="Daftar isi">
            <h3 className="font-semibold text-ink mb-3 px-2">Daftar Isi</h3>
            <ul className="space-y-1" role="list">
              {post.sections.map((section, idx) => (
                <li key={idx}>
                  <a
                    href={`#section-${idx}`}
                    className="block px-2 py-1.5 text-sm text-ink-2 hover:text-accent rounded-sm transition-colors"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <footer className="se-article-share mt-12 pt-8 border-t border-rule">
        <h3 className="font-display text-lg text-ink mb-4">Bagikan artikel ini</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${post.title}\nhttps://sumateraexplore.my.id/tour/blog/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="se-btn se-btn--wa"
            aria-label="Bagikan ke WhatsApp"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.454.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.67m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378 3.392 3.392 0 0 1-.764-.54 26.66 26.66 0 0 0-.32-.9c-.186-.393-.646-.846-.834-.979-.198-.149-.37-.198-.595-.099-.21.098-.334.262-.488.5-.138.223-.197.411-.306.644-.097.207-.334.37-.36.657-.012.123 1.079 3.43 1.474 4.274.15.315.335.595.335.945 0 .262-.097.539-.335.815-.283.334-.73.583-.89.764-.225.25-.54.51-.723.59-.28.13-.533.16-.95.098-.626-.095-1.26-.322-1.784-.52-.78-.296-1.45-.716-1.99-1.2-.51-.458-.86-.89-.86-1.363 0-.249.13-.536.23-.67.097-.133.324-.23.547-.347.225-.116.533-.262.71-.346.173-.085.334-.208.411-.47.075-.263.075-.527.01-.67-.064-.132-.526-.78-.815-1.41-.36-.78-.72-1.56-.72-1.886 0-.225.074-.424.235-.67.148-.224.497-.578 1.195-1.22.502-.455 1.145-.795 1.485-.972.32-.17.654-.272 1.067-.272.15 0 .284.02.38.074l-.05.286a.36.36 0 0 1-.2.332.74.74 0 0 0-.467.198c-.283.148-1.048.865-1.475 1.78-.427.914-.66 1.947-.66 2.347 0 .334.097.594.174.792.134.334.411.883.695 1.18.173.197.47.489.67.574.186.098.398.098.617.039.149-.039.262-.118.373-.272.11-.15.334-.458.67-1.067l.173-.326.502.523c.64.73 1.678 2.27 2.12 3.174.44.902.55 1.94.44 2.266-.004.162-.02.42-.272.52-.298.097-.968.374-1.675.374-.394 0-.669-.106-.89-.333M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.011L0 24l5.756-1.82A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://sumateraexplore.my.id/tour/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="se-btn se-btn--fb"
            aria-label="Bagikan ke Facebook"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.775 0H5.225C2.344 0 0 2.344 0 5.225v13.55C0 21.656 2.344 24 5.225 24h8.327v-9.804H9.712v-3.965h3.835V13.37c0-1.178.034-2.312 2.25-2.312H20V7.558c0-.592-.025-1.186-.176-1.761H16.77c-1.07 0-1.64.644-1.64 1.64v2.7h4.1l-.55 3.965H14.32V24h5.455C21.656 24 24 21.656 24 18.775V5.225C24 2.344 21.656 0 18.775 0z"/></svg>
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=https://sumateraexplore.my.id/tour/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="se-btn se-btn--tw"
            aria-label="Bagikan ke X (Twitter)"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.308.527L10.847 13.105l-4.88 5.32L.75 21.75l6.306-7.424 2.312 2.312L12 18.055l8.244-1.805z"/></svg>
            X
          </a>
          <button
            className="se-btn se-btn--copy"
            onClick={() => navigator.clipboard.writeText(`https://sumateraexplore.my.id/tour/blog/${post.slug}`)}
            aria-label="Salin tautan artikel"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Salin Link
          </button>
        </div>
      </footer>
    </article>
  );
}

export function BlogDetailWrapper({ post }: BlogDetailContentProps) {
  return (
    <ErrorBoundary>
      <BlogDetailContent post={post} />
    </ErrorBoundary>
  );
}