'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, Truck, Coffee, Sparkles, AlertCircle } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

export function BasketDrawer() {
  const {
    items,
    updateQuantity,
    removeFromBasket,
    clearBasket,
    postalCode,
    setPostalCode,
    subtotal,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useBasket();

  if (!isDrawerOpen) return null;

  // Group items by Roaster to show Free Shipping threshold progress
  const roasterSubtotals: Record<string, { count: number; subtotal: number }> = {};
  for (const item of items) {
    if (!roasterSubtotals[item.roasterName]) {
      roasterSubtotals[item.roasterName] = { count: 0, subtotal: 0 };
    }
    roasterSubtotals[item.roasterName].count += item.quantity;
    roasterSubtotals[item.roasterName].subtotal += item.price * item.quantity;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-md transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-stone-50 shadow-2xl flex flex-col justify-between border-l border-stone-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-white">
            <div className="flex items-center gap-2.5 font-black text-stone-900 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-900 text-white">
                <Coffee className="h-4 w-4" />
              </div>
              <span>My Coffee Basket</span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Basket Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-16">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-4">
                  <Coffee className="h-10 w-10" />
                </div>
                <h4 className="text-lg font-bold text-stone-900">Your basket is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mt-1 mb-6 leading-relaxed">
                  Add coffees from different roasters to let our engine calculate the cheapest delivered combination.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-2xl bg-amber-900 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-amber-800"
                >
                  Explore Coffees
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1">
                  <span>{items.length} coffee variant{items.length > 1 ? 's' : ''}</span>
                  <button onClick={clearBasket} className="text-red-600 hover:underline">
                    Clear all
                  </button>
                </div>

                {/* Free Shipping Progress Indicators */}
                <div className="space-y-2">
                  {Object.entries(roasterSubtotals).map(([roasterName, data]) => {
                    const threshold = 40.00; // Estimated default roaster threshold
                    const progressPercent = Math.min(100, (data.subtotal / threshold) * 100);
                    const deficit = Math.max(0, threshold - data.subtotal);

                    return (
                      <div key={roasterName} className="rounded-xl border border-amber-200 bg-amber-50/70 p-2.5 text-xs">
                        <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
                          <span>{roasterName}</span>
                          <span>
                            {deficit === 0 ? (
                              <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                                <Sparkles className="h-3 w-3" /> Free Shipping Unlocked!
                              </span>
                            ) : (
                              <span>Add ${deficit.toFixed(2)} for FREE shipping</span>
                            )}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-amber-200/80">
                          <div
                            className={`h-full transition-all duration-500 ${
                              deficit === 0 ? 'bg-emerald-600' : 'bg-amber-800'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Item List */}
                <div className="space-y-3 pt-2">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-amber-50">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-amber-800/30">
                            <Coffee className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                            {item.roasterName}
                          </span>
                          <h5 className="text-xs font-bold text-stone-900 line-clamp-1">{item.productName}</h5>
                          <div className="text-[11px] text-stone-500 font-medium">
                            {item.weightG}g · ${item.price.toFixed(2)} (${item.pricePer100g.toFixed(2)}/100g)
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="p-1 text-stone-600 hover:text-stone-900"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-extrabold text-stone-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="p-1 text-stone-600 hover:text-stone-900"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-black text-stone-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromBasket(item.variantId)}
                              className="text-stone-400 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Optimization Trigger */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 bg-white p-6 shadow-2xl space-y-4">
              {/* Delivery ZIP input */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-black text-stone-900 mb-1.5">
                  <Truck className="h-4 w-4 text-amber-800" />
                  <span>Delivery ZIP / Postal Code</span>
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 64283"
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm font-bold text-stone-900 shadow-inner focus:border-amber-800 focus:outline-none"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Required to calculate exact delivery costs and free-shipping thresholds.
                </p>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="text-xs font-bold text-stone-600">Product Subtotal</span>
                <span className="text-xl font-black text-stone-900">${subtotal.toFixed(2)}</span>
              </div>

              {/* Find Cheapest Basket CTA */}
              <Link
                href="/basket/results"
                onClick={() => setIsDrawerOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-900 to-amber-950 py-4 text-sm font-extrabold text-white shadow-xl hover:from-amber-800 hover:to-amber-900 transition-all active:scale-98"
              >
                <span>Find Cheapest Basket</span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
