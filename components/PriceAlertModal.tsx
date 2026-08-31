'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, Check, Loader2 } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantId: string;
  productName: string;
  currentPrice: number;
}

export function PriceAlertModal({ isOpen, onClose, variantId, productName, currentPrice }: PriceAlertModalProps) {
  const { addPriceAlert } = useBasket();
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState((currentPrice * 0.9).toFixed(2));
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const parsedPrice = parseFloat(targetPrice);
      const res = await fetch('/api/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, email, targetPrice: parsedPrice }),
      });
      
      addPriceAlert({
        variantId,
        productName,
        targetPrice: parsedPrice,
        email,
      });

      setSuccessMsg('Price alert saved successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      addPriceAlert({
        variantId,
        productName,
        targetPrice: parseFloat(targetPrice),
        email,
      });
      setSuccessMsg('Price alert saved locally!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 font-black text-stone-900 text-base">
            <Bell className="h-5 w-5 text-amber-800" />
            <span>Set Price Alert</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-stone-400 hover:text-stone-900 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            We will notify you when <strong className="text-stone-900">{productName}</strong> drops below your target price.
          </p>
        </div>

        {successMsg ? (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-900 border border-emerald-200">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">Target Price ($)</label>
              <input
                type="number"
                step="0.5"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Current Price: ${currentPrice.toFixed(2)}</span>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="coffee-lover@example.com"
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold text-stone-900 focus:border-amber-800 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-xl bg-amber-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-800 disabled:opacity-50 transition-all"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                <span>Set Alert</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
