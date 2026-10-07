'use client';

import React, { useState } from 'react';
import { CapProduct } from './types';
import { MessageCircle, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: CapProduct;
  onSelect: (product: CapProduct, selectedColorHex?: string) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const [activeColor, setActiveColor] = useState(product.colorHex);
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => !isOutOfStock && onSelect(product, activeColor)}
      className={`group bg-white flex flex-col justify-between transition-all duration-200 cursor-pointer ${
        isOutOfStock ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* 1. CONTENEDOR DE FOTO / ILUSTRACIÓN GRIS CLARO (Estilo New Era) */}
      <div className="bg-neutral-100 rounded-2xl aspect-square relative overflow-hidden flex items-center justify-center p-6 border border-neutral-200/60 group-hover:border-black transition-colors">
        {/* Badges superiores sobre la imagen */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.badge && !isOutOfStock && (
            <span
              className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-xs ${
                product.badge === 'NUEVO'
                  ? 'bg-black text-white'
                  : product.badge === 'MÁS VENDIDO'
                  ? 'bg-black text-white'
                  : 'bg-neutral-800 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-neutral-300 text-neutral-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">
              AGOTADO
            </span>
          )}
        </div>

        {/* Silueta Técnica de Gorra con Color Dinámico */}
        <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <svg viewBox="0 0 140 110" className="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.14)]">
            <ellipse cx="70" cy="95" rx="55" ry="7" fill="#000000" opacity="0.08" />

            {/* Copa */}
            <path
              d="M25 75 C25 28, 50 18, 70 18 C90 18, 115 28, 115 75 Z"
              fill={activeColor}
            />

            {/* Costuras */}
            <path d="M70 18 L70 75" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
            <path d="M70 18 Q48 45 35 75" stroke="#ffffff" strokeWidth="0.8" opacity="0.25" />
            <path d="M70 18 Q92 45 105 75" stroke="#ffffff" strokeWidth="0.8" opacity="0.25" />

            {/* Ojalillos */}
            <circle cx="50" cy="35" r="1.5" fill="#ffffff" opacity="0.4" />
            <circle cx="90" cy="35" r="1.5" fill="#ffffff" opacity="0.4" />

            {/* Botón superior */}
            <circle cx="70" cy="18" r="4" fill="#ffffff" />
            <circle cx="70" cy="18" r="3" fill={activeColor} />

            {/* Visera */}
            {product.silhouette === 'SNAPBACK' || product.silhouette === 'FITTED' ? (
              // Visera Plana Pro
              <g>
                <path d="M12 75 C12 70, 128 70, 128 75 C128 82, 12 82, 12 75 Z" fill="#18181b" />
                {/* Sticker Dorado Oficial 59FIFTY */}
                <circle cx="102" cy="76" r="4.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.7" />
                <circle cx="102" cy="76" r="3.2" fill="#fef08a" />
              </g>
            ) : (
              // Visera Curva Baseball
              <g>
                <path d="M10 75 C30 68, 110 68, 130 75 C122 84, 18 84, 10 75 Z" fill="#18181b" />
                {/* Sticker Plateado Curvo */}
                <circle cx="100" cy="76" r="4" fill="#e4e4e7" stroke="#71717a" strokeWidth="0.7" />
              </g>
            )}

            {/* Bordado Frontal 3D */}
            <g filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.5))">
              <rect x="52" y="36" width="36" height="24" rx="4" fill="none" stroke="#ffffff" strokeWidth="2.5" />
              <text x="70" y="53" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                {product.teamLogo}
              </text>
            </g>
          </svg>
        </div>

        {/* Silueta Tag Inferior */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="bg-white/90 text-neutral-800 text-[9px] font-mono font-black px-2 py-0.5 rounded shadow-2xs border border-neutral-200">
            {product.silhouetteLabel}
          </span>
        </div>
      </div>

      {/* 2. DETALLES Y TIPOGRAFÍA NEW ERA */}
      <div className="pt-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Swatches de Color */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="flex items-center gap-1.5 pb-1">
              {product.availableColors.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColor(swatch.hex);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                    activeColor === swatch.hex
                      ? 'ring-2 ring-black ring-offset-1 scale-110'
                      : 'border-neutral-300 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
            </div>
          )}

          {/* Marca / Silueta */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">
            {product.brand}
          </span>

          {/* Título en Mayúsculas (Estilo New Era) */}
          <h3 className="font-extrabold text-xs sm:text-sm text-neutral-950 uppercase tracking-wide leading-snug line-clamp-2 mt-0.5 group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Fila de Precio y Acción */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-base sm:text-lg font-black text-black tracking-tight">
              Bs. {product.price.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            className="px-3.5 py-2 bg-black text-white hover:bg-neutral-800 rounded-full font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            <span>Pedir</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
