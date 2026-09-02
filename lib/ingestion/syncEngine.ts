import { prisma } from '@/lib/db';
import { ShopifySource } from './shopifySource';
import { calculatePricePer100g } from './normalizer';

const STALE_THRESHOLD_MS = 6 * 60 * 60 * 1000; // 6 hours threshold for smart sync

export interface SyncResult {
  roasterId: string;
  roasterName: string;
  status: 'SYNCED' | 'SKIPPED_FRESH' | 'FAILED';
  productsSynced: number;
  priceAlertsTriggered: number;
  message: string;
}

export async function syncSingleRoaster(
  roasterId: string,
  options?: { force?: boolean }
): Promise<SyncResult> {
  const roaster = await prisma.roaster.findUnique({ where: { id: roasterId } });

  if (!roaster) {
    return {
      roasterId,
      roasterName: 'Unknown',
      status: 'FAILED',
      productsSynced: 0,
      priceAlertsTriggered: 0,
      message: 'Roaster not found in database',
    };
  }

  // Smart Cache Check: Skip if synced recently (<6 hours) unless force=true or previous sync failed
  const isStale =
    !roaster.lastSyncAt ||
    Date.now() - new Date(roaster.lastSyncAt).getTime() > STALE_THRESHOLD_MS ||
    roaster.syncStatus === 'FAILED';

  if (!options?.force && !isStale) {
    const hoursAgo = ((Date.now() - new Date(roaster.lastSyncAt!).getTime()) / (1000 * 60 * 60)).toFixed(1);
    return {
      roasterId: roaster.id,
      roasterName: roaster.name,
      status: 'SKIPPED_FRESH',
      productsSynced: 0,
      priceAlertsTriggered: 0,
      message: `Roaster catalog is fresh (synced ${hoursAgo}h ago).`,
    };
  }

  // Update status to SYNCING
  await prisma.roaster.update({
    where: { id: roaster.id },
    data: { syncStatus: 'SYNCING' },
  });

  const shopifySource = new ShopifySource();
  let productsSynced = 0;
  let priceAlertsTriggered = 0;

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

        productsSynced++;

        for (const rv of rp.variants) {
          const weightG = rv.weightG || 250;
          const pricePer100g = calculatePricePer100g(rv.price, weightG);

          const existingVariant = await prisma.variant.findFirst({
            where: { productId: product.id, weightG },
          });

          if (existingVariant) {
            // Price drop / price change intelligence
            if (existingVariant.price !== rv.price) {
              await prisma.priceHistory.create({
                data: { variantId: existingVariant.id, price: rv.price },
              });
            }

            // Check active price alerts if price dropped
            if (rv.price <= existingVariant.price) {
              const triggeredAlerts = await prisma.priceAlert.updateMany({
                where: {
                  variantId: existingVariant.id,
                  targetPrice: { gte: rv.price },
                  isTriggered: false,
                },
                data: { isTriggered: true },
              });
              priceAlertsTriggered += triggeredAlerts.count;
            }

            await prisma.variant.update({
              where: { id: existingVariant.id },
              data: {
                price: rv.price,
                pricePer100g,
                isAvailable: rv.available,
                updatedAt: new Date(),
              },
            });
          } else {
            const newVar = await prisma.variant.create({
              data: {
                productId: product.id,
                weightG,
                price: rv.price,
                pricePer100g,
                isAvailable: rv.available,
              },
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

    return {
      roasterId: roaster.id,
      roasterName: roaster.name,
      status: 'SYNCED',
      productsSynced,
      priceAlertsTriggered,
      message: `Successfully synchronized ${productsSynced} products.`,
    };
  } catch (err: any) {
    console.error(`Sync error for ${roaster.name}:`, err);

    await prisma.roaster.update({
      where: { id: roaster.id },
      data: { syncStatus: 'FAILED', failedSyncAt: new Date(), syncError: err.message || 'Sync failed' },
    });

    return {
      roasterId: roaster.id,
      roasterName: roaster.name,
      status: 'FAILED',
      productsSynced,
      priceAlertsTriggered: 0,
      message: err.message || 'Synchronization failed',
    };
  }
}
