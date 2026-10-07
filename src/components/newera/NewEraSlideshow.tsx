'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  tag: string;
  heading: string;
  description: string;
  buttonText: string;
  filterTag: string;
  image: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 'urban-luxury',
    tag: 'NUEVO DROP • BRAYSA CAPS',
    heading: 'URBAN LUXURY',
    description: 'Confección premium, acabados en alto relieve y siluetas seleccionadas para destacar.',
    buttonText: 'EXPLORAR DROP',
    filterTag: 'TODAS',
    image: '/banners/banner_drop.jpg',
  },
  {
    id: 'headwear-vanguard',
    tag: 'EDICIÓN LIMITADA 2026',
    heading: 'HEADWEAR VANGUARD',
    description: 'Bordados 3D de alta densidad, viseras curvas y combinaciones exclusivas para Bolivia.',
    buttonText: 'VER COLECCIÓN',
    filterTag: 'CURVAS (BASEBALL)',
    image: '/banners/banner_caps.jpg',
  },
  {
    id: 'street-attitude',
    tag: 'STREETWEAR OFICIAL',
    heading: 'ESTILO SIN LÍMITES',
    description: 'La máxima actitud urbana en tu outfit. Envíos garantizados a todo el país.',
    buttonText: 'COMPRAR AHORA',
    filterTag: 'SNAPBACK (AJUSTABLE)',
    image: '/banners/banner_urban.jpg',
  },
];

interface NewEraSlideshowProps {
  onCtaClick?: (tag: string) => void;
}

export default function NewEraSlideshow({ onCtaClick }: NewEraSlideshowProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full h-[460px] md:h-[560px] bg-neutral-950 overflow-hidden select-none">
      {/* Slides */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIdx;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.heading}
              className="w-full h-full object-cover object-center transform transition-transform duration-10000 scale-100 hover:scale-105"
            />

            {/* Cinematic Gradient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Left Content */}
            <div className="absolute inset-0 max-w-[1920px] mx-auto px-8 md:px-20 flex flex-col justify-center items-start text-white z-20">
              <div className="max-w-xl space-y-4">
                {/* Brand Tag Lockup */}
                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <img
                    src="/BRAYSA_logos/blanco/BRAYSA_04_icono_blanco.png"
                    alt="BRAYSA"
                    className="h-4 w-auto object-contain"
                  />
                  <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-white uppercase">
                    {slide.tag}
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-md font-sans uppercase">
                  {slide.heading}
                </h1>
                <p className="text-sm md:text-base text-neutral-200 font-normal max-w-lg leading-relaxed drop-shadow">
                  {slide.description}
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onCtaClick && onCtaClick(slide.filterTag)}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer active:scale-95 shadow-lg shadow-black/20"
                  >
                    {slide.buttonText}
                  </button>

                  <div className="hidden sm:flex items-center gap-2">
                    <img
                      src="/BRAYSA_logos/blanco/BRAYSA_06_logotipo_horizontal_blanco.png"
                      alt="BRAYSA"
                      className="h-5 w-auto object-contain opacity-60"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Nav Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-8 h-8 stroke-[1.5]" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-8 h-8 stroke-[1.5]" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {HERO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentIdx(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIdx
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
