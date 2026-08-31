'use client';

import React from 'react';
import { Bell, X, Trash2, Mail, Tag, AlertCircle } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

export function PriceAlertsDrawer() {
  const { priceAlerts, removePriceAlert, isAlertsDrawerOpen, setIsAlertsDrawerOpen } = useBasket();

  if (!isAlertsDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsAlertsDrawerOpen(false)}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 p-6 bg-stone-50">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 font-bold">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-stone-900">Your Price Alerts</h2>
                <p className="text-[11px] text-stone-500 font-semibold">Active price drop notifications</p>
              </div>
            </div>

            <button
              onClick={() => setIsAlertsDrawerOpen(false)}
              className="rounded-xl p-2 text-stone-400 hover:bg-stone-200 hover:text-stone-900 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {priceAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50/50">
                <Bell className="h-12 w-12 text-stone-300 mb-3" />
                <h3 className="text-sm font-bold text-stone-800">No Active Price Alerts</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Click the bell icon on any coffee card to get notified when prices drop!
                </p>
              </div>
            ) : (
              priceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm hover:border-amber-400 transition-all"
                >
                  <div className="space-y-1 pr-2">
                    <h4 className="text-xs font-black text-stone-900 leading-snug">{alert.productName}</h4>
                    
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700">
                      <Tag className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Target Price: ${alert.targetPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                      <Mail className="h-3 w-3 text-stone-400" />
                      <span>{alert.email}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removePriceAlert(alert.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
                    title="Delete price alert"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-stone-200 p-6 bg-stone-50">
            <button
              onClick={() => setIsAlertsDrawerOpen(false)}
              className="w-full rounded-2xl bg-stone-950 py-3.5 text-xs font-black text-white shadow-md hover:bg-stone-800 transition-all active:scale-98"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
