'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Banknote,
  QrCode,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  Lock,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export default function CajaPage() {
  const { shift, openShift, closeShift } = useAuth();

  // Open shift inputs
  const [initialAmountInput, setInitialAmountInput] = useState<string>('200');

  // Expense modal / quick input
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [expenseAmount, setExpenseAmount] = useState<string>('20');
  const [expenseReason, setExpenseReason] = useState<string>('Almuerzo / Comida');
  const [manualExpenses, setManualExpenses] = useState<number>(0);

  // Close shift (Arqueo) state
  const [isCloseModalOpen, setIsCloseModalOpen] = useState<boolean>(false);
  const [countedCashInput, setCountedCashInput] = useState<string>('');
  const [countMode, setCountMode] = useState<'BILLETES' | 'DIRECTO'>('BILLETES');
  const [bills200, setBills200] = useState<string>('0');
  const [bills100, setBills100] = useState<string>('0');
  const [bills50, setBills50] = useState<string>('0');
  const [bills20, setBills20] = useState<string>('0');
  const [bills10, setBills10] = useState<string>('0');
  const [coinsInput, setCoinsInput] = useState<string>('0');

  const [arqueoResult, setArqueoResult] = useState<{
    status: 'CUADRADO' | 'SOBRANTE' | 'FALTANTE';
    difference: number;
    theoretical: number;
    declared: number;
  } | null>(null);

  // Success alert
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Calculations
  const theoreticalCash = shift.isOpen
    ? shift.initialAmount + shift.totalCashSales - manualExpenses
    : 0;

  const handleOpenShift = () => {
    const amount = parseFloat(initialAmountInput) || 0;
    openShift(amount);
    setManualExpenses(0);
    setFeedbackMessage('¡Caja abierta exitosamente! Ya puedes realizar ventas.');
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount) || 0;
    if (amount <= 0) return;

    setManualExpenses((prev) => prev + amount);
    setIsExpenseModalOpen(false);
    setExpenseAmount('20');
    setFeedbackMessage(`Gasto registrado: Bs. ${amount.toFixed(2)} (${expenseReason})`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const totalPhysicalCalculated = useMemo(() => {
    if (countMode === 'DIRECTO') {
      return parseFloat(countedCashInput) || 0;
    }
    return (
      (parseInt(bills200) || 0) * 200 +
      (parseInt(bills100) || 0) * 100 +
      (parseInt(bills50) || 0) * 50 +
      (parseInt(bills20) || 0) * 20 +
      (parseInt(bills10) || 0) * 10 +
      (parseFloat(coinsInput) || 0)
    );
  }, [countMode, countedCashInput, bills200, bills100, bills50, bills20, bills10, coinsInput]);

  const liveDifference = totalPhysicalCalculated - theoreticalCash;

  const handleCalculateArqueo = () => {
    const counted = totalPhysicalCalculated;
    const diff = counted - theoreticalCash;

    let status: 'CUADRADO' | 'SOBRANTE' | 'FALTANTE' = 'CUADRADO';
    if (diff > 0.05) status = 'SOBRANTE';
    else if (diff < -0.05) status = 'FALTANTE';

    setArqueoResult({
      status,
      difference: diff,
      theoretical: theoreticalCash,
      declared: counted,
    });
  };

  const handleConfirmClose = () => {
    closeShift();
    setIsCloseModalOpen(false);
    setCountedCashInput('');
    setFeedbackMessage('¡Turno de caja cerrado correctamente!');
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-5">
      {/* Page Title & Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
            <Banknote className="w-5 h-5 text-neutral-900" />
            Control de Caja
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-0.5 uppercase tracking-wide">
            Fondo inicial, gaveta y arqueo de turno
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
            shift.isOpen
              ? 'bg-black text-white border-black'
              : 'bg-neutral-100 text-neutral-600 border-neutral-300'
          }`}
        >
          {shift.isOpen ? 'ABIERTA' : 'CERRADA'}
        </span>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="bg-neutral-950 text-white p-3.5 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* VIEW A: IF SHIFT IS CLOSED */}
      {!shift.isOpen ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black uppercase tracking-wider text-neutral-950">
              La Caja está Cerrada
            </h2>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Ingresa el dinero en efectivo que tienes en gaveta como cambio para iniciar la atención.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-700">
              Fondo Inicial / Base (Bs):
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-neutral-400">
                Bs.
              </span>
              <input
                type="number"
                min="0"
                step="10"
                value={initialAmountInput}
                onChange={(e) => setInitialAmountInput(e.target.value)}
                className="w-full text-2xl font-black text-neutral-950 pl-12 pr-4 py-3.5 rounded-2xl border-2 border-neutral-200 focus:border-black focus:outline-none transition-all"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex gap-2 pt-1">
              {[100, 150, 200, 300].map((base) => (
                <button
                  key={base}
                  type="button"
                  onClick={() => setInitialAmountInput(base.toString())}
                  className="flex-1 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-black text-neutral-800 active:scale-95 transition-all"
                >
                  {base} Bs
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenShift}
            className="w-full min-h-[52px] py-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Abrir Caja y Comenzar Turno
          </button>
        </div>
      ) : (
        /* VIEW B: IF SHIFT IS OPEN */
        <div className="space-y-4">
          {/* Main Theoretical Cash Card (New Era Premium Dark Box) */}
          <div className="bg-neutral-950 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4 border border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Efectivo Teórico en Gaveta
              </span>
              <span className="bg-white/10 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/20">
                En vivo
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tight">
              Bs. {theoreticalCash.toFixed(2)}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                  Fondo Inicial
                </span>
                <span className="font-extrabold text-white text-sm">
                  Bs. {shift.initialAmount.toFixed(2)}
                </span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                  Ventas en Efectivo
                </span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  +Bs. {shift.totalCashSales.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Stats: Digital QR & Minor Expenses */}
          <div className="grid grid-cols-2 gap-3">
            {/* QR Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <QrCode className="w-3.5 h-3.5 text-neutral-900" />
                <span>Cobrado por QR</span>
              </div>
              <div className="text-xl font-black text-neutral-950">
                Bs. {shift.totalDigitalSales.toFixed(2)}
              </div>
              <p className="text-[10px] text-neutral-400 font-medium">En cuenta bancaria</p>
            </div>

            {/* Expenses Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <MinusCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Gastos Menores</span>
              </div>
              <div className="text-xl font-black text-rose-600">
                -Bs. {manualExpenses.toFixed(2)}
              </div>
              <p className="text-[10px] text-neutral-400 font-medium">Almuerzos o compras</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Button 1: Registrar Gasto Menor */}
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <MinusCircle className="w-4 h-4 text-neutral-500" />
              <span>Registrar Gasto de Gaveta</span>
            </button>

            {/* Button 2: Cerrar Turno / Arqueo */}
            <button
              type="button"
              onClick={() => {
                setArqueoResult(null);
                setCountedCashInput('');
                setIsCloseModalOpen(true);
              }}
              className="w-full min-h-[52px] py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider active:scale-95 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-white" />
              <span>Cerrar Caja / Realizar Arqueo</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: REGISTRAR GASTO MENOR */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-neutral-200">
            <h3 className="font-black text-sm uppercase tracking-wider text-neutral-950 flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-rose-500" />
              <span>Registrar Gasto Menor</span>
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Monto que sale de gaveta (Bs):
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full text-xl font-black text-center text-neutral-950 py-3 rounded-2xl border-2 border-neutral-200 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Motivo del gasto:
                </label>
                <input
                  type="text"
                  required
                  value={expenseReason}
                  onChange={(e) => setExpenseReason(e.target.value)}
                  placeholder="Ej. Almuerzo, bolsas, cambio"
                  className="w-full text-sm font-medium text-neutral-900 p-3 rounded-2xl border border-neutral-200 focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="py-3 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  Confirmar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ARQUEO DE CIERRE DE CAJA CON CONTEO DE BILLETES */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 border border-neutral-200 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-black text-sm uppercase tracking-wider text-neutral-950 flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-950" />
                <span>Arqueo y Cierre de Turno</span>
              </h3>
              <span className="text-xs text-neutral-400 font-bold">
                Teórico: <strong>Bs. {theoreticalCash.toFixed(2)}</strong>
              </span>
            </div>

            {!arqueoResult ? (
              <div className="space-y-4">
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-2xl text-xs font-black">
                  <button
                    type="button"
                    onClick={() => setCountMode('BILLETES')}
                    className={`py-2 rounded-xl transition-all cursor-pointer ${
                      countMode === 'BILLETES'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Contador de Billetes
                  </button>
                  <button
                    type="button"
                    onClick={() => setCountMode('DIRECTO')}
                    className={`py-2 rounded-xl transition-all cursor-pointer ${
                      countMode === 'DIRECTO'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Monto Directo
                  </button>
                </div>

                {/* MODE A: BILLETES BOLIVIANOS */}
                {countMode === 'BILLETES' ? (
                  <div className="space-y-3">
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Ingresa la cantidad física de cada denominación que tienes en la gaveta:
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Bs. 200 */}
                      <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-neutral-700">Bs. 200</span>
                          <span className="font-mono text-neutral-400">
                            = Bs. {(parseInt(bills200) || 0) * 200}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={bills200}
                          onChange={(e) => setBills200(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-xl px-2 py-1 text-center font-black text-sm"
                        />
                      </div>

                      {/* Bs. 100 */}
                      <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-neutral-700">Bs. 100</span>
                          <span className="font-mono text-neutral-400">
                            = Bs. {(parseInt(bills100) || 0) * 100}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={bills100}
                          onChange={(e) => setBills100(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-xl px-2 py-1 text-center font-black text-sm"
                        />
                      </div>

                      {/* Bs. 50 */}
                      <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-neutral-700">Bs. 50</span>
                          <span className="font-mono text-neutral-400">
                            = Bs. {(parseInt(bills50) || 0) * 50}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={bills50}
                          onChange={(e) => setBills50(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-xl px-2 py-1 text-center font-black text-sm"
                        />
                      </div>

                      {/* Bs. 20 */}
                      <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-neutral-700">Bs. 20</span>
                          <span className="font-mono text-neutral-400">
                            = Bs. {(parseInt(bills20) || 0) * 20}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={bills20}
                          onChange={(e) => setBills20(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-xl px-2 py-1 text-center font-black text-sm"
                        />
                      </div>

                      {/* Bs. 10 */}
                      <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-neutral-700">Bs. 10</span>
                          <span className="font-mono text-neutral-400">
                            = Bs. {(parseInt(bills10) || 0) * 10}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={bills10}
                          onChange={(e) => setBills10(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-xl px-2 py-1 text-center font-black text-sm"
                        />
                      </div>

                      {/* Monedas */}
                      <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-neutral-700">Monedas (Bs.)</span>
                          <span className="font-mono text-neutral-400">
                            = Bs. {parseFloat(coinsInput) || 0}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={coinsInput}
                          onChange={(e) => setCoinsInput(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-xl px-2 py-1 text-center font-black text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* MODE B: DIRECT INPUT */
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Dinero físico contado total (Bs):
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-neutral-400">
                        Bs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.50"
                        autoFocus
                        value={countedCashInput}
                        onChange={(e) => setCountedCashInput(e.target.value)}
                        placeholder="0.00"
                        className="w-full text-2xl font-black text-center text-neutral-950 py-3.5 rounded-2xl border-2 border-neutral-200 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Live Count and Live Difference Box */}
                <div className="bg-neutral-900 text-white p-3.5 rounded-2xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 uppercase font-bold tracking-wider text-[10px]">
                      Total Físico en Gaveta:
                    </span>
                    <span className="text-xl font-black text-white">
                      Bs. {totalPhysicalCalculated.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold">
                      Estado en Vivo:
                    </span>
                    {Math.abs(liveDifference) < 0.05 ? (
                      <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cuadre Exacto
                      </span>
                    ) : liveDifference > 0 ? (
                      <span className="text-amber-400 font-black text-xs flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Sobrante +Bs. {liveDifference.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-rose-400 font-black text-xs flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Faltante -Bs. {Math.abs(liveDifference).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCloseModalOpen(false)}
                    className="py-3 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={handleCalculateArqueo}
                    className="py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    Verificar Arqueo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Result Status Box */}
                {arqueoResult.status === 'CUADRADO' && (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <div className="text-sm font-black uppercase tracking-wider text-emerald-950">
                      ¡Caja Cuadrada Exacta!
                    </div>
                    <p className="text-xs text-emerald-700">
                      La gaveta física coincide con las ventas del turno (Diferencia: 0.00 Bs).
                    </p>
                  </div>
                )}

                {arqueoResult.status === 'SOBRANTE' && (
                  <div className="bg-neutral-100 border-2 border-neutral-400 rounded-2xl p-4 text-center space-y-1">
                    <ArrowUpRight className="w-8 h-8 text-neutral-900 mx-auto" />
                    <div className="text-sm font-black uppercase tracking-wider text-neutral-950">
                      Hay Dinero Sobrante: +Bs. {arqueoResult.difference.toFixed(2)}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Tienes más dinero en gaveta del registrado en el sistema.
                    </p>
                  </div>
                )}

                {arqueoResult.status === 'FALTANTE' && (
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-center space-y-1">
                    <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
                    <div className="text-sm font-black uppercase tracking-wider text-rose-950">
                      Falta Dinero: -Bs. {Math.abs(arqueoResult.difference).toFixed(2)}
                    </div>
                    <p className="text-xs text-rose-700">
                      El dinero físico contado es menor al calculado por el sistema.
                    </p>
                  </div>
                )}

                <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 text-xs space-y-1">
                  <div className="flex justify-between text-neutral-500 font-medium">
                    <span>Efectivo Teórico:</span>
                    <strong className="text-neutral-900">
                      Bs. {arqueoResult.theoretical.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-neutral-500 font-medium">
                    <span>Físico Declarado:</span>
                    <strong className="text-neutral-900">
                      Bs. {arqueoResult.declared.toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setArqueoResult(null)}
                    className="py-3 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    Volver a contar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClose}
                    className="py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    Cerrar y Finalizar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
