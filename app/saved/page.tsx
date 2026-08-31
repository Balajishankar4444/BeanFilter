'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Loader2, Sparkles, CupSoda } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';
import { ProductCard } from '@/components/ProductCard';

export default function SavedCoffeesPage() {
  const { favorites } = useBasket();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    fetchSavedProducts();
  }, [favorites]);

  const fetchSavedProducts = async () => {
    setLoading(true);
    try {
      // Fetch products matching saved IDs
      const res = await fetch(`/api/products?limit=100`);
      const data = await res.json();
      if (data.success) {
        const savedList = data.products.filter((p: any) => favorites.includes(p.id));
        setProducts(savedList);
      }
    } catch (e) {
      console.error('Failed to fetch saved products', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-up">
      {/* Top Back Link */}
      <div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-600 hover:text-amber-900 transition-all hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Coffee Catalog
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 uppercase tracking-widest">
            <Heart className="h-4 w-4 fill-amber-700 text-amber-700" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="text-3xl font-black text-stone-950">Your Saved Coffees</h1>
          <p className="text-xs text-stone-500 font-semibold">
            Quick access to your bookmarked specialty coffees
          </p>
        </div>

        <div className="rounded-2xl bg-amber-100/70 border border-amber-300/60 px-4 py-2 text-xs font-black text-amber-900 shadow-sm self-start sm:self-auto">
          {favorites.length} Saved Coffee{favorites.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-amber-800" />
          <p className="text-xs font-bold text-stone-600">Loading your saved coffees...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-white border border-stone-200 p-8 shadow-sm space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-800">
            <Heart className="h-8 w-8 text-stone-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-stone-900">No Saved Coffees Yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Click the heart icon on any coffee card in the catalog to save it here for fast access!
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-900 px-6 py-3 text-xs font-extrabold text-white shadow-md hover:bg-amber-800 transition-all hover:scale-105"
          >
            <CupSoda className="h-4 w-4 text-amber-300" />
            <span>Explore Coffee Catalog</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
