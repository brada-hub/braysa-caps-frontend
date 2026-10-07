'use client';

import React from 'react';

interface NewEraMarqueeProps {
  onJoinClick?: () => void;
}

export default function NewEraMarquee({ onJoinClick }: NewEraMarqueeProps) {
  const items = Array.from({ length: 8 });

  return (
    <div className="w-full bg-black py-3.5 overflow-hidden border-y border-neutral-900 select-none">
      <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-6 mx-5 shrink-0">
            {/* BRAYSA Linear White Logo */}
            <img
              src="/BRAYSA_logos/blanco/BRAYSA_06_logotipo_horizontal_blanco.png"
              alt="BRAYSA"
              className="h-4 w-auto object-contain"
            />

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold tracking-widest text-[#A9965D] uppercase">
                REWARDS
              </span>
              <button
                type="button"
                onClick={onJoinClick}
                className="text-xs font-bold text-white underline underline-offset-4 hover:text-[#A9965D] transition-colors uppercase tracking-wider cursor-pointer"
              >
                Unirme
              </button>
            </div>

            <span className="text-neutral-700 text-xs">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
