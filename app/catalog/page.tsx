'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, Coffee, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { CatalogFilters } from '@/components/CatalogFilters';
import { ProductCard } from '@/components/ProductCard';
import { ScrollFadeUp } from '@/components/ScrollFadeUp';
import { useBasket } from '@/context/BasketContext';

const CATEGORIES = ['All', 'Single Origin', 'Blend', 'Espresso', 'Filter', 'Decaf', 'Cold Brew'];

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
  const [sortBy, setSortBy] = useState<'cheapest' | 'newest' | 'name'>('cheapest');

  // Mobile Filter Drawer State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state dynamically whenever URL searchParams change
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedProcess(searchParams.get('process') || '');
    setSelectedRoastLevel(searchParams.get('roastLevel') || '');
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
  }, [searchQuery, selectedCategory, selectedRoasters, selectedProcess, selectedRoastLevel, selectedFlavorNotes, maxBagPrice, maxPrice100g, inStockOnly]);

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
      if (sortBy) params.set('sortBy', sortBy);
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  };

  const stateKey = `${selectedCategory}-${selectedProcess}-${currentPage}-${searchQuery}-${sortBy}-${inStockOnly}-${maxBagPrice}-${maxPrice100g}`;

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

      {/* Category Filter & Sort Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 animate-fade-up delay-2">
        <div className="flex flex-wrap items-center gap-1.5">
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

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <span className="text-xs font-bold uppercase text-stone-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-stone-300 bg-stone-50 py-1.5 pl-3 pr-8 text-xs font-bold text-stone-800 outline-none hover:border-stone-400 focus:border-amber-900"
          >
            <option value="cheapest">Price/100g: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
            <option value="newest">Newest Ingessed</option>
          </select>
        </div>
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

        {/* Product Grid */}
        <main className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold border-b border-stone-100 pb-3">
            <span>
              Showing <strong className="text-stone-900">{products.length}</strong> of{' '}
              <strong className="text-stone-900">{totalCount}</strong> specialty coffees
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-amber-800" />
              <p className="text-xs font-bold text-stone-600">Loading catalog items...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-white border border-stone-200 p-8 space-y-3">
              <Coffee className="h-12 w-12 text-stone-300" />
              <h3 className="text-base font-bold text-stone-800">No Coffees Found</h3>
              <p className="text-xs text-stone-500 max-w-sm">
                Try loosening your price filters or clearing selected flavor notes.
              </p>
              <button
                onClick={handleResetFilters}
                className="rounded-xl bg-amber-900 px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div key={stateKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, idx) => (
                <ScrollFadeUp key={product.id} delay={Math.min(idx * 35, 350)}>
                  <ProductCard product={product} />
                </ScrollFadeUp>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-extrabold text-stone-700 disabled:opacity-40 hover:bg-stone-50 transition-all"
              >
                Previous
              </button>

              <span className="text-xs font-extrabold text-stone-700 px-3">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-extrabold text-stone-700 disabled:opacity-40 hover:bg-stone-50 transition-all"
              >
                Next
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
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-amber-800" />
        <p className="text-xs font-bold text-stone-600">Loading catalog...</p>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
