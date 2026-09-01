'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import {
  ShoppingBag,
  Settings,
  Sparkles,
  Heart,
  Bell,
  Store,
  User,
} from 'lucide-react';

import { useBasket } from '@/context/BasketContext';
import { useAuth } from '@/context/AuthContext';

function NavbarContent() {
  const { user } = useAuth();
  const {
    totalCount,
    setIsDrawerOpen,
    favorites,
    priceAlerts,
    setIsAlertsDrawerOpen,
  } = useBasket();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentProcess = searchParams?.get('process') || '';

  const isSavedPageActive = pathname === '/saved';

  const isCatalogActive =
    pathname === '/catalog' &&
    !isSavedPageActive;

  const isAdminActive = pathname === '/admin';
  const isRoastersActive = pathname === '/roasters';

  const activeClass =
    'text-amber-900 border-b-2 border-amber-800 pb-1 font-black';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/10 bg-amber-50/80 backdrop-blur-xl shadow-sm transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================================================================
            BRAND / LOGO
            ================================================================ */}

        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Bean to Leaf home"
        >
          {/* Logo image */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-900/10 bg-amber-50 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
            <img
              src="/logo.jpg"
              alt="Bean to Leaf logo"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Brand name */}
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight leading-none text-stone-950 transition-colors group-hover:text-amber-900">
              Bean <span className="text-amber-700">to Leaf</span>
            </span>

            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-800">
              Specialty Coffee Discovery
            </span>
          </div>
        </Link>

        {/* ================================================================
            MAIN NAVIGATION
            ================================================================ */}

        <nav
          className="hidden items-center gap-8 text-xs font-extrabold uppercase tracking-wider text-stone-700 md:flex"
          aria-label="Main navigation"
        >
          {/* Explore Coffee */}
          <Link
            href="/catalog"
            className={`transition-all hover:text-amber-900 ${
              isCatalogActive
                ? activeClass
                : 'hover:opacity-80'
            }`}
          >
            Explore Coffee
          </Link>

          {/* Roasters */}
          <Link
            href="/roasters"
            className={`flex items-center gap-1 transition-all hover:text-amber-900 ${
              isRoastersActive
                ? activeClass
                : 'text-stone-700 hover:opacity-80'
            }`}
          >
            <Store className="h-3.5 w-3.5 text-amber-700" />

            <span>Roasters</span>
          </Link>

          {/* Equipment */}
          <Link
            href="/equipment"
            className={`transition-all hover:text-amber-900 ${
              pathname === '/equipment'
                ? activeClass
                : 'hover:opacity-80'
            }`}
          >
            Equipment
          </Link>

          {/* Subscriptions */}
          <Link
            href="/coffee-subscriptions"
            className={`transition-all hover:text-amber-900 ${
              pathname === '/coffee-subscriptions'
                ? activeClass
                : 'hover:opacity-80'
            }`}
          >
            Subscriptions
          </Link>

          {/* Admin */}
          <Link
            href="/admin"
            className={`flex items-center gap-1 transition-all hover:text-amber-900 ${
              isAdminActive
                ? activeClass
                : 'text-stone-500 hover:opacity-80'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />

            <span>Admin</span>
          </Link>
        </nav>

        {/* ================================================================
            ACTIONS
            ================================================================ */}

        <div className="flex items-center gap-2">

          {/* ============================================================
              SAVED
              ============================================================ */}

          <Link
            href="/saved"
            className={`relative flex items-center gap-1.5 rounded-2xl border bg-white/90 px-3 py-2.5 text-xs font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95 ${
              isSavedPageActive
                ? 'border-amber-800 bg-amber-100/60 text-amber-900'
                : 'border-stone-300 text-stone-800 hover:border-amber-600 hover:text-amber-900'
            }`}
            title="View saved coffees"
          >
            <Heart
              className={`h-4 w-4 ${
                favorites.length > 0
                  ? 'fill-amber-700 text-amber-700'
                  : 'text-stone-600'
              }`}
            />

            <span className="hidden sm:inline">
              Saved
            </span>

            {favorites.length > 0 && (
              <span className="ml-0.5 text-xs font-black text-amber-900">
                ({favorites.length})
              </span>
            )}
          </Link>

          {/* ============================================================
              PRICE ALERTS
              ============================================================ */}

          <button
            type="button"
            onClick={() => setIsAlertsDrawerOpen(true)}
            className="relative flex items-center gap-1.5 rounded-2xl border border-stone-300 bg-white/90 px-3 py-2.5 text-xs font-extrabold text-stone-800 shadow-sm transition-all hover:scale-105 hover:border-amber-600 hover:text-amber-900 active:scale-95"
            title="Manage price drop alerts"
          >
            <Bell
              className={`h-4 w-4 ${
                priceAlerts.length > 0
                  ? 'fill-amber-800/20 text-amber-800'
                  : 'text-stone-600'
              }`}
            />

            <span className="hidden sm:inline">
              Alerts
            </span>

            {priceAlerts.length > 0 && (
              <span className="ml-0.5 text-xs font-black text-amber-900">
                ({priceAlerts.length})
              </span>
            )}
          </button>

          {/* ============================================================
              FIREBASE LOGIN / USER ACCOUNT
              ============================================================ */}

          <Link
            href="/login"
            className="relative flex items-center gap-1.5 rounded-2xl border border-stone-300 bg-white/90 px-3 py-2.5 text-xs font-extrabold text-stone-800 shadow-sm transition-all hover:scale-105 hover:border-amber-600 hover:text-amber-900 active:scale-95"
            title={user ? `Logged in as ${user.email}` : 'Sign in to account'}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Account" className="h-4 w-4 rounded-full" />
            ) : (
              <User className={`h-4 w-4 ${user ? 'text-emerald-700' : 'text-stone-600'}`} />
            )}

            <span className="hidden sm:inline truncate max-w-[80px]">
              {user ? (user.displayName || user.email?.split('@')[0] || 'Account') : 'Sign In'}
            </span>
          </Link>

          {/* ============================================================
              BASKET
              ============================================================ */}

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2 rounded-2xl border border-amber-800/40 bg-gradient-to-r from-amber-900 to-amber-950 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:from-amber-800 hover:to-amber-900 active:scale-95"
            title="Open basket"
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />

            <span className="hidden sm:inline">
              Basket
            </span>

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

/* ==========================================================================
   NAVBAR
   ========================================================================== */

export function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 h-20 w-full border-b border-amber-900/10 bg-amber-50/80 shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="h-11 w-11 rounded-2xl bg-amber-900/10 animate-pulse" />
          </div>
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}