'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Truck, ArrowRight, Check, MessageCircle } from 'lucide-react';
import { NewEraProduct } from './types';

interface NewEraProductModalProps {
  product: NewEraProduct | null;
  initialColor?: string;
  onClose: () => void;
  onAddToCart: (product: NewEraProduct, selectedColor: string, selectedSize: string, quantity: number) => void;
}

export default function NewEraProductModal({
  product,
  initialColor,
  onClose,
  onAddToCart,
}: NewEraProductModalProps) {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(
    initialColor || product.colors[0]?.name || 'Original'
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Único');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  useEffect(() => {
    if (initialColor) {
      setSelectedColor(initialColor);
    }
  }, [initialColor]);

  const formatPrice = (val: number) =>
    `Bs. ${Math.round(val || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setIsAddedAnimation(true);
    setTimeout(() => {
      setIsAddedAnimation(false);
      onClose();
    }, 600);
  };

  const handleBuyWhatsApp = () => {
    const text = `¡Hola BRAYSA Caps! 👋 Me interesa comprar la gorra *${product.name}* (${product.silhouette}) en talla *${selectedSize}* (Color: *${selectedColor}*, Cantidad: *${quantity}x*, Precio: *${formatPrice(product.price * quantity)}*). ¿Tienen disponibilidad para envío inmediato a mi ciudad?`;
    window.open(`https://api.whatsapp.com/send?phone=59167544099&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col md:flex-row">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 bg-[#f8f8f8] p-6 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-neutral-200">
            {/* Main Picture */}
            <div className="relative aspect-square w-full max-w-sm rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail row */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 max-w-full">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${idx === selectedImageIdx ? 'border-black' : 'border-neutral-200 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2.5 py-0.5 rounded-full">
                  {product.silhouette}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  {product.team} • {product.league}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                {product.name}
              </h2>

              {/* SKU */}
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                SKU: {product.sku}
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex text-[#A9965D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#A9965D]" />
                  ))}
                </div>
                <span className="text-xs text-neutral-600 font-semibold">
                  5.0 ({product.reviewCount} opiniones)
                </span>
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-black tracking-tight">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  En Stock
                </span>
              </div>

              {/* Delivery info Bolivia */}
              <p className="text-xs text-neutral-600 mt-1">
                Disponible para entrega inmediata y envíos garantizados a toda Bolivia.
              </p>

              {/* Color Selection */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Color: <span className="font-normal text-neutral-900">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${selectedColor === c.name
                          ? 'border-black bg-neutral-100 font-bold shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-300"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Talla y Tipo de Regulador */}
              <div className="mt-4 bg-neutral-50 rounded-2xl p-3 border border-neutral-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black uppercase tracking-wider text-neutral-800">
                    Talla y Ajuste:
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Le queda a todos
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                  <span className="px-2.5 py-1 bg-white border border-neutral-300 rounded-xl shadow-2xs">
                    Unitalla Ajustable
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    • Regulador: {product.regulatorType || 'Broche Graduable'}
                  </span>
                </div>
              </div>

              {/* Promo Banner if applicable */}
              {product.promoText && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
                  <span className="font-black text-amber-900 uppercase text-[10px] tracking-wider">
                    ⚡ Oferta por Cantidad:
                  </span>
                  <span className="font-bold text-amber-800 text-xs">
                    {product.promoText}
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Cantidad:
                </span>
                <div className="flex items-center border border-neutral-300 rounded-full overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions & Guarantee */}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <button
                type="button"
                onClick={handleAdd}
                disabled={product.isSoldOut}
                className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 ${product.isSoldOut
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : isAddedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-neutral-800 text-white active:scale-98'
                  }`}
              >
                {product.isSoldOut ? (
                  'Producto Agotado'
                ) : isAddedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> ¡Agregado al Carrito!
                  </>
                ) : (
                  <>
                    Agregar al Carrito • {formatPrice(product.price * quantity)}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyWhatsApp}
                disabled={product.isSoldOut}
                className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 ${product.isSoldOut
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-98'
                  }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp ({formatPrice(product.price * quantity)})</span>
              </button>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                  <span>100% Original con Holograma</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                  <span>Envíos a todo el país</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
