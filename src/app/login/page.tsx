'use client';

import React from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Store, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { loginAs } = useAuth();

  const handleQuickLogin = (role: UserRole) => {
    loginAs(role);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Brand Indicator */}
      <div className="max-w-md w-full mx-auto pt-8 text-center space-y-3">
        <div className="flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/BRAYSA_logos/negro/BRAYSA_02_logo_principal_negro.png"
            alt="BRAYSA CAPS"
            className="h-16 w-auto object-contain drop-shadow-sm"
          />
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-bold tracking-widest uppercase">
            Terminal Punto de Venta • Bolivia
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-neutral-950">
            Selecciona tu Perfil
          </h2>
          <p className="text-xs text-neutral-500">
            Acceso directo al sistema para ventas en mostrador
          </p>
        </div>

        {/* Big Touch Buttons for Role Selection */}
        <div className="space-y-3">
          {/* Option 1: CAJERA */}
          <button
            type="button"
            onClick={() => handleQuickLogin('CASHIER')}
            className="w-full min-h-[74px] p-4 rounded-2xl border-2 border-neutral-200 hover:border-black bg-white hover:bg-neutral-50 active:scale-[0.98] transition-all text-left flex items-center justify-between shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:bg-neutral-800 transition-colors">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                  <span>Cajera Mostrador</span>
                  <span className="bg-neutral-100 text-neutral-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-neutral-200">
                    Rápido
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Venta táctil, cobros QR/efectivo y control de gaveta
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          {/* Option 2: ADMINISTRADOR */}
          <button
            type="button"
            onClick={() => handleQuickLogin('ADMIN')}
            className="w-full min-h-[74px] p-4 rounded-2xl border border-neutral-200 hover:border-black bg-white hover:bg-neutral-50 active:scale-[0.98] transition-all text-left flex items-center justify-between shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:bg-black transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-neutral-950 uppercase tracking-wider">
                  Administrador
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Acceso completo: Stock CPP, compras de lotes y reportes
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>
        </div>

        {/* Storefront Link */}
        <div className="pt-3 text-center border-t border-neutral-100">
          <Link
            href="/"
            className="text-xs font-bold text-neutral-600 hover:text-black uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Ver tienda pública de clientes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        © 2026 BRAYSA CAPS • Terminal Oficial
      </div>
    </div>
  );
}
