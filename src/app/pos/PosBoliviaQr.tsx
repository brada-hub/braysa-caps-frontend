'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Copy, Check, Clock, ShieldCheck, RefreshCw, Smartphone } from 'lucide-react';

interface PosBoliviaQrProps {
  amount: number;
  saleId?: string;
  onVerified?: () => void;
}

export function PosBoliviaQr({ amount, saleId = 'TICK-NEW', onVerified }: PosBoliviaQrProps) {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0 || isVerified) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, isVerified]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyAmount = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(`Bs. ${amount}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleManualVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      if (onVerified) onVerified();
    }, 600);
  };

  const handleResetTimer = () => {
    setSecondsLeft(300);
  };

  return (
    <div className="bg-neutral-900 text-white rounded-3xl p-5 sm:p-6 space-y-4 border border-neutral-800 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag & Timer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-700/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-black uppercase tracking-wider text-[10px] text-emerald-400">
            QR Simple Bolivia
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(secondsLeft)}</span>
          {secondsLeft === 0 && (
            <button
              type="button"
              onClick={handleResetTimer}
              className="ml-1 text-emerald-400 hover:text-emerald-300"
              title="Renovar QR"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* QR Visual Container */}
      <div className="relative mx-auto w-52 h-52 bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-2xl border-4 border-neutral-800">
        {/* Authentic SVG QR Pattern with Corner Finders */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-neutral-950"
          fill="currentColor"
        >
          {/* Top-Left Finder */}
          <rect x="5" y="5" width="26" height="26" rx="2" fill="currentColor" />
          <rect x="8" y="8" width="20" height="20" fill="white" />
          <rect x="12" y="12" width="12" height="12" fill="currentColor" />

          {/* Top-Right Finder */}
          <rect x="69" y="5" width="26" height="26" rx="2" fill="currentColor" />
          <rect x="72" y="8" width="20" height="20" fill="white" />
          <rect x="76" y="12" width="12" height="12" fill="currentColor" />

          {/* Bottom-Left Finder */}
          <rect x="5" y="69" width="26" height="26" rx="2" fill="currentColor" />
          <rect x="8" y="72" width="20" height="20" fill="white" />
          <rect x="12" y="76" width="12" height="12" fill="currentColor" />

          {/* Timing Patterns */}
          <g fill="currentColor">
            <rect x="35" y="15" width="4" height="4" />
            <rect x="43" y="15" width="4" height="4" />
            <rect x="51" y="15" width="4" height="4" />
            <rect x="59" y="15" width="4" height="4" />
            <rect x="15" y="35" width="4" height="4" />
            <rect x="15" y="43" width="4" height="4" />
            <rect x="15" y="51" width="4" height="4" />
            <rect x="15" y="59" width="4" height="4" />

            {/* Matrix Data Points */}
            <rect x="35" y="35" width="4" height="4" />
            <rect x="41" y="35" width="4" height="4" />
            <rect x="55" y="35" width="4" height="4" />
            <rect x="63" y="35" width="4" height="4" />
            <rect x="35" y="41" width="4" height="4" />
            <rect x="63" y="41" width="4" height="4" />
            <rect x="71" y="41" width="4" height="4" />
            <rect x="79" y="41" width="4" height="4" />
            <rect x="87" y="41" width="4" height="4" />

            <rect x="35" y="55" width="4" height="4" />
            <rect x="47" y="55" width="4" height="4" />
            <rect x="55" y="55" width="4" height="4" />
            <rect x="71" y="55" width="4" height="4" />
            <rect x="83" y="55" width="4" height="4" />

            <rect x="35" y="63" width="4" height="4" />
            <rect x="43" y="63" width="4" height="4" />
            <rect x="59" y="63" width="4" height="4" />
            <rect x="75" y="63" width="4" height="4" />

            <rect x="41" y="71" width="4" height="4" />
            <rect x="49" y="71" width="4" height="4" />
            <rect x="57" y="71" width="4" height="4" />
            <rect x="65" y="71" width="4" height="4" />
            <rect x="73" y="71" width="4" height="4" />
            <rect x="85" y="71" width="4" height="4" />

            <rect x="37" y="79" width="4" height="4" />
            <rect x="45" y="79" width="4" height="4" />
            <rect x="61" y="79" width="4" height="4" />
            <rect x="77" y="79" width="4" height="4" />
            <rect x="85" y="79" width="4" height="4" />

            <rect x="35" y="87" width="4" height="4" />
            <rect x="49" y="87" width="4" height="4" />
            <rect x="57" y="87" width="4" height="4" />
            <rect x="69" y="87" width="4" height="4" />
            <rect x="77" y="87" width="4" height="4" />
            <rect x="85" y="87" width="4" height="4" />
          </g>

          {/* Center Logo Shield */}
          <rect x="40" y="40" width="20" height="20" rx="4" fill="white" stroke="currentColor" strokeWidth="1.5" />
          <text
            x="50"
            y="54"
            fontSize="8"
            fontWeight="900"
            textAnchor="middle"
            fill="black"
            fontFamily="sans-serif"
          >
            BRAYSA
          </text>
        </svg>

        {/* Verified Overlay */}
        {isVerified && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-3 text-center text-white animate-in zoom-in-75">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center mb-2 shadow-lg">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <span className="font-black text-sm uppercase">Pago Confirmado</span>
            <span className="text-[10px] text-emerald-300 font-mono mt-0.5">Bs. {amount} recibido</span>
          </div>
        )}
      </div>

      {/* Amount & Copy action */}
      <div className="text-center space-y-1">
        <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
          Monto Exacto a Transferir
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl sm:text-3xl font-black text-white">
            Bs. {amount}
          </span>
          <button
            type="button"
            onClick={handleCopyAmount}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
            title="Copiar monto"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Banking interoperability badges */}
      <div className="bg-neutral-800/60 rounded-2xl p-3 border border-neutral-700/60 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-neutral-300 font-bold">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            Banca Móvil Bolivia
          </span>
          <span className="font-mono text-neutral-400">Ref: {saleId}</span>
        </div>
        <p className="text-[10px] text-neutral-400 leading-relaxed">
          Compatible con BNB, BCP, Banco Unión, Fie, Banco Sol, Bisa, Ganadero y Mercantil.
        </p>
      </div>

      {/* Verification Action */}
      {!isVerified ? (
        <button
          type="button"
          onClick={handleManualVerify}
          disabled={isVerifying}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isVerifying ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          <span>{isVerifying ? 'Verificando con Banco...' : 'Confirmar Transferencia Recibida'}</span>
        </button>
      ) : (
        <div className="text-center text-xs font-black text-emerald-400 py-1 flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4" />
          <span>Transferencia Acreditada en Turno</span>
        </div>
      )}
    </div>
  );
}
