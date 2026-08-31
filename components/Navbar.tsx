'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShoppingBag, Coffee, Settings, Sparkles, Heart, Bell } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

function NavbarContent() {
  const { totalCount, setIsDrawerOpen, favorites, priceAlerts, setIsAlertsDrawerOpen } = useBasket();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentProcess = searchParams?.get('process') || '';
  const isSavedPageActive = pathname === '/saved';

  const isNaturalActive = pathname === '/catalog' && currentProcess === 'Natural' && !isSavedPageActive;
  const isAnaerobicActive = pathname === '/catalog' && currentProcess === 'Anaerobic' && !isSavedPageActive;
  const isCatalogActive = pathname === '/catalog' && !currentProcess && !isSavedPageActive;
  const isAdminActive = pathname === '/admin';

  const activeClass = 'text-amber-900 border-b-2 border-amber-800 pb-1 font-black';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/10 bg-amber-50/80 backdrop-blur-xl shadow-sm transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-900 via-amber-950 to-stone-950 text-amber-300 shadow-md group-hover:scale-105 transition-all duration-300">
            <Coffee className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-stone-950 text-xl tracking-tight leading-none group-hover:text-amber-900 transition-colors">
              Bean<span className="text-amber-700 font-extrabold">Deals</span>
            </span>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mt-0.5">
              Specialty Aggregator
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-extrabold text-stone-700 uppercase tracking-wider">
          <Link
            href="/catalog"
            className={`transition-all hover:text-amber-900 ${
              isCatalogActive ? activeClass : 'hover:opacity-80'
            }`}
          >
            Coffee Catalog
          </Link>
          <Link
            href="/catalog?process=Natural"
            className={`transition-all hover:text-amber-900 flex items-center gap-1 ${
              isNaturalActive ? activeClass : 'hover:opacity-80'
            }`}
          >
            <span>Natural Process</span>
            <Sparkles className="h-3 w-3 text-amber-600" />
          </Link>
          <Link
            href="/catalog?process=Anaerobic"
            className={`transition-all hover:text-amber-900 ${
              isAnaerobicActive ? activeClass : 'hover:opacity-80'
            }`}
          >
            Anaerobic Deals
          </Link>
          <Link
            href="/admin"
            className={`transition-all hover:text-amber-900 flex items-center gap-1 ${
              isAdminActive ? activeClass : 'text-stone-500 hover:opacity-80'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Admin Sync</span>
          </Link>
        </nav>

        {/* Action Buttons (Saved, Price Alerts, Basket) */}
        <div className="flex items-center gap-2">
          {/* Dedicated Saved Coffees Page Link */}
          <Link
            href="/saved"
            className={`relative flex items-center gap-1.5 rounded-2xl border bg-white/90 px-3 py-2.5 text-xs font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95 ${
              isSavedPageActive
                ? 'border-amber-800 text-amber-900 bg-amber-100/60'
                : 'border-stone-300 text-stone-800 hover:border-amber-600 hover:text-amber-900'
            }`}
            title="View saved coffees page"
          >
            <Heart className={`h-4 w-4 ${favorites.length > 0 ? 'fill-amber-700 text-amber-700' : 'text-stone-600'}`} />
            <span className="hidden sm:inline">Saved</span>
            {favorites.length > 0 && (
              <span className="text-xs font-black text-amber-900 ml-0.5">
                ({favorites.length})
              </span>
            )}
          </Link>

          {/* Price Alerts Drawer Button */}
          <button
            onClick={() => setIsAlertsDrawerOpen(true)}
            className="relative flex items-center gap-1.5 rounded-2xl border border-stone-300 bg-white/90 px-3 py-2.5 text-xs font-extrabold text-stone-800 shadow-sm hover:border-amber-600 hover:text-amber-900 transition-all hover:scale-105 active:scale-95"
            title="Manage price drop alerts"
          >
            <Bell className={`h-4 w-4 ${priceAlerts.length > 0 ? 'text-amber-800 fill-amber-800/20' : 'text-stone-600'}`} />
            <span className="hidden sm:inline">Alerts</span>
            {priceAlerts.length > 0 && (
              <span className="text-xs font-black text-amber-900 ml-0.5">
                ({priceAlerts.length})
              </span>
            )}
          </button>

          {/* Basket Trigger Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-900 to-amber-950 px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:from-amber-800 hover:to-amber-900 transition-all active:scale-95 border border-amber-800/40"
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Basket</span>
            {totalCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-stone-950 shadow-sm animate-pulse">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-40 w-full border-b border-amber-900/10 bg-amber-50/80 backdrop-blur-xl shadow-sm h-20" />
    }>
      <NavbarContent />
    </Suspense>
  );
}
