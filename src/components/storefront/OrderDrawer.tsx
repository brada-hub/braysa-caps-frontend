'use client';

import React, { useState, useEffect } from 'react';
import { CapProduct } from './types';
import {
  X,
  Plus,
  Minus,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Truck,
  Check,
} from 'lucide-react';

interface OrderDrawerProps {
  product: CapProduct | null;
  initialColorHex?: string;
  onClose: () => void;
  whatsappNumber?: string;
}

export default function OrderDrawer({
  product,
  initialColorHex,
  onClose,
  whatsappNumber = '59170000000',
}: OrderDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product ? initialColorHex || product.colorHex : '#18181b'
  );

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedColor(initialColorHex || product.colorHex);
    }
  }, [product, initialColorHex]);

  if (!product) return null;

  const totalAmount = (product.price * quantity).toFixed(2);

  // Buscar el nombre del color seleccionado
  const currentColorObj = product.availableColors?.find(
    (c) => c.hex.toLowerCase() === selectedColor.toLowerCase()
  );
  const colorName = currentColorObj ? currentColorObj.name : product.color;

  const whatsappMessage = `¡Hola BRAYSA CAPS! 👋 Quisiera realizar el siguiente pedido:

🧢 *Gorra:* ${product.name}
🏷️ *Silueta:* ${product.silhouetteLabel}
🎨 *Color:* ${colorName}
📦 *Cantidad:* ${quantity} unidad(es)
💰 *Total a pagar:* Bs. ${totalAmount}

📍 ¿Tienen disponible para entrega en mostrador o envío a domicilio?`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border-t sm:border border-neutral-200 animate-in slide-in-from-bottom duration-200 overflow-hidden">
        {/* Header Modal */}
        <div className="p-5 border-b border-neutral-100 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
              {product.brand} • {product.silhouetteLabel}
            </span>
            <h3 className="font-extrabold text-base text-neutral-950 uppercase tracking-tight leading-snug mt-0.5">
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Visual Cap Mini-Preview */}
          <div className="bg-neutral-100 rounded-2xl p-4 flex items-center gap-4 border border-neutral-200/80">
            <div className="w-20 h-20 shrink-0 bg-white rounded-xl p-2 border border-neutral-200/60 flex items-center justify-center">
              <svg viewBox="0 0 140 110" className="w-full h-full drop-shadow-sm">
                <path d="M25 75 C25 28, 50 18, 70 18 C90 18, 115 28, 115 75 Z" fill={selectedColor} />
                <path d="M70 18 L70 75" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
                <circle cx="70" cy="18" r="4" fill="#ffffff" />
                <circle cx="70" cy="18" r="3" fill={selectedColor} />
                <path d="M12 75 C12 70, 128 70, 128 75 C128 82, 12 82, 12 75 Z" fill="#18181b" />
                <rect x="54" y="38" width="32" height="22" rx="4" fill="none" stroke="#ffffff" strokeWidth="2" />
                <text x="70" y="53" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
                  {product.teamLogo}
                </text>
              </svg>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-neutral-900 uppercase">
                Color: <span className="font-extrabold">{colorName}</span>
              </div>
              <div className="text-xs text-neutral-500 font-medium">
                Precio: <strong>Bs. {product.price.toFixed(2)}</strong> c/u
              </div>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Disponible para entrega inmediata
              </div>
            </div>
          </div>

          {/* Selector de Color Swatches si hay múltiples */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
                Seleccionar Color:
              </label>
              <div className="flex items-center gap-2">
                {product.availableColors.map((swatch) => {
                  const isSelected = selectedColor.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => setSelectedColor(swatch.hex)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-xs'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/40"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>{swatch.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de Cantidad Tactil */}
          <div className="flex items-center justify-between bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">
                Cantidad
              </span>
              <span className="text-[11px] text-neutral-500">
                Unidades a pedir
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-xl bg-white border border-neutral-300 disabled:opacity-40 flex items-center justify-center text-neutral-800 font-black active:scale-90 transition-transform shadow-2xs cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-base font-black text-neutral-950 w-7 text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-white border border-neutral-300 flex items-center justify-center text-neutral-800 font-black active:scale-90 transition-transform shadow-2xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Banner Informativo de Pago QR Simple */}
          <div className="bg-neutral-950 text-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shrink-0 font-black">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <span className="font-extrabold uppercase tracking-wider text-white block">
                Paga con QR Simple
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">
                Paga de inmediato desde BNB, BCP, Mercantil o Banco Unión sin recargos.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer con Total y Botón WhatsApp */}
        <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Total a Pagar:
            </span>
            <div className="text-2xl font-black text-black">
              Bs. {totalAmount}
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Pedir por WhatsApp ahora</span>
          </a>

          <p className="text-[10px] text-neutral-400 text-center font-medium">
            Atención personalizada de lunes a domingo. Confirmamos stock en minutos.
          </p>
        </div>
      </div>
    </div>
  );
}
