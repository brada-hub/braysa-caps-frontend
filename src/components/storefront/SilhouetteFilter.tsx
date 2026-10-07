'use client';

import React from 'react';
import { SilhouetteFilterType } from './types';

interface SilhouetteFilterProps {
  currentFilter: SilhouetteFilterType;
  onFilterChange: (filter: SilhouetteFilterType) => void;
  productCount: number;
}

const SILHOUETTES: { label: SilhouetteFilterType; description: string }[] = [
  { label: 'TODAS', description: 'Todo el catálogo' },
  { label: 'SNAPBACK (AJUSTABLE)', description: 'Visera plana con broche' },
  { label: 'CURVAS (BASEBALL)', description: 'Visera curva 9FORTY' },
  { label: 'FITTED (CERRADA)', description: 'Corona alta 59FIFTY' },
  { label: 'TRUCKER (MALLA)', description: 'Malla transpirable A-Frame' },
];

export default function SilhouetteFilter({
  currentFilter,
  onFilterChange,
  productCount,
}: SilhouetteFilterProps) {
  return (
    <div className="bg-white border-b border-neutral-200 sticky top-[95px] z-30 py-3 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Horizontal Scrollable Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto">
          {SILHOUETTES.map(({ label }) => {
            const isSelected = currentFilter === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onFilterChange(label)}
                className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase whitespace-nowrap transition-all border cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black hover:text-black'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Counter Badge */}
        <div className="text-[11px] font-black uppercase tracking-widest text-neutral-400 hidden sm:block">
          {productCount} {productCount === 1 ? 'MODELO DISPONIBLE' : 'MODELOS DISPONIBLES'}
        </div>
      </div>
    </div>
  );
}
