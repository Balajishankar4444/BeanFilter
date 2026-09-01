'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface BasketItem {
  productId: string;
  variantId: string;
  productName: string;
  roasterName: string;
  weightG: number;
  unitLabel?: string | null;
  currencyCode?: string | null;
  price: number;
  pricePer100g: number;
  imageUrl?: string | null;
  quantity: number;
}

export interface PriceAlertItem {
  id: string;
  variantId: string;
  productName: string;
  targetPrice: number;
  email: string;
  createdAt: string;
}

interface BasketContextType {
  items: BasketItem[];
  addToBasket: (item: Omit<BasketItem, 'quantity'>) => void;
  removeFromBasket: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearBasket: () => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  priceAlerts: PriceAlertItem[];
  addPriceAlert: (alert: Omit<PriceAlertItem, 'id' | 'createdAt'>) => void;
  removePriceAlert: (id: string) => void;
  postalCode: string;
  setPostalCode: (code: string) => void;
  doseG: number;
  setDoseG: (dose: number) => void;
  totalCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isAlertsDrawerOpen: boolean;
  setIsAlertsDrawerOpen: (open: boolean) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertItem[]>([]);
  const [postalCode, setPostalCode] = useState<string>('64283');
  const [doseG, setDoseG] = useState<number>(15);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('coffee_basket');
      const savedZip = localStorage.getItem('coffee_zip');
      const savedDose = localStorage.getItem('coffee_dose');
      const savedFavs = localStorage.getItem('coffee_favorites');
      const savedAlerts = localStorage.getItem('coffee_price_alerts');
      if (saved) setItems(JSON.parse(saved));
      if (savedZip) setPostalCode(savedZip);
      if (savedDose) setDoseG(parseFloat(savedDose));
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedAlerts) setPriceAlerts(JSON.parse(savedAlerts));
    } catch (e) {
      console.error('Failed to load storage data', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('coffee_basket', JSON.stringify(items));
      localStorage.setItem('coffee_zip', postalCode);
      localStorage.setItem('coffee_dose', String(doseG));
      localStorage.setItem('coffee_favorites', JSON.stringify(favorites));
      localStorage.setItem('coffee_price_alerts', JSON.stringify(priceAlerts));
    } catch (e) {
      console.error('Failed to save storage data', e);
    }
  }, [items, postalCode, doseG, favorites, priceAlerts, isLoaded]);

  const addToBasket = (item: Omit<BasketItem, 'quantity'>) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === item.variantId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromBasket = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const addPriceAlert = (alert: Omit<PriceAlertItem, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlertItem = {
      ...alert,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
  };

  const removePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <BasketContext.Provider
      value={{
        items,
        addToBasket,
        removeFromBasket,
        updateQuantity,
        clearBasket,
        favorites,
        toggleFavorite,
        isFavorite,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        postalCode,
        setPostalCode,
        doseG,
        setDoseG,
        totalCount,
        subtotal,
        isDrawerOpen,
        setIsDrawerOpen,
        isAlertsDrawerOpen,
        setIsAlertsDrawerOpen,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}
