export interface BasketItemForShipping {
  productId: string;
  variantId: string;
  weightG: number;
  price: number;
  quantity: number;
}

export interface RoasterShippingContext {
  roasterId: string;
  roasterName: string;
  baseShippingCost: number;
  shippingThreshold: number | null; // e.g. 40.00 for free shipping over $40
  currency: string;
}

export interface ShippingCalculationRequest {
  roaster: RoasterShippingContext;
  items: BasketItemForShipping[];
  country?: string;
  postalCode?: string;
}

export interface ShippingResult {
  shippingCost: number;
  currency: string;
  isExact: boolean;
  source: string;
  isFreeShippingApplied: boolean;
  freeShippingDeficit: number; // Amount needed to hit free shipping threshold, if applicable
}
