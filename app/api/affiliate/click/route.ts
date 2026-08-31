import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, variantId, roasterId, referrer } = body;

    if (!productId || !roasterId) {
      return NextResponse.json({ success: false, error: 'Missing productId or roasterId' }, { status: 400 });
    }

    const clickRecord = await prisma.affiliateClick.create({
      data: {
        productId,
        variantId: variantId || null,
        roasterId,
        referrer: referrer || request.headers.get('referer') || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      clickId: clickRecord.id,
    });
  } catch (err: any) {
    console.error('Error logging affiliate click:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
