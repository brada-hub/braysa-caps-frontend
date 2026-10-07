'use client';

import React, { useState, useEffect } from 'react';

const SLIDES = [
  '🧢 Envíos garantizados a toda Bolivia por flota y courier',
  '⚡ Pagos rápidos por QR Simple y transferencias directas',
  '🔥 Especialistas en Gorras Originales • Fitted & Snapback',
  '💬 Asesoría de tallas y pedidos inmediatos por WhatsApp',
];

interface NewEraTopBarProps {
  onRewardsClick?: () => void;
}

export default function NewEraTopBar({ onRewardsClick }: NewEraTopBarProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#000000] text-white text-[12px] font-medium tracking-tight py-2.5 px-4 relative z-50 border-b border-neutral-900 select-none">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between relative min-h-[22px]">
        {/* Central Rotating Slide */}
        <div className="flex-1 flex justify-center items-center text-center overflow-hidden">
          <div className="relative h-5 flex items-center justify-center">
            {SLIDES.map((text, idx) => (
              <span
                key={idx}
                className={`transition-all duration-500 transform absolute whitespace-nowrap text-xs md:text-sm font-normal tracking-wide text-neutral-100 ${
                  idx === currentSlide
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Top Direct WhatsApp / Contact button */}
        <a
          href="https://wa.me/59170000000?text=Hola%20BRAYSA%20Caps!%20Quisiera%20consultar%20sobre%20gorras%20disponibles"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A9965D] hover:text-[#c4b378] font-bold text-xs uppercase tracking-widest transition-colors py-0.5 px-2 shrink-0 cursor-pointer ml-auto flex items-center gap-1"
        >
          WHATSAPP
        </a>
      </div>
    </div>
  );
}
