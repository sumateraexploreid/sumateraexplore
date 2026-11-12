"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { LegalDocumentItem } from "@/data/business";

export default function LegalDocumentProof({
  documents,
  compact = false,
}: {
  documents: LegalDocumentItem[];
  compact?: boolean;
}) {
  const [activeDoc, setActiveDoc] = useState<LegalDocumentItem | null>(null);

  useEffect(() => {
    if (!activeDoc) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDoc(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDoc]);

  return (
    <>
      <div
        className={
          compact
            ? "grid grid-cols-2 gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 gap-6"
        }
      >
        {documents.map((doc) => (
          <figure
            key={doc.id}
            className="border-t border-rule pt-3 flex flex-col justify-between gap-2"
          >
            <div>
              <div
                onClick={() => setActiveDoc(doc)}
                className="relative aspect-[5/7] w-full overflow-hidden rounded-card bg-paper-2 border border-rule cursor-pointer hover:border-accent transition-colors duration-200"
              >
                <Image
                  src={doc.image}
                  alt={doc.alt}
                  fill
                  sizes="(max-width: 768px) 45vw, 240px"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="pt-2.5">
                <span
                  className={`block font-semibold text-ink ${
                    compact ? "text-xs leading-snug" : "text-sm leading-snug"
                  }`}
                >
                  {doc.title}
                </span>
                {!compact && (
                  <span className="mt-1 block text-xs text-muted leading-snug">
                    {doc.subtitle}
                  </span>
                )}
              </figcaption>
            </div>

            <button
              type="button"
              onClick={() => setActiveDoc(doc)}
              className="se-text-link self-start text-accent"
            >
              Perbesar dokumen
            </button>
          </figure>
        ))}
      </div>

      {activeDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-doc-modal-title"
          className="fixed inset-0 z-[400] flex items-center justify-center p-3 sm:p-4 bg-paper/95"
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-paper-2 border border-rule rounded-card p-4 md:p-6 space-y-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  id="legal-doc-modal-title"
                  className="font-display text-base sm:text-lg text-ink"
                >
                  {activeDoc.title}
                </h3>
                <p className="text-xs text-muted mt-0.5">{activeDoc.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                aria-label="Tutup pratinjau dokumen"
                className="se-text-link px-2 text-ink shrink-0"
              >
                Tutup
              </button>
            </div>

            <div className="relative aspect-[5/7] w-full overflow-hidden border border-rule bg-paper">
              <Image
                src={activeDoc.image}
                alt={activeDoc.alt}
                fill
                sizes="(max-width: 768px) 95vw, 672px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
