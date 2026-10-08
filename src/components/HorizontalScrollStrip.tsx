"use client";

import React, { useRef, useState, useEffect } from 'react';

interface HorizontalScrollStripProps {
    children: React.ReactNode;
    itemWidthClass?: string;
    showArrows?: boolean;
}

export default function HorizontalScrollStrip({ children, itemWidthClass = 'w-[260px] sm:w-[280px] md:w-[310px]', showArrows = true }: HorizontalScrollStripProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollPercent, setScrollPercent] = useState(0);

    const onDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        if (!scrollRef.current) return;
        
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setStartX(clientX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const x = clientX - scrollRef.current.offsetLeft;
        const walk = (x - startX); // scroll speed can be multiplied here if desired
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const onUp = () => {
        setIsDragging(false);
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const max = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        setScrollPercent(max > 0 ? (scrollRef.current.scrollLeft / max) * 100 : 0);
    };

    const scrollPrev = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
        }
    };

    const scrollNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group/strip">
            {showArrows && (
                <>
                    <button onClick={scrollPrev} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/50 backdrop-blur-md border border-slate-200 rounded-full items-center justify-center text-slate-700 hover:bg-toba-green hover:text-white transition duration-300 shadow-lg opacity-60 hover:opacity-100">
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    <button onClick={scrollNext} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/50 backdrop-blur-md border border-slate-200 rounded-full items-center justify-center text-slate-700 hover:bg-toba-green hover:text-white transition duration-300 shadow-lg opacity-60 hover:opacity-100">
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                </>
            )}

            <div 
                ref={scrollRef}
                onMouseDown={onDown}
                onMouseMove={onMove}
                onMouseUp={onUp}
                onMouseLeave={onUp}
                onTouchStart={onDown}
                onTouchMove={onMove}
                onTouchEnd={onUp}
                onScroll={handleScroll}
                className={`flex items-start gap-6 overflow-x-auto scroll-smooth px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-4 no-scrollbar select-none snap-x snap-mandatory overscroll-x-contain ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                {React.Children.map(children, (child) => (
                    <div className={`flex-shrink-0 snap-start ${itemWidthClass}`}>
                        {child}
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
                <div className="h-[3px] w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="h-full bg-toba-green rounded-full absolute left-0 top-0 transition duration-150"
                         style={{ width: `${scrollPercent}%` }}></div>
                </div>
            </div>
        </div>
    );
}
