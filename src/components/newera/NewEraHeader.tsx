'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, ShoppingCart, Heart, Menu, X, ChevronRight, ArrowRight, Boxes } from 'lucide-react';
import { NewEraProduct } from './types';

interface NewEraHeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onSelectCategory?: (category: string) => void;
  onSelectTeam?: (team: string) => void;
  products: NewEraProduct[];
  onSelectProduct?: (product: NewEraProduct) => void;
}

const MLB_TEAMS = [
  'Arizona Diamondbacks', 'Atlanta Braves', 'Baltimore Orioles', 'Boston Red Sox',
  'Chicago Cubs', 'Chicago White Sox', 'Cincinnati Reds', 'Detroit Tigers',
  'Houston Astros', 'Los Angeles Dodgers', 'Milwaukee Brewers', 'New York Mets',
  'New York Yankees', 'Oakland Athletics', 'Philadelphia Phillies', 'Pittsburgh Pirates',
  'San Diego Padres', 'San Francisco Giants', 'Seattle Mariners', 'St. Louis Cardinals',
  'Toronto Blue Jays',
];

const NBA_TEAMS = [
  'Boston Celtics', 'Brooklyn Nets', 'Chicago Bulls', 'Golden State Warriors',
  'LA Lakers', 'Miami Heat', 'New York Knicks', 'Milwaukee Bucks',
];

const NFL_TEAMS = [
  'Arizona Cardinals', 'Buffalo Bills', 'Dallas Cowboys', 'Green Bay Packers',
  'Kansas City Chiefs', 'Las Vegas Raiders', 'Miami Dolphins', 'New England Patriots',
  'New York Jets',
];

const NHL_TEAMS = [
  'Pittsburgh Penguins', 'Detroit Red Wings', 'Washington Capitals',
];

const MOTORSPORT_TEAMS = [
  'McLaren F1', 'BTW Alpine F1', 'Oracle Red Bull', 'Visa Cash App', 'Haas F1',
];

export default function NewEraHeader({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSelectCategory,
  onSelectTeam,
  products,
  onSelectProduct,
}: NewEraHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMegaTab, setActiveMegaTab] = useState<'MLB' | 'NBA' | 'NFL' | 'NHL' | 'MOTORSPORT'>('MLB');

  // Omnisearch state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('TODAS');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Ctrl + K / Esc shortcut for Omnisearch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  const searchResults = useMemo(() => {
    return products
      .filter((p) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.team.toLowerCase().includes(query) ||
          p.silhouette.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query);

        let matchesFilter = true;
        if (selectedSearchFilter !== 'TODAS') {
          const filterUpper = selectedSearchFilter.toUpperCase();
          matchesFilter =
            p.silhouette.toUpperCase().includes(filterUpper) ||
            p.team.toUpperCase().includes(filterUpper) ||
            (p.regulatorType && p.regulatorType.toUpperCase().includes(filterUpper)) ||
            (filterUpper === 'REGULABLE' && true);
        }

        return matchesQuery && matchesFilter;
      })
      .slice(0, 8);
  }, [products, searchQuery, selectedSearchFilter]);

  const getTeamsForTab = () => {
    switch (activeMegaTab) {
      case 'MLB': return MLB_TEAMS;
      case 'NBA': return NBA_TEAMS;
      case 'NFL': return NFL_TEAMS;
      case 'NHL': return NHL_TEAMS;
      case 'MOTORSPORT': return MOTORSPORT_TEAMS;
      default: return MLB_TEAMS;
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${isScrolled ? 'shadow-md border-b border-neutral-200' : 'border-b border-neutral-100'
        }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
        {/* LEFT: Logo + Main Navigation links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Authentic BRAYSA Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/BRAYSA_logos/negro/BRAYSA_06_logotipo_horizontal_negro.png"
              alt="BRAYSA Caps"
              className="h-9 md:h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Menu (Matching typography: 14px, 500 weight, normal case) */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory('TODAS')}
              className="text-[14px] font-bold uppercase tracking-wider text-black hover:text-neutral-500 py-6 transition-colors cursor-pointer"
            >
              Gorras
            </button>

            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory('TODAS')}
              className="text-[14px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black py-6 transition-colors cursor-pointer"
            >
              Ver Catálogo
            </button>
          </nav>
        </div>

        {/* RIGHT: Action Icons matching Image 1 exactly:
            [Black User Circle] [Cart with badge 0] [Wishlist with badge 0] [Search icon] */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* 1. Account / Iniciar Sesión (Solid Black Circle) */}
          <Link
            href="/login"
            className="w-11 h-11 rounded-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center transition-colors shadow-xs"
            title="Mi cuenta / Iniciar Sesión"
            aria-label="Mi cuenta"
          >
            <User className="w-5 h-5 text-white" />
          </Link>

          {/* 2. Carrito (Light Gray Circle with badge count) */}
          <button
            type="button"
            onClick={onOpenCart}
            className="w-11 h-11 rounded-full bg-[#f3f3f3] hover:bg-neutral-200 flex items-center justify-center text-black relative transition-colors cursor-pointer"
            title="Carrito"
            aria-label="Carrito"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
              {cartCount}
            </span>
          </button>

          {/* 3. Wishlist (Light Gray Circle with badge count) */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="w-11 h-11 rounded-full bg-[#f3f3f3] hover:bg-neutral-200 flex items-center justify-center text-black relative transition-colors cursor-pointer"
            title="Favoritos"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
              {wishlistCount}
            </span>
          </button>

          {/* 4. Search Button (Light Gray Circle) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-11 h-11 rounded-full bg-[#f3f3f3] hover:bg-neutral-200 flex items-center justify-center text-black transition-colors cursor-pointer"
              title="Buscar"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Enhanced Omnisearch Modal (Ctrl + K) */}
            {isSearchOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
                <div
                  className="fixed inset-0"
                  onClick={() => setIsSearchOpen(false)}
                />

                <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-neutral-200 z-10 flex flex-col space-y-4 p-5 sm:p-6 animate-in zoom-in-95 duration-150">
                  {/* Top Search Input */}
                  <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                    <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por equipo, silueta (59FIFTY), SKU o modelo... [Ctrl + K]"
                      className="w-full text-sm font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="p-1 rounded-lg text-neutral-400 hover:text-black cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    )}
                    <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-100 text-neutral-500 rounded-md border border-neutral-200">
                      ESC
                    </kbd>
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {['TODAS', 'VISERA CURVA', 'VISERA PLANA', 'TRUCKER', 'BÁSICA LISA', 'REGULABLE'].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setSelectedSearchFilter(tab)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
                          selectedSearchFilter === tab
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Results List */}
                  <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onSelectProduct && onSelectProduct(item);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0 flex items-center justify-center">
                              <img
                                src={item.images[0] || '/cdn/p_yankees_1.jpg'}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800">
                                  {item.silhouette}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-bold truncate">
                                  {item.team}
                                </span>
                              </div>
                              <h4 className="text-xs font-black text-neutral-900 truncate uppercase mt-0.5">
                                {item.name}
                              </h4>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-black text-neutral-950">
                              Bs. {item.price}
                            </div>
                            <span
                              className={`text-[9px] font-bold uppercase ${
                                item.isSoldOut ? 'text-rose-600' : 'text-emerald-600'
                              }`}
                            >
                              {item.isSoldOut ? 'Agotada' : 'En Stock'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-neutral-400 text-xs">
                        No se encontraron gorras que coincidan con la búsqueda.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <img src="/BRAYSA_logos/negro/BRAYSA_06_logotipo_horizontal_negro.png" alt="BRAYSA" className="h-8 w-auto object-contain" />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-neutral-500 hover:text-black cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-neutral-100">
              <div className="pt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory && onSelectCategory('TODAS');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-3 text-base font-bold uppercase tracking-wider text-neutral-900 hover:text-black flex items-center justify-between"
                >
                  <span>Ver Todas las Gorras</span>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <div className="pt-4 space-y-2">
                <Link
                  href="/inventario"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm font-black text-neutral-900 py-2 px-3 bg-neutral-100 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-black" />
                    <span>Stock & Catálogo</span>
                  </div>
                  <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full uppercase">
                    Configurar
                  </span>
                </Link>
                <Link
                  href="/pos"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-neutral-800 py-2 px-3 hover:bg-neutral-50 rounded-xl"
                >
                  <span>Punto de Venta (POS)</span>
                </Link>
                <Link
                  href="/caja"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-700 py-2 px-3 hover:bg-neutral-50 rounded-xl"
                >
                  <span>Control de Caja</span>
                </Link>
              </div>
            </div>

            <div className="p-4 bg-black text-center flex items-center justify-center gap-2">
              <img
                src="/BRAYSA_logos/blanco/BRAYSA_04_icono_blanco.png"
                alt="BRAYSA"
                className="h-4 w-auto object-contain"
              />
              <span className="font-bold text-xs text-white tracking-widest uppercase">
                BRAYSA CAPS • BOLIVIA
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
