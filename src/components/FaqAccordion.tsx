import React from "react";

interface FaqProps {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqProps[] }) {
  return (
    <div className="divide-y divide-rule border-y border-rule">
      {faqs.map((faq, index) => (
        <details key={faq.q} open={index === 0} className="group">
          <summary className="list-none cursor-pointer w-full py-5 flex justify-between items-center gap-4 text-left text-ink hover:text-accent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-focus">
            <span className="font-display text-lg leading-snug">{faq.q}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180 group-open:text-accent"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div className="pb-5">
            <p className="text-sm text-ink-2 leading-relaxed">{faq.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
