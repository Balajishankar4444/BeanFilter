'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  Coffee,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Building2,
  Tag,
  Compass,
} from 'lucide-react';

import { getCurrencySymbol } from '@/lib/formatCurrency';

export interface EnrichedRoaster {
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
  tags: string[];
  isFeatured?: boolean;
  productCount: number;
  businessType: 'ROASTER' | 'RETAILER' | 'SUBSCRIPTION' | 'BRAND' | 'EQUIPMENT';
  affiliateStatus: 'confirmed' | 'unverified' | 'needs_verification' | 'none';
  affiliateNetwork?: string;
  commissionRate?: number;
  commissionDescription?: string;
  cookieDays?: number;
  averageOrderValue?: number;
  affiliateTrackingUrl?: string;
}

interface RoasterDirectoryClientProps {
  initialRoasters: EnrichedRoaster[];
}

export default function RoasterDirectoryClient({ initialRoasters }: RoasterDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedStyle, setSelectedStyle] = useState<string>('ALL');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('ALL');
  const [onlyAffiliates, setOnlyAffiliates] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'name' | 'products'>('recommended');
  const [selectedTaste, setSelectedTaste] = useState<string | null>(null);

  // Available countries
  const countries = useMemo(() => {
    const list = Array.from(new Set(initialRoasters.map((r) => r.country))).filter(Boolean);
    return ['ALL', ...list];
  }, [initialRoasters]);

  // Taste preference options
  const tasteOptions = [
    { id: 'fruity', label: 'Bright & Fruity', icon: '🍓', tag: 'Light Roast' },
    { id: 'nutty', label: 'Chocolate & Nutty', icon: '🍫', tag: 'Medium Roast' },
    { id: 'balanced', label: 'Sweet & Balanced', icon: '🍯', tag: 'Specialty' },
    { id: 'floral', label: 'Floral & Tea-Like', icon: '🌸', tag: 'Single Origin' },
    { id: 'bold', label: 'Bold & Rich', icon: '☕', tag: 'Espresso' },
  ];

  // Filtered & Sorted Roasters
  const filteredRoasters = useMemo(() => {
    return initialRoasters
      .filter((r) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchCity = r.city.toLowerCase().includes(q);
          const matchCountry = r.country.toLowerCase().includes(q);
          const matchDesc = r.description.toLowerCase().includes(q);
          const matchTags = r.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchCity && !matchCountry && !matchDesc && !matchTags) {
            return false;
          }
        }

        // Country filter
        if (selectedCountry !== 'ALL' && r.country !== selectedCountry) {
          return false;
        }

        // Style filter
        if (selectedStyle !== 'ALL' && !r.tags.includes(selectedStyle)) {
          return false;
        }

        // Business Type filter
        if (selectedBusinessType !== 'ALL' && r.businessType !== selectedBusinessType) {
          return false;
        }

        // Only Confirmed Affiliate Partners filter
        if (onlyAffiliates && r.affiliateStatus !== 'confirmed') {
          return false;
        }

        // Taste preference filter
        if (selectedTaste) {
          const matchedPref = tasteOptions.find((t) => t.id === selectedTaste);
          if (matchedPref && !r.tags.includes(matchedPref.tag) && !r.tags.includes('Specialty')) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'products') {
          return b.productCount - a.productCount;
        }
        // Recommended default: featured first, then product count
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.productCount - a.productCount;
      });
  }, [initialRoasters, searchQuery, selectedCountry, selectedStyle, sortBy, selectedTaste]);

  const featuredRoasters = useMemo(() => {
    return initialRoasters.filter((r) => r.isFeatured).slice(0, 6);
  }, [initialRoasters]);

  const handlePopularSearch = (term: string) => {
    setSelectedCountry(term);
    setSearchQuery('');
    const directorySection = document.getElementById('directory');
    if (directorySection) {
      directorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTasteSelect = (tasteId: string) => {
    if (selectedTaste === tasteId) {
      setSelectedTaste(null);
    } else {
      setSelectedTaste(tasteId);
      const directorySection = document.getElementById('directory');
      if (directorySection) {
        directorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative border-b border-stone-300/70 py-16 sm:py-20 bg-[#E8DCC8]">
        <div className="mx-auto max-w-5xl px-6 text-center sm:px-8">
          <div className="animate-fade-up delay-1 mb-4 inline-flex items-center gap-2 rounded-full border border-stone-400/80 bg-[#F3EBDD]/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-700 backdrop-blur-sm">
            <Building2 size={13} className="text-amber-800" />
            <span>Coffee Roasters</span>
          </div>

          <h1 className="animate-fade-up delay-2 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-stone-950 sm:text-6xl lg:text-7xl">
            Find Your Next Coffee Roaster
          </h1>

          <p className="animate-fade-up delay-3 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-700 sm:text-xl">
            Discover specialty coffee roasters, explore their coffees, and find beans that match the way you like to drink coffee.
          </p>

          {/* Search Box */}
          <div className="animate-fade-up delay-4 mx-auto mt-10 max-w-2xl">
            <div className="relative flex items-center rounded-2xl border border-stone-300/90 bg-[#FAF7F2] p-2 shadow-lg transition-all duration-300 focus-within:border-stone-500 focus-within:ring-2 focus-within:ring-amber-800/20">
              <Search className="ml-4 h-5 w-5 text-stone-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roasters, cities, countries..."
                className="w-full bg-transparent px-4 py-3 text-base text-stone-900 placeholder-stone-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROASTERS */}
      {featuredRoasters.length > 0 && (
        <section className="bg-[#F3EBDD] py-16 border-y border-stone-300/70">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                FEATURED
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Roasters Worth Exploring
              </h2>
              <p className="mt-2 text-base text-stone-600">
                Discover coffee roasters selected for their coffee, approach and reputation.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredRoasters.map((roaster) => (
                <div
                  key={roaster.id}
                  className="group flex flex-col justify-between rounded-2xl border border-stone-300 bg-[#FAF7F2] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-stone-400 hover:shadow-lg"
                >
                  <div>
                    {/* Logo & Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-stone-300 bg-[#F3EBDD] font-bold text-stone-800 text-lg overflow-hidden shrink-0">
                        {roaster.logoUrl ? (
                          <img
                            src={roaster.logoUrl}
                            alt={roaster.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          roaster.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-900">
                        <Sparkles size={11} className="text-amber-700" />
                        Featured
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-stone-950 group-hover:text-amber-900 transition-colors">
                      {roaster.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-600">
                      <MapPin size={13} className="text-stone-400" />
                      <span>
                        {roaster.city}, {roaster.country}
                      </span>
                    </p>

                    <p className="mt-3 text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {roaster.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {roaster.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-stone-300/70 bg-[#F3EBDD]/60 px-2.5 py-1 text-[11px] font-medium text-stone-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
                    <span className="text-xs font-medium text-stone-500">
                      {roaster.productCount} {roaster.productCount === 1 ? 'Coffee' : 'Coffees'} Available
                    </span>
                    <Link
                      href={`/roasters/${roaster.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>View Roaster</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. ALL COFFEE ROASTERS (Directory) */}
      <section id="directory" className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 scroll-mt-24">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            ROASTER DIRECTORY
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            All Coffee Roasters
          </h2>
          <p className="mt-2 text-base text-stone-600">
            Browse specialty coffee roasters and discover where your next bag of coffee comes from.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-stone-300 bg-[#F3EBDD] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name or city..."
                className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-9 pr-3 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-stone-400"
              />
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-sm font-medium text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="ALL">All Countries</option>
                {countries
                  .filter((c) => c !== 'ALL')
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-stone-500" />
            </div>

            {/* Style Dropdown */}
            <div className="relative">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-sm font-medium text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="ALL">All Roast Styles</option>
                <option value="Specialty">Specialty</option>
                <option value="Light Roast">Light Roast</option>
                <option value="Single Origin">Single Origin</option>
                <option value="Espresso">Espresso</option>
                <option value="Direct Trade">Direct Trade</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-stone-500" />
            </div>
            {/* Business Type Dropdown */}
            <div className="relative">
              <select
                value={selectedBusinessType}
                onChange={(e) => setSelectedBusinessType(e.target.value)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-sm font-medium text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="ALL">All Categories</option>
                <option value="ROASTER">Specialty Roaster</option>
                <option value="RETAILER">Marketplace / Retailer</option>
                <option value="SUBSCRIPTION">Subscription Service</option>
                <option value="BRAND">Coffee Brand</option>
                <option value="EQUIPMENT">Equipment Retailer</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-stone-500" />
            </div>

            {/* Affiliate Partner Toggle */}
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 px-3 text-sm font-medium text-stone-800 hover:border-stone-400">
              <input
                type="checkbox"
                checked={onlyAffiliates}
                onChange={(e) => setOnlyAffiliates(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-amber-900 focus:ring-amber-800"
              />
              <span>Affiliate Partners</span>
            </label>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 shrink-0">
              Sort:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none rounded-xl border border-stone-300 bg-[#FAF7F2] py-2 pl-3 pr-8 text-sm font-medium text-stone-800 outline-none hover:border-stone-400"
              >
                <option value="recommended">Recommended</option>
                <option value="name">Name (A–Z)</option>
                <option value="products">Most Coffees</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-stone-500" />
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filters */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-600">
          <span>
            Showing <strong className="font-semibold text-stone-900">{filteredRoasters.length}</strong> {filteredRoasters.length === 1 ? 'roaster' : 'roasters'}
          </span>
          {(searchQuery || selectedCountry !== 'ALL' || selectedStyle !== 'ALL' || selectedTaste) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('ALL');
                setSelectedStyle('ALL');
                setSelectedTaste(null);
              }}
              className="font-medium text-amber-900 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* 5. ROASTER CARDS GRID */}
        {filteredRoasters.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRoasters.map((roaster) => (
              <div
                key={roaster.id}
                className="group flex flex-col justify-between rounded-2xl border border-stone-300/80 bg-[#F3EBDD] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-stone-400 hover:shadow-md"
              >
                <div>
                  {/* Top area */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-stone-300 bg-[#FAF7F2] font-bold text-stone-800 overflow-hidden shrink-0">
                      {roaster.logoUrl ? (
                        <img
                          src={roaster.logoUrl}
                          alt={roaster.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        roaster.name.substring(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {roaster.affiliateStatus === 'confirmed' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          <Check size={11} className="text-emerald-700" />
                          Affiliate Partner
                        </span>
                      ) : (
                        <span className="rounded-full border border-stone-300/80 bg-stone-200/60 px-2.5 py-0.5 text-[10px] font-medium text-stone-600">
                          Roaster Directory
                        </span>
                      )}

                      {roaster.productCount > 0 && (
                        <span className="rounded-full bg-stone-300/70 px-2.5 py-0.5 text-[10px] font-semibold text-stone-700">
                          {roaster.productCount} {roaster.productCount === 1 ? 'Coffee' : 'Coffees'}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight text-stone-950 group-hover:text-amber-900 transition-colors">
                    {roaster.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-600">
                    <MapPin size={13} className="text-stone-400" />
                    <span>
                      {roaster.city}, {roaster.country}
                    </span>
                  </p>

                  <p className="mt-3 text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {roaster.description}
                  </p>

                  {/* Commission / Shipping Details */}
                  {roaster.affiliateStatus === 'confirmed' && roaster.commissionDescription && (
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span>💡 {roaster.commissionDescription}</span>
                    </div>
                  )}

                  {roaster.shippingThreshold && (
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-stone-600">
                      <span>🚚 Free shipping over {getCurrencySymbol(roaster.defaultCurrency, roaster.name)}{roaster.shippingThreshold}</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {roaster.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-stone-300 bg-[#FAF7F2]/80 px-2.5 py-1 text-[11px] font-medium text-stone-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-stone-300/70 pt-4 flex items-center justify-between">
                  <a
                    href={roaster.affiliateTrackingUrl || roaster.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-600 hover:text-stone-950 transition-colors flex items-center gap-1 font-medium"
                  >
                    <Globe size={12} />
                    <span>{roaster.affiliateStatus === 'confirmed' ? `Buy at ${roaster.name}` : 'Visit Website'}</span>
                  </a>
                  <Link
                    href={`/roasters/${roaster.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Coffees</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-300/60 text-stone-600 mb-4">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-semibold text-stone-950">No roasters found</h3>
            <p className="mt-2 text-sm text-stone-600 max-w-md mx-auto">
              We couldn’t find any coffee roasters matching your search criteria. Try clearing your filters or searching for another location.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('ALL');
                setSelectedStyle('ALL');
                setSelectedTaste(null);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-medium text-[#E8DCC8] hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 6. FIND A ROASTER FOR YOUR TASTE */}
      <section className="bg-[#F3EBDD] py-16 border-y border-stone-300/70">
        <div className="mx-auto max-w-5xl px-6 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            FIND YOUR MATCH
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            What Kind of Coffee Do You Like?
          </h2>
          <p className="mt-3 text-base text-stone-600 max-w-2xl mx-auto">
            Tell us what you enjoy in your cup and discover roasters worth exploring.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {tasteOptions.map((taste) => {
              const isSelected = selectedTaste === taste.id;
              return (
                <button
                  key={taste.id}
                  onClick={() => handleTasteSelect(taste.id)}
                  className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-[#E8DCC8] shadow-md scale-[1.03]'
                      : 'border-stone-300/90 bg-[#FAF7F2] text-stone-800 hover:border-stone-400 hover:bg-[#F7F2E8]'
                  }`}
                >
                  <span className="text-xl">{taste.icon}</span>
                  <span>{taste.label}</span>
                  {isSelected && <Check size={16} className="text-amber-400 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                const directorySection = document.getElementById('directory');
                if (directorySection) {
                  directorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-medium text-[#E8DCC8] hover:bg-stone-800 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Find My Roasters</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* 7. EXPLORE BY COFFEE STYLE */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            SPECIALTY SELECTIONS
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Explore Roasters by Coffee Style
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Light Roast Roasters',
              desc: 'Bright, fruity and complex coffees crafted to showcase natural origin characteristics.',
              filter: 'Light Roast',
            },
            {
              title: 'Espresso Roasters',
              desc: 'Roasters known for balanced, rich coffees suited to espresso and milk drinks.',
              filter: 'Espresso',
            },
            {
              title: 'Single-Origin Roasters',
              desc: 'Explore coffees traceable to individual origins, washing stations and farms.',
              filter: 'Single Origin',
            },
            {
              title: 'Decaf Roasters',
              desc: 'Specialty decaf coffee processed via Sugarcane or Swiss Water without compromising flavor.',
              filter: 'Specialty',
            },
            {
              title: 'Organic Coffee Roasters',
              desc: 'Discover roasters offering certified organic and eco-conscious coffee selections.',
              filter: 'Direct Trade',
            },
          ].map((style) => (
            <div
              key={style.title}
              onClick={() => {
                setSelectedStyle(style.filter);
                const directorySection = document.getElementById('directory');
                if (directorySection) {
                  directorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="group cursor-pointer rounded-2xl border border-stone-300/80 bg-[#F3EBDD] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-stone-400 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#E8DCC8] mb-4">
                  <Coffee size={20} />
                </div>
                <h3 className="text-xl font-semibold text-stone-950 group-hover:text-amber-900 transition-colors">
                  {style.title}
                </h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  {style.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center text-xs font-semibold text-stone-900 group-hover:translate-x-1 transition-transform">
                <span>View roasters</span>
                <ArrowRight size={14} className="ml-1.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FIND ROASTERS NEAR YOU */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-stone-300/80 bg-[#F3EBDD] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              NEAR YOU
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Find Coffee Roasters Near You
            </h2>
            <p className="text-base text-stone-600 leading-relaxed max-w-xl">
              Explore local coffee roasters and discover specialty coffee close to home. Compare coffees from roasters nearby or discover international craft roasters delivered directly to your door.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const directorySection = document.getElementById('directory');
                  if (directorySection) {
                    directorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-medium text-[#E8DCC8] hover:bg-stone-800 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Explore Local Roasters</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Tasteful Map Placeholder */}
          <div className="w-full lg:w-1/2 aspect-[4/3] max-w-md rounded-2xl border border-stone-300 bg-[#FAF7F2] p-6 shadow-inner relative overflow-hidden flex flex-col justify-between coffee-grid-bg">
            <div className="flex items-center justify-between text-xs font-medium text-stone-600">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-800" />
                Specialty Hubs Map
              </span>
              <span className="rounded-full bg-stone-200/80 px-2.5 py-0.5 text-[10px]">
                Global Directory
              </span>
            </div>

            {/* Simulated map pin callouts */}
            <div className="my-auto grid grid-cols-2 gap-3">
              {[
                { city: 'London', count: '1 Roaster' },
                { city: 'Brooklyn', count: '1 Roaster' },
                { city: 'Portland', count: '3 Roasters' },
                { city: 'San Francisco', count: '2 Roasters' },
              ].map((pin) => (
                <div
                  key={pin.city}
                  className="rounded-xl border border-stone-300 bg-[#F3EBDD]/90 p-3 backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-700 animate-ping" />
                    <span className="text-xs font-bold text-stone-900">{pin.city}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-stone-500">{pin.count}</p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-center text-stone-500 italic">
              Showing active specialty roasting hubs with worldwide delivery
            </p>
          </div>
        </div>
      </section>

      {/* 9. SEO CONTENT SECTION */}
      <section className="bg-[#F3EBDD] py-16 sm:py-20 border-t border-stone-300/70">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <div className="prose prose-stone max-w-none space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">
                GUIDE & INSIGHTS
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl border-b border-stone-300 pb-4">
                Coffee Roasters: A Guide to Finding Better Beans
              </h2>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-stone-900">What is a coffee roaster?</h3>
              <p className="text-base text-stone-700 leading-relaxed">
                A coffee roaster is a specialized craftsman or business that transforms raw, green coffee seeds into fragrant, roasted coffee beans. Green coffee beans are harvested, processed, and dried at coffee farms around the world before being shipped to roasters. Using heat and careful airflow control, roasters bring out the intricate natural sugars, acids, and aromatics inherent in each coffee lot.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-stone-900">What is a specialty coffee roaster?</h3>
              <p className="text-base text-stone-700 leading-relaxed">
                Specialty coffee roasters focus exclusively on high-grade arabica coffee that scores 80 points or higher on the standard 100-point Specialty Coffee Association (SCA) scale. Unlike commercial mass-market roasters who prioritize high-volume dark roasts to mask defects, specialty roasters source traceable micro-lots and roast in smaller batches. Their objective is to highlight origin characteristics—such as floral Ethiopian notes or chocolatey Colombian profiles—rather than heavy roast flavors.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-stone-900">How do I choose a coffee roaster?</h3>
              <p className="text-base text-stone-700 leading-relaxed">
                Finding the right coffee roaster comes down to matching their roasting philosophy with your personal taste. Consider these essential factors:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone-700">
                <li>
                  <strong className="font-semibold text-stone-900">Roast Profile:</strong> Do you prefer light, vibrant filter roasts or rich, balanced espresso blends?
                </li>
                <li>
                  <strong className="font-semibold text-stone-900">Coffee Origins:</strong> Check if the roaster sources from your favorite origins like Kenya, Ethiopia, Colombia, or Guatemala.
                </li>
                <li>
                  <strong className="font-semibold text-stone-900">Freshness & Roast Dates:</strong> Quality roasters stamp explicit roast dates on every bag rather than generic best-before dates.
                </li>
                <li>
                  <strong className="font-semibold text-stone-900">Processing Methods:</strong> Look for varied offerings including Washed, Natural, Honey, and Anaerobic fermentations.
                </li>
                <li>
                  <strong className="font-semibold text-stone-900">Transparency & Sourcing:</strong> Top roasters publish producer details, farm elevation, and direct trade practices.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-stone-900">Should I buy coffee directly from a roaster?</h3>
              <p className="text-base text-stone-700 leading-relaxed">
                Purchasing coffee directly from independent roasters or curated specialty platforms ensures maximum freshness and supports small-scale farming communities. Roasters typically ship within days of roasting, giving you fresh coffee at peak flavor expression while providing complete transparency regarding variety and altitude.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-stone-900">How fresh should roasted coffee be?</h3>
              <p className="text-base text-stone-700 leading-relaxed">
                For filter coffee (pour over, drip, French press), coffee is typically best enjoyed between 7 and 30 days after roasting. For espresso, allowing coffee to rest for 10 to 21 days lets trapped carbon dioxide degas naturally, resulting in smoother crema and balanced extraction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ — LAST SECTION */}
      <section className="mx-auto max-w-4xl px-6 sm:px-8 pb-16 sm:pb-24">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Coffee Roaster Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'What is a coffee roaster?',
              a: 'A coffee roaster is a craftsman or business that transforms green, unroasted coffee beans into roasted coffee ready for brewing. Roasters monitor heat, airflow, and time to develop complex flavor notes.',
            },
            {
              q: 'What is a specialty coffee roaster?',
              a: 'A specialty coffee roaster sources and roasts high-grade coffee scoring 80+ points on the SCA scale. They focus on micro-lot traceability, light to medium roast profiles, and preserving unique origin flavors.',
            },
            {
              q: 'How do I find a good coffee roaster?',
              a: 'Look for roasters that print clear roast dates, detail the coffee’s origin and elevation, offer single-origin selections, and provide detailed tasting notes.',
            },
            {
              q: 'Is freshly roasted coffee better?',
              a: 'Yes. Freshly roasted coffee contains vibrant aromatics and complex flavors. However, coffee needs a few days of resting (degassing) after roasting before brewing for optimal flavor balance.',
            },
            {
              q: 'What should I look for when choosing a coffee roaster?',
              a: 'Key factors include roast profile preference (light, medium, dark), origin variety, processing methods, ethical sourcing practices, and clear shipping thresholds.',
            },
            {
              q: 'What is the difference between a coffee roaster and a coffee shop?',
              a: 'A coffee roaster roasts raw green beans into coffee beans. A coffee shop prepares and serves brewed coffee beverages to customers. Many specialty companies operate as both roasteries and cafes.',
            },
            {
              q: 'Can I buy coffee directly from a roaster?',
              a: 'Yes! Buying directly from roasters or through specialty discovery platforms ensures you receive freshly roasted beans, detailed brew recommendations, and direct support for farm-level producers.',
            },
          ].map((item, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6 transition-all duration-200 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-stone-950 text-lg">
                <span>{item.q}</span>
                <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-400 text-stone-600 transition-transform group-open:rotate-180">
                  <ChevronDown size={16} />
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-stone-700 border-t border-stone-300/60 pt-4">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
