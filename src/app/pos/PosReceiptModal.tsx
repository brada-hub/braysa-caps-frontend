'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Share2,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Phone,
  Store,
} from 'lucide-react';
import { CartLine } from './page';

interface PosReceiptModalProps {
  saleData: {
    saleId: string;
    totalAmount: number;
    change: number;
    paymentMode: 'CASH' | 'QR' | 'MIXED';
    items: CartLine[];
    date: Date;
    customerName?: string;
  };
  onNewSale: () => void;
}

export function PosReceiptModal({ saleData, onNewSale }: PosReceiptModalProps) {
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>(saleData.customerName || '');
  const [copied, setCopied] = useState<boolean>(false);

  // Formatted date
  const formattedDate = new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(saleData.date);

  // Generate plain text receipt for WhatsApp / Clipboard
  const generateReceiptText = () => {
    const greeting = customerName ? `Hola *${customerName.trim()}*, gracias` : '¡Gracias';
    let text = `🧢 *BRAYSA CAPS - RECIBO DE COMPRA*\n`;
    text += `📍 Tienda Oficial New Era Bolivia\n`;
    text += `───────────────────────\n`;
    text += `🧾 *Ticket:* #${saleData.saleId}\n`;
    text += `📅 *Fecha:* ${formattedDate}\n`;
    text += `💳 *Método de Pago:* ${saleData.paymentMode === 'CASH' ? 'Efectivo' : saleData.paymentMode === 'QR' ? 'QR Simple' : 'Mixto (Efectivo + QR)'}\n`;
    text += `───────────────────────\n`;
    text += `*DETALLE DE GORRAS:*\n`;

    saleData.items.forEach((line, idx) => {
      const lineTotal = (line.cap.price - line.rebaja) * line.quantity;
      text += `${idx + 1}. *${line.cap.name}*\n`;
      text += `   • Talla: ${line.selectedSize} | Cant: ${line.quantity}x\n`;
      text += `   • Subtotal: Bs. ${lineTotal}${line.rebaja > 0 ? ` (Rebaja -Bs. ${line.rebaja * line.quantity})` : ''}\n`;
    });

    text += `───────────────────────\n`;
    text += `💰 *TOTAL PAGADO:* *Bs. ${saleData.totalAmount}*\n`;
    if (saleData.change > 0) {
      text += `💵 *Cambio devuelto:* Bs. ${saleData.change}\n`;
    }
    text += `───────────────────────\n`;
    text += `${greeting} por tu compra en Braysa Caps. ¡Gorras 100% auténticas New Era con stickers y sellos oficiales!\n`;
    text += `📱 Soporte / WhatsApp: +591 76543210\n`;
    text += `🌐 Catálogo: https://braysacaps.bo`;

    return text;
  };

  const handleSendWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNumber = customerPhone.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('591') ? cleanNumber : `591${cleanNumber}`;
    const text = encodeURIComponent(generateReceiptText());

    if (cleanNumber.length >= 7) {
      window.open(`https://api.whatsapp.com/send?phone=${fullNumber}&text=${text}`, '_blank');
    } else {
      // If no phone is provided, open WhatsApp share dialog directly
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const handleCopyClipboard = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(generateReceiptText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 my-auto space-y-5 shadow-2xl relative">
        {/* Top Success Badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest bg-neutral-100 px-2 py-0.5 rounded-full">
              #{saleData.saleId}
            </span>
            <h3 className="font-black text-xl uppercase tracking-tight text-neutral-950 mt-1">
              ¡Venta Registrada con Éxito!
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Stock rebajado de inventario y venta sumada al turno actual.
            </p>
          </div>
        </div>

        {/* Structured Ticket Preview Card */}
        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/90 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 text-xs text-neutral-500 font-bold">
            <span>BRAYSA CAPS • TICKET DIGITAL</span>
            <span>{formattedDate}</span>
          </div>

          {/* Items breakdown list */}
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {saleData.items.map((line, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 border-b border-neutral-200/50 last:border-none"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-black text-neutral-950 uppercase truncate">
                    {line.cap.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium">
                    Talla {line.selectedSize} • {line.quantity} un. x Bs. {line.cap.price - line.rebaja}
                  </div>
                </div>
                <div className="text-right font-black text-neutral-950 shrink-0">
                  Bs. {(line.cap.price - line.rebaja) * line.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="pt-2 border-t border-neutral-200 space-y-1 text-xs">
            <div className="flex justify-between font-medium text-neutral-500">
              <span>Método:</span>
              <span className="font-bold text-neutral-900">
                {saleData.paymentMode === 'CASH'
                  ? 'Efectivo'
                  : saleData.paymentMode === 'QR'
                  ? 'QR Simple'
                  : 'Mixto'}
              </span>
            </div>

            <div className="flex justify-between text-sm sm:text-base font-black text-neutral-950 pt-1">
              <span>Total Cobrado:</span>
              <span>Bs. {saleData.totalAmount}</span>
            </div>

            {saleData.change > 0 && (
              <div className="flex justify-between text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <span>Cambio entregado:</span>
                <span>Bs. {saleData.change}</span>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp 1-Click Dispatch Section */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-950 uppercase tracking-wider">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Enviar Recibo Digital por WhatsApp</span>
          </div>

          <form onSubmit={handleSendWhatsApp} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nombre cliente (Opcional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600"
              />

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                  +591
                </span>
                <input
                  type="tel"
                  placeholder="76543210 (Celular)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl pl-12 pr-3 py-2 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Enviar Recibo a WhatsApp</span>
            </button>
          </form>
        </div>

        {/* Secondary Actions: Thermal Print & Copy */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-black">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-500" />
                <span>Copiar Texto</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-neutral-500" />
            <span>Imprimir Ticket</span>
          </button>
        </div>

        {/* Primary Action: New Sale */}
        <div className="pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={onNewSale}
            className="w-full py-4 rounded-2xl bg-black hover:bg-neutral-800 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Iniciar Nueva Venta (Listo)</span>
          </button>
        </div>

        {/* Hidden Thermal Print Ticket (Only rendered during window.print()) */}
        <div className="hidden print:block fixed inset-0 bg-white p-4 text-black text-xs font-mono">
          <div className="text-center font-bold text-sm mb-1">BRAYSA CAPS BOLIVIA</div>
          <div className="text-center text-[10px] mb-2">GORRAS 100% ORIGINALES NEW ERA</div>
          <div className="border-b border-black my-1" />
          <div className="flex justify-between text-[10px]">
            <span>TICKET: #{saleData.saleId}</span>
            <span>{formattedDate}</span>
          </div>
          <div className="border-b border-black my-1" />
          {saleData.items.map((line, idx) => (
            <div key={idx} className="my-1">
              <div>{line.cap.name}</div>
              <div className="flex justify-between text-[10px]">
                <span>Talla {line.selectedSize} ({line.quantity} un)</span>
                <span>Bs. {(line.cap.price - line.rebaja) * line.quantity}</span>
              </div>
            </div>
          ))}
          <div className="border-b border-black my-1" />
          <div className="flex justify-between font-bold text-sm my-1">
            <span>TOTAL:</span>
            <span>Bs. {saleData.totalAmount}</span>
          </div>
          {saleData.change > 0 && (
            <div className="flex justify-between text-[10px]">
              <span>CAMBIO:</span>
              <span>Bs. {saleData.change}</span>
            </div>
          )}
          <div className="border-b border-black my-2" />
          <div className="text-center text-[9px]">¡Gracias por tu compra!</div>
        </div>
      </div>
    </div>
  );
}
