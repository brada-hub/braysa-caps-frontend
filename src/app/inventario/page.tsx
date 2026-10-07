'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  Layers,
  Search,
  AlertTriangle,
  CheckCircle2,
  History,
  Plus,
  Minus,
  Boxes,
  TrendingUp,
  X,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  DollarSign,
  Calendar,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  ShieldAlert,
  ChevronRight,
  Tag,
  Eye,
  EyeOff,
  Edit3,
  Save,
  RotateCcw,
  Camera,
  UploadCloud,
  Check,
  Trash2,
  ExternalLink,
  Globe,
  Image as ImageIcon,
} from 'lucide-react';
import { INITIAL_NEW_ERA_PRODUCTS } from '@/components/newera/productsData';
import { NewEraProduct } from '@/components/newera/types';

// Storage key shared with storefront & POS
export const BRAYSA_INVENTORY_STORAGE_KEY = 'braysa_caps_inventory';

export const STUDIO_GALLERY_PHOTOS = [
  { src: '/cdn/p_rangers_1.jpg', label: 'Texas Rangers (1. Frontal)' },
  { src: '/cdn/p_rangers_2.jpg', label: 'Texas Rangers (2. Reverso / Ángulo)' },
  { src: '/cdn/p_yankees_pack_1.jpg', label: 'NY Yankees Fitted Pack (1. Frontal)' },
  { src: '/cdn/p_yankees_pack_2.jpg', label: 'NY Yankees Fitted Pack (2. Reverso)' },
  { src: '/cdn/p_dodgers_pack_1.jpg', label: 'LA Dodgers World Series (1. Frontal)' },
  { src: '/cdn/p_dodgers_pack_2.jpg', label: 'LA Dodgers World Series (2. Reverso)' },
  { src: '/cdn/p_athletics_1.jpg', label: 'Oakland Athletics (1. Frontal)' },
  { src: '/cdn/p_athletics_2.jpg', label: 'Oakland Athletics (2. Reverso)' },
  { src: '/cdn/p_sox_bloom_1.jpg', label: 'White Sox Autumn Bloom (1. Frontal)' },
  { src: '/cdn/p_sox_bloom_2.jpg', label: 'White Sox Autumn Bloom (2. Reverso)' },
  { src: '/cdn/p_bloom_ne_1.jpg', label: 'Botanical Bloom (1. Frontal)' },
  { src: '/cdn/p_bloom_ne_2.jpg', label: 'Botanical Bloom (2. Reverso)' },
  { src: '/cdn/p_yankees_1.jpg', label: 'NY Yankees Clásica' },
  { src: '/cdn/p_yankees_black.jpg', label: 'NY Yankees All Black' },
  { src: '/cdn/p_yankees_navy.jpg', label: 'NY Yankees Navy' },
  { src: '/cdn/p_yankees_red.jpg', label: 'NY Yankees Red' },
  { src: '/cdn/p_dodgers_black.jpg', label: 'LA Dodgers Black' },
  { src: '/cdn/p_dodgers_blue.jpg', label: 'LA Dodgers Royal Blue' },
  { src: '/cdn/p_recycled_dodgers.jpg', label: 'Dodgers Recycled' },
  { src: '/cdn/p_recycled_yankees.jpg', label: 'Yankees Recycled' },
  { src: '/cdn/p_star_visor_dodgers.jpg', label: 'Dodgers Star Visor' },
  { src: '/cdn/p_bad_bunny.jpg', label: 'Bad Bunny Edición Especial' },
  { src: '/cdn/p_food_icon.jpg', label: 'MLB Food Icons' },
  { src: '/cdn/p_3930_dodgers.jpg', label: '39THIRTY Dodgers Stretch' },
  { src: '/cdn/p_3930_yankees.jpg', label: '39THIRTY Yankees Stretch' },
];

export const AVAILABLE_FITTED_SIZES = [
  'Unitalla Ajustable',
  'Hebilla Metálica',
  'Broche Snapback',
  'Malla Trucker',
  'Velcro Graduable',
];

export interface InventoryCapItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  silhouette: string;
  team: string;
  color: string;
  images: string[];
  salePrice: number;
  currentUnitCost: number;
  currentStock: number;
  minStockThreshold: number;
  isActive: boolean; // Controls visibility on the storefront
  isNew?: boolean;
  freeShipping?: boolean;
  sizes?: string[];
  description?: string;
  lastUpdated?: string;
}

export interface KardexMovementItem {
  id: string;
  tenantId: string;
  variantId: string;
  variantSku?: string;
  variantName?: string;
  movementType: 'COMPRA' | 'VENTA_POS' | 'VENTA_WEB' | 'AJUSTE_MANUAL';
  quantity: number;
  previousStock: number;
  newStock: number;
  unitCost: number;
  referenceId?: string | null;
  userId: string;
  notes?: string | null;
  createdAt: string;
}

// Map the 16 official storefront caps to our full-featured inventory records
function getInitialInventoryFromStore(): InventoryCapItem[] {
  return INITIAL_NEW_ERA_PRODUCTS.map((prod) => {
    // Estimación inicial de costo en base al precio de venta para calcular margen
    const initialCost = Math.round(prod.price * 0.55);
    const initialStock = prod.isSoldOut ? 0 : 12;

    return {
      id: prod.id,
      sku: prod.sku,
      name: prod.name,
      brand: prod.brand || 'BRAYSA CAPS',
      silhouette: prod.silhouette,
      team: prod.team,
      color: prod.colors?.map((c) => c.name).join(', ') || 'Clásico',
      images: prod.images || ['/cdn/p_yankees_1.jpg'],
      salePrice: prod.price,
      currentUnitCost: initialCost,
      currentStock: initialStock,
      minStockThreshold: 3,
      isActive: true,
      isNew: prod.isNew ?? true,
      freeShipping: prod.freeShipping ?? true,
      sizes: prod.sizes || ['Unitalla Ajustable'],
      description: prod.description || `Gorra urbana con regulador graduable.`,
      lastUpdated: '2026-10-01T12:00:00.000Z',
    };
  });
}

function formatBs(amount: number): string {
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const INITIAL_KARDEX: KardexMovementItem[] = [
  {
    id: 'kdx-01',
    tenantId: 'e9b1b369-2f22-443b-b236-4767117f7eb0',
    variantId: 'prod-5950-01',
    variantSku: '60915730',
    variantName: '59FIFTY Texas Rangers Cooperstown',
    movementType: 'COMPRA',
    quantity: 12,
    previousStock: 0,
    newStock: 12,
    unitCost: 150,
    referenceId: 'INVENTARIO-INICIAL',
    userId: 'Administrador BRAYSA',
    notes: 'Lote de inauguración BRAYSA CAPS',
    createdAt: '2026-10-01T12:00:00.000Z',
  },
  {
    id: 'kdx-02',
    tenantId: 'e9b1b369-2f22-443b-b236-4767117f7eb0',
    variantId: 'prod-5950-02',
    variantSku: '60976998',
    variantName: '59FIFTY Autumn Bloom Negro',
    movementType: 'VENTA_POS',
    quantity: 2,
    previousStock: 14,
    newStock: 12,
    unitCost: 135,
    referenceId: 'TICKET-0012',
    userId: 'Caja Central',
    notes: 'Venta mostrador físico',
    createdAt: '2026-10-02T16:30:00.000Z',
  },
];

export default function InventarioPage() {
  const { user } = useAuth();

  // Inventory & Kardex state initialized with store defaults to prevent hydration mismatch #418
  const [items, setItems] = useState<InventoryCapItem[]>(() => getInitialInventoryFromStore());
  const [kardexList, setKardexList] = useState<KardexMovementItem[]>(INITIAL_KARDEX);

  // Tab: 'stock' | 'compras' | 'kardex'
  const [activeTab, setActiveTab] = useState<'stock' | 'compras' | 'kardex'>('stock');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSilhouette, setFilterSilhouette] = useState('all');

  // Batch purchase form states
  const [selectedCapId, setSelectedCapId] = useState<string>('prod-5950-01');
  const [purchaseQty, setPurchaseQty] = useState<string>('12');
  const [purchaseTotalCost, setPurchaseTotalCost] = useState<string>('1500');
  const [purchaseSupplier, setPurchaseSupplier] = useState<string>('Distribuidor Oficial New Era');
  const [purchaseNotes, setPurchaseNotes] = useState<string>('');
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);

  // Kardex modal
  const [modalKardexCap, setModalKardexCap] = useState<InventoryCapItem | null>(null);

  // Quick edit modal for advanced customization & photo studio
  const [editingCap, setEditingCap] = useState<InventoryCapItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [photoMethodTab, setPhotoMethodTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [selectedPhotoSlot, setSelectedPhotoSlot] = useState<0 | 1>(0);
  const [urlInput, setUrlInput] = useState('');

  // Toast notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', title: string, text: string) => {
    setToast({ type, title, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdatePhotoInSlot = (slotIdx: 0 | 1, photoUrl: string) => {
    if (!editingCap) return;
    const currentImgs = editingCap.images && editingCap.images.length > 0 ? [...editingCap.images] : ['/cdn/p_yankees_1.jpg'];
    if (slotIdx === 0) {
      currentImgs[0] = photoUrl;
    } else {
      if (currentImgs.length < 2) {
        currentImgs.push(photoUrl);
      } else {
        currentImgs[1] = photoUrl;
      }
    }
    setEditingCap({
      ...editingCap,
      images: currentImgs,
    });
  };

  const handleOpenCreateModal = () => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newSku = `609${randomSuffix}`;
    const newId = `prod-custom-${Date.now()}`;
    setIsCreatingNew(true);
    setUrlInput('');
    setSelectedPhotoSlot(0);
    setPhotoMethodTab('gallery');
    setEditingCap({
      id: newId,
      sku: newSku,
      name: 'Nueva Gorra Streetwear (Con Regulador)',
      brand: 'BRAYSA CAPS',
      silhouette: 'Visera Curva',
      team: 'Streetwear Bolivia',
      color: 'Negro / Original',
      images: ['/cdn/p_yankees_1.jpg', '/cdn/p_yankees_black.jpg'],
      salePrice: 70,
      currentUnitCost: 38,
      currentStock: 12,
      minStockThreshold: 3,
      isActive: true,
      isNew: true,
      freeShipping: true,
      sizes: ['Unitalla Ajustable'],
      description: 'Gorra streetwear con regulador graduable para ajuste perfecto.',
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleOpenEditModal = (cap: InventoryCapItem) => {
    setIsCreatingNew(false);
    setUrlInput('');
    setSelectedPhotoSlot(0);
    setPhotoMethodTab('gallery');
    setEditingCap({
      ...cap,
      images: cap.images && cap.images.length > 0 ? [...cap.images] : ['/cdn/p_yankees_1.jpg'],
      sizes: cap.sizes && cap.sizes.length > 0 ? [...cap.sizes] : ['7', '7 1/8', '7 1/4', '7 3/8', '7 1/2'],
    });
  };

  const handleSaveProduct = () => {
    if (!editingCap) return;
    if (!editingCap.name.trim()) {
      showToast('error', 'Nombre Requerido', 'Por favor ingresa un nombre para la gorra.');
      return;
    }
    if (editingCap.salePrice <= 0) {
      showToast('error', 'Precio Inválido', 'El precio de venta debe ser mayor a 0 Bs.');
      return;
    }

    const cleanedCap: InventoryCapItem = {
      ...editingCap,
      lastUpdated: new Date().toISOString(),
    };

    if (isCreatingNew) {
      const updated = [cleanedCap, ...items];
      persistInventory(updated);
      showToast('success', '¡Gorra Creada!', `"${cleanedCap.name}" añadida al catálogo y al POS.`);
      if (cleanedCap.currentStock > 0) {
        const initKardex: KardexMovementItem = {
          id: `kdx-${Date.now()}`,
          tenantId: 'e9b1b369-2f22-443b-b236-4767117f7eb0',
          variantId: cleanedCap.id,
          variantSku: cleanedCap.sku,
          variantName: cleanedCap.name,
          movementType: 'COMPRA',
          quantity: cleanedCap.currentStock,
          previousStock: 0,
          newStock: cleanedCap.currentStock,
          unitCost: cleanedCap.currentUnitCost,
          referenceId: 'ALTA-NUEVO-PRODUCTO',
          userId: user?.email || 'Admin',
          notes: 'Registro de nuevo producto en catálogo',
          createdAt: new Date().toISOString(),
        };
        setKardexList((prev) => [initKardex, ...prev]);
      }
    } else {
      const updated = items.map((i) => (i.id === cleanedCap.id ? cleanedCap : i));
      persistInventory(updated);
      showToast('success', 'Gorra Actualizada', `Se guardaron todos los cambios de "${cleanedCap.name}".`);
    }

    setEditingCap(null);
    setIsCreatingNew(false);
  };

  const handleDeleteProduct = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    if (confirm(`¿Estás seguro de eliminar "${target.name}" del catálogo?`)) {
      const updated = items.filter((i) => i.id !== id);
      persistInventory(updated);
      showToast('success', 'Gorra Eliminada', `"${target.name}" fue eliminada del catálogo.`);
      setEditingCap(null);
    }
  };

  // Load inventory from localStorage after client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BRAYSA_INVENTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setSelectedCapId(parsed[0].id);
        }
      }
    } catch {
      // LocalStorage access safe
    }
  }, []);

  // Save to localStorage whenever items change
  const persistInventory = (updatedItems: InventoryCapItem[]) => {
    setItems(updatedItems);
    try {
      localStorage.setItem(BRAYSA_INVENTORY_STORAGE_KEY, JSON.stringify(updatedItems));
      window.dispatchEvent(new Event('braysa_inventory_updated'));
    } catch {
      // storage quota or SSR safe
    }
  };

  // Fast inline stock adjustment (+1, -1, or direct number)
  const handleUpdateStock = (id: string, deltaOrExact: number, isAbsolute = false) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    const previousStock = target.currentStock;
    const newStock = isAbsolute ? Math.max(0, deltaOrExact) : Math.max(0, target.currentStock + deltaOrExact);

    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          currentStock: newStock,
          lastUpdated: new Date().toISOString(),
        };
      }
      return item;
    });

    persistInventory(updated);

    // Record adjustment movement in Kardex
    if (newStock !== previousStock) {
      const diff = newStock - previousStock;
      const newKardex: KardexMovementItem = {
        id: `kdx-${Date.now()}`,
        tenantId: 'e9b1b369-2f22-443b-b236-4767117f7eb0',
        variantId: target.id,
        variantSku: target.sku,
        variantName: target.name,
        movementType: 'AJUSTE_MANUAL',
        quantity: Math.abs(diff),
        previousStock,
        newStock,
        unitCost: target.currentUnitCost,
        referenceId: 'AJUSTE-MANUAL',
        userId: user?.email || 'Admin',
        notes: `Ajuste manual de stock: ${previousStock} -> ${newStock} uds`,
        createdAt: new Date().toISOString(),
      };
      setKardexList((prev) => [newKardex, ...prev]);
    }
  };

  // Fast inline price adjustment
  const handleUpdatePrice = (id: string, newSalePrice: number) => {
    if (isNaN(newSalePrice) || newSalePrice < 0) return;
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          salePrice: newSalePrice,
          lastUpdated: new Date().toISOString(),
        };
      }
      return item;
    });
    persistInventory(updated);
    showToast('success', 'Precio Actualizado', `Nuevo precio de venta: Bs. ${newSalePrice}`);
  };

  // Fast inline cost adjustment
  const handleUpdateCost = (id: string, newCost: number) => {
    if (isNaN(newCost) || newCost < 0) return;
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          currentUnitCost: newCost,
          lastUpdated: new Date().toISOString(),
        };
      }
      return item;
    });
    persistInventory(updated);
  };

  // Toggle storefront visibility (Active / Hidden)
  const handleToggleActive = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextState = !item.isActive;
        showToast(
          nextState ? 'success' : 'error',
          nextState ? 'Gorra Visible en Tienda' : 'Gorra Ocultada de Tienda',
          nextState
            ? `"${item.name}" ahora se muestra en el catálogo web.`
            : `"${item.name}" ha sido ocultada del catálogo web.`
        );
        return {
          ...item,
          isActive: nextState,
          lastUpdated: new Date().toISOString(),
        };
      }
      return item;
    });
    persistInventory(updated);
  };

  // Reset entire catalog to original store defaults
  const handleResetCatalog = () => {
    if (confirm('¿Restablecer todo el catálogo y stock a los valores originales de BRAYSA?')) {
      const fresh = getInitialInventoryFromStore();
      persistInventory(fresh);
      showToast('success', 'Catálogo Restablecido', 'Se recargaron los 16 productos oficiales de la tienda.');
    }
  };

  // Batch purchase calculation (CPP)
  const currentSelectedCap = useMemo(() => {
    return items.find((i) => i.id === selectedCapId) || items[0];
  }, [items, selectedCapId]);

  const parsedQty = Math.max(0, parseInt(purchaseQty, 10) || 0);
  const parsedTotalCost = Math.max(0, parseFloat(purchaseTotalCost) || 0);
  const batchUnitCost = parsedQty > 0 ? parsedTotalCost / parsedQty : 0;

  const simulatedCPP = useMemo(() => {
    if (!currentSelectedCap) return 0;
    const curStock = currentSelectedCap.currentStock;
    const curCost = currentSelectedCap.currentUnitCost;
    const totalNew = curStock + parsedQty;
    if (totalNew <= 0) return curCost;
    return (curStock * curCost + parsedTotalCost) / totalNew;
  }, [currentSelectedCap, parsedQty, parsedTotalCost]);

  const projectedMarginPct = useMemo(() => {
    if (!currentSelectedCap || currentSelectedCap.salePrice <= 0) return 0;
    const profit = currentSelectedCap.salePrice - simulatedCPP;
    return (profit / currentSelectedCap.salePrice) * 100;
  }, [currentSelectedCap, simulatedCPP]);

  // Handle batch purchase registration
  const handleRegisterBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedCap || parsedQty <= 0 || parsedTotalCost <= 0) {
      showToast('error', 'Campos Requeridos', 'Verifica cantidad y costo del lote.');
      return;
    }

    setIsSubmittingBatch(true);
    setTimeout(() => {
      const prevStock = currentSelectedCap.currentStock;
      const newStock = prevStock + parsedQty;

      const updated = items.map((item) => {
        if (item.id === currentSelectedCap.id) {
          return {
            ...item,
            currentStock: newStock,
            currentUnitCost: Math.round(simulatedCPP * 100) / 100,
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      });

      persistInventory(updated);

      const newKardex: KardexMovementItem = {
        id: `kdx-${Date.now()}`,
        tenantId: 'e9b1b369-2f22-443b-b236-4767117f7eb0',
        variantId: currentSelectedCap.id,
        variantSku: currentSelectedCap.sku,
        variantName: currentSelectedCap.name,
        movementType: 'COMPRA',
        quantity: parsedQty,
        previousStock: prevStock,
        newStock,
        unitCost: Math.round(simulatedCPP * 100) / 100,
        referenceId: `LOTE-${Date.now().toString().slice(-4)}`,
        userId: user?.email || 'Administrador BRAYSA',
        notes: `Proveedor: ${purchaseSupplier}. ${purchaseNotes}`.trim(),
        createdAt: new Date().toISOString(),
      };

      setKardexList((prev) => [newKardex, ...prev]);
      setIsSubmittingBatch(false);
      showToast('success', 'Lote Registrado', `Se añadieron ${parsedQty} uds a "${currentSelectedCap.name}".`);
      setActiveTab('stock');
    }, 400);
  };

  // KPIs
  const kpi = useMemo(() => {
    const totalUnits = items.reduce((acc, i) => acc + i.currentStock, 0);
    const totalCostValue = items.reduce((acc, i) => acc + i.currentStock * i.currentUnitCost, 0);
    const totalSaleValue = items.reduce((acc, i) => acc + i.currentStock * i.salePrice, 0);
    const criticalCount = items.filter((i) => i.currentStock <= i.minStockThreshold).length;
    const activeCount = items.filter((i) => i.isActive).length;

    return {
      totalUnits,
      totalCostValue,
      totalSaleValue,
      grossProfit: totalSaleValue - totalCostValue,
      criticalCount,
      activeCount,
    };
  }, [items]);

  // Filtered caps
  const filteredCaps = useMemo(() => {
    return items.filter((cap) => {
      const matchSearch =
        cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.silhouette.toLowerCase().includes(searchTerm.toLowerCase());

      let matchFilter = true;
      if (filterSilhouette === 'low-stock') {
        matchFilter = cap.currentStock <= cap.minStockThreshold;
      } else if (filterSilhouette === 'inactive') {
        matchFilter = !cap.isActive;
      } else if (filterSilhouette !== 'all') {
        matchFilter = cap.silhouette.toLowerCase() === filterSilhouette.toLowerCase();
      }

      return matchSearch && matchFilter;
    });
  }, [items, searchTerm, filterSilhouette]);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-20">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all animate-in slide-in-from-top-3 ${
            toast.type === 'success'
              ? 'bg-neutral-900 text-white border-neutral-700'
              : 'bg-rose-950 text-white border-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <div>
            <div className="font-black uppercase tracking-wider">{toast.title}</div>
            <div className="text-[11px] text-neutral-300 font-normal">{toast.text}</div>
          </div>
        </div>
      )}

      {/* TOP HEADER & ACTIONS */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-black text-white">
              <Boxes className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
                Control de Stock & Catálogo
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Configura precios en Bolivianos (Bs.), stock físico y visibilidad de las 16 gorras de la tienda.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetCatalog}
            title="Restablecer los 16 productos a sus valores originales"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 hover:text-neutral-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            <Store className="w-4 h-4" />
            <span>Ver Tienda Online</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TOP KPI METRICS BAR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Stock Total Físico
              </span>
              <Package className="w-4 h-4 text-neutral-900" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              {kpi.totalUnits} <span className="text-xs font-bold text-neutral-400">uds</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              {items.length} modelos en inventario ({kpi.activeCount} visibles en web)
            </p>
          </div>

          {/* KPI 2 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Inversión en Costo
              </span>
              <DollarSign className="w-4 h-4 text-neutral-900" />
            </div>
            <div suppressHydrationWarning className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              Bs. {formatBs(kpi.totalCostValue)}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Capital invertido en almacén</p>
          </div>

          {/* KPI 3 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Potencial Venta Bruta
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div suppressHydrationWarning className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              Bs. {formatBs(kpi.totalSaleValue)}
            </div>
            <p suppressHydrationWarning className="text-[11px] text-emerald-700 font-bold mt-1">
              +Bs. {formatBs(kpi.grossProfit)} ganancia proyectada
            </p>
          </div>

          {/* KPI 4 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Stock Crítico
              </span>
              <AlertTriangle
                className={`w-4 h-4 ${kpi.criticalCount > 0 ? 'text-rose-600' : 'text-neutral-400'}`}
              />
            </div>
            <div
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                kpi.criticalCount > 0 ? 'text-rose-600' : 'text-neutral-950'
              }`}
            >
              {kpi.criticalCount}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              {kpi.criticalCount > 0 ? 'Requieren reabastecimiento urgente' : 'Todos los niveles saludables'}
            </p>
          </div>
        </div>

        {/* WORKSPACE VIEW TABS */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'stock'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200'
              }`}
            >
              Catálogo & Stock ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('compras')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'compras'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200'
              }`}
            >
              + Ingreso de Lote (CPP)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kardex')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'kardex'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200'
              }`}
            >
              Kardex de Movimientos
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: CATALOGO Y GESTION CONFIGURABLE DE STOCK                */}
        {/* ============================================================== */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre, equipo, silueta (59FIFTY, 9FORTY) o SKU..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-neutral-500 font-bold hidden md:block">
                    Mostrando {filteredCaps.length} de {items.length} gorras
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>+ Nueva Gorra</span>
                  </button>
                </div>
              </div>

              {/* Silhouette Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterSilhouette('all')}
                  className={`px-3 py-1 rounded-full font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 text-[11px] ${
                    filterSilhouette === 'all'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Todas ({items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSilhouette('Visera Curva')}
                  className={`px-3 py-1 rounded-full font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 text-[11px] ${
                    filterSilhouette.toLowerCase() === 'visera curva'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Visera Curva
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSilhouette('Visera Plana')}
                  className={`px-3 py-1 rounded-full font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 text-[11px] ${
                    filterSilhouette.toLowerCase() === 'visera plana'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Visera Plana
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSilhouette('Trucker')}
                  className={`px-3 py-1 rounded-full font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 text-[11px] ${
                    filterSilhouette.toLowerCase() === 'trucker'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Trucker (Malla)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSilhouette('Básica Lisa')}
                  className={`px-3 py-1 rounded-full font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 text-[11px] ${
                    filterSilhouette.toLowerCase() === 'básica lisa'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Básica Lisa
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSilhouette('low-stock')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 text-[11px] ${
                    filterSilhouette === 'low-stock'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Crítico ({kpi.criticalCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSilhouette('inactive')}
                  className={`px-3 py-1 rounded-full font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 text-[11px] ${
                    filterSilhouette === 'inactive'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                >
                  Ocultas ({items.length - kpi.activeCount})
                </button>
              </div>
            </div>

            {/* DESKTOP TABLE - CONFIGURACIÓN INTEGRAL DE CADA GORRA */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black uppercase tracking-wider text-neutral-600">
                      <th className="py-3 px-4">Gorra de Tienda</th>
                      <th className="py-3 px-4 text-center">Silueta / Equipo</th>
                      <th className="py-3 px-4 text-center">Stock Físico (Editable)</th>
                      <th className="py-3 px-4 text-center">Costo Unit. (Bs.)</th>
                      <th className="py-3 px-4 text-center">Precio Venta (Bs.)</th>
                      <th className="py-3 px-4 text-center">Margen</th>
                      <th className="py-3 px-4 text-center">Tienda Web</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {filteredCaps.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-neutral-400 font-medium">
                          No se encontraron gorras con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredCaps.map((item) => {
                        const isLow = item.currentStock <= item.minStockThreshold;
                        const isSoldOut = item.currentStock === 0;
                        const unitProfit = item.salePrice - item.currentUnitCost;
                        const profitPct = item.salePrice > 0 ? (unitProfit / item.salePrice) * 100 : 0;

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-neutral-50/80 transition-colors group ${
                              !item.isActive ? 'opacity-60 bg-neutral-50/30' : ''
                            }`}
                          >
                            {/* Product Info & Thumbnail */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0">
                                  {item.images?.[0] ? (
                                    <Image
                                      src={item.images[0]}
                                      alt={item.name}
                                      fill
                                      sizes="48px"
                                      className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                      <Package className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 max-w-xs">
                                  <div className="font-black text-xs uppercase tracking-tight text-neutral-950 truncate">
                                    {item.name}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-0.5">
                                    <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded font-bold text-neutral-800 border border-neutral-200">
                                      {item.sku}
                                    </span>
                                    <span>•</span>
                                    <span className="truncate">{item.color}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Silhouette & Team */}
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white">
                                {item.silhouette}
                              </span>
                              <div className="text-[10px] text-neutral-500 font-semibold mt-1">
                                {item.team}
                              </div>
                            </td>

                            {/* Stock Quick Stepper & Direct Input */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStock(item.id, -1)}
                                    title="Restar 1 unidad"
                                    className="w-6 h-6 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 text-neutral-700 font-black flex items-center justify-center shadow-xs border border-neutral-200 transition-colors cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>

                                  <input
                                    type="number"
                                    min="0"
                                    value={item.currentStock}
                                    onChange={(e) =>
                                      handleUpdateStock(item.id, parseInt(e.target.value, 10) || 0, true)
                                    }
                                    className="w-12 text-center text-xs font-black bg-transparent focus:outline-none focus:bg-white rounded py-0.5 text-neutral-950"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStock(item.id, 1)}
                                    title="Sumar 1 unidad"
                                    className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 font-black flex items-center justify-center shadow-xs border border-neutral-200 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Status badge */}
                                {isSoldOut ? (
                                  <span className="text-[9px] font-black uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                    Agotado
                                  </span>
                                ) : isLow ? (
                                  <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    Bajo Stock ({item.currentStock} uds)
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    En Stock ({item.currentStock} uds)
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Cost Price (Bs.) */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex items-center gap-1 border border-neutral-200 rounded-lg px-2 py-1 bg-neutral-50 focus-within:border-black focus-within:bg-white transition-all">
                                <span className="text-[10px] font-bold text-neutral-400">Bs.</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.currentUnitCost}
                                  onChange={(e) =>
                                    handleUpdateCost(item.id, parseFloat(e.target.value) || 0)
                                  }
                                  className="w-14 text-right text-xs font-bold text-neutral-800 bg-transparent focus:outline-none"
                                />
                              </div>
                            </td>

                            {/* Sale Price (Bs.) */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex items-center gap-1 border border-neutral-200 rounded-lg px-2 py-1 bg-neutral-50 focus-within:border-black focus-within:bg-white transition-all">
                                <span className="text-[10px] font-bold text-neutral-400">Bs.</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.salePrice}
                                  onChange={(e) =>
                                    handleUpdatePrice(item.id, parseFloat(e.target.value) || 0)
                                  }
                                  className="w-14 text-right text-xs font-black text-neutral-950 bg-transparent focus:outline-none"
                                />
                              </div>
                            </td>

                            {/* Margen */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="font-black text-xs text-emerald-700">
                                +Bs. {unitProfit.toFixed(0)}
                              </div>
                              <span className="text-[10px] font-semibold text-neutral-500">
                                {profitPct.toFixed(0)}% retorno
                              </span>
                            </td>

                            {/* Visibility Toggle */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleActive(item.id)}
                                title={item.isActive ? 'Ocultar de la tienda web' : 'Mostrar en la tienda web'}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  item.isActive
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                                }`}
                              >
                                {item.isActive ? (
                                  <>
                                    <Eye className="w-3 h-3 text-emerald-600" />
                                    <span>Visible</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3 text-neutral-500" />
                                    <span>Oculto</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(item)}
                                  className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                                  title="Editar todas las características y fotos"
                                >
                                  <Edit3 className="w-3 h-3 text-emerald-400" />
                                  <span>Editar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCapId(item.id);
                                    setActiveTab('compras');
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-800 font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                                  title="Ingresar lote con CPP para esta gorra"
                                >
                                  + Lote
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setModalKardexCap(item)}
                                  className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                                  title="Ver movimientos de Kardex"
                                >
                                  <History className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: INGRESO DE MERCADERÍA POR LOTE (RN-01 CPP)              */}
        {/* ============================================================== */}
        {activeTab === 'compras' && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs max-w-2xl mx-auto space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-black text-white">
                    <Plus className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-black text-base uppercase tracking-wider text-neutral-950">
                      Llegada de Mercadería por Lote
                    </h2>
                    <p className="text-xs text-neutral-500 font-medium">
                      Calcula el Costo Promedio Ponderado (CPP) e incrementa el stock de la tienda automáticamente.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 uppercase tracking-wider">
                  RN-01 CPP
                </span>
              </div>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-4">
              {/* Cap Selector */}
              <div>
                <label className="block text-[11px] font-black text-neutral-700 uppercase tracking-wider mb-1.5">
                  Seleccionar Gorra / Modelo
                </label>
                <select
                  value={selectedCapId}
                  onChange={(e) => setSelectedCapId(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black transition-all cursor-pointer"
                >
                  {items.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.silhouette}] {c.name} — Stock actual: {c.currentStock} uds | Costo act: Bs. {c.currentUnitCost}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Total Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-neutral-700 uppercase tracking-wider mb-1.5">
                    Cantidad Recibida (Unidades)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(e.target.value)}
                    placeholder="Ej. 12"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm font-black text-neutral-900 focus:outline-none focus:border-black transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-neutral-700 uppercase tracking-wider mb-1.5">
                    Costo Total del Lote (Bs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={purchaseTotalCost}
                    onChange={(e) => setPurchaseTotalCost(e.target.value)}
                    placeholder="Ej. 1500"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm font-black text-neutral-900 focus:outline-none focus:border-black transition-all"
                    required
                  />
                </div>
              </div>

              {/* Supplier & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-neutral-700 uppercase tracking-wider mb-1.5">
                    Proveedor
                  </label>
                  <input
                    type="text"
                    value={purchaseSupplier}
                    onChange={(e) => setPurchaseSupplier(e.target.value)}
                    placeholder="Ej. New Era Bolivia / Importación"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-neutral-700 uppercase tracking-wider mb-1.5">
                    Nota o Referencia de Lote
                  </label>
                  <input
                    type="text"
                    value={purchaseNotes}
                    onChange={(e) => setPurchaseNotes(e.target.value)}
                    placeholder="Factura, guía o detalles..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black transition-all"
                  />
                </div>
              </div>

              {/* CPP Math Breakdown Box */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-700">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-neutral-900" />
                    <span>Cálculo Automático CPP</span>
                  </div>
                  <span className="text-[10px] bg-neutral-200 px-2 py-0.5 rounded-full">
                    {batchUnitCost > 0 ? `Bs. ${batchUnitCost.toFixed(2)} / ud en este lote` : '—'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-neutral-200">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                      Stock Final Proyectado
                    </span>
                    <div className="text-base font-black text-neutral-950 mt-0.5">
                      {(currentSelectedCap?.currentStock || 0) + parsedQty} unidades
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      +{parsedQty} unidades nuevas
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-neutral-200">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                      Nuevo Costo Promedio (CPP)
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-neutral-400 line-through">
                        Bs. {currentSelectedCap?.currentUnitCost.toFixed(0)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-900" />
                      <span className="text-base font-black text-neutral-950">
                        Bs. {simulatedCPP.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Margen proy.: {projectedMarginPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('stock')}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBatch || parsedQty <= 0 || parsedTotalCost <= 0}
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingBatch ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar Ingreso al Stock</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: KARDEX AUDIT TRAIL                                      */}
        {/* ============================================================== */}
        {activeTab === 'kardex' && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-black text-white">
                  <History className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-base uppercase tracking-wider text-neutral-950">
                    Kardex General de Movimientos
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Historial de entradas por compras, ventas en mostrador y ajustes manuales.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {kardexList.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 text-xs">
                  No hay movimientos registrados en el kardex aún.
                </div>
              ) : (
                kardexList.map((mov) => {
                  const isEntry = mov.movementType === 'COMPRA';
                  const isAdjust = mov.movementType === 'AJUSTE_MANUAL';

                  return (
                    <div
                      key={mov.id}
                      className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-400 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                            isEntry
                              ? 'bg-neutral-950 text-white'
                              : isAdjust
                              ? 'bg-neutral-200 text-neutral-800'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          }`}
                        >
                          {isEntry ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs uppercase tracking-wider text-neutral-950">
                              {mov.movementType === 'COMPRA'
                                ? 'Ingreso de Compra (Lote)'
                                : mov.movementType === 'VENTA_POS'
                                ? 'Venta Mostrador (POS)'
                                : mov.movementType === 'VENTA_WEB'
                                ? 'Venta Tienda Online'
                                : 'Ajuste Manual de Inventario'}
                            </span>
                            <span suppressHydrationWarning className="text-[10px] text-neutral-400 font-mono font-semibold">
                              {new Date(mov.createdAt).toLocaleDateString('es-BO', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="text-xs text-neutral-700 font-bold mt-0.5">
                            {mov.variantName || mov.variantSku}
                          </div>

                          {mov.notes && (
                            <p className="text-[11px] text-neutral-500 italic mt-0.5">
                              "{mov.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100 text-right">
                        <div>
                          <span className="font-black text-sm text-neutral-950">
                            {isEntry ? `+${mov.quantity}` : `${mov.newStock > mov.previousStock ? '+' : '-'}${mov.quantity}`} uds
                          </span>
                          <div className="text-[10px] text-neutral-400">
                            {mov.previousStock} → {mov.newStock} final
                          </div>
                        </div>

                        <div className="bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200">
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">
                            Costo Registrado
                          </span>
                          <span className="text-xs font-black text-neutral-900">
                            Bs. {mov.unitCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* INDIVIDUAL KARDEX MODAL */}
      {modalKardexCap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative">
                  {modalKardexCap.images?.[0] && (
                    <Image
                      src={modalKardexCap.images[0]}
                      alt={modalKardexCap.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-neutral-950">
                    Kardex: {modalKardexCap.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    SKU: {modalKardexCap.sku} | Stock Actual: {modalKardexCap.currentStock} uds
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalKardexCap(null)}
                className="p-1.5 rounded-xl hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {kardexList.filter((k) => k.variantId === modalKardexCap.id).length === 0 ? (
                <div className="py-10 text-center text-neutral-400 text-xs">
                  Sin movimientos específicos registrados para esta gorra.
                </div>
              ) : (
                kardexList
                  .filter((k) => k.variantId === modalKardexCap.id)
                  .map((k) => (
                    <div
                      key={k.id}
                      className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-black text-neutral-900 uppercase">
                          {k.movementType}
                        </div>
                        <div className="text-[11px] text-neutral-500">{k.notes || 'Operación de inventario'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-neutral-950">
                          {k.previousStock} → {k.newStock} uds
                        </div>
                        <div className="text-[10px] text-neutral-400">Bs. {k.unitCost} CPP</div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex justify-end">
              <button
                type="button"
                onClick={() => setModalKardexCap(null)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED CAP CONFIGURATION & PHOTO STUDIO MODAL */}
      {editingCap && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0 flex items-center justify-center">
                  {editingCap.images?.[0] ? (
                    <img
                      src={editingCap.images[0]}
                      alt={editingCap.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Camera className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isCreatingNew ? 'bg-emerald-600 text-white' : 'bg-black text-white'
                    }`}>
                      {isCreatingNew ? 'Nuevo Producto' : 'Configuración & Fotos'}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 font-bold">
                      SKU: {editingCap.sku}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-neutral-950 mt-0.5 truncate max-w-md">
                    {isCreatingNew ? 'Registrar Nueva Gorra en Catálogo' : editingCap.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCap(null);
                  setIsCreatingNew(false);
                }}
                className="p-2 rounded-xl hover:bg-neutral-200 text-neutral-400 hover:text-black cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* ============================================================== */}
              {/* 1. SECCIÓN DE FOTOGRAFÍAS DE ESTUDIO & SUBIDA                  */}
              {/* ============================================================== */}
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                        Fotografías Oficiales de la Gorra (2 Vistas Web)
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Configura la <strong>Foto 1 (Frontal)</strong> y la <strong>Foto 2 (Reverso / Hover)</strong> para tu tienda.
                      </p>
                    </div>
                  </div>

                  {/* Slot selector pill buttons */}
                  <div className="flex items-center gap-1.5 bg-neutral-200/80 p-1 rounded-xl shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoSlot(0)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedPhotoSlot === 0
                          ? 'bg-black text-white shadow-xs'
                          : 'text-neutral-700 hover:text-black'
                      }`}
                    >
                      <span>1. Foto Frontal</span>
                      {selectedPhotoSlot === 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoSlot(1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedPhotoSlot === 1
                          ? 'bg-black text-white shadow-xs'
                          : 'text-neutral-700 hover:text-black'
                      }`}
                    >
                      <span>2. Foto Reverso / Hover</span>
                      {selectedPhotoSlot === 1 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    </button>
                  </div>
                </div>

                {/* DUAL PREVIEW CARDS (Foto 1 y Foto 2 lado a lado) */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Card Foto 1 */}
                  <div
                    onClick={() => setSelectedPhotoSlot(0)}
                    className={`relative rounded-2xl border-2 p-2.5 bg-white transition-all cursor-pointer flex flex-col items-center justify-between ${
                      selectedPhotoSlot === 0
                        ? 'border-black ring-2 ring-black/20 shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300 opacity-80'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 text-white">
                        1. Vista Frontal
                      </span>
                      {selectedPhotoSlot === 0 && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Editando ahora
                        </span>
                      )}
                    </div>

                    <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center overflow-hidden">
                      <img
                        src={editingCap.images?.[0] || '/cdn/p_yankees_1.jpg'}
                        alt="Foto 1 Frontal"
                        className="w-full h-full object-contain p-1 hover:scale-105 transition-transform"
                      />
                    </div>

                    <span className="text-[10px] text-neutral-500 font-bold mt-1 text-center">
                      Foto principal en vitrina
                    </span>
                  </div>

                  {/* Card Foto 2 */}
                  <div
                    onClick={() => setSelectedPhotoSlot(1)}
                    className={`relative rounded-2xl border-2 p-2.5 bg-white transition-all cursor-pointer flex flex-col items-center justify-between ${
                      selectedPhotoSlot === 1
                        ? 'border-black ring-2 ring-black/20 shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300 opacity-80'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 text-white">
                        2. Reverso / Hover
                      </span>
                      {selectedPhotoSlot === 1 ? (
                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Editando ahora
                        </span>
                      ) : !editingCap.images?.[1] ? (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          Sin configurar
                        </span>
                      ) : null}
                    </div>

                    <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center overflow-hidden">
                      {editingCap.images?.[1] ? (
                        <img
                          src={editingCap.images[1]}
                          alt="Foto 2 Reverso"
                          className="w-full h-full object-contain p-1 hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl border border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 gap-1">
                          <Plus className="w-5 h-5 text-neutral-400" />
                          <span className="text-[10px] font-bold">Clic para agregar</span>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-neutral-500 font-bold mt-1 text-center">
                      Se muestra al pasar el mouse
                    </span>
                  </div>
                </div>

                {/* Subir / Elegir para la foto seleccionada */}
                <div className="bg-white rounded-xl border border-neutral-200 p-3 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      Asignar imagen a{' '}
                      <span className="underline decoration-black decoration-2">
                        {selectedPhotoSlot === 0 ? 'Foto 1 (Frontal)' : 'Foto 2 (Reverso / Hover)'}
                      </span>
                      :
                    </span>

                    {/* Method Tabs */}
                    <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => setPhotoMethodTab('gallery')}
                        className={`px-2.5 py-1 rounded-md font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                          photoMethodTab === 'gallery' ? 'bg-black text-white shadow-2xs' : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        Galería ({STUDIO_GALLERY_PHOTOS.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoMethodTab('upload')}
                        className={`px-2.5 py-1 rounded-md font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                          photoMethodTab === 'upload' ? 'bg-black text-white shadow-2xs' : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        Subir Archivo
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoMethodTab('url')}
                        className={`px-2.5 py-1 rounded-md font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                          photoMethodTab === 'url' ? 'bg-black text-white shadow-2xs' : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        Pegar URL
                      </button>
                    </div>
                  </div>

                  {/* Tab 1: Galería */}
                  {photoMethodTab === 'gallery' && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-neutral-500 block">
                        Haz clic en una foto para asignarla a la {selectedPhotoSlot === 0 ? 'Foto 1 (Frontal)' : 'Foto 2 (Reverso)'}:
                      </span>
                      <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1 bg-neutral-50 rounded-xl border border-neutral-200">
                        {STUDIO_GALLERY_PHOTOS.map((photo, pIdx) => {
                          const isSelected = editingCap.images?.[selectedPhotoSlot] === photo.src;
                          return (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleUpdatePhotoInSlot(selectedPhotoSlot, photo.src)}
                              title={photo.label}
                              className={`group relative aspect-square rounded-lg border-2 p-0.5 transition-all overflow-hidden flex items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'border-black ring-2 ring-black/20 bg-white shadow-2xs'
                                  : 'border-neutral-200 hover:border-neutral-400 bg-white'
                              }`}
                            >
                              <img
                                src={photo.src}
                                alt={photo.label}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              />
                              {isSelected && (
                                <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black text-emerald-400 rounded-full flex items-center justify-center">
                                  <Check className="w-2 h-2 stroke-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Subir Archivo */}
                  {photoMethodTab === 'upload' && (
                    <div className="p-3 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-center space-y-1.5">
                      <UploadCloud className="w-6 h-6 text-neutral-400" />
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-xs transition-all">
                        <span>Seleccionar Foto para {selectedPhotoSlot === 0 ? 'Foto 1 (Frontal)' : 'Foto 2 (Reverso)'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (loadEvent) => {
                                const base64 = loadEvent.target?.result as string;
                                if (base64) {
                                  handleUpdatePhotoInSlot(selectedPhotoSlot, base64);
                                  showToast('success', 'Foto Cargada', `Se actualizó la Foto ${selectedPhotoSlot + 1} correctamente.`);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-neutral-400">
                        Formatos JPG, PNG, WEBP.
                      </p>
                    </div>
                  )}

                  {/* Tab 3: URL */}
                  {photoMethodTab === 'url' && (
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder={`https://... enlace de imagen para Foto ${selectedPhotoSlot + 1}`}
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!urlInput.trim()) {
                              showToast('error', 'URL Vacía', 'Ingresa una URL válida.');
                              return;
                            }
                            handleUpdatePhotoInSlot(selectedPhotoSlot, urlInput.trim());
                            showToast('success', 'Foto Actualizada', `Se asignó la URL a la Foto ${selectedPhotoSlot + 1}.`);
                            setUrlInput('');
                          }}
                          className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-black uppercase tracking-wider shrink-0 cursor-pointer"
                        >
                          Aplicar a Foto {selectedPhotoSlot + 1}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ============================================================== */}
              {/* 2. IDENTIDAD & SILUETA OFICIAL                                */}
              {/* ============================================================== */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-neutral-500" />
                  Identidad del Producto
                </h4>

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-1">
                    Nombre Oficial en Tienda
                  </label>
                  <input
                    type="text"
                    value={editingCap.name}
                    onChange={(e) => setEditingCap({ ...editingCap, name: e.target.value })}
                    placeholder="Ej. 59FIFTY Texas Rangers Cooperstown Visera Verde"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Team, Silhouette, and Color */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-1">
                      Silueta New Era
                    </label>
                    <select
                      value={editingCap.silhouette}
                      onChange={(e) => setEditingCap({ ...editingCap, silhouette: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="Visera Curva">Visera Curva (Dad Cap / Hebilla Metálica)</option>
                      <option value="Visera Plana">Visera Plana (Snapback Regulable)</option>
                      <option value="Trucker">Trucker (Malla con Broche)</option>
                      <option value="Básica Lisa">Básica Lisa (Sin logo / Unicolor)</option>
                      <option value="Vintage / Retro">Vintage / Retro (Desgastada)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-1">
                      Equipo / Franquicia
                    </label>
                    <input
                      type="text"
                      value={editingCap.team}
                      onChange={(e) => setEditingCap({ ...editingCap, team: e.target.value })}
                      placeholder="Ej. Texas Rangers, NY Yankees"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-1">
                      Colorway / Acabado
                    </label>
                    <input
                      type="text"
                      value={editingCap.color}
                      onChange={(e) => setEditingCap({ ...editingCap, color: e.target.value })}
                      placeholder="Ej. Negro / Dorado, Azul Marino"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* 3. CONFIGURACIÓN DE TALLAS DISPONIBLES                        */}
              {/* ============================================================== */}
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-neutral-500" />
                      Tallas Habilitadas para Venta (POS & Web)
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Selecciona las tallas activas o usa los atajos rápidos.
                    </p>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCap({
                          ...editingCap,
                          sizes: ['Unitalla Ajustable'],
                        })
                      }
                      className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-lg text-[10px] font-black uppercase text-neutral-800 transition-colors"
                    >
                      Unitalla Ajustable
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCap({
                          ...editingCap,
                          sizes: ['Unitalla Ajustable', 'Hebilla Metálica'],
                        })
                      }
                      className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-lg text-[10px] font-black uppercase text-neutral-800 transition-colors"
                    >
                      Hebilla Metálica
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCap({
                          ...editingCap,
                          sizes: ['Unitalla Ajustable', 'Broche Snapback'],
                        })
                      }
                      className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-lg text-[10px] font-black uppercase text-neutral-800 transition-colors"
                    >
                      Snapback
                    </button>
                  </div>
                </div>

                {/* Size Chips Selector */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {AVAILABLE_FITTED_SIZES.map((sz) => {
                    const isSelected = editingCap.sizes?.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const currentSizes = editingCap.sizes || [];
                          const nextSizes = isSelected
                            ? currentSizes.filter((s) => s !== sz)
                            : [...currentSizes, sz];
                          setEditingCap({
                            ...editingCap,
                            sizes: nextSizes.length > 0 ? nextSizes : ['Unitalla Ajustable'],
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-xs scale-102'
                            : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================== */}
              {/* 4. PRECIOS, COSTO & STOCK FÍSICO (Bs.)                         */}
              {/* ============================================================== */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
                  Precios, Costo & Stock en Almacén (Bolivia Bs.)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-1">
                      Precio Venta (Bs.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingCap.salePrice}
                      onChange={(e) =>
                        setEditingCap({ ...editingCap, salePrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm font-black text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-1">
                      Costo Compra (Bs.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingCap.currentUnitCost}
                      onChange={(e) =>
                        setEditingCap({
                          ...editingCap,
                          currentUnitCost: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm font-black text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-1">
                      Stock Físico (Uds.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingCap.currentStock}
                      onChange={(e) =>
                        setEditingCap({
                          ...editingCap,
                          currentStock: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm font-black text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-1">
                      Stock Mínimo (Alerta)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingCap.minStockThreshold}
                      onChange={(e) =>
                        setEditingCap({
                          ...editingCap,
                          minStockThreshold: parseInt(e.target.value, 10) || 3,
                        })
                      }
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm font-black text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Profit KPI bar */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      Margen Comercial Estimado
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-900">
                    Ganancia: <span className="font-black text-sm">Bs. {editingCap.salePrice - editingCap.currentUnitCost}</span> por unidad ({editingCap.salePrice > 0 ? (((editingCap.salePrice - editingCap.currentUnitCost) / editingCap.salePrice) * 100).toFixed(0) : 0}% margen)
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* 5. ETIQUETAS COMERCIALES & VISIBILIDAD                         */}
              {/* ============================================================== */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Nuevo Drop */}
                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <div className="font-black text-xs uppercase tracking-wider text-neutral-900">
                      🔥 Nuevo Drop
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Etiqueta roja de lanzamiento
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingCap({ ...editingCap, isNew: !editingCap.isNew })}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      editingCap.isNew ? 'bg-rose-600 text-white' : 'bg-neutral-300 text-neutral-700'
                    }`}
                  >
                    {editingCap.isNew ? 'Activo' : 'No'}
                  </button>
                </div>

                {/* Envío Gratis */}
                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <div className="font-black text-xs uppercase tracking-wider text-neutral-900">
                      🚚 Envío Gratis
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Promoción de despacho Bolivia
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingCap({ ...editingCap, freeShipping: !editingCap.freeShipping })}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      editingCap.freeShipping ? 'bg-emerald-600 text-white' : 'bg-neutral-300 text-neutral-700'
                    }`}
                  >
                    {editingCap.freeShipping ? 'Activo' : 'No'}
                  </button>
                </div>

                {/* Visibility */}
                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <div className="font-black text-xs uppercase tracking-wider text-neutral-900">
                      👁️ Catálogo Web
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Visible para clientes online
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingCap({ ...editingCap, isActive: !editingCap.isActive })}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      editingCap.isActive ? 'bg-black text-white' : 'bg-neutral-300 text-neutral-700'
                    }`}
                  >
                    {editingCap.isActive ? 'Visible' : 'Oculto'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/90 flex items-center justify-between gap-3">
              <div>
                {!isCreatingNew && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(editingCap.id)}
                    className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Gorra</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCap(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>{isCreatingNew ? 'Guardar y Publicar Gorra' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
