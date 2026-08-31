import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const roasters = await prisma.roaster.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      count: roasters.length,
      roasters: roasters.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        websiteUrl: r.websiteUrl,
        logoUrl: r.logoUrl,
        shippingThreshold: r.shippingThreshold,
        baseShippingCost: r.baseShippingCost,
        syncStatus: r.syncStatus,
        lastSyncAt: r.lastSyncAt,
        syncError: r.syncError,
        productCount: r._count.products,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
