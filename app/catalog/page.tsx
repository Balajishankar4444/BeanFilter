'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, SlidersHorizontal, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { CatalogFilters } from '@/components/CatalogFilters';
import { ScrollFadeUp } from '@/components/ScrollFadeUp';
import { useBasket } from '@/context/BasketContext';

const CATEGORIES = ['All', 'Filter', 'Espresso', 'Decaf', 'Cold Brew', 'Omni-roast'];

function CatalogContent() {
  const searchParams = useSearchParams();
  const { favorites } = useBasket();

  const [products, setProducts] = useState<any[]>([]);
  const [roasters, setRoasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoasters, setSelectedRoasters] = useState<string[]>([]);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [selectedRoastLevel, setSelectedRoastLevel] = useState('');
  const [selectedFlavorNotes, setSelectedFlavorNotes] = useState<string[]>([]);
  const [maxBagPrice, setMaxBagPrice] = useState<number>(150);
  const [maxPrice100g, setMaxPrice100g] = useState<number>(50);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'cheapest' | 'newest' | 'name'>('cheapest');

  // Mobile Filter Drawer State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state dynamically whenever URL searchParams change
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedProcess(searchParams.get('process') || '');
    setSelectedRoastLevel(searchParams.get('roastLevel') || '');
    if (searchParams.get('favorites') === 'true') {
      setShowFavoritesOnly(true);
    } else {
      setShowFavoritesOnly(false);
    }
    if (searchParams.get('roasters')) {
      setSelectedRoasters(searchParams.get('roasters')!.split(','));
    } else {
      setSelectedRoasters([]);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRoasters();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedRoasters, selectedProcess, selectedRoastLevel, selectedFlavorNotes, maxBagPrice, maxPrice100g, inStockOnly, showFavoritesOnly]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedRoasters, selectedProcess, selectedRoastLevel, selectedFlavorNotes, maxBagPrice, maxPrice100g, inStockOnly, currentPage]);

  const fetchRoasters = async () => {
    try {
      const res = await fetch('/api/roasters');
      const data = await res.json();
      if (data.success) {
        setRoasters(data.roasters);
      }
    } catch (e) {
      console.error('Failed to fetch roasters', e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
      if (selectedRoasters.length > 0) params.set('roasters', selectedRoasters.join(','));
      if (selectedProcess) params.set('process', selectedProcess);
      if (selectedRoastLevel) params.set('roastLevel', selectedRoastLevel);
      if (selectedFlavorNotes.length > 0) params.set('flavorNotes', selectedFlavorNotes.join(','));
      if (maxBagPrice < 150) params.set('maxPrice', String(maxBagPrice));
      if (maxPrice100g < 50) params.set('maxPrice100g', String(maxPrice100g));
      if (inStockOnly) params.set('inStockOnly', 'true');
      params.set('page', String(currentPage));
      params.set('limit', '18');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedRoasters([]);
    setSelectedProcess('');
    setSelectedRoastLevel('');
    setSelectedFlavorNotes([]);
    setMaxBagPrice(150);
    setMaxPrice100g(50);
    setInStockOnly(false);
    setShowFavoritesOnly(false);
    setCurrentPage(1);
  };

  const displayedProducts = showFavoritesOnly
    ? products.filter((p) => favorites.includes(p.id))
    : products;

  const sortedProducts = [...displayedProducts].sort((a, b) => {
    if (sortBy === 'cheapest') {
      return (a.cheapestPricePer100g || 0) - (b.cheapestPricePer100g || 0);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const stateKey = `${selectedCategory}-${selectedProcess}-${currentPage}-${searchQuery}-${sortBy}-${inStockOnly}-${showFavoritesOnly}-${maxBagPrice}-${maxPrice100g}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-up">
      {/* Header & Main Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6 animate-fade-up delay-1">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Specialty Coffee Catalog</h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse and compare specialty coffees across roasters. Prices normalized to **Price / 100g**.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, roaster, origin..."
              className="w-full rounded-xl border border-stone-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-stone-900 shadow-sm focus:border-amber-800 focus:outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-800 shadow-sm hover:bg-stone-50 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-fade-up delay-2">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] font-black text-stone-400 uppercase tracking-wider mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-amber-900 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border hover:scale-105 active:scale-95 ${
            showFavoritesOnly
              ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${showFavoritesOnly ? 'fill-red-500 text-red-500' : ''}`} />
          <span>Saved Coffees ({favorites.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showMobileFilters ? 'block' : 'hidden'} md:block md:col-span-1 animate-fade-up delay-3`}>
          <CatalogFilters
            roasters={roasters}
            selectedRoasters={selectedRoasters}
            setSelectedRoasters={setSelectedRoasters}
            selectedProcess={selectedProcess}
            setSelectedProcess={setSelectedProcess}
            selectedRoastLevel={selectedRoastLevel}
            setSelectedRoastLevel={setSelectedRoastLevel}
            selectedFlavorNotes={selectedFlavorNotes}
            setSelectedFlavorNotes={setSelectedFlavorNotes}
            maxBagPrice={maxBagPrice}
            setMaxBagPrice={setMaxBagPrice}
            maxPrice100g={maxPrice100g}
            setMaxPrice100g={setMaxPrice100g}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Catalog Main View */}
        <main className="md:col-span-3 space-y-4">
          {/* Top Bar: Count & Active Filters Indicator */}
          <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-stone-200 shadow-sm text-xs animate-fade-up delay-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-700">
                Showing <strong className="text-stone-900">{showFavoritesOnly ? sortedProducts.length : totalCount}</strong> specialty coffees
              </span>
              {showFavoritesOnly && (
                <span className="rounded-lg bg-red-100 px-2 py-0.5 font-bold text-red-900 animate-scale-in">
                  Saved Favorites Only
                </span>
              )}
              {selectedProcess && (
                <span className="rounded-lg bg-amber-100 px-2 py-0.5 font-bold text-amber-900 animate-scale-in">
                  {selectedProcess} Process
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1 text-xs font-bold text-stone-800 focus:outline-none transition-all"
              >
                <option value="cheapest">Cheapest / 100g</option>
                <option value="newest">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Grid View & ScrollFadeUp Cards */}
          {loading ? (
            <div key={`loading-${stateKey}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl border border-stone-200/80 bg-white p-5 space-y-4 shadow-sm">
                  <div className="aspect-[4/3] rounded-2xl animate-shimmer" />
                  <div className="h-4 w-1/3 rounded-lg animate-shimmer" />
                  <div className="h-6 w-3/4 rounded-lg animate-shimmer" />
                  <div className="h-4 w-1/2 rounded-lg animate-shimmer" />
                  <div className="h-10 rounded-2xl animate-shimmer" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div key={`empty-${stateKey}`} className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center animate-fade-up">
              <p className="text-sm font-bold text-stone-800">
                {showFavoritesOnly ? "You haven't saved any coffees yet" : "No coffees matched your filters"}
              </p>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                {showFavoritesOnly ? "Click the heart button on any coffee card to save it for later." : "Try clearing some filters or searching for something else."}
              </p>
              <button
                onClick={handleResetFilters}
                className="rounded-xl bg-amber-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-800 transition-all hover:scale-105 active:scale-95"
              >
                {showFavoritesOnly ? "View Full Catalog" : "Reset All Filters"}
              </button>
            </div>
          ) : (
            <div key={`grid-${stateKey}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product, idx) => (
                <ScrollFadeUp key={`${stateKey}-${product.id}`} delay={(idx % 3) * 70}>
                  <ProductCard product={product} />
                </ScrollFadeUp>
              ))}
            </div>
          )}

          {/* Pagination Bar */}
          {!showFavoritesOnly && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-200 bg-white p-4 rounded-2xl shadow-sm mt-6 animate-fade-up delay-5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                  currentPage === 1 ? 'border-stone-200 text-stone-400 cursor-not-allowed' : 'border-stone-300 text-stone-800 hover:bg-stone-100 hover:scale-105 active:scale-95'
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              <span className="text-xs font-bold text-stone-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                  currentPage === totalPages ? 'border-stone-200 text-stone-400 cursor-not-allowed' : 'border-stone-300 text-stone-800 hover:bg-stone-100 hover:scale-105 active:scale-95'
                }`}
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 animate-fade-up">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-3xl border border-stone-200/80 bg-white p-5 space-y-4 shadow-sm">
            <div className="aspect-[4/3] rounded-2xl animate-shimmer" />
            <div className="h-4 w-1/3 rounded-lg animate-shimmer" />
            <div className="h-6 w-3/4 rounded-lg animate-shimmer" />
            <div className="h-10 rounded-2xl animate-shimmer" />
          </div>
        ))}
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
