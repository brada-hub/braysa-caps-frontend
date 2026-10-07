'use client';

import React from 'react';
import { Store, MessageCircle, MapPin, ShieldCheck, Clock } from 'lucide-react';

interface NewEraFooterProps {
  onNavClick?: (target: string) => void;
}

export default function NewEraFooter({ onNavClick }: NewEraFooterProps) {
  return (
    <footer className="bg-neutral-950 text-white pt-12 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Simple Grid: 3 Clean Customer-Focused Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-neutral-800/80 items-start">
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-3">
            <div className="inline-block">
              <img
                src="/BRAYSA_logos/blanco/BRAYSA_06_logotipo_horizontal_blanco.png"
                alt="BRAYSA Caps"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Tienda especializada en gorras de colección y estilo urbano en Bolivia. Calidad garantizada, siluetas auténticas y drops seleccionados.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Garantía de Originalidad 100%</span>
            </div>
          </div>

          {/* Col 2: Cobertura & Envíos Bolivia */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              Envíos a toda Bolivia
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Despachos diarios y seguros a La Paz, Cochabamba, Santa Cruz y todos los departamentos del país por flota o courier.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Entregas rápidas de 24 a 48 hrs</span>
            </div>
          </div>

          {/* Col 3: Atención y Pedidos */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-200">
              Atención y Pedidos
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              ¿Tienes dudas con tu talla o buscas un modelo especial? Escríbenos directamente:
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/59167544099?text=Hola%20BRAYSA%20Caps!%20Quisiera%20consultar%20sobre%20gorras%20disponibles"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp (+591 67544099)</span>
              </a>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  document.getElementById('collection-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-neutral-400 hover:text-white transition-colors text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Explorar Colección de Gorras</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright Only */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© 2026 BRAYSA CAPS • Headwear Bolivia. Todos los derechos reservados.</p>
          <p className="text-[11px] text-neutral-500 font-medium">BRAYSA Headwear Store</p>
        </div>
      </div>
    </footer>
  );
}
