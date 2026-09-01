'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, ShoppingBag, CupSoda, Check, Plus, Bell, Heart } from 'lucide-react';
import { FlavorBadge } from '@/components/FlavorBadge';
import { PriceHistoryChart } from '@/components/PriceHistoryChart';
import { ProductDetailHeartButton } from '@/components/ProductDetailHeartButton';
import { PriceAlertModal } from '@/components/PriceAlertModal';
import { useBasket } from '@/context/BasketContext';

interface VariantData {
  id: string;
  weightG: number;
  price: number;
  pricePer100g: number;
  isBestValue?: boolean;
  isAvailable?: boolean;
  priceHistories?: any[];
}

interface ProductDetailViewProps {
  product: {
    id: string;
    name: string;
    originCountry?: string | null;
    category?: string | null;
    region?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    roaster: {
      id: string;
      name: string;
      shippingThreshold?: number | null;
    };
    variants: VariantData[];
    flavorNotes: string[];
  };
  initialVariantId?: string;
  allHistories?: any[];
}

function formatWeightLabel(weightG: number): string {
  if (weightG === 340) return '340g / 12 oz';
  if (weightG === 454) return '454g / 16 oz';
  if (weightG === 250) return '250g / 8.8 oz';
  if (weightG === 142) return '142g / 5 oz';
  if (weightG === 226) return '226g / 8 oz';
  if (weightG === 1000) return '1kg / 35.2 oz';
  const oz = (weightG / 28.3495).toFixed(1);
  return `${weightG}g / ${oz} oz`;
}

export function ProductDetailView({ product, initialVariantId, allHistories = [] }: ProductDetailViewProps) {
  const { addToBasket, doseG } = useBasket();

  // Find initial variant index matching URL param or default to 0
  const initialIndex = initialVariantId
    ? product.variants.findIndex((v) => v.id === initialVariantId)
    : 0;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  if (!currentVariant) return null;

  const costPerCup = ((currentVariant.price / currentVariant.weightG) * doseG).toFixed(2);
  const cafeSavings = Math.max(0, 6.00 - parseFloat(costPerCup)).toFixed(2);
  const isAvailable = currentVariant.isAvailable !== false;

  // Filter histories specifically for the selected variant bag size
  const variantHistories = (currentVariant.priceHistories && currentVariant.priceHistories.length > 0)
    ? currentVariant.priceHistories
    : allHistories.filter((h) => h.variantId === currentVariant.id);

  const displayHistories = variantHistories.length > 0 ? variantHistories : allHistories;

  const handleAdd = () => {
    if (!isAvailable) return;
    addToBasket({
      productId: product.id,
      variantId: currentVariant.id,
      productName: product.name,
      roasterName: product.roaster.name,
      weightG: currentVariant.weightG,
      price: currentVariant.price,
      pricePer100g: currentVariant.pricePer100g,
      imageUrl: product.imageUrl,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="space-y-10">
      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        variantId={currentVariant.id}
        productName={product.name}
        currentPrice={currentVariant.price}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Product Image */}
        <div className="animate-fade-up delay-2 relative aspect-square overflow-hidden rounded-3xl bg-amber-50/60 border border-stone-200 shadow-md">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-amber-800/30">
              <CupSoda className="h-24 w-24" />
            </div>
          )}

          {/* Favorite Heart Button */}
          <ProductDetailHeartButton productId={product.id} />

          {/* Top Left Origin & Category Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5 z-10">
            {product.originCountry && (
              <span className="rounded-lg bg-stone-900/85 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-100 backdrop-blur-md shadow whitespace-nowrap">
                {product.originCountry}
              </span>
            )}
            {product.category && (
              <span className="rounded-lg bg-amber-900/85 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-50 backdrop-blur-md shadow whitespace-nowrap">
                {product.category}
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Interactive Variant Selector */}
        <div className="animate-fade-up delay-3 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-800 block mb-1">
              {product.roaster.name}
            </span>
            <h1 className="text-3xl font-black text-stone-950 leading-tight">{product.name}</h1>
            {product.region && (
              <p className="text-xs text-stone-500 font-semibold mt-1">Region: {product.region}</p>
            )}
          </div>

          {/* Flavor Notes */}
          {product.flavorNotes.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Flavor Profile</span>
              <div className="flex flex-wrap gap-1.5">
                {product.flavorNotes.map((note: string) => (
                  <FlavorBadge key={note} note={note} />
                ))}
              </div>
            </div>
          )}

          {/* Gram & Ounce Bag Size Option Buttons */}
          <div className="space-y-2.5 rounded-2xl bg-amber-50/60 p-4 border border-amber-900/10">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Select Bag Size (Grams & Ounces):</span>
              <span className="text-amber-900 font-extrabold whitespace-nowrap">{formatWeightLabel(currentVariant.weightG)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shadow-sm whitespace-nowrap ${
                    selectedVariantIndex === idx
                      ? 'bg-stone-950 text-white ring-2 ring-amber-600 scale-105'
                      : 'bg-white text-stone-800 hover:bg-stone-100 hover:scale-102 border border-stone-200'
                  }`}
                >
                  <span>{formatWeightLabel(v.weightG)}</span>
                  <span className="text-[11px] opacity-80">${v.price.toFixed(2)}</span>
                  {v.isBestValue && <span className="text-[10px] text-amber-300 font-black">⭐ Best</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Value Box (Clean Single Line, whitespace-nowrap) */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-baseline justify-between gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-3xl font-black text-stone-950">${currentVariant.price.toFixed(2)}</span>
                <span className="text-xs font-bold text-stone-500 whitespace-nowrap">
                  ({formatWeightLabel(currentVariant.weightG)})
                </span>
              </div>
              <span className="rounded-xl bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow whitespace-nowrap">
                ${currentVariant.pricePer100g.toFixed(2)} / 100g
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-stone-100">
              <div className="rounded-xl bg-stone-50 p-2.5">
                <span className="text-stone-500 font-medium block text-[11px]">Cost per cup ({doseG}g dose):</span>
                <strong className="text-stone-900 font-extrabold text-sm whitespace-nowrap">${costPerCup} / cup</strong>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-950">
                <span className="text-emerald-700 font-medium block text-[11px]">Cafe Savings vs $6 cup:</span>
                <strong className="text-emerald-700 font-extrabold text-sm whitespace-nowrap">Save ~${cafeSavings}</strong>
              </div>
            </div>

            {!isAvailable && (
              <div className="rounded-xl bg-amber-50 p-2.5 text-center text-xs font-bold text-amber-800 border border-amber-200 whitespace-nowrap">
                Out of Stock at Roaster
              </div>
            )}

            {/* Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-stone-100 items-center">
              {/* Primary Add to Basket Button */}
              <button
                onClick={handleAdd}
                disabled={!isAvailable}
                className={`sm:col-span-5 flex items-center justify-center gap-1.5 rounded-2xl py-3.5 px-3 text-xs font-extrabold transition-all shadow-md h-12 whitespace-nowrap ${
                  !isAvailable
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                    : addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-950 text-white hover:bg-stone-800 active:scale-98'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="h-4 w-4 shrink-0" /> Added!
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 shrink-0" /> Add to Basket
                  </>
                )}
              </button>

              {/* Price Alert Button */}
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="sm:col-span-2 flex h-12 items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:text-amber-900 transition-all shadow-sm shrink-0"
                title="Set Price Alert"
              >
                <Bell className="h-4 w-4" />
              </button>

              {/* Buy Direct from Roaster Link */}
              <a
                href={`/api/redirect/${currentVariant.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:col-span-5 flex items-center justify-center gap-1.5 rounded-2xl bg-amber-900 px-3.5 py-3.5 text-xs font-extrabold text-white shadow-lg hover:bg-amber-800 transition-all hover:scale-105 active:scale-95 h-12 whitespace-nowrap"
              >
                <span className="truncate">Direct Product Link</span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <span className="font-extrabold text-stone-900 block uppercase tracking-wider">About this coffee</span>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Price History Section Filtered specifically by Selected Gram Weight */}
      {displayHistories.length > 0 && (
        <div className="animate-fade-up delay-4">
          <PriceHistoryChart
            histories={displayHistories}
            selectedWeightG={currentVariant.weightG}
          />
        </div>
      )}
    </div>
  );
}
