'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, CupSoda, ExternalLink, Plus, Check, Bell } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';
import { PriceAlertModal } from '@/components/PriceAlertModal';
import { getCurrencySymbol } from '@/lib/formatCurrency';

interface VariantData {
  id: string;
  weightG: number;
  unitLabel?: string | null;
  price: number;
  pricePer100g: number;
  isBestValue?: boolean;
  isAvailable?: boolean;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  roaster: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    defaultCurrency?: string | null;
  };
  originCountry?: string | null;
  region?: string | null;
  category?: string | null;
  process?: string | null;
  roastLevel?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  productUrl?: string | null;
  affiliateUrl?: string | null;
  flavorNotes: string[];
  variants: VariantData[];
}

function formatWeightLabel(v: VariantData | number): string {
  if (typeof v === 'object' && v?.unitLabel) return v.unitLabel;
  const weightG = typeof v === 'object' ? v.weightG : v;
  if (Math.abs(weightG - 340) < 5) return '12 oz';
  if (Math.abs(weightG - 454) < 5) return '16 oz';
  if (Math.abs(weightG - 226.8) < 5) return '8 oz';
  if (Math.abs(weightG - 141.7) < 5) return '5 oz';
  if (Math.abs(weightG - 283.5) < 5) return '10 oz';
  if (Math.abs(weightG - 907.2) < 10) return '2 lb';
  if (Math.abs(weightG - 2268) < 15) return '5 lb';
  if (weightG >= 1000) return `${(weightG / 1000).toFixed(weightG % 1000 === 0 ? 0 : 1)}kg`;
  return `${weightG}g`;
}

export function ProductCard({ product }: { product: ProductData }) {
  const { addToBasket, doseG, toggleFavorite, isFavorite } = useBasket();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];

  if (!currentVariant) return null;

  const fav = isFavorite(product.id);
  const costPerCup = ((currentVariant.price / currentVariant.weightG) * doseG).toFixed(2);
  const cafeSavings = Math.max(0, 6.00 - parseFloat(costPerCup)).toFixed(2);
  const isAvailable = currentVariant.isAvailable !== false;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAvailable) return;

    addToBasket({
      productId: product.id,
      variantId: currentVariant.id,
      productName: product.name,
      roasterName: product.roaster.name,
      weightG: currentVariant.weightG,
      unitLabel: currentVariant.unitLabel,
      currencyCode: product.roaster.defaultCurrency,
      price: currentVariant.price,
      pricePer100g: currentVariant.pricePer100g,
      imageUrl: product.imageUrl,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyClick = async (e: React.MouseEvent) => {
    try {
      fetch('/api/affiliate/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: currentVariant.id,
          roasterId: product.roaster.id,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const productDetailUrl = `/products/${product.id}?variantId=${currentVariant.id}`;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-stone-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl">
      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        variantId={currentVariant.id}
        productName={product.name}
        currentPrice={currentVariant.price}
      />

      <div>
        {/* Clickable Image & Badges */}
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-amber-50/60">
          <Link href={productDetailUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-amber-800/20">
                <CupSoda className="h-16 w-16" />
              </div>
            )}
          </Link>

          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm text-stone-600 hover:text-red-500 transition-all hover:scale-110 z-20"
            title={fav ? "Remove from saved" : "Save coffee"}
          >
            <Heart className={`h-4 w-4 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1 z-10">
            {product.originCountry && (
              <span
                title={product.originCountry}
                className="shrink-1 max-w-[95px] truncate rounded-lg bg-stone-900/85 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-100 backdrop-blur-md shadow cursor-default"
              >
                {product.originCountry}
              </span>
            )}
            {product.category && (
              <span
                title={product.category}
                className="whitespace-nowrap rounded-lg bg-amber-900/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-50 backdrop-blur-md shadow cursor-default"
              >
                {product.category}
              </span>
            )}
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="rounded-xl bg-emerald-600/95 px-2.5 py-1 text-xs font-black text-white shadow-lg backdrop-blur-sm whitespace-nowrap">
              {currentVariant.weightG > 1 && currentVariant.pricePer100g !== currentVariant.price
                ? `${getCurrencySymbol(product.roaster?.defaultCurrency, product.roaster?.name)}${currentVariant.pricePer100g.toFixed(2)} / 100g`
                : `${getCurrencySymbol(product.roaster?.defaultCurrency, product.roaster?.name)}${currentVariant.price.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Roaster Name & Roast Level */}
        <div className="mb-1 flex items-center justify-between text-xs font-black tracking-widest text-amber-800 uppercase">
          <span className="truncate">{product.roaster.name}</span>
          {product.process && (
            <span className="shrink-0 rounded bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
              {product.process}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="line-clamp-2 text-base font-black text-stone-900 leading-snug hover:text-amber-800 transition-colors">
          <Link href={productDetailUrl} target="_blank" rel="noopener noreferrer">
            {product.name}
          </Link>
        </h3>

        {/* Flavor Notes Pills */}
        {product.flavorNotes && product.flavorNotes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.flavorNotes.slice(0, 3).map((note, idx) => (
              <span
                key={idx}
                className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 whitespace-nowrap"
              >
                {note}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3 pt-3 border-t border-stone-100">
        {/* Quantity / Size Variant Selector */}
        {product.variants.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all whitespace-nowrap ${
                  selectedVariantIndex === idx
                    ? 'bg-amber-950 text-white shadow-sm ring-1 ring-amber-700'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {formatWeightLabel(v)} {v.isBestValue && '⭐ Best'}
              </button>
            ))}
          </div>
        )}

        {/* Price & Value Stats (Single Line whitespace-nowrap) */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5 whitespace-nowrap min-w-0">
            <span className="text-xl font-black text-stone-950 shrink-0">
              {getCurrencySymbol(product.roaster?.defaultCurrency, product.roaster?.name)}{currentVariant.price.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-stone-500 whitespace-nowrap truncate">
              ({formatWeightLabel(currentVariant)})
            </span>
          </div>

          <div className="text-right whitespace-nowrap shrink-0">
            <span className="text-xs font-extrabold text-stone-700 block whitespace-nowrap">
              {getCurrencySymbol(product.roaster?.defaultCurrency, product.roaster?.name)}{costPerCup}/cup
            </span>
            <span className="text-[10px] font-black text-emerald-600 block whitespace-nowrap">
              Save ~{getCurrencySymbol(product.roaster?.defaultCurrency, product.roaster?.name)}{cafeSavings} vs cafe
            </span>
          </div>
        </div>

        {/* Out of Stock Warning */}
        {!isAvailable && (
          <div className="rounded-xl bg-amber-50 p-2 text-center text-xs font-bold text-amber-800 border border-amber-200 whitespace-nowrap">
            Out of Stock at Roaster
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-black transition-all whitespace-nowrap ${
              !isAvailable
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : addedAnimation
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-amber-900 text-white hover:bg-amber-800 shadow-md active:scale-98'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="h-4 w-4 shrink-0" /> Added!
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 shrink-0" /> Basket
              </>
            )}
          </button>

          {/* Price Alert Button */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-600 hover:border-amber-500 hover:text-amber-900 transition-all shadow-sm"
            title="Set Price Drop Alert"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* Buy Direct Link */}
          <a
            href={`/api/redirect/${currentVariant.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBuyClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-amber-900 transition-all shadow-sm"
            title={`Buy direct from ${product.roaster.name}`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
