'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingCart,
  Banknote,
  Boxes,
  TrendingUp,
  LogOut,
  User,
  Shield,
  Store,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AppNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, isCashier, logout, shift, openShift, closeShift } = useAuth();

  // Modal to quickly open or close shift from the TopBar badge
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [initialBaseInput, setInitialBaseInput] = useState('200');

  // Do not show the app navigation on the public storefront or login page
  const isPublicPage = pathname === '/' || pathname === '/login';

  if (isPublicPage) {
    return <>{children}</>;
  }

  const handleToggleShiftFromModal = () => {
    if (shift.isOpen) {
      closeShift();
      setIsShiftModalOpen(false);
    } else {
      const amount = parseFloat(initialBaseInput) || 0;
      openShift(amount);
      setIsShiftModalOpen(false);
    }
  };

  const navLinks = [
    {
      href: '/pos',
      label: 'Ventas (POS)',
      sub: 'Cobro y Mostrador',
      icon: ShoppingCart,
      adminOnly: false,
    },
    {
      href: '/inventario',
      label: 'Stock & Catálogo',
      sub: 'Configurar Productos',
      icon: Boxes,
      adminOnly: false,
    },
    {
      href: '/caja',
      label: 'Control de Caja',
      sub: 'Arqueos y Turnos',
      icon: Banknote,
      adminOnly: false,
    },
    {
      href: '/reportes',
      label: 'Métricas & Ganancias',
      sub: 'Reportes Financieros',
      icon: TrendingUp,
      adminOnly: false,
    },
  ];

  const getPageTitle = () => {
    switch (pathname) {
      case '/pos':
        return { title: 'Punto de Venta', subtitle: 'Terminal de Cobro Rápido' };
      case '/inventario':
        return { title: 'Stock & Configuración de Catálogo', subtitle: 'Gestión Completa de Gorras y Precios' };
      case '/caja':
        return { title: 'Control de Caja', subtitle: 'Arqueo de Efectivo y Turnos' };
      case '/reportes':
        return { title: 'Métricas y Rendimiento', subtitle: 'Ganancias Reales y Análisis de Ventas' };
      default:
        return { title: 'Sistema BRAYSA', subtitle: 'Panel de Control' };
    }
  };

  const currentPage = getPageTitle();

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950 font-sans flex flex-col">
      {/* ========================================================= */}
      {/* 1. DESKTOP TRADITIONAL SIDEBAR (FIJA A LA IZQUIERDA)       */}
      {/* ========================================================= */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-white border-r border-neutral-200 z-40">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-neutral-200 flex items-center justify-between">
          <Link href="/pos" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/BRAYSA_logos/negro/BRAYSA_06_logotipo_horizontal_negro.png"
              alt="BRAYSA CAPS"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Módulos del Sistema
          </div>

          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-black text-white shadow-sm font-bold'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-50 font-semibold'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-black'
                  }`}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs uppercase tracking-wider font-extrabold truncate">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] truncate font-medium ${
                      isActive ? 'text-neutral-300' : 'text-neutral-400'
                    }`}
                  >
                    {item.sub}
                  </span>
                </div>
              </Link>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Acceso Rápido
          </div>

          {/* Link to Storefront */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-neutral-700 hover:bg-neutral-50 hover:text-black border border-dashed border-neutral-300 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-neutral-400 group-hover:text-black" />
              <span className="text-xs font-bold uppercase tracking-wider">Ver Tienda Online</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black" />
          </Link>
        </div>

        {/* Bottom Profile & Cash Shift Status */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/60 space-y-3">
          {/* Shift status button */}
          <button
            type="button"
            onClick={() => setIsShiftModalOpen(true)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
              shift.isOpen
                ? 'bg-white text-neutral-900 border-neutral-200 shadow-2xs hover:border-black'
                : 'bg-neutral-200/60 text-neutral-500 border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  shift.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'
                }`}
              />
              <span suppressHydrationWarning className="text-[11px]">{shift.isOpen ? 'Caja Activa' : 'Caja Cerrada'}</span>
            </div>
            <span suppressHydrationWarning className="text-[10px] text-neutral-400 font-bold uppercase">
              {shift.isOpen ? `Bs. ${shift.initialAmount}` : 'Abrir'}
            </span>
          </button>

          {/* User profile */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div suppressHydrationWarning className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user?.name?.[0] || 'C'}
              </div>
              <div className="flex flex-col min-w-0">
                <span suppressHydrationWarning className="text-xs font-black text-neutral-950 uppercase truncate">
                  {user?.name || 'Cajera'}
                </span>
                <span suppressHydrationWarning className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide truncate">
                  {isAdmin ? 'Administrador' : 'Cajero'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-200/70 transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. TOPBAR FOR DESKTOP & MOBILE HEADER                      */}
      {/* ========================================================= */}
      <header className="md:pl-64 sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        {/* Mobile Logo / Desktop Section Title */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center gap-2">
            <Link href="/pos">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/BRAYSA_logos/negro/BRAYSA_04_icono_negro.png"
                alt="BRAYSA"
                className="w-7 h-7 object-contain"
              />
            </Link>
          </div>

          <div className="flex flex-col">
            <h1 suppressHydrationWarning className="text-sm md:text-base font-black uppercase tracking-wider text-neutral-950">
              {currentPage.title}
            </h1>
            <p suppressHydrationWarning className="hidden md:block text-[11px] text-neutral-500 font-medium tracking-wide">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Cash Shift Badge */}
          <button
            type="button"
            onClick={() => setIsShiftModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border transition-all active:scale-95 cursor-pointer ${
              shift.isOpen
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
            }`}
            title="Toca para gestionar turno de caja"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                shift.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-400'
              }`}
            />
            <span suppressHydrationWarning className="text-[11px]">{shift.isOpen ? 'Caja Abierta' : 'Caja Cerrada'}</span>
          </button>

          {/* Quick Storefront Link */}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors uppercase tracking-wider"
            title="Abrir tienda de clientes"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Tienda</span>
          </Link>

          {/* Mobile Logout */}
          <button
            type="button"
            onClick={logout}
            className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-black"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. MAIN CONTENT WRAPPER (RESPONSIVO CON OFFSET EN PC)      */}
      {/* ========================================================= */}
      <main className="md:pl-64 flex-1 w-full pb-20 md:pb-8">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>

      {/* ========================================================= */}
      {/* 4. MOBILE BOTTOM NAV (SOLO PANTALLAS PEQUEÑAS < 768px)     */}
      {/* ========================================================= */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-md px-2 py-1.5 safe-bottom"
      >
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-[50px] flex flex-col items-center justify-center rounded-2xl transition-all active:scale-95 ${
                  isActive
                    ? 'bg-black text-white font-black shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-bold'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 uppercase tracking-wider font-extrabold">
                  {item.label.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 5. QUICK CASH SHIFT MODAL                                 */}
      {/* ========================================================= */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-extrabold text-base text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <Banknote className="w-5 h-5 text-neutral-900" />
                <span>Estado de Caja</span>
              </h3>
              <button
                onClick={() => setIsShiftModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {shift.isOpen ? (
              <div className="space-y-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-black mx-auto mb-1.5" />
                  <div className="font-black text-neutral-900 text-base uppercase">Caja Abierta y Activa</div>
                  <div className="text-xs text-neutral-600 mt-0.5">
                    Fondo inicial: <strong className="text-black">Bs. {shift.initialAmount}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/caja"
                    onClick={() => setIsShiftModalOpen(false)}
                    className="min-h-[48px] py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs text-center flex items-center justify-center active:scale-95 transition-all uppercase tracking-wider"
                  >
                    Ver Arqueo
                  </Link>
                  <button
                    type="button"
                    onClick={handleToggleShiftFromModal}
                    className="min-h-[48px] py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 font-extrabold text-xs active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Cerrar Turno
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-center">
                  <XCircle className="w-8 h-8 text-neutral-400 mx-auto mb-1.5" />
                  <div className="font-black text-neutral-900 text-base uppercase">Caja Cerrada</div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Ingresa el monto de cambio inicial para comenzar a vender.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1">
                    Fondo Base Inicial (Bs)
                  </label>
                  <input
                    type="number"
                    value={initialBaseInput}
                    onChange={(e) => setInitialBaseInput(e.target.value)}
                    placeholder="200"
                    className="w-full bg-neutral-50 border-2 border-neutral-300 rounded-xl px-3 py-2 text-sm font-black text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleToggleShiftFromModal}
                  className="w-full min-h-[48px] py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Abrir Caja Ahora</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
