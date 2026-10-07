'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  QrCode,
  Banknote,
  Boxes,
  Store,
  Tag,
  X,
  CreditCard,
  ChevronRight,
  Receipt,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Volume2,
  VolumeX,
  Keyboard,
  Coins,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Phone,
  User,
} from 'lucide-react';
import { INITIAL_NEW_ERA_PRODUCTS } from '@/components/newera/productsData';
import { NewEraProduct } from '@/components/newera/types';
import { BRAYSA_INVENTORY_STORAGE_KEY, InventoryCapItem, KardexMovementItem } from '../inventario/page';
import { posAudio } from './posAudio';
import { PosBoliviaQr } from './PosBoliviaQr';
import { PosReceiptModal } from './PosReceiptModal';

export interface PosCapItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  silhouette: string;
  team: string;
  league: string;
  price: number;
  costPrice: number;
  stock: number;
  images: string[];
  colors: string[];
  sizes: string[];
  isActive: boolean;
}

export interface CartLine {
  cap: PosCapItem;
  selectedSize: string;
  quantity: number;
  rebaja: number; // Rebaja en Bs por unidad
}

// Helper to breakdown Bolivian change into exact bills and coins
function getBolivianChangeBreakdown(change: number): string[] {
  if (change <= 0) return [];
  const denominations = [
    { value: 200, label: 'billete(s) de Bs. 200' },
    { value: 100, label: 'billete(s) de Bs. 100' },
    { value: 50, label: 'billete(s) de Bs. 50' },
    { value: 20, label: 'billete(s) de Bs. 20' },
    { value: 10, label: 'billete(s) de Bs. 10' },
    { value: 5, label: 'moneda(s) de Bs. 5' },
    { value: 2, label: 'moneda(s) de Bs. 2' },
    { value: 1, label: 'moneda(s) de Bs. 1' },
  ];

  let remaining = Math.floor(change);
  const breakdown: string[] = [];

  for (const denom of denominations) {
    if (remaining >= denom.value) {
      const count = Math.floor(remaining / denom.value);
      remaining = remaining % denom.value;
      breakdown.push(`${count} ${denom.label}`);
    }
  }

  return breakdown;
}

export default function PosPage() {
  const { user, shift, setShift } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sound toggle (persisted)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Products loaded from the real BRAYSA catalog & synchronized with /inventario
  const [products, setProducts] = useState<PosCapItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('TODAS');

  // Cart State
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Customer metadata for the active sale
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Size Picker Modal (When clicking a cap with multiple fitted sizes)
  const [sizingModalCap, setSizingModalCap] = useState<PosCapItem | null>(null);
  const [chosenSize, setChosenSize] = useState<string>('');

  // Payment Drawer / Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'QR' | 'MIXED'>('CASH');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [splitCashInput, setSplitCashInput] = useState<string>('');
  const [isSubmittingSale, setIsSubmittingSale] = useState(false);
  const [qrVerified, setQrVerified] = useState(false);

  // Success Ticket Modal
  const [saleCompletedData, setSaleCompletedData] = useState<{
    saleId: string;
    totalAmount: number;
    change: number;
    paymentMode: 'CASH' | 'QR' | 'MIXED';
    items: CartLine[];
    date: Date;
    customerName?: string;
    customerPhone?: string;
  } | null>(null);

  // Init Audio preference
  useEffect(() => {
    try {
      const savedAudio = localStorage.getItem('braysa_pos_audio');
      if (savedAudio !== null) {
        const val = savedAudio === 'true';
        setAudioEnabled(val);
        posAudio.enabled = val;
      }
    } catch {
      // safe fallback
    }
  }, []);

  const toggleAudio = () => {
    const nextVal = !audioEnabled;
    setAudioEnabled(nextVal);
    posAudio.enabled = nextVal;
    try {
      localStorage.setItem('braysa_pos_audio', String(nextVal));
    } catch {}
  };

  // Load products from inventory storage or initialize with official store catalog
  const loadInventory = () => {
    try {
      const stored = localStorage.getItem(BRAYSA_INVENTORY_STORAGE_KEY);
      if (stored) {
        const parsed: InventoryCapItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with rich product data (images, sizes, team)
          const merged: PosCapItem[] = INITIAL_NEW_ERA_PRODUCTS.map((prod) => {
            const found = parsed.find((i) => i.id === prod.id || i.sku === prod.sku);
            return {
              id: prod.id,
              sku: prod.sku,
              name: found?.name || prod.name,
              brand: prod.brand || 'BRAYSA CAPS',
              silhouette: (found?.silhouette as any) || prod.silhouette,
              team: found?.team || prod.team,
              league: prod.league || 'URBANO',
              price: found ? found.salePrice : prod.price,
              costPrice: found ? found.currentUnitCost : Math.round(prod.price * 0.55),
              stock: found ? found.currentStock : prod.isSoldOut ? 0 : 12,
              images: (found && found.images && found.images.length > 0) ? found.images : (prod.images || ['/cdn/p_yankees_1.jpg']),
              colors: prod.colors?.map((c) => c.name) || ['Original'],
              sizes: (found && found.sizes && found.sizes.length > 0) ? found.sizes : (prod.sizes || ['Unitalla Ajustable']),
              isActive: found ? found.isActive : true,
            };
          });

          // Also include new custom products created in /inventario
          const customItems: PosCapItem[] = parsed
            .filter((item) => !INITIAL_NEW_ERA_PRODUCTS.some((p) => p.id === item.id || p.sku === item.sku) && item.isActive !== false)
            .map((item) => ({
              id: item.id,
              sku: item.sku,
              name: item.name,
              brand: item.brand || 'BRAYSA CAPS',
              silhouette: (item.silhouette as any) || 'Visera Curva',
              team: item.team || 'BRAYSA STREETWEAR',
              league: 'URBANO',
              price: item.salePrice,
              costPrice: item.currentUnitCost,
              stock: item.currentStock,
              images: item.images && item.images.length > 0 ? item.images : ['/cdn/p_yankees_1.jpg'],
              colors: [item.color || 'Negro'],
              sizes: item.sizes && item.sizes.length > 0 ? item.sizes : ['Unitalla Ajustable'],
              isActive: true,
            }));

          setProducts([...customItems, ...merged]);
          return;
        }
      }
    } catch {
      // Fallback to store products
    }

    const fallback: PosCapItem[] = INITIAL_NEW_ERA_PRODUCTS.map((prod) => ({
      id: prod.id,
      sku: prod.sku,
      name: prod.name,
      brand: prod.brand || 'BRAYSA CAPS',
      silhouette: prod.silhouette,
      team: prod.team,
      league: prod.league || 'URBANO',
      price: prod.price,
      costPrice: Math.round(prod.price * 0.55),
      stock: prod.isSoldOut ? 0 : 12,
      images: prod.images || ['/cdn/p_yankees_1.jpg'],
      colors: prod.colors?.map((c) => c.name) || ['Original'],
      sizes: prod.sizes || ['Unitalla Ajustable'],
      isActive: true,
    }));
    setProducts(fallback);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((cap) => {
      if (!cap.isActive) return false;

      const matchSearch =
        cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.silhouette.toLowerCase().includes(searchTerm.toLowerCase());

      let matchCategory = true;
      if (selectedFilter !== 'TODAS') {
        matchCategory = cap.silhouette.toUpperCase() === selectedFilter.toUpperCase();
      }

      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedFilter]);

  // Cart Calculations
  const totalUnits = useMemo(() => cart.reduce((acc, l) => acc + l.quantity, 0), [cart]);

  const subtotalBeforeDiscounts = useMemo(
    () => cart.reduce((acc, l) => acc + l.cap.price * l.quantity, 0),
    [cart]
  );

  const totalRebajas = useMemo(
    () => cart.reduce((acc, l) => acc + l.rebaja * l.quantity, 0),
    [cart]
  );

  const totalToPay = Math.max(0, subtotalBeforeDiscounts - totalRebajas);

  // Cash / Change Calculations
  const parsedCash = parseFloat(cashTendered) || 0;
  const changeToReturn = Math.max(0, parsedCash - totalToPay);
  const changeBreakdown = useMemo(() => getBolivianChangeBreakdown(changeToReturn), [changeToReturn]);

  // Split payment
  const parsedSplitCash = Math.min(totalToPay, parseFloat(splitCashInput) || 0);
  const remainingSplitQr = Math.max(0, totalToPay - parsedSplitCash);

  // Click on a product card - Instant 1-click add to ticket for physical POS counter speed
  const handleProductClick = (cap: PosCapItem) => {
    if (cap.stock <= 0) return;
    addToCartWithDetails(cap, cap.sizes?.[0] || 'Unitalla Ajustable');
  };

  const addToCartWithDetails = (cap: PosCapItem, size: string) => {
    posAudio.playAdd();

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (line) => line.cap.id === cap.id && line.selectedSize === size
      );

      if (existingIdx >= 0) {
        const currentQty = prev[existingIdx].quantity;
        if (currentQty >= cap.stock) return prev;
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { cap, selectedSize: size, quantity: 1, rebaja: 0 }];
      }
    });

    setSizingModalCap(null);
  };

  // Modify Cart Quantities
  const handleUpdateQuantity = (capId: string, size: string, delta: number) => {
    if (delta > 0) {
      posAudio.playAdd();
    }
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.cap.id === capId && line.selectedSize === size) {
            const nextQty = line.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > line.cap.stock) return line;
            return { ...line, quantity: nextQty };
          }
          return line;
        })
        .filter(Boolean) as CartLine[]
    );
  };

  // Apply quick per-unit discount (Rebaja en Bolivianos)
  const handleApplyRebaja = (capId: string, size: string, rebajaBs: number) => {
    setCart((prev) =>
      prev.map((line) => {
        if (line.cap.id === capId && line.selectedSize === size) {
          const maxRebaja = Math.max(0, line.cap.price - line.cap.costPrice);
          const safeRebaja = Math.min(Math.max(0, rebajaBs), maxRebaja);
          return { ...line, rebaja: safeRebaja };
        }
        return line;
      })
    );
  };

  // Open Checkout Modal
  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setCashTendered(totalToPay.toString());
    setSplitCashInput(Math.floor(totalToPay / 2).toString());
    setQrVerified(false);
    setIsCartDrawerOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 or Ctrl+K: Focus search
      if (e.key === 'F2' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Escape: Close open modals or blur search
      if (e.key === 'Escape') {
        if (sizingModalCap) {
          setSizingModalCap(null);
          return;
        }
        if (isPaymentModalOpen) {
          setIsPaymentModalOpen(false);
          return;
        }
        if (saleCompletedData) {
          setSaleCompletedData(null);
          return;
        }
        if (searchTerm) {
          setSearchTerm('');
          return;
        }
      }

      // F4: Open Checkout (when not in payment modal)
      if (e.key === 'F4' && cart.length > 0 && !isPaymentModalOpen) {
        e.preventDefault();
        handleOpenCheckout();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sizingModalCap, isPaymentModalOpen, saleCompletedData, searchTerm, cart, totalToPay]);

  // Quick Cash Additions helper
  const handleAddBill = (billValue: number) => {
    const current = parseFloat(cashTendered) || 0;
    setCashTendered((current + billValue).toString());
  };

  // Smart presets for Bolivian cash based on totalToPay
  const smartCashPresets = useMemo(() => {
    const presets = [totalToPay];
    const base10 = Math.ceil(totalToPay / 10) * 10;
    const base20 = Math.ceil(totalToPay / 20) * 20;
    const base50 = Math.ceil(totalToPay / 50) * 50;
    const base100 = Math.ceil(totalToPay / 100) * 100;
    const next100 = base100 + 100;

    [base10, base20, base50, base100, next100].forEach((val) => {
      if (val > totalToPay && !presets.includes(val) && presets.length < 5) {
        presets.push(val);
      }
    });

    return presets;
  }, [totalToPay]);

  // Finalize Sale
  const handleConfirmSale = () => {
    setIsSubmittingSale(true);

    setTimeout(() => {
      // 1. Deduct stock in memory and in localStorage `braysa_caps_inventory`
      try {
        const stored = localStorage.getItem(BRAYSA_INVENTORY_STORAGE_KEY);
        let inventoryList: InventoryCapItem[] = stored ? JSON.parse(stored) : [];

        cart.forEach((line) => {
          const target = inventoryList.find((i) => i.id === line.cap.id || i.sku === line.cap.sku);
          if (target) {
            target.currentStock = Math.max(0, target.currentStock - line.quantity);
            target.lastUpdated = new Date().toISOString();
          }
        });

        localStorage.setItem(BRAYSA_INVENTORY_STORAGE_KEY, JSON.stringify(inventoryList));
      } catch {}

      // 2. Update local products state
      setProducts((prev) =>
        prev.map((c) => {
          const inCartLines = cart.filter((l) => l.cap.id === c.id);
          if (inCartLines.length > 0) {
            const soldQty = inCartLines.reduce((acc, l) => acc + l.quantity, 0);
            return { ...c, stock: Math.max(0, c.stock - soldQty) };
          }
          return c;
        })
      );

      // 3. Update cash shift totals immediately with direct storage sync
      setShift((s) => {
        const count = (s.salesCount || 0) + 1;
        let updated: any;
        if (paymentMode === 'CASH') {
          updated = { ...s, totalCashSales: (s.totalCashSales || 0) + totalToPay, salesCount: count };
        } else if (paymentMode === 'QR') {
          updated = { ...s, totalDigitalSales: (s.totalDigitalSales || 0) + totalToPay, salesCount: count };
        } else {
          updated = {
            ...s,
            totalCashSales: (s.totalCashSales || 0) + parsedSplitCash,
            totalDigitalSales: (s.totalDigitalSales || 0) + remainingSplitQr,
            salesCount: count,
          };
        }
        try {
          localStorage.setItem('ksera_cash_shift', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 4. Play success sound
      posAudio.playSuccess();

      // 5. Open ticket receipt
      setSaleCompletedData({
        saleId: `TICK-${Date.now().toString().slice(-4)}`,
        totalAmount: totalToPay,
        change: paymentMode === 'CASH' ? changeToReturn : 0,
        paymentMode,
        items: [...cart],
        date: new Date(),
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
      });

      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setIsPaymentModalOpen(false);
      setIsSubmittingSale(false);
    }, 350);
  };

  const totalShiftSales = shift.totalCashSales + shift.totalDigitalSales;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* ============================================================== */}
      {/* 1. TOP STATUS BAR: SHIFT STATS & QUICK ACTIONS                 */}
      {/* ============================================================== */}
      <div className="bg-neutral-900 text-white rounded-3xl p-4 sm:p-5 border border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Shift indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wider text-white">
                Punto de Venta BRAYSA
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Caja Activa
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Operador: <strong className="text-neutral-200">{user?.name || 'Cajero Oficial'}</strong> • Moneda: <strong className="text-neutral-200">Bolivianos (Bs.)</strong>
            </p>
          </div>
        </div>

        {/* Center/Right: Live Shift Cash & QR metrics + Sound & Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Shift Cash metric */}
          <Link
            href="/caja"
            className="bg-neutral-800/80 hover:bg-neutral-800 px-3.5 py-2 rounded-2xl border border-neutral-700/80 transition-all flex items-center gap-2 cursor-pointer"
            title="Ver arqueo detallado en Caja"
          >
            <Banknote className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">Efectivo</div>
              <div className="font-black text-white">Bs. {shift.totalCashSales}</div>
            </div>
          </Link>

          {/* Shift QR metric */}
          <Link
            href="/caja"
            className="bg-neutral-800/80 hover:bg-neutral-800 px-3.5 py-2 rounded-2xl border border-neutral-700/80 transition-all flex items-center gap-2 cursor-pointer"
            title="Ver ventas QR en Caja"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">QR Simple</div>
              <div className="font-black text-white">Bs. {shift.totalDigitalSales}</div>
            </div>
          </Link>

          {/* Total Sales today & transaction count */}
          <div className="bg-neutral-800/80 px-3.5 py-2 rounded-2xl border border-neutral-700/80 hidden sm:flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                Total Turno ({shift.salesCount || 0} ventas)
              </div>
              <div className="font-black text-white">Bs. {totalShiftSales}</div>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              audioEnabled
                ? 'bg-neutral-800 text-emerald-400 border-neutral-700 hover:bg-neutral-700'
                : 'bg-neutral-800/40 text-neutral-500 border-neutral-700 hover:text-white'
            }`}
            title={audioEnabled ? 'Sonidos de POS activados (Clic para silenciar)' : 'Sonidos silenciados (Clic para activar)'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SEARCH BAR & SILHOUETTE CATEGORY FILTERS                    */}
      {/* ============================================================== */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Omnisearch Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por equipo (Dodgers, Yankees), modelo o SKU... [F2]"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-20 py-3 text-xs sm:text-sm font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors uppercase tracking-wider"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-neutral-400 hover:text-black p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-neutral-200 text-neutral-600 rounded-md">
                F2
              </kbd>
            </div>
          </div>

          {/* Quick shortcuts pills */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-2xl border border-neutral-200 text-[11px] font-mono text-neutral-500 font-bold">
              <Keyboard className="w-3.5 h-3.5 text-neutral-400" />
              <span>F2: Buscar</span>
              <span>•</span>
              <span>F4: Cobrar</span>
              <span>•</span>
              <span>Esc: Cerrar</span>
            </div>

            <Link
              href="/inventario"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-black uppercase tracking-wider transition-all"
            >
              <Boxes className="w-4 h-4" />
              <span>Stock</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider shadow-xs transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Ver Tienda</span>
            </Link>
          </div>
        </div>

        {/* Silhouette Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'TODAS', label: 'Todas las Gorras' },
            { id: 'VISERA CURVA', label: 'Visera Curva (Dad Cap)' },
            { id: 'VISERA PLANA', label: 'Visera Plana (Snapback)' },
            { id: 'TRUCKER', label: 'Trucker (Con Malla)' },
            { id: 'BÁSICA LISA', label: 'Básica Lisa' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-4 py-2 rounded-full font-black uppercase tracking-wider text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN WORKSPACE: CATALOG GRID + SIDE TICKET                  */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: GRID DE GORRAS CON ACCESO DIRECTO A TALLAS     */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-bold px-1">
            <span>Catálogo BRAYSA CAPS ({filteredProducts.length} modelos listos para mostrador)</span>
            <span>Precios en Bolivianos (Bs.)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white border border-neutral-200 rounded-3xl p-12 text-center text-neutral-400 text-sm">
                No se encontraron gorras con esos criterios. Presiona <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-black font-bold">Esc</kbd> para reiniciar.
              </div>
            ) : (
              filteredProducts.map((cap) => {
                const isSoldOut = cap.stock <= 0;
                const inCartQty = cart
                  .filter((l) => l.cap.id === cap.id)
                  .reduce((acc, l) => acc + l.quantity, 0);

                return (
                  <div
                    key={cap.id}
                    className={`relative bg-white border border-neutral-200 hover:border-black rounded-3xl p-3 sm:p-3.5 text-left flex flex-col justify-between transition-all duration-200 group shadow-xs ${
                      isSoldOut ? 'opacity-40' : ''
                    } ${inCartQty > 0 ? 'ring-2 ring-black bg-neutral-50/50' : ''}`}
                  >
                    {/* Badge if in cart */}
                    {inCartQty > 0 && (
                      <div className="absolute top-2.5 right-2.5 z-20 bg-black text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                        {inCartQty}
                      </div>
                    )}

                    {/* Product Click Trigger Container */}
                    <button
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => handleProductClick(cap)}
                      className="w-full text-left cursor-pointer focus:outline-none"
                    >
                      {/* Image Box */}
                      <div className="w-full aspect-square rounded-2xl bg-neutral-50 relative overflow-hidden mb-3 border border-neutral-100 flex items-center justify-center">
                        {cap.images?.[0] ? (
                          <Image
                            src={cap.images[0]}
                            alt={cap.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-neutral-400 text-xs">Sin imagen</div>
                        )}

                        {/* Stock badge */}
                        <div className="absolute bottom-2 left-2 z-10">
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isSoldOut
                                ? 'bg-rose-600 text-white'
                                : cap.stock <= 3
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-white/90 backdrop-blur-xs text-neutral-900 border border-neutral-200 shadow-2xs'
                            }`}
                          >
                            {isSoldOut ? 'Agotada' : `${cap.stock} en stock`}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800">
                            {cap.silhouette}
                          </span>
                          <span className="font-mono text-neutral-400 font-bold">{cap.sku}</span>
                        </div>

                        <h3 className="font-black text-xs uppercase tracking-tight text-neutral-950 line-clamp-1 group-hover:text-black">
                          {cap.name}
                        </h3>

                        <p className="text-[11px] text-neutral-500 truncate font-medium">
                          {cap.team} • {cap.colors[0]}
                        </p>
                      </div>
                    </button>

                    {/* Adjustable Sizing Badge */}
                    {!isSoldOut && (
                      <div className="flex items-center gap-1.5 py-1 mt-1 border-t border-neutral-100 text-[10px] font-bold text-neutral-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>Unitalla Ajustable • Con Regulador</span>
                      </div>
                    )}

                    {/* Price and Add Button */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <div className="text-sm sm:text-base font-black text-neutral-950">
                        Bs. {cap.price}
                      </div>

                      <button
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => handleProductClick(cap)}
                        className="w-7 h-7 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-30 text-white flex items-center justify-center text-xs font-black shadow-xs active:scale-90 transition-transform cursor-pointer"
                        title="Agregar al ticket"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: TICKET DE VENTA Y COBRO (SIDE PANEL DESKTOP)            */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-black text-white">
                  <ShoppingCart className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-black text-sm uppercase tracking-wider text-neutral-950">
                    Ticket Mostrador
                  </h2>
                  <p className="text-[10px] text-neutral-400 font-bold">
                    {totalUnits === 0 ? 'Sin gorras seleccionadas' : `${totalUnits} gorras en ticket`}
                  </p>
                </div>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 uppercase tracking-wider cursor-pointer"
                >
                  Vaciar
                </button>
              )}
            </div>

            {/* Optional Customer quick tag */}
            {cart.length > 0 && (
              <div className="bg-neutral-50 rounded-2xl p-2.5 border border-neutral-200/80 flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cliente mostrador (Opcional)..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
            )}

            {/* Cart Lines */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-2">
                  <ShoppingCart className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-xs font-medium">Toca cualquier gorra para agregarla al ticket</p>
                </div>
              ) : (
                cart.map((line) => {
                  const lineTotal = (line.cap.price - line.rebaja) * line.quantity;

                  return (
                    <div
                      key={`${line.cap.id}-${line.selectedSize}`}
                      className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-black text-xs text-neutral-950 uppercase line-clamp-1">
                            {line.cap.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium mt-0.5">
                            <span className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 font-bold text-neutral-800">
                              Talla: {line.selectedSize}
                            </span>
                            <span>•</span>
                            <span>Bs. {line.cap.price} c/u</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-neutral-950">
                            Bs. {lineTotal}
                          </div>
                          {line.rebaja > 0 && (
                            <span className="text-[9px] text-rose-600 font-bold">
                              -Bs. {line.rebaja * line.quantity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper + Quick Discount */}
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 text-xs">
                        {/* Stepper */}
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-neutral-200">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(line.cap.id, line.selectedSize, -1)}
                            className="w-6 h-6 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-700 font-black cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-black text-xs text-neutral-950">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(line.cap.id, line.selectedSize, 1)}
                            className="w-6 h-6 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-700 font-black cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Quick Rebaja Pill */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-neutral-400 font-bold">Rebaja:</span>
                          {[0, 10, 20].map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => handleApplyRebaja(line.cap.id, line.selectedSize, amount)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                                line.rebaja === amount
                                  ? 'bg-black text-white'
                                  : 'bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300'
                              }`}
                            >
                              {amount === 0 ? '0' : `-${amount}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-500 font-medium">
                <span>Subtotal ({totalUnits} gorras)</span>
                <span>Bs. {subtotalBeforeDiscounts}</span>
              </div>
              {totalRebajas > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Descuentos / Rebajas</span>
                  <span>-Bs. {totalRebajas}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-neutral-950 pt-2 border-t border-neutral-100">
                <span>Total a Cobrar</span>
                <span>Bs. {totalToPay}</span>
              </div>
            </div>

            {/* Main Checkout Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleOpenCheckout}
              className="w-full py-4 rounded-2xl bg-black hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Banknote className="w-4 h-4" />
              <span>Cobrar Bs. {totalToPay} [F4]</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MOBILE BOTTOM BAR                                           */}
      {/* ============================================================== */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-16 left-4 right-4 z-40 max-w-md mx-auto">
          <button
            type="button"
            onClick={handleOpenCheckout}
            className="w-full bg-black text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between active:scale-95 transition-all border border-neutral-800 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm">
                {totalUnits}
              </div>
              <div className="text-left">
                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Total a Cobrar
                </div>
                <div className="text-base font-black text-white">Bs. {totalToPay}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-xs">
              <span>Cobrar</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: SELECTOR DE TALLAS FITTED                             */}
      {/* ============================================================== */}
      {sizingModalCap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-black text-sm uppercase tracking-wider text-neutral-950">
                  Seleccionar Talla de Gorra
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  {sizingModalCap.name} ({sizingModalCap.silhouette})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSizingModalCap(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Size Buttons Grid */}
            <div className="grid grid-cols-4 gap-2 py-2">
              {sizingModalCap.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setChosenSize(sz)}
                  className={`py-3 rounded-2xl text-xs font-black uppercase transition-all cursor-pointer ${
                    chosenSize === sz
                      ? 'bg-black text-white shadow-sm scale-105'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSizingModalCap(null)}
                className="px-4 py-2 rounded-xl text-neutral-600 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => addToCartWithDetails(sizingModalCap, chosenSize)}
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                Agregar al Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: COBRO RÁPIDO CON BILLETES BOLIVIANOS & QR INTEGRADO   */}
      {/* ============================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 my-auto space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-black text-base uppercase tracking-wider text-neutral-950">
                  Cobro en Mostrador
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  {totalUnits} gorras seleccionadas • Total: <strong>Bs. {totalToPay}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Optional Customer Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200">
              <div className="relative">
                <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Nombre Cliente (Opcional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-8 pr-2 py-1.5 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
                />
              </div>

              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="WhatsApp (+591 Opcional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-8 pr-2 py-1.5 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('CASH')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  paymentMode === 'CASH'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('QR')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  paymentMode === 'QR'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>QR Simple</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('MIXED')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  paymentMode === 'MIXED'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Mixto</span>
              </button>
            </div>

            {/* CASH MODE: BOLIVIAN QUICK BILLS & CHANGE CALCULATOR */}
            {paymentMode === 'CASH' && (
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-700">
                    Monto Recibido del Cliente
                  </label>
                  <button
                    type="button"
                    onClick={() => setCashTendered('')}
                    className="text-[11px] font-bold text-neutral-400 hover:text-neutral-900 cursor-pointer"
                  >
                    Limpiar
                  </button>
                </div>

                {/* Main Cash Input */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-neutral-400">
                    Bs.
                  </span>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    autoFocus
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-12 pr-4 py-2.5 text-xl font-black text-neutral-950 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Bolivian Banknotes Chips: +10, +20, +50, +100, +200 */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Billetes Bolivianos (+ sumar rápido)
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[10, 20, 50, 100, 200].map((bill) => (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => handleAddBill(bill)}
                        className="py-1.5 px-1 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-neutral-200 rounded-xl text-center text-xs font-black text-neutral-900 transition-all cursor-pointer active:scale-95 shadow-2xs"
                      >
                        +Bs.{bill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smart Presets Suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Sugerencias de Pago
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {smartCashPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCashTendered(preset.toString())}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          parsedCash === preset
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-white hover:bg-neutral-200 text-neutral-800 border border-neutral-200'
                        }`}
                      >
                        {preset === totalToPay ? `Exacto Bs. ${preset}` : `Bs. ${preset}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Change or Missing Alert Card */}
                <div className="pt-2 border-t border-neutral-200">
                  {parsedCash >= totalToPay ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 uppercase">
                          Vuelto al Cliente:
                        </span>
                        <span className="text-xl font-black text-emerald-700">
                          Bs. {changeToReturn}
                        </span>
                      </div>

                      {/* Smart Breakdown of coins/bills to deliver */}
                      {changeBreakdown.length > 0 && (
                        <div className="text-[10px] text-emerald-700/90 font-medium pt-1 border-t border-emerald-200/60 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Entregar: {changeBreakdown.join(' + ')}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-800 uppercase flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        Faltan por cobrar:
                      </span>
                      <span className="text-lg font-black text-rose-700">
                        Bs. {totalToPay - parsedCash}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QR SIMPLE MODE: BOLIVIAN BANK-GRADE SVG QR COMPONENT */}
            {paymentMode === 'QR' && (
              <PosBoliviaQr
                amount={totalToPay}
                saleId={`TICK-${Date.now().toString().slice(-4)}`}
                onVerified={() => setQrVerified(true)}
              />
            )}

            {/* MIXED PAYMENT MODE */}
            {paymentMode === 'MIXED' && (
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1">
                    Parte Recibida en Efectivo (Bs.)
                  </label>
                  <input
                    type="number"
                    value={splitCashInput}
                    onChange={(e) => setSplitCashInput(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-sm font-black text-neutral-950"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-neutral-600 pt-1">
                  <span>Restante a cobrar por QR Simple:</span>
                  <span className="font-black text-neutral-950">Bs. {remainingSplitQr}</span>
                </div>
              </div>
            )}

            {/* Submit Payment Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-neutral-600 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Volver
              </button>

              <button
                type="button"
                disabled={isSubmittingSale || (paymentMode === 'CASH' && parsedCash < totalToPay)}
                onClick={handleConfirmSale}
                className="px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Completar Venta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: TICKET DIGITAL WHATSAPP & IMPRESIÓN TÉRMICA           */}
      {/* ============================================================== */}
      {saleCompletedData && (
        <PosReceiptModal
          saleData={saleCompletedData}
          onNewSale={() => setSaleCompletedData(null)}
        />
      )}
    </div>
  );
}
