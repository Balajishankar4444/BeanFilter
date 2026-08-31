'use client';

import React from 'react';
import { CupSoda, Sliders } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

export function DoseCalculatorWidget() {
  const { doseG, setDoseG } = useBasket();

  const presets = [
    { label: '12g (Light)', value: 12 },
    { label: '15g (Standard)', value: 15 },
    { label: '18g (Espresso)', value: 18 },
    { label: '20g (French Press)', value: 20 },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-800 text-amber-50">
          <CupSoda className="h-4 w-4" />
        </div>
        <div>
          <span>Live Dose Calculator</span>
          <p className="text-[11px] text-amber-800/80 font-normal">
            Adjust dose to recalculate exact **Cost per Cup** across all coffees.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => setDoseG(p.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              doseG === p.value
                ? 'bg-amber-900 text-white shadow-md scale-105'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
