'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Store, Shield, ArrowRight, Lock, KeyRound, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loginAs, logout } = useAuth();
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'PIN' | 'ROLES'>('PIN');

  // Handle PIN submission
  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '1234') {
      setErrorMessage('');
      loginAs('CASHIER');
    } else if (pin === '8888' || pin === '0000') {
      setErrorMessage('');
      loginAs('ADMIN');
    } else {
      setErrorMessage('PIN incorrecto. (Usa 1234 para Cajera o 8888 para Admin)');
      setPin('');
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage('');
      if (nextPin.length === 4) {
        if (nextPin === '1234') {
          setTimeout(() => loginAs('CASHIER'), 150);
        } else if (nextPin === '8888' || nextPin === '0000') {
          setTimeout(() => loginAs('ADMIN'), 150);
        } else {
          setTimeout(() => {
            setErrorMessage('PIN inválido. Cajero: 1234 • Admin: 8888');
            setPin('');
          }, 200);
        }
      }
    }
  };

  const handleClearPin = () => {
    setPin('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-neutral-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Brand Indicator */}
      <div className="max-w-md w-full mx-auto pt-6 sm:pt-8 text-center space-y-3">
        <div className="flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/BRAYSA_logos/blanco/BRAYSA_02_logo_principal_blanco.png"
            alt="BRAYSA CAPS"
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-md"
          />
        </div>
        <div>
          <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase">
            Terminal Punto de Venta • BRAYSA POS
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-4">
        {/* Active Session Indicator (if logged in) */}
        {user && (
          <div className="bg-neutral-800/80 border border-neutral-700 rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="font-black text-white">{user.name}</div>
                <div className="text-[10px] text-neutral-400 uppercase font-mono">{user.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/pos"
                className="px-3 py-1.5 bg-white text-black font-black text-xs rounded-xl hover:bg-neutral-200 uppercase transition-all"
              >
                Ir al POS
              </Link>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-neutral-400 hover:text-rose-400 cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher: PIN vs Perfiles Directos */}
        <div className="flex bg-neutral-950 p-1 rounded-2xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('PIN')}
            className={`flex-1 py-2 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'PIN'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Acceso por PIN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ROLES')}
            className={`flex-1 py-2 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ROLES'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Atajo 1-Clic
          </button>
        </div>

        {/* TAB 1: PIN NUMERIC KEYPAD */}
        {activeTab === 'PIN' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-200">
                Ingresa tu PIN de 4 Dígitos
              </h2>
              <p className="text-[11px] text-neutral-400">
                Cajera: <code className="text-emerald-400 font-bold font-mono">1234</code> • Admin: <code className="text-cyan-400 font-bold font-mono">8888</code>
              </p>
            </div>

            {/* PIN Indicator Dots */}
            <div className="flex justify-center gap-3 py-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    pin.length > idx
                      ? 'bg-white border-white scale-110 shadow-xs shadow-white/50'
                      : 'border-neutral-600 bg-neutral-950'
                  }`}
                />
              ))}
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-2.5 text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-1.5 animate-in shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Numeric Keypad Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="h-14 rounded-2xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 text-lg font-black text-white transition-all cursor-pointer border border-neutral-700/80"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="h-14 rounded-2xl bg-neutral-950 hover:bg-neutral-800 active:scale-95 text-xs font-black uppercase text-neutral-400 transition-all cursor-pointer border border-neutral-800"
              >
                Borrar
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-14 rounded-2xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 text-lg font-black text-white transition-all cursor-pointer border border-neutral-700/80"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handlePinSubmit()}
                className="h-14 rounded-2xl bg-white hover:bg-neutral-200 active:scale-95 text-xs font-black uppercase text-black transition-all cursor-pointer shadow-md"
              >
                Entrar
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECT ROLE SELECTOR */}
        {activeTab === 'ROLES' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => loginAs('CASHIER')}
              className="w-full min-h-[70px] p-4 rounded-2xl border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 active:scale-[0.98] transition-all text-left flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span>Cajera Mostrador</span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Rápido
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Venta de mostrador, cobros QR/efectivo y turno de caja
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => loginAs('ADMIN')}
              className="w-full min-h-[70px] p-4 rounded-2xl border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 active:scale-[0.98] transition-all text-left flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-wider">
                    Administrador / Dueño
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Acceso total: Control de stock CPP, lotes y métricas
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          </div>
        )}

        {/* Storefront Link */}
        <div className="pt-3 text-center border-t border-neutral-800/80">
          <Link
            href="/"
            className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Ver tienda pública de clientes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        © 2026 BRAYSA CAPS • Terminal Punto de Venta Oficial
      </div>
    </div>
  );
}
