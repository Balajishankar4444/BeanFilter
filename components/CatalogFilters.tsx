'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface CatalogFiltersProps {
  roasters: { name: string; slug: string }[];
  selectedRoasters: string[];
  setSelectedRoasters: (slugs: string[]) => void;
  selectedProcess: string;
  setSelectedProcess: (process: string) => void;
  selectedRoastLevel: string;
  setSelectedRoastLevel: (level: string) => void;
  selectedFlavorNotes: string[];
  setSelectedFlavorNotes: (notes: string[]) => void;
  maxBagPrice: number;
  setMaxBagPrice: (price: number) => void;
  maxPrice100g: number;
  setMaxPrice100g: (price: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (inStock: boolean) => void;
  onReset: () => void;
}

const COMMON_FLAVORS = ['Jasmine', 'Peach', 'Blueberry', 'Bergamot', 'Caramel', 'Chocolate', 'Honey', 'Citrus', 'Apple', 'Pecan'];
const PROCESSES = ['Washed', 'Natural', 'Anaerobic', 'Honey', 'Carbonic Maceration'];
const ROAST_LEVELS = ['Light', 'Medium-Light', 'Medium', 'Dark'];

export function CatalogFilters({
  roasters,
  selectedRoasters,
  setSelectedRoasters,
  selectedProcess,
  setSelectedProcess,
  selectedRoastLevel,
  setSelectedRoastLevel,
  selectedFlavorNotes,
  setSelectedFlavorNotes,
  maxBagPrice,
  setMaxBagPrice,
  maxPrice100g,
  setMaxPrice100g,
  inStockOnly,
  setInStockOnly,
  onReset,
}: CatalogFiltersProps) {
  const toggleRoaster = (slug: string) => {
    if (selectedRoasters.includes(slug)) {
      setSelectedRoasters(selectedRoasters.filter((s) => s !== slug));
    } else {
      setSelectedRoasters([...selectedRoasters, slug]);
    }
  };

  const toggleFlavorNote = (note: string) => {
    if (selectedFlavorNotes.includes(note)) {
      setSelectedFlavorNotes(selectedFlavorNotes.filter((n) => n !== note));
    } else {
      setSelectedFlavorNotes([...selectedFlavorNotes, note]);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
          <Filter className="h-4 w-4 text-amber-800" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-amber-800"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Max Total Bag Price ($) Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
          <span>Max Bag Price ($)</span>
          <span className="text-amber-900 font-extrabold">
            {maxBagPrice >= 150 ? 'Any Bag Price ($150+)' : `$${maxBagPrice.toFixed(0)}`}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="150"
          step="5"
          value={maxBagPrice}
          onChange={(e) => setMaxBagPrice(parseFloat(e.target.value))}
          className="w-full accent-amber-900 cursor-pointer"
        />
        <span className="text-[10px] text-stone-400 mt-1 block">Filters out bags costing more than this amount.</span>
      </div>

      {/* Max Price per 100g ($) Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
          <span>Max Price / 100g ($)</span>
          <span className="text-emerald-700 font-extrabold">
            {maxPrice100g >= 50 ? 'Any Value ($50+)' : `$${maxPrice100g.toFixed(2)}`}
          </span>
        </div>
        <input
          type="range"
          min="4"
          max="50"
          step="1"
          value={maxPrice100g}
          onChange={(e) => setMaxPrice100g(parseFloat(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <span className="text-[10px] text-stone-400 mt-1 block">Normalized value comparison metric.</span>
      </div>

      {/* Roasters Multi-Select */}
      <div>
        <h4 className="text-xs font-bold text-stone-800 mb-2">Roasters</h4>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {roasters.map((r) => (
            <label key={r.slug} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-stone-900">
              <input
                type="checkbox"
                checked={selectedRoasters.includes(r.slug)}
                onChange={() => toggleRoaster(r.slug)}
                className="rounded text-amber-800 focus:ring-amber-700"
              />
              <span>{r.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Process Method */}
      <div>
        <h4 className="text-xs font-bold text-stone-800 mb-2">Process Method</h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedProcess('')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
              selectedProcess === '' ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          {PROCESSES.map((proc) => (
            <button
              key={proc}
              onClick={() => setSelectedProcess(selectedProcess === proc ? '' : proc)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                selectedProcess === proc ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {proc}
            </button>
          ))}
        </div>
      </div>

      {/* Roast Level */}
      <div>
        <h4 className="text-xs font-bold text-stone-800 mb-2">Roast Level</h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedRoastLevel('')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
              selectedRoastLevel === '' ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          {ROAST_LEVELS.map((rl) => (
            <button
              key={rl}
              onClick={() => setSelectedRoastLevel(selectedRoastLevel === rl ? '' : rl)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                selectedRoastLevel === rl ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {rl}
            </button>
          ))}
        </div>
      </div>

      {/* Flavor Notes */}
      <div>
        <h4 className="text-xs font-bold text-stone-800 mb-2">Flavor Profile</h4>
        <div className="flex flex-wrap gap-1">
          {COMMON_FLAVORS.map((note) => {
            const isSelected = selectedFlavorNotes.includes(note);
            return (
              <button
                key={note}
                onClick={() => toggleFlavorNote(note)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  isSelected ? 'bg-amber-800 text-white' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200'
                }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="pt-2 border-t border-stone-100">
        <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded text-amber-800 focus:ring-amber-700"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
