import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, Truck, Lightbulb } from 'lucide-react';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { ScrollFadeUp } from '@/components/ScrollFadeUp';
import { ProductDetailView } from '@/components/ProductDetailView';

export const revalidate = 60;

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        roaster: true,
        variants: {
          include: {
            priceHistories: { orderBy: { recordedAt: 'asc' } },
          },
          orderBy: { weightG: 'asc' },
        },
        flavorNotes: {
          include: { flavorNote: true },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      flavorNotes: product.flavorNotes.map((fn) => fn.flavorNote.name),
    };
  } catch (e) {
    return null;
  }
}

// Intelligent Frequently Bought Together & Pairing Algorithm (Strictly In-Stock Only)
async function getSmartPairings(currentProduct: any) {
  try {
    const rawRelated = await prisma.product.findMany({
      where: {
        roasterId: currentProduct.roasterId,
        id: { not: currentProduct.id },
        isActive: true,
        variants: {
          some: {
            isAvailable: true, // STRICTLY IN-STOCK ONLY
          },
        },
      },
      take: 8,
      include: {
        roaster: true,
        variants: { orderBy: { pricePer100g: 'asc' } },
        flavorNotes: { include: { flavorNote: true } },
      },
      orderBy: { id: 'asc' },
    });

    const formatted = rawRelated.map((p) => ({
      ...p,
      flavorNotes: p.flavorNotes.map((fn) => fn.flavorNote.name),
      cheapestPricePer100g: p.variants[0]?.pricePer100g || 0,
      inStock: true,
    }));

    // Prioritize contrasting process & category for a perfect taste duo
    const paired = formatted.sort((a, b) => {
      const aDiffProcess = a.process !== currentProduct.process ? 1 : 0;
      const bDiffProcess = b.process !== currentProduct.process ? 1 : 0;
      return bDiffProcess - aDiffProcess;
    });

    return paired.slice(0, 3);
  } catch (e) {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { variantId?: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const related = await getSmartPairings(product);
  const allHistories = product.variants.flatMap((v) => v.priceHistories);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-up">
      {/* Back Link */}
      <div className="animate-fade-up delay-1">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-900 transition-all hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Coffee Catalog
        </Link>
      </div>

      {/* Main Interactive Product Detail & Variant Selector View */}
      <ProductDetailView
        product={product}
        initialVariantId={searchParams.variantId}
        allHistories={allHistories}
      />

      {/* Intelligent Frequently Bought Together & Pairing Recommendations */}
      {related.length > 0 && (
        <section className="animate-fade-up delay-5 space-y-6 pt-8 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 uppercase tracking-widest mb-1">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Frequently Bought Together</span>
              </div>
              <h2 className="text-2xl font-black text-stone-950">
                Recommended Pairings from {product.roaster.name}
              </h2>
            </div>

            {product.roaster.shippingThreshold && (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-900 shadow-sm">
                <Truck className="h-4 w-4 text-emerald-600" />
                <span>Free delivery threshold: ${product.roaster.shippingThreshold.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Convincing Bundle Incentive Banner */}
          <div className="flex items-center gap-3 rounded-2xl bg-amber-900 text-amber-50 p-4 shadow-md">
            <Lightbulb className="h-6 w-6 text-amber-300 shrink-0" />
            <p className="text-xs leading-relaxed font-medium">
              <strong>Smart Buyer Tip:</strong> Combine <strong>{product.name}</strong> with a complementary pairing below from <strong>{product.roaster.name}</strong> to qualify for free shipping and enjoy diverse flavor profiles in one delivery!
            </p>
          </div>

          {/* Pairings Grid with ScrollFadeUp Motion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p, idx) => (
              <ScrollFadeUp key={p.id} delay={idx * 100}>
                <ProductCard product={p as any} />
              </ScrollFadeUp>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
