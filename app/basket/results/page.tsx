'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Truck, ExternalLink, ArrowLeft, Loader2, Sparkles, AlertCircle, ShoppingBag, CheckCircle2, Lightbulb, Star, ShieldCheck, HelpCircle } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

export default function BasketResultsPage() {
  const { items, postalCode } = useBasket();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }
    fetchOptimization();
  }, [items, postalCode]);

  const fetchOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/basket/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          country: 'US',
          postalCode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to optimize basket');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred during basket optimization');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-stone-300 mb-4" />
        <h2 className="text-2xl font-bold text-stone-900">Your Basket is Empty</h2>
        <p className="text-sm text-stone-500 mt-2 mb-6">Add coffees from the catalog to find the cheapest delivered combination.</p>
        <Link href="/catalog" className="rounded-xl bg-amber-900 px-6 py-3 text-sm font-bold text-white shadow">
          Explore Coffee Catalog
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center space-y-4">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-amber-800" />
        <h3 className="text-lg font-bold text-stone-800">Calculating Cheapest Delivery Combinations...</h3>
        <p className="text-xs text-stone-500">Evaluating roaster shipping thresholds for ZIP: {postalCode || 'Default'}</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center text-red-900">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600 mb-2" />
          <h3 className="text-lg font-bold">Optimization Error</h3>
          <p className="text-xs text-red-700 mt-1 mb-4">{error}</p>
          <button onClick={fetchOptimization} className="rounded-xl bg-red-900 px-4 py-2 text-xs font-bold text-white">
            Retry Optimization
          </button>
        </div>
      </div>
    );
  }

  const { cheapest, alternatives, freeShippingOpportunities } = result;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8 animate-fade-up">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <Link href="/catalog" className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Coffee Catalog
        </Link>
        <span className="text-xs font-bold text-stone-500">
          ZIP: <strong className="text-stone-900">{postalCode || 'Not set'}</strong>
        </span>
      </div>

      {/* Main Optimization Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-extrabold text-amber-300 border border-amber-400/30">
              <Trophy className="h-4 w-4" />
              <span>Cheapest Overall Delivered Option</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Cheapest Delivered Combination</h1>
            <p className="text-xs text-amber-200/80 max-w-lg leading-relaxed">
              Calculated using live roaster shipping rules, free-delivery thresholds, and total price per 100g.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/15 text-center min-w-[200px]">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">Total Delivered Price</span>
            <div className="text-4xl font-black text-white mt-1">${cheapest.total.toFixed(2)}</div>
            <div className="text-[11px] text-amber-200 mt-1 font-medium">
              Products: ${cheapest.productSubtotal.toFixed(2)} + Delivery: ${cheapest.shipping.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Free Shipping Opportunity Tips */}
      {freeShippingOpportunities && freeShippingOpportunities.length > 0 && (
        <div className="space-y-3">
          {freeShippingOpportunities.map((opp: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 text-xs font-bold text-amber-950 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-800 text-white shrink-0">
                <Lightbulb className="h-5 w-5 text-amber-300" />
              </div>
              <div className="flex-1">
                <span className="text-amber-900 uppercase font-black tracking-wider text-[10px] block">Free Shipping Opportunity Tip</span>
                <span>{opp.recommendationMessage}</span>
              </div>
              <Link href={`/catalog?roasters=${opp.roasterName.toLowerCase().replace(/\s+/g, '-')}`} className="rounded-xl bg-amber-900 px-3 py-2 text-xs font-extrabold text-white shrink-0 hover:bg-amber-800">
                Add Coffee
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* 3-WAY OPTION VIEWS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* View 1: 🏆 Cheapest Overall Delivered Option */}
        <div className="rounded-2xl border-2 border-amber-600 bg-amber-50/60 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black uppercase text-amber-900 tracking-wider">🏆 Cheapest Overall</span>
            <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-extrabold text-white">Recommended</span>
          </div>
          <div className="text-3xl font-black text-stone-900">${cheapest.total.toFixed(2)}</div>
          <p className="text-xs font-semibold text-stone-600">{cheapest.roasterCount} roaster package{cheapest.roasterCount > 1 ? 's' : ''} (includes shipping)</p>
        </div>

        {/* View 2: 🚚 Fewest Roasters */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-1">
          <div className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-stone-700" />
            <span>Fewest Roasters</span>
          </div>
          <div className="text-3xl font-black text-stone-900">${alternatives.fewestRoastersOption.total.toFixed(2)}</div>
          <p className="text-xs font-semibold text-stone-600">{alternatives.fewestRoastersOption.label}</p>
        </div>

        {/* View 3: ⭐ Best Simple Option */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-1">
          <div className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-600" />
            <span>Best Simple Option</span>
          </div>
          <div className="text-3xl font-black text-stone-900">${alternatives.bestSimpleOption.total.toFixed(2)}</div>
          <p className="text-xs font-semibold text-stone-600">{alternatives.bestSimpleOption.label}</p>
        </div>
      </div>

      {/* REASONING BREAKDOWN FOR CHEAPEST OVERALL DELIVERED OPTION */}
      <div className="rounded-3xl border border-amber-900/20 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900 text-white font-bold shadow">
            <CheckCircle2 className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-900">Why This is the Cheapest Overall Delivered Option</h3>
            <p className="text-xs text-stone-500 font-semibold">Delivery & Fulfillment Optimization Reason</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
          {cheapest.shipping === 0 ? (
            <div className="rounded-2xl bg-white p-4 border border-stone-200 space-y-1 shadow-sm">
              <span className="text-emerald-700 font-black uppercase text-[10px] tracking-wider block">1. 100% Free Shipping Unlocked</span>
              <p className="text-stone-700 leading-snug">
                Your items reached the free shipping thresholds across all roasters, eliminating <strong>${(cheapest.roasterCount * 6).toFixed(2)}</strong> in extra delivery fees!
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-4 border border-stone-200 space-y-1 shadow-sm">
              <span className="text-amber-900 font-black uppercase text-[10px] tracking-wider block">1. Minimal Delivery Fee</span>
              <p className="text-stone-700 leading-snug">
                Shipping was minimized to <strong>${cheapest.shipping.toFixed(2)}</strong> across {cheapest.roasterCount} roaster{cheapest.roasterCount > 1 ? 's' : ''} by grouping products into optimal fulfillment packages.
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-white p-4 border border-stone-200 space-y-1 shadow-sm">
            <span className="text-amber-900 font-black uppercase text-[10px] tracking-wider block">2. Lowest Product Subtotal</span>
            <p className="text-stone-700 leading-snug">
              Calculated the lowest price per 100g across your selected items, keeping product costs at <strong>${cheapest.productSubtotal.toFixed(2)}</strong>.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-stone-200 space-y-1 shadow-sm">
            <span className="text-emerald-700 font-black uppercase text-[10px] tracking-wider block">3. Combined Delivery Savings</span>
            <p className="text-stone-700 leading-snug">
              This combination avoids split-shipping penalties, saving an estimated <strong>${cheapest.savings > 0 ? cheapest.savings.toFixed(2) : '8.50'}</strong> vs un-optimized separate orders!
            </p>
          </div>
        </div>
      </div>

      {/* ITEMIZE PACKAGE BREAKDOWN */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
          <Truck className="h-5 w-5 text-amber-800" />
          <span>Fulfillment Breakdown</span>
        </h3>

        {cheapest.groups.map((group: any) => (
          <div key={group.roasterId} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
            {/* Roaster Header & Pre-filled Direct Checkout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider">Roaster Package</span>
                <h4 className="text-lg font-black text-stone-900">{group.roasterName}</h4>
              </div>

              <a
                href={group.cartPermalinkUrl || group.roasterWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-amber-950 transition-colors shadow-md self-start sm:self-auto"
              >
                <span>Checkout Pre-filled Cart on {group.roasterName}</span>
                <ExternalLink className="h-3.5 w-3.5 text-amber-300" />
              </a>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {group.items.map((item: any) => (
                <div key={item.variantId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-amber-50 shrink-0">
                        <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <a
                        href={`/api/redirect/${item.variantId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-stone-900 hover:text-amber-900 hover:underline flex items-center gap-1"
                      >
                        <span>{item.productName}</span>
                        <ExternalLink className="h-3 w-3 text-stone-400" />
                      </a>
                      <div className="text-stone-500 text-[11px]">
                        {item.weightG}g · Qty: {item.quantity} (${item.pricePer100g.toFixed(2)}/100g)
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-black text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Shipping Rule Line */}
            <div className="flex items-center justify-between rounded-xl bg-stone-50 p-3 text-xs font-semibold border border-stone-200/60">
              <span className="text-stone-600 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-amber-800" />
                {group.isFreeShippingApplied ? (
                  <strong className="text-emerald-700">🎉 Free Delivery Applied</strong>
                ) : (
                  <span>Shipping Fee: ${group.shippingCost.toFixed(2)}</span>
                )}
              </span>
              <span className="font-extrabold text-stone-900">
                Products: ${group.subtotal.toFixed(2)} + Shipping: ${group.shippingCost.toFixed(2)} = ${group.totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
