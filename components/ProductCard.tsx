'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, CupSoda, ExternalLink, Plus, Check, Bell } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';
import { PriceAlertModal } from '@/components/PriceAlertModal';

interface VariantData {
  id: string;
  weightG: number;
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
        {/* Clickable Image & Badges (Opens Selected Variant in New Tab) */}
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-amber-50/60">
          <Link href={productDetailUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-amber-800/20">
                <CupSoda className="h-16 w-16" />
              </div>
            )}
          </Link>

          {/* Favorite Heart Button (Strict Z-20 Layer) */}
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

          {/* Top Left Origin & Category Badges (Single Straight Horizontal Line, flex-nowrap) */}
          <div className="absolute top-3 left-3 right-12 flex flex-nowrap items-center gap-1 z-10 pointer-events-none overflow-hidden">
            {product.originCountry && (
              <span className="shrink-1 max-w-[95px] truncate rounded-lg bg-stone-900/85 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-100 backdrop-blur-md shadow">
                {product.originCountry}
              </span>
            )}
            {product.category && (
              <span className="shrink-1 max-w-[85px] truncate rounded-lg bg-amber-900/85 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-50 backdrop-blur-md shadow">
                {product.category}
              </span>
            )}
          </div>

          {/* Price Per 100g Tag */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="rounded-xl bg-emerald-600/95 px-2.5 py-1 text-xs font-black text-white shadow-lg backdrop-blur-sm">
              ${currentVariant.pricePer100g.toFixed(2)} / 100g
            </span>
          </div>
        </div>

        {/* Roaster Name & Roast Level */}
        <div className="mb-1 flex items-center justify-between text-xs font-black tracking-widest text-amber-800 uppercase">
          <span>{product.roaster.name}</span>
          {product.process && (
            <span className="rounded bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
              {product.process}
            </span>
          )}
        </div>

        {/* Product Title (Opens Selected Variant in New Tab) */}
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
                className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600"
              >
                {note}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3 pt-3 border-t border-stone-100">
        {/* Bag Size Variant Selector */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIndex(idx)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  selectedVariantIndex === idx
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {v.weightG}g {v.isBestValue && '⭐ Best'}
              </button>
            ))}
          </div>
        )}

        {/* Price & Value Stats */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl font-black text-stone-950">${currentVariant.price.toFixed(2)}</span>
            <span className="ml-1 text-xs text-stone-500 font-semibold">({currentVariant.weightG}g)</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-stone-600 block">
              ${costPerCup}/cup
            </span>
            <span className="text-[10px] font-extrabold text-emerald-600 block">
              Save ~${cafeSavings} vs cafe
            </span>
          </div>
        </div>

        {/* Out of Stock Warning */}
        {!isAvailable && (
          <div className="rounded-xl bg-amber-50 p-2 text-center text-xs font-bold text-amber-800 border border-amber-200">
            Out of Stock at Roaster
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-black transition-all ${
              !isAvailable
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : addedAnimation
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-amber-900 text-white hover:bg-amber-800 shadow-md active:scale-98'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="h-4 w-4" /> Added!
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Basket
              </>
            )}
          </button>

          {/* Price Alert Button */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-600 hover:border-amber-500 hover:text-amber-900 transition-all shadow-sm"
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
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-amber-900 transition-all shadow-sm"
            title={`Buy direct from ${product.roaster.name}`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
