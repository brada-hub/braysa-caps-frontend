'use client';

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { NewEraProduct } from './types';
import NewEraProductCard from './NewEraProductCard';

interface NewEraCollectionTabsProps {
  products: NewEraProduct[];
  onSelectProduct: (product: NewEraProduct, initialColor?: string) => void;
  onAddToCartDirect: (product: NewEraProduct) => void;
  onViewAllSilhouette?: (silhouette: string) => void;
}

const TABS = [
  { id: 'TODAS', label: 'Todas las Gorras' },
  { id: 'Visera Curva', label: 'Visera Curva (Dad Cap)' },
  { id: 'Visera Plana', label: 'Visera Plana (Snapback)' },
  { id: 'Trucker', label: 'Trucker (Con Malla)' },
  { id: 'Básica Lisa', label: 'Lisas / Básicas' },
];

export default function NewEraCollectionTabs({
  products,
  onSelectProduct,
  onAddToCartDirect,
  onViewAllSilhouette,
}: NewEraCollectionTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('TODAS');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    activeTab === 'TODAS'
      ? products
      : products.filter(
          (p) =>
            p.silhouetteCategory?.toUpperCase() === activeTab.toUpperCase() ||
            p.silhouette.toUpperCase() === activeTab.toUpperCase()
        );

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
    <section id="collection-tabs-section" className="py-10 md:py-14 bg-white border-b border-neutral-100">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Unitalla Ajustable • Con Regulador
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase mt-1">
              Catálogo de Gorras Urbanas
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Todos los modelos cuentan con broche o correa regulable. Le quedan perfecto a cualquier medida.
            </p>
          </div>

          <div className="text-xs text-neutral-400 font-bold">
            Mostrando {filteredProducts.length} modelos disponibles
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Products Horizontal Slider */}
        <div className="relative group">
          <button
            type="button"
            onClick={scrollLeft}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-md text-black flex items-center justify-center hover:bg-neutral-50 transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-none"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0"
              >
                <NewEraProductCard
                  product={product}
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
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
