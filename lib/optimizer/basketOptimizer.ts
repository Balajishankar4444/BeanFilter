import { prisma } from '../db';
import { shippingEngine } from '../shipping/shippingEngine';

export interface BasketInputItem {
  productId?: string;
  variantId: string;
  quantity: number;
}

export interface OptimizeBasketRequest {
  items?: BasketInputItem[];
  basket?: BasketInputItem[];
  country?: string;
  postalCode?: string;
}

export interface RoasterFulfillmentGroup {
  roasterId: string;
  roasterName: string;
  roasterWebsiteUrl: string;
  cartPermalinkUrl: string;
  logoUrl?: string | null;
  items: {
    productId: string;
    productName: string;
    variantId: string;
    sku?: string | null;
    weightG: number;
    price: number;
    quantity: number;
    pricePer100g: number;
    imageUrl?: string | null;
    productUrl: string;
    affiliateUrl?: string | null;
  }[];
  subtotal: number;
  shippingCost: number;
  totalCost: number;
  isFreeShippingApplied: boolean;
  freeShippingDeficit: number;
  shippingSource: string;
}

export interface FreeShippingOpportunity {
  roasterName: string;
  amountNeeded: number;
  potentialShippingSavings: number;
  recommendationMessage: string;
}

export interface OptimizationResult {
  cheapest: {
    productSubtotal: number;
    shipping: number;
    total: number;
    roasterCount: number;
    savings: number;
    groups: RoasterFulfillmentGroup[];
  };
  cheapestOption?: {
    total: number;
    productSubtotal: number;
    shippingTotal: number;
    roasterCount: number;
    groups: RoasterFulfillmentGroup[];
  };
  alternatives: {
    fewestRoastersOption: {
      total: number;
      roasterCount: number;
      label: string;
    };
    bestSimpleOption: {
      total: number;
      roasterCount: number;
      label: string;
    };
    cheapestCoffeeOnlyOption: {
      subtotal: number;
      label: string;
    };
  };
  freeShippingOpportunities: FreeShippingOpportunity[];
  savings: number;
  currency: string;
}

export async function optimizeBasket(req: OptimizeBasketRequest): Promise<OptimizationResult> {
  const inputItems = req.items || req.basket || [];
  const country = req.country || 'US';
  const postalCode = req.postalCode;

  if (!inputItems || inputItems.length === 0) {
    return {
      cheapest: { productSubtotal: 0, shipping: 0, total: 0, roasterCount: 0, savings: 0, groups: [] },
      alternatives: {
        fewestRoastersOption: { total: 0, roasterCount: 0, label: '0 roasters' },
        bestSimpleOption: { total: 0, roasterCount: 0, label: '0 roasters' },
        cheapestCoffeeOnlyOption: { subtotal: 0, label: '$0.00' },
      },
      freeShippingOpportunities: [],
      savings: 0,
      currency: 'USD',
    };
  }

  // Fetch variant details from DB
  const variantIds = inputItems.map((b) => b.variantId);
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        include: {
          roaster: true,
        },
      },
    },
  });

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  // Group items by Roaster
  const roasterGroupsMap = new Map<string, { roaster: typeof variants[0]['product']['roaster']; items: any[] }>();

  for (const item of inputItems) {
    const variant = variantMap.get(item.variantId);
    if (!variant) continue;

    const roaster = variant.product.roaster;
    if (!roasterGroupsMap.has(roaster.id)) {
      roasterGroupsMap.set(roaster.id, { roaster, items: [] });
    }

    roasterGroupsMap.get(roaster.id)!.items.push({
      productId: variant.product.id,
      productName: variant.product.name,
      variantId: variant.id,
      sku: variant.sku,
      weightG: variant.weightG,
      price: variant.price,
      quantity: item.quantity,
      pricePer100g: variant.pricePer100g,
      imageUrl: variant.product.imageUrl,
      productUrl: variant.product.productUrl,
      affiliateUrl: variant.product.affiliateUrl,
    });
  }

  const fulfillmentGroups: RoasterFulfillmentGroup[] = [];
  const freeShippingOpportunities: FreeShippingOpportunity[] = [];

  let overallProductSubtotal = 0;
  let overallShippingTotal = 0;

  for (const [roasterId, group] of Array.from(roasterGroupsMap.entries())) {
    const roaster = group.roaster;
    const groupSubtotal = group.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const shippingRes = shippingEngine.calculateShipping({
      roaster: {
        roasterId: roaster.id,
        roasterName: roaster.name,
        baseShippingCost: roaster.baseShippingCost,
        shippingThreshold: roaster.shippingThreshold,
        currency: roaster.defaultCurrency,
      },
      items: group.items,
      country,
      postalCode,
    });

    const groupTotalCost = groupSubtotal + shippingRes.shippingCost;

    overallProductSubtotal += groupSubtotal;
    overallShippingTotal += shippingRes.shippingCost;

    // Check Free Shipping Opportunity Tip (Add $X coffee -> save $Y shipping)
    if (!shippingRes.isFreeShippingApplied && shippingRes.freeShippingDeficit > 0 && shippingRes.freeShippingDeficit <= 12) {
      freeShippingOpportunities.push({
        roasterName: roaster.name,
        amountNeeded: shippingRes.freeShippingDeficit,
        potentialShippingSavings: shippingRes.shippingCost,
        recommendationMessage: `Add $${shippingRes.freeShippingDeficit.toFixed(2)} coffee from ${roaster.name} → unlock FREE shipping and save $${shippingRes.shippingCost.toFixed(2)} delivery!`,
      });
    }

    // Construct Shopify Pre-filled Cart Permalink URL
    const cartItemsQuery = group.items
      .filter((i) => i.sku && !isNaN(Number(i.sku)))
      .map((i) => `${i.sku}:${i.quantity}`)
      .join(',');

    let cartPermalinkUrl = roaster.websiteUrl;
    if (cartItemsQuery) {
      const cleanWebsite = roaster.websiteUrl.replace(/\/$/, '');
      cartPermalinkUrl = `${cleanWebsite}/cart/${cartItemsQuery}?ref=beandeals&utm_source=beandeals&utm_medium=aggregator`;
    } else if (group.items[0]?.productUrl) {
      cartPermalinkUrl = group.items[0].productUrl;
    }

    fulfillmentGroups.push({
      roasterId: roaster.id,
      roasterName: roaster.name,
      roasterWebsiteUrl: roaster.websiteUrl,
      cartPermalinkUrl,
      logoUrl: roaster.logoUrl,
      items: group.items,
      subtotal: Number(groupSubtotal.toFixed(2)),
      shippingCost: Number(shippingRes.shippingCost.toFixed(2)),
      totalCost: Number(groupTotalCost.toFixed(2)),
      isFreeShippingApplied: shippingRes.isFreeShippingApplied,
      freeShippingDeficit: shippingRes.freeShippingDeficit,
      shippingSource: shippingRes.source,
    });
  }

  const overallTotal = Number((overallProductSubtotal + overallShippingTotal).toFixed(2));
  const naiveShippingCost = fulfillmentGroups.length * 8.00;
  const savings = Number(Math.max(0, naiveShippingCost - overallShippingTotal).toFixed(2));

  return {
    cheapest: {
      productSubtotal: Number(overallProductSubtotal.toFixed(2)),
      shipping: Number(overallShippingTotal.toFixed(2)),
      total: overallTotal,
      roasterCount: fulfillmentGroups.length,
      savings,
      groups: fulfillmentGroups,
    },
    alternatives: {
      fewestRoastersOption: {
        total: overallTotal,
        roasterCount: fulfillmentGroups.length,
        label: `${fulfillmentGroups.length} roaster package${fulfillmentGroups.length > 1 ? 's' : ''}`,
      },
      bestSimpleOption: {
        total: overallTotal,
        roasterCount: fulfillmentGroups.length,
        label: `${fulfillmentGroups.length} roaster package${fulfillmentGroups.length > 1 ? 's' : ''}`,
      },
      cheapestCoffeeOnlyOption: {
        subtotal: Number(overallProductSubtotal.toFixed(2)),
        label: `$${overallProductSubtotal.toFixed(2)} product subtotal`,
      },
    },
    freeShippingOpportunities,
    savings,
    currency: 'USD',
  };
}
