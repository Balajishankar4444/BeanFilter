import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        roaster: true,
        variants: {
          include: {
            priceHistories: {
              orderBy: { recordedAt: 'asc' },
            },
          },
          orderBy: { weightG: 'asc' },
        },
        flavorNotes: {
          include: {
            flavorNote: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        flavorNotes: product.flavorNotes.map((fn) => fn.flavorNote.name),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
