'use client';

import React, { useState, useMemo } from 'react';
import { EquipmentItem } from '@/lib/equipmentRegistry';
import {
  Search,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Zap,
  Award,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface EquipmentCatalogClientProps {
  initialEquipment: EquipmentItem[];
}

export default function EquipmentCatalogClient({ initialEquipment }: EquipmentCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');

  // Categories list
  const categories = [
    { id: 'ALL', label: 'All Equipment', icon: '⚡' },
    { id: 'GRINDER', label: 'Coffee Grinders', icon: '⚙️' },
    { id: 'ESPRESSO_MACHINE', label: 'Espresso Machines', icon: '☕' },
    { id: 'KETTLE', label: 'Gooseneck Kettles', icon: '🫖' },
    { id: 'BREWER', label: 'Brewers', icon: '💧' },
    { id: 'SCALE', label: 'Barista Scales', icon: '⚖️' },
    { id: 'SUBSCRIPTION', label: 'Subscriptions', icon: '📦' },
  ];

  // Available brands list
  const brands = useMemo(() => {
    const list = Array.from(new Set(initialEquipment.map((item) => item.brand))).filter(Boolean);
    return ['ALL', ...list.sort()];
  }, [initialEquipment]);

  // Filter & Sort Logic
  const filteredEquipment = useMemo(() => {
    return initialEquipment
      .filter((item) => {
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchBrand = item.brand.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchBest = item.bestFor.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCategory && !matchDesc && !matchBest) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
          return false;
        }

        // Brand Filter
        if (selectedBrand !== 'ALL' && item.brand !== selectedBrand) {
          return false;
        }

        // Price Range Filter
        if (selectedPriceRange === 'UNDER_100' && item.price >= 100) return false;
        if (selectedPriceRange === '100_300' && (item.price < 100 || item.price > 300)) return false;
        if (selectedPriceRange === '300_700' && (item.price < 300 || item.price > 700)) return false;
        if (selectedPriceRange === 'OVER_700' && item.price <= 700) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.editorialRating - a.editorialRating;
        // Default: Featured / High-yield first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.estimatedYieldUsd - a.estimatedYieldUsd;
      });
  }, [initialEquipment, searchQuery, selectedCategory, selectedBrand, selectedPriceRange, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setSelectedPriceRange('ALL');
    setSortBy('recommended');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'ALL' || selectedBrand !== 'ALL' || selectedPriceRange !== 'ALL';

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO SECTION */}
      <section className="bg-[#E8DCC8] border-b border-stone-300/70 py-12 sm:py-16 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-4xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-400/60 bg-[#FAF7F2]/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-stone-800">
            <Sparkles size={13} className="text-amber-900" /> Coffee Equipment & Setup Engine
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Explore Coffee Equipment & Gear
          </h1>
          <p className="mt-2 text-base text-stone-700 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Search precision grinders, commercial espresso machines, pour-over kettles, and barista scales from Baratza, Fellow, Breville, and Acaia.
          </p>

          {/* SEARCH BAR */}
          <div className="mx-auto max-w-2xl pt-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment by brand, model, or category (e.g. Baratza Encore, Breville, Fellow Kettle)..."
                className="w-full rounded-2xl border border-stone-300 bg-[#FAF7F2] py-3.5 pl-12 pr-4 text-sm text-stone-900 placeholder-stone-400 shadow-sm outline-none focus:border-amber-900 focus:ring-1 focus:ring-amber-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs text-stone-500 hover:text-stone-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY CHIPS */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-900 text-white shadow-sm'
                  : 'border border-stone-300 bg-[#F3EBDD] text-stone-800 hover:border-stone-400 hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FILTER TOOLBAR & SORTING */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-stone-300 bg-[#F3EBDD] p-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Brand Dropdown */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-xs font-semibold text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="ALL">All Brands ({brands.length - 1})</option>
                {brands
                  .filter((b) => b !== 'ALL')
                  .map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-stone-500" />
            </div>

            {/* Price Range Dropdown */}
            <div className="relative">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-xs font-semibold text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="ALL">All Price Ranges</option>
                <option value="UNDER_100">Under $100</option>
                <option value="100_300">$100 – $300</option>
                <option value="300_700">$300 – $700</option>
                <option value="OVER_700">$700+</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-stone-500" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline"
              >
                <RotateCcw size={12} /> Reset Filters
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold uppercase text-stone-500">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-xs font-semibold text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-stone-500" />
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="mt-4 flex items-center justify-between text-xs text-stone-600">
          <span>
            Showing <strong className="font-semibold text-stone-900">{filteredEquipment.length}</strong> equipment items
          </span>
        </div>
      </section>

      {/* 4. EQUIPMENT GRID */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEquipment.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-stone-400 hover:shadow-md"
              >
                <div>
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-white border border-stone-300/80">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (item.category === 'ESPRESSO_MACHINE') {
                          target.src = 'https://images.unsplash.com/photo-1517668808822-9e428d6904d4?w=800&auto=format&fit=crop&q=80';
                        } else if (item.category === 'KETTLE') {
                          target.src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80';
                        } else if (item.category === 'BREWER') {
                          target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80';
                        } else {
                          target.src = 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=800&auto=format&fit=crop&q=80';
                        }
                      }}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-stone-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
                      {item.bestFor.replace(/ESPRESSO_MACHINE/g, 'Espresso Machines').replace(/GRINDER/g, 'Grinders').replace(/KETTLE/g, 'Kettles').replace(/BREWER/g, 'Brewers').replace(/SCALE/g, 'Scales')}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-emerald-800 px-2.5 py-0.5 text-[11px] font-bold text-white">
                      ★ {item.editorialRating} Rating
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1">
                    <span className="text-amber-900 uppercase tracking-wider">{item.brand}</span>
                    <span className="text-stone-950 text-base font-black">${item.price.toFixed(2)}</span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-stone-950 group-hover:text-amber-900 transition-colors">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Key Features */}
                  <div className="mt-4 space-y-1.5 border-t border-stone-300/70 pt-3">
                    {item.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-medium text-stone-700">
                        <Check size={12} className="text-emerald-700 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-stone-300/70 pt-4 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-stone-500">
                    Partner: {item.affiliateNetwork}
                  </span>
                  <a
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-900 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800 transition-colors shadow-sm"
                  >
                    <span>Buy at Merchant</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-12 text-center">
            <SlidersHorizontal className="mx-auto h-12 w-12 text-stone-400 mb-3" />
            <h3 className="text-lg font-semibold text-stone-900">No equipment matches your search</h3>
            <p className="mt-1 text-xs text-stone-600">Try adjusting your brand, category, or price filters.</p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
