"use client";

import React, { useState } from 'react';

interface FaqProps {
    q: string;
    a: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqProps[] }) {
    const [selected, setSelected] = useState<number | null>(1);

    return (
        <div className="space-y-2 md:space-y-4">
            {faqs.map((faq, index) => {
                const isOpen = selected === index + 1;
                return (
                    <div key={index} className="bg-white px-5 md:px-6 rounded-2xl border border-slate-100 shadow-xs transition-shadow hover:shadow-sm">
                        <button 
                            onClick={() => setSelected(isOpen ? null : index + 1)}
                            aria-expanded={isOpen}
                            className="w-full py-5 md:py-6 flex justify-between items-center gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-toba-green focus-visible:ring-offset-2"
                        >
                            <span className="text-[15px] md:text-[18px] text-slate-900 font-bold leading-snug">{faq.q}</span>
                            <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-toba-green' : 'text-slate-400'}`} aria-hidden="true">expand_more</span>
                        </button>
                        <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <p className="pb-5 md:pb-6 font-sans text-[14px] md:text-[16px] text-slate-600 leading-relaxed">
                                {faq.a}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
