'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

export function ProductDetailHeartButton({ productId }: { productId: string }) {
  const { toggleFavorite, isFavorite } = useBasket();
  const fav = isFavorite(productId);

  return (
    <button
      onClick={() => toggleFavorite(productId)}
      className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-md text-stone-600 hover:text-red-500 transition-all hover:scale-110 z-20 border border-stone-200/60"
      title={fav ? "Remove from saved" : "Save coffee"}
    >
      <Heart className={`h-5 w-5 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
    </button>
  );
}
