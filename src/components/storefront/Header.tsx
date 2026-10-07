'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MessageCircle,
  Menu,
  X,
  Store,
  ChevronDown,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCategorySelect?: (cat: string) => void;
  whatsappNumber?: string;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onCategorySelect,
  whatsappNumber = '59170000000',
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const generalWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    '¡Hola BRAYSA CAPS! 👋 Quisiera consultar sobre el catálogo oficial y envíos a mi ciudad.'
  )}`;

  const navItems = [
    { label: 'GORRAS', category: 'TODAS' },
    { label: 'MLB / NBA', category: 'SNAPBACK (AJUSTABLE)' },
    { label: 'CURVAS', category: 'CURVAS (BASEBALL)' },
    { label: 'NOVEDADES', category: 'TODAS' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* 1. TOP ANNOUNCEMENT TICKER (Estilo Oficial New Era) */}
      <div className="bg-black text-white py-2 px-4 text-[11px] sm:text-xs text-center font-bold tracking-widest uppercase flex items-center justify-center gap-2">
        <span>Envíos a toda Bolivia</span>
        <span className="text-neutral-500">•</span>
        <span>Pagos con QR Simple y Efectivo</span>
        <span className="text-neutral-500">•</span>
        <span className="hidden sm:inline">Gorras 100% Originales</span>
      </div>

      {/* 2. NAVBAR PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 text-neutral-900 hover:text-black focus:outline-none"
          aria-label="Abrir menú"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* LOGO OFICIAL BRAYSA */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/BRAYSA_logos/negro/BRAYSA_06_logotipo_horizontal_negro.png"
            alt="BRAYSA Caps"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>

        {/* MENÚ DE CATEGORÍAS PRINCIPALES (DESKTOP) */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-black tracking-widest uppercase text-neutral-900">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onCategorySelect && onCategorySelect(item.category)}
              className="py-1 hover:text-neutral-500 transition-colors cursor-pointer relative group"
            >
              <span>{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* ICONOS DERECHA: BÚSQUEDA, WHATSAPP Y ACCESO POS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Barra de búsqueda desktop / botón toggle */}
          <div className="relative">
            <div className="hidden sm:flex items-center bg-neutral-100 rounded-full px-3 py-1.5 border border-neutral-200 focus-within:border-black transition-all">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="BUSCAR GORRA..."
                className="w-36 md:w-52 bg-transparent text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none pl-2 tracking-wide uppercase"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Toggle búsqueda móvil */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-neutral-900 hover:bg-neutral-100 rounded-full"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Botón Acceso POS Mostrador */}
          <Link
            href="/pos"
            className="p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
            title="Punto de Venta Mostrador (POS)"
          >
            <Store className="w-5 h-5" />
          </Link>

          {/* Botón WhatsApp Oficial New Era Style */}
          <a
            href={generalWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black text-white hover:bg-neutral-800 px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* INPUT DE BÚSQUEDA MÓVIL DESPLEGABLE */}
      {isSearchOpen && (
        <div className="sm:hidden px-4 pb-3 border-t border-neutral-100 bg-white">
          <div className="flex items-center bg-neutral-100 rounded-xl px-3 py-2 border border-neutral-200">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="BUSCAR EQUIPO O COLOR..."
              className="w-full bg-transparent text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none pl-2 uppercase"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-neutral-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MENÚ MÓVIL LATERAL */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (onCategorySelect) onCategorySelect(item.category);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-extrabold tracking-wider uppercase text-neutral-900 py-2 border-b border-neutral-100"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 font-bold">
            <Link href="/pos" className="flex items-center gap-1.5 text-black">
              <Store className="w-4 h-4" />
              <span>Acceder al POS Mostrador</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
