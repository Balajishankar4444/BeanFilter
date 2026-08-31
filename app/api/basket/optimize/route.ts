import { NextRequest, NextResponse } from 'next/server';
import { optimizeBasket } from '@/lib/optimizer/basketOptimizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const basketItems = body.basket || body.items;
    const country = body.country || 'US';
    const postalCode = body.postalCode || '';

    if (!basketItems || !Array.isArray(basketItems)) {
      return NextResponse.json({ success: false, error: 'Invalid basket format' }, { status: 400 });
    }

    const optimizationResult = await optimizeBasket({
      basket: basketItems,
      country,
      postalCode,
    });

    return NextResponse.json({
      success: true,
      data: optimizationResult,
    });
  } catch (err: any) {
    console.error('Error optimizing basket:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
