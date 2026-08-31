import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ShopifySource } from '@/lib/ingestion/shopifySource';
import { calculatePricePer100g } from '@/lib/ingestion/normalizer';

export async function POST() {
  try {
    const roasters = await prisma.roaster.findMany();
    const shopifySource = new ShopifySource();

    for (const roaster of roasters) {
      await prisma.roaster.update({
        where: { id: roaster.id },
        data: { syncStatus: 'SYNCING' },
      });

      try {
        if (roaster.syncSource === 'SHOPIFY') {
          const rawProducts = await shopifySource.fetchProducts(roaster.websiteUrl);

          for (const rp of rawProducts) {
            const product = await prisma.product.upsert({
              where: {
                roasterId_slug: {
                  roasterId: roaster.id,
                  slug: rp.slug,
                },
              },
              update: {
                name: rp.name,
                originCountry: rp.originCountry,
                process: rp.process,
                roastLevel: rp.roastLevel,
                description: rp.description,
                imageUrl: rp.imageUrl || undefined,
                productUrl: rp.productUrl,
                updatedAt: new Date(),
              },
              create: {
                roasterId: roaster.id,
                name: rp.name,
                slug: rp.slug,
                originCountry: rp.originCountry,
                process: rp.process,
                roastLevel: rp.roastLevel,
                description: rp.description,
                imageUrl: rp.imageUrl,
                productUrl: rp.productUrl,
              },
            });

            for (const rv of rp.variants) {
              const weightG = rv.weightG || 250;
              const pricePer100g = calculatePricePer100g(rv.price, weightG);

              const existingVariant = await prisma.variant.findFirst({
                where: { productId: product.id, weightG },
              });

              if (existingVariant) {
                if (existingVariant.price !== rv.price) {
                  await prisma.priceHistory.create({
                    data: { variantId: existingVariant.id, price: rv.price },
                  });
                }

                await prisma.variant.update({
                  where: { id: existingVariant.id },
                  data: { price: rv.price, pricePer100g, isAvailable: rv.available, updatedAt: new Date() },
                });
              } else {
                const newVar = await prisma.variant.create({
                  data: { productId: product.id, weightG, price: rv.price, pricePer100g, isAvailable: rv.available },
                });
                await prisma.priceHistory.create({
                  data: { variantId: newVar.id, price: rv.price },
                });
              }
            }
          }
        }

        await prisma.roaster.update({
          where: { id: roaster.id },
          data: { syncStatus: 'SUCCESS', lastSyncAt: new Date(), syncError: null },
        });
      } catch (err: any) {
        await prisma.roaster.update({
          where: { id: roaster.id },
          data: { syncStatus: 'FAILED', failedSyncAt: new Date(), syncError: err.message },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Sync job completed' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
