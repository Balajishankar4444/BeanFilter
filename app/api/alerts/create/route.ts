import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, email, targetPrice } = body;

    if (!variantId || !email || !targetPrice) {
      return NextResponse.json({ success: false, error: 'Missing variantId, email, or targetPrice' }, { status: 400 });
    }

    const alert = await prisma.priceAlert.create({
      data: {
        variantId,
        email: email.trim().toLowerCase(),
        targetPrice: parseFloat(targetPrice),
      },
    });

    return NextResponse.json({
      success: true,
      alertId: alert.id,
      message: `Alert created! We'll email ${email} when the price falls below $${targetPrice}.`,
    });
  } catch (err: any) {
    console.error('Error creating price alert:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
