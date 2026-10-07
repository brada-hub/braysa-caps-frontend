'use client';

import React from 'react';
import { X, Award, Gift, Sparkles, Star, Check } from 'lucide-react';

interface NewEraRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewEraRewardsModal({ isOpen, onClose }: NewEraRewardsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-black text-white border border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 z-10 space-y-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#A9965D]/20 text-[#A9965D] mb-1">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wider text-white">
              NEW ERA <span className="text-[#A9965D]">REWARDS</span>
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              El club exclusivo para coleccionistas y fanáticos del headwear oficial. Sumá puntos con cada compra y canjealos por beneficios únicos.
            </p>
          </div>

          {/* Perks list */}
          <div className="space-y-3 pt-2">
            {[
              {
                title: 'Puntos por cada compra',
                desc: 'Acumulá 10 puntos por cada Bs. 50 gastados en la tienda online o locales físicos.',
              },
              {
                title: 'Acceso anticipado a drops',
                desc: 'Comprá ediciones limitadas como Star Visor y Collabs 24hs antes del lanzamiento general.',
              },
              {
                title: 'Regalo de cumpleaños',
                desc: 'Cupón especial de descuento y pin exclusivo New Era en tu mes de cumpleaños.',
              },
              {
                title: 'Envíos prioritarios bonificados',
                desc: 'Tiempos de despacho express para miembros nivel All-Star.',
              },
            ].map((perk, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-neutral-900/80 border border-neutral-800"
              >
                <div className="w-5 h-5 rounded-full bg-[#A9965D]/20 text-[#A9965D] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-[#A9965D] hover:bg-[#b8a56a] text-black font-extrabold text-xs uppercase tracking-widest rounded-full transition-colors shadow-md cursor-pointer"
            >
              Unirme a Rewards Gratis
            </button>
            <p className="text-[10px] text-neutral-500">
              Al registrarte acumulás tus primeros 500 puntos de bienvenida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
