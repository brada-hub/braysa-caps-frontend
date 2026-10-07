'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { NewEraProduct } from './types';
import NewEraProductCard from './NewEraProductCard';

interface NewEraPopularCarouselProps {
  products: NewEraProduct[];
  onSelectProduct: (product: NewEraProduct, initialColor?: string) => void;
  onAddToCartDirect: (product: NewEraProduct) => void;
  onViewAll?: () => void;
}

export default function NewEraPopularCarousel({
  products,
  onSelectProduct,
  onAddToCartDirect,
  onViewAll,
}: NewEraPopularCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-[#fafafa] border-b border-neutral-200">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
              Tendencias Streetwear
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight uppercase text-black font-sans mt-0.5">
              Gorras más populares
            </h2>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold uppercase tracking-widest text-black hover:text-neutral-500 transition-colors border-b border-black pb-0.5 flex items-center gap-1 cursor-pointer"
          >
            VER COLECCIÓN <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Carousel with Navigation Arrows */}
        <div className="relative group">
          <button
            type="button"
            onClick={scrollLeft}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-md text-black flex items-center justify-center hover:bg-neutral-50 transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth py-2 px-1 scrollbar-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {products.map((prod) => (
              <div
                key={prod.id}
                className="w-[260px] sm:w-[290px] md:w-[320px] shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <NewEraProductCard
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  onAddToCartDirect={onAddToCartDirect}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollRight}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-md text-black flex items-center justify-center hover:bg-neutral-50 transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
