import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { variantId: string } }
) {
  try {
    const variant = await prisma.variant.findUnique({
      where: { id: params.variantId },
      include: {
        product: {
          include: {
            roaster: true,
          },
        },
      },
    });

    if (!variant) {
      return NextResponse.redirect(new URL('/catalog', request.url));
    }

    const referrer = request.headers.get('referer') || undefined;

    // Log click event in AffiliateClick table
    try {
      await prisma.affiliateClick.create({
        data: {
          productId: variant.productId,
          variantId: variant.id,
          roasterId: variant.product.roasterId,
          referrer,
        },
      });
    } catch (e) {
      console.error('Failed to log affiliate click event', e);
    }

    // Always prioritize official product page URL to prevent 404 errors
    let rawTarget = variant.product.affiliateUrl || variant.product.productUrl || variant.product.roaster.websiteUrl;

    if (!rawTarget.startsWith('http://') && !rawTarget.startsWith('https://')) {
      rawTarget = `https://${rawTarget}`;
    }

    const urlObj = new URL(rawTarget);

    // Append variant SKU to automatically pre-select bag size on roaster website
    if (variant.sku && !urlObj.searchParams.has('variant')) {
      urlObj.searchParams.set('variant', variant.sku);
    }

    // Append tracking parameters
    if (!urlObj.searchParams.has('ref')) {
      urlObj.searchParams.set('ref', 'beandeals');
      urlObj.searchParams.set('utm_source', 'beandeals');
      urlObj.searchParams.set('utm_medium', 'aggregator');
    }

    return NextResponse.redirect(urlObj.toString(), 302);
  } catch (err: any) {
    console.error('Error handling affiliate redirect:', err);
    return NextResponse.redirect(new URL('/catalog', request.url));
  }
}
