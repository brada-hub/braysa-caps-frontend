'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, CheckCircle2, MessageCircle } from 'lucide-react';
import { CartItem } from './types';

interface NewEraCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 500;

export default function NewEraCartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  }: NewEraCartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const formatPrice = (val: number) =>
    `Bs. ${Math.round(val || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
          {/* 1. HEADER */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-wider text-black font-sans">
                Tu Carrito
              </h2>
              <span className="text-xs bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 rounded-full">
                {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. FREE SHIPPING PROGRESS BAR */}
          <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 text-xs">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Felicitaciones! Tenés Envío Gratis en tu compra</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-neutral-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-neutral-500" />
                    Te faltan <strong className="text-black font-extrabold">{formatPrice(shippingRemaining)}</strong> para
                  </span>
                  <span className="font-bold text-black uppercase tracking-wider text-[11px]">
                    Envío Gratis
                  </span>
                </div>
                {/* Progress Track */}
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. ITEM LIST OR EMPTY STATE */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                    Tu carrito está vacío
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Descubrí las gorras más icónicas de New Era en nuestro catálogo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex gap-3 sm:gap-4 items-start">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded bg-neutral-100 shrink-0 border border-neutral-200"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 leading-snug line-clamp-2">
                      {item.product.name}
                    </h4>

                    <div className="text-[11px] text-neutral-500 mt-0.5 space-x-2">
                      <span>Color: <strong>{item.selectedColor}</strong></span>
                      <span>•</span>
                      <span>Talle: <strong>{item.selectedSize}</strong></span>
                    </div>

                    <p className="text-xs font-bold text-black mt-1.5">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-neutral-300 rounded-full overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                          aria-label="Restar uno"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                          aria-label="Sumar uno"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. FOOTER & CHECKOUT */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-600 uppercase tracking-wider text-xs">
                  Subtotal
                </span>
                <span className="text-lg font-black text-black tracking-tight">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="text-[11px] text-neutral-400">
                Coordinación directa por WhatsApp o checkout en línea.
              </p>

              <button
                type="button"
                onClick={() => {
                  let msg = `¡Hola BRAYSA Caps! 👋 Quiero realizar el siguiente pedido:\n\n`;
                  items.forEach((item, i) => {
                    msg += `${i + 1}. *${item.product.name}*\n   • Silueta: ${item.product.silhouette} | Talla: ${item.selectedSize} | Color: ${item.selectedColor}\n   • Cantidad: ${item.quantity}x • Bs. ${item.product.price * item.quantity}\n`;
                  });
                  msg += `\n💰 *Total a Pagar:* *Bs. ${subtotal}*\n`;
                  msg += `¿Cómo realizo el pago por QR y coordinamos el envío?`;
                  window.open(`https://api.whatsapp.com/send?phone=59167544099&text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-200 shadow-md cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir Todo por WhatsApp ({formatPrice(subtotal)})</span>
              </button>

              <button
                type="button"
                onClick={onCheckout}
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-200 shadow-md cursor-pointer active:scale-98 text-center"
              >
                Checkout en Línea
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
