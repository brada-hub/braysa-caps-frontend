'use client';

import React from 'react';
import { ArrowDown, Flame, ShieldCheck, Sparkles, Truck } from 'lucide-react';

interface HeroBannerProps {
  onCtaClick: () => void;
}

export default function HeroBanner({ onCtaClick }: HeroBannerProps) {
  return (
    <section className="relative bg-neutral-950 text-white overflow-hidden border-b border-neutral-900">
      {/* Subtle background glow & texture */}
      <div className="absolute inset-0 bg-radial from-neutral-800/40 via-neutral-950 to-neutral-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-24 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column: Editorial Headline & CTA */}
        <div className="max-w-2xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-black tracking-widest uppercase text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>DROP STREETWEAR 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[0.95] text-white">
            ALL STAR CLASSICS <br />
            <span className="text-neutral-400 font-light">ELEVA TU ESTILO</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl font-medium leading-relaxed">
            Las siluetas más icónicas de la cultura urbana: 59FIFTY Fitted, 9FORTY Curva y 9FIFTY Snapback. 
            Bordados 3D de alta densidad con sellos holográficos oficiales.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              type="button"
              onClick={onCtaClick}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-neutral-200 font-black text-xs sm:text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>VER MODELOS</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Garantía 100% Original</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase (Cap Silhouette Graphic) */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 shrink-0 flex items-center justify-center">
          {/* Circular halo */}
          <div className="absolute inset-0 rounded-full border border-neutral-800/80 scale-95" />
          <div className="absolute inset-4 rounded-full border border-dashed border-neutral-800/40" />

          {/* Large Hero Cap Vector Artwork */}
          <div className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]">
            <svg viewBox="0 0 160 120" className="w-72 h-72 sm:w-84 sm:h-84">
              <ellipse cx="80" cy="105" rx="65" ry="8" fill="#000000" opacity="0.4" />
              {/* Crown */}
              <path
                d="M28 85 C28 32, 55 20, 80 20 C105 20, 132 32, 132 85 Z"
                fill="#171717"
              />
              {/* Seams */}
              <path d="M80 20 L80 85" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" />
              <path d="M80 20 Q54 50 40 85" stroke="#ffffff" strokeWidth="0.8" opacity="0.15" />
              <path d="M80 20 Q106 50 120 85" stroke="#ffffff" strokeWidth="0.8" opacity="0.15" />
              {/* Top button */}
              <circle cx="80" cy="20" r="4.5" fill="#ffffff" />
              <circle cx="80" cy="20" r="3.5" fill="#171717" />
              {/* Eyelets */}
              <circle cx="56" cy="38" r="1.8" fill="#ffffff" opacity="0.3" />
              <circle cx="104" cy="38" r="1.8" fill="#ffffff" opacity="0.3" />
              {/* Visor Flat */}
              <path
                d="M12 85 C12 80, 148 80, 148 85 C148 94, 12 94, 12 85 Z"
                fill="#0a0a0a"
              />
              {/* 59FIFTY Gold Foil Holographic Visor Sticker */}
              <circle cx="118" cy="87" r="5.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
              <circle cx="118" cy="87" r="4" fill="#fef08a" />
              <text x="118" y="89" textAnchor="middle" fontSize="3" fontWeight="900" fill="#78350f">
                59FIFTY
              </text>
              {/* 3D Embroidered NY Logo */}
              <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.6))">
                <rect x="62" y="42" width="36" height="26" rx="6" fill="none" stroke="#ffffff" strokeWidth="2.5" />
                <text x="80" y="60" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="sans-serif">
                  NY
                </text>
              </g>
            </svg>
          </div>

          {/* Floating Tag */}
          <div className="absolute bottom-2 left-2 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
            ORIGINAL 59FIFTY®
          </div>
        </div>
      </div>
    </section>
  );
}
