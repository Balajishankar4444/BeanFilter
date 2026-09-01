'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Globe,
  Check,
  Search,
  ChevronDown,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export interface RoasterDetailData {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  logoUrl: string | null;
  defaultCurrency: string;
  shippingThreshold: number | null;
  baseShippingCost: number;
  city: string;
  country: string;
  description: string;
  businessType: string;
  affiliateStatus: string;
  affiliateNetwork?: string;
  commissionDescription?: string;
  affiliateTrackingUrl?: string;
  products: any[];
}

interface RoasterDetailClientProps {
  roaster: RoasterDetailData;
}

export default function RoasterDetailClient({ roaster }: RoasterDetailClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoast, setSelectedRoast] = useState('ALL');
  const [selectedProcess, setSelectedProcess] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredProducts = useMemo(() => {
    return roaster.products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchOrigin = (p.originCountry || '').toLowerCase().includes(q);
        const matchNotes = (p.flavorNotes || []).some((n: string) => n.toLowerCase().includes(q));
        if (!matchName && !matchOrigin && !matchNotes) return false;
      }

      if (selectedRoast !== 'ALL' && p.roastLevel !== selectedRoast) {
        return false;
      }

      if (selectedProcess !== 'ALL' && p.process !== selectedProcess) {
        return false;
      }

      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [roaster.products, searchQuery, selectedRoast, selectedProcess, selectedCategory]);

  return (
    <div className="space-y-8 pb-16">
      {/* BREADCRUMB & BACK LINK */}
      <div className="bg-[#E8DCC8] border-b border-stone-300/70 py-4 px-6 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/roasters"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-amber-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to All Roasters
          </Link>
        </div>
      </div>

      {/* ROASTER HERO BANNER */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-stone-300 bg-[#F3EBDD] p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Logo */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-stone-300 bg-[#FAF7F2] font-black text-2xl text-stone-800 overflow-hidden shrink-0 shadow-sm">
                {roaster.logoUrl ? (
                  <img src={roaster.logoUrl} alt={roaster.name} className="h-full w-full object-cover" />
                ) : (
                  roaster.name.substring(0, 2).toUpperCase()
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {roaster.affiliateStatus === 'confirmed' ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-900">
                      <Check size={13} className="text-emerald-700" />
                      Affiliate Partner ({roaster.affiliateNetwork || 'Verified'})
                    </span>
                  ) : (
                    <span className="rounded-full border border-stone-300 bg-stone-200/80 px-3 py-0.5 text-xs font-medium text-stone-700">
                      Specialty Roaster
                    </span>
                  )}

                  <span className="rounded-full bg-stone-300/80 px-3 py-0.5 text-xs font-semibold text-stone-800">
                    {roaster.products.length} {roaster.products.length === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-950">
                  {roaster.name}
                </h1>

                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-stone-600">
                  <MapPin size={14} className="text-stone-500" />
                  <span>
                    {roaster.city}, {roaster.country}
                  </span>
                </p>

                <p className="mt-3 text-sm text-stone-700 leading-relaxed max-w-2xl">
                  {roaster.description}
                </p>

                {/* Shipping & Commission Notes */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {roaster.shippingThreshold && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-[#FAF7F2] px-3 py-1 rounded-lg border border-stone-300">
                      <Truck size={13} className="text-amber-900" />
                      <span>Free shipping over ${roaster.shippingThreshold}</span>
                    </div>
                  )}

                  {roaster.affiliateStatus === 'confirmed' && roaster.commissionDescription && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-lg border border-emerald-300">
                      <span>💡 {roaster.commissionDescription}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA BUTTON */}
            <div className="w-full md:w-auto shrink-0 flex flex-col items-stretch md:items-end gap-2">
              <a
                href={roaster.affiliateTrackingUrl || roaster.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-900 px-6 py-3 text-sm font-bold text-white hover:bg-amber-800 transition-colors shadow-sm"
              >
                <Globe size={16} />
                <span>{roaster.affiliateStatus === 'confirmed' ? `Buy at ${roaster.name}` : 'Visit Store'}</span>
              </a>
              <span className="text-[11px] text-center md:text-right font-medium text-stone-500">
                Official Merchant Website
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">COFFEE CATALOG</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-950">
              Coffee & Beans from {roaster.name}
            </h2>
          </div>

          {/* FILTER TOOLBAR */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[180px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee..."
                className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-9 pr-3 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-stone-400"
              />
            </div>

            {/* Roast Level Filter */}
            <div className="relative">
              <select
                value={selectedRoast}
                onChange={(e) => setSelectedRoast(e.target.value)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-xs font-medium text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="ALL">All Roast Levels</option>
                <option value="Light">Light Roast</option>
                <option value="Medium-Light">Medium-Light</option>
                <option value="Medium">Medium</option>
                <option value="Dark">Dark</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-stone-500" />
            </div>

            {/* Process Filter */}
            <div className="relative">
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-xs font-medium text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="ALL">All Processes</option>
                <option value="Washed">Washed</option>
                <option value="Natural">Natural</option>
                <option value="Honey">Honey</option>
                <option value="Anaerobic">Anaerobic</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-stone-500" />
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-stone-400 mb-3" />
            <h3 className="text-lg font-semibold text-stone-900">No products match your filters</h3>
            <p className="mt-1 text-xs text-stone-600">Try adjusting your roast or process search settings.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRoast('ALL');
                setSelectedProcess('ALL');
                setSelectedCategory('ALL');
              }}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
