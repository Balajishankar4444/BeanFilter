import { ShippingCalculationRequest, ShippingResult } from './types';

export class ShippingEngine {
  calculateShipping(req: ShippingCalculationRequest): ShippingResult {
    const { roaster, items } = req;
    
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Free shipping threshold check
    if (roaster.shippingThreshold !== null && subtotal >= roaster.shippingThreshold) {
      return {
        shippingCost: 0,
        currency: roaster.currency || 'USD',
        isExact: true,
        source: `FREE_SHIPPING_THRESHOLD (Orders >= $${roaster.shippingThreshold.toFixed(2)})`,
        isFreeShippingApplied: true,
        freeShippingDeficit: 0,
      };
    }

    const deficit = roaster.shippingThreshold !== null ? Math.max(0, roaster.shippingThreshold - subtotal) : 0;

    return {
      shippingCost: roaster.baseShippingCost,
      currency: roaster.currency || 'USD',
      isExact: true,
      source: 'FLAT_RATE_POLICY',
      isFreeShippingApplied: false,
      freeShippingDeficit: Number(deficit.toFixed(2)),
    };
  }
}

export const shippingEngine = new ShippingEngine();
