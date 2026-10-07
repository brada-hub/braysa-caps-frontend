'use client';

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { NewEraProduct } from './types';

interface NewEraProductCardProps {
  product: NewEraProduct;
  onSelectProduct: (product: NewEraProduct, initialColor?: string) => void;
  onAddToCartDirect: (product: NewEraProduct) => void;
}

export default function NewEraProductCard({
  product,
  onSelectProduct,
  onAddToCartDirect,
}: NewEraProductCardProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || 'Original'
  );

  const formatPrice = (val: number) => {
    return `Bs. ${Math.round(val || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserSelected(true);
    setCurrentImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserSelected(true);
    setCurrentImageIdx((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Determine which photo is displayed:
  // - If user manually clicked a dot/arrow -> respect currentImageIdx
  // - If user is hovering and hasn't clicked -> preview Foto 2 (reverso)
  // - Otherwise -> ALWAYS show Foto 1 (frontal)
  const displayedIdx = userSelected
    ? currentImageIdx
    : isHovered && product.images.length > 1
    ? 1
    : currentImageIdx;

  const activeImageSrc =
    product.images[displayedIdx] || product.images[0] || '/cdn/p_yankees_1.jpg';

  return (
    <div className="bg-white border border-neutral-200/90 rounded-sm hover:border-black transition-all duration-200 flex flex-col justify-between group overflow-hidden h-full">
      {/* 1. MEDIA FIGURE */}
      <div
        className="relative aspect-square w-full bg-[#f8f8f8] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product, selectedColor)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setUserSelected(false);
          setCurrentImageIdx(0);
        }}
      >
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.isSoldOut && (
            <span className="bg-neutral-200 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
              Agotado
            </span>
          )}
          {product.isNew && !product.isSoldOut && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              Nuevo Drop
            </span>
          )}
          {product.freeShipping && !product.isSoldOut && (
            <span className="bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              Envío Gratis
            </span>
          )}
        </div>

        {/* Primary and Hover Image */}
        <div className="w-full h-full relative flex items-center justify-center p-2">
          <img
            key={activeImageSrc}
            src={activeImageSrc}
            alt={product.name}
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Quick Image Navigation Arrows (on hover) */}
        {product.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/95 hover:bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20 cursor-pointer border border-neutral-200"
              aria-label="Imagen previa"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/95 hover:bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20 cursor-pointer border border-neutral-200"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Dots Indicator - Clickable Buttons */}
        {product.images.length > 1 && (
          <div
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-neutral-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            {product.images.map((_, dotIdx) => {
              const isDotActive = dotIdx === displayedIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIdx(dotIdx);
                    setUserSelected(true);
                  }}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    isDotActive
                      ? 'bg-black w-5 shadow-2xs'
                      : 'bg-neutral-300 hover:bg-neutral-500 w-2'
                  }`}
                  aria-label={`Ver ${dotIdx === 0 ? 'Foto 1 (Frontal)' : 'Foto 2 (Reverso)'}`}
                  title={dotIdx === 0 ? 'Foto 1: Vista Frontal' : 'Foto 2: Vista Reverso / Ángulo'}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 2. PRODUCT INFO */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product, selectedColor)}
            className="text-xs sm:text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 hover:text-black cursor-pointer mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Promo Bundle Badge if available */}
          {product.promoText && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-2.5 py-1 text-[11px] font-black text-amber-900 flex items-center justify-between mb-2">
              <span>⚡ {product.promoText}</span>
              <span className="text-[9px] uppercase tracking-wider text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">Combo</span>
            </div>
          )}

          {/* Bolivia Delivery & Adjustable Regulator Badge */}
          <div className="bg-neutral-50 rounded-xl p-2 text-[11px] text-neutral-700 border border-neutral-100 flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">Unitalla • {product.regulatorType || 'Con Regulador'}</span>
            </div>
            <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded shrink-0">
              Graduable
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-[#A9965D]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-[#A9965D]"
                />
              ))}
            </div>
            <span className="text-[11px] text-neutral-500 font-medium ml-1">
              {product.reviewCount} {product.reviewCount === 1 ? 'reseña' : 'reseñas'}
            </span>
          </div>

          {/* Color Swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${selectedColor === c.name
                      ? 'ring-2 ring-black ring-offset-1 scale-110'
                      : 'border-neutral-300 hover:scale-105'
                    }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3. BUTTONS */}
        <div className="pt-2 flex flex-col gap-2">
          {product.isSoldOut ? (
            <button
              disabled
              className="w-full py-2.5 bg-neutral-200 text-neutral-400 text-xs font-bold uppercase tracking-wider rounded-full cursor-not-allowed text-center"
            >
              Agotado
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectProduct(product, selectedColor)}
              className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer text-center active:scale-98"
            >
              Ver Gorra & Pedir
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectProduct(product, selectedColor)}
            className="w-full py-2 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer text-center"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}
