'use client';

import React from 'react';
import { CapProduct } from './types';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

interface ProductGridProps {
  products: CapProduct[];
  onSelectProduct: (product: CapProduct, selectedColorHex?: string) => void;
  onResetFilters: () => void;
}

export default function ProductGrid({
  products,
  onSelectProduct,
  onResetFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200 p-8 space-y-4 max-w-lg mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-white mx-auto flex items-center justify-center text-neutral-400 border border-neutral-200">
          <Search className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-neutral-950 uppercase tracking-wider">
            No se encontraron modelos
          </h3>
          <p className="text-xs text-neutral-500 font-medium">
            Prueba ajustando el término de búsqueda o seleccionando otra silueta.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Ver todo el catálogo
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>
    </section>
  );
}
