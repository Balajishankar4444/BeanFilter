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

    let targetUrl = variant.product.affiliateUrl || variant.product.productUrl || variant.product.roaster.websiteUrl;

    // If numerical Shopify variant ID (sku) exists, redirect directly to Shopify pre-filled cart checkout page!
    if (variant.sku && !isNaN(Number(variant.sku))) {
      const roasterDomain = variant.product.roaster.websiteUrl.replace(/\/$/, '');
      targetUrl = `${roasterDomain}/cart/${variant.sku}:1?ref=beandeals&utm_source=beandeals&utm_medium=aggregator`;
    } else {
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }

      if (!variant.product.affiliateUrl && !targetUrl.includes('ref=')) {
        const urlObj = new URL(targetUrl);
        urlObj.searchParams.set('ref', 'beandeals');
        urlObj.searchParams.set('utm_source', 'beandeals');
        urlObj.searchParams.set('utm_medium', 'aggregator');
        targetUrl = urlObj.toString();
      }
    }

    return NextResponse.redirect(targetUrl, 302);
  } catch (err: any) {
    console.error('Error handling affiliate redirect:', err);
    return NextResponse.redirect(new URL('/catalog', request.url));
  }
}
