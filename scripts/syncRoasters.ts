import { PrismaClient } from '@prisma/client';
import { ShopifySource } from '../lib/ingestion/shopifySource';
import { calculatePricePer100g, flagBestValueVariant } from '../lib/ingestion/normalizer';

const prisma = new PrismaClient({
  log: ['error'],
});

async function syncAllRoasters() {
  console.log('--- Starting Roaster Synchronization Job ---');
  const roasters = await prisma.roaster.findMany();

  const shopifyConnector = new ShopifySource();

  for (const roaster of roasters) {
    console.log(`Syncing ${roaster.name} (${roaster.websiteUrl})...`);

    await prisma.roaster.update({
      where: { id: roaster.id },
      data: { syncStatus: 'SYNCING' },
    });

    try {
      if (roaster.syncSource === 'SHOPIFY') {
        const rawProducts = await shopifyConnector.fetchProducts(roaster.websiteUrl);

        console.log(`Fetched ${rawProducts.length} raw products for ${roaster.name}`);

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
              farm: rp.farm,
              category: rp.category,
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
              farm: rp.farm,
              category: rp.category,
              process: rp.process,
              roastLevel: rp.roastLevel,
              description: rp.description,
              imageUrl: rp.imageUrl,
              productUrl: rp.productUrl,
            },
          });

          // Calculate variants pricePer100g and Best Value flag
          const variantCalculations = rp.variants.map((rv) => {
            const weightG = rv.weightG || 250;
            const pricePer100g = calculatePricePer100g(rv.price, weightG);
            return { ...rv, weightG, pricePer100g };
          });

          const bestValueFlags = flagBestValueVariant(variantCalculations);

          for (let i = 0; i < variantCalculations.length; i++) {
            const rv = variantCalculations[i];
            const isBestValue = bestValueFlags[i] || false;
            const skuVal = rv.sku ? String(rv.sku) : undefined;

            const existingVariant = await prisma.variant.findFirst({
              where: {
                productId: product.id,
                weightG: rv.weightG,
              },
            });

            if (existingVariant) {
              if (existingVariant.price !== rv.price) {
                await prisma.priceHistory.create({
                  data: {
                    variantId: existingVariant.id,
                    price: rv.price,
                  },
                });
              }

              await prisma.variant.update({
                where: { id: existingVariant.id },
                data: {
                  price: rv.price,
                  pricePer100g: rv.pricePer100g,
                  isBestValue,
                  sku: skuVal,
                  isAvailable: rv.available,
                  updatedAt: new Date(),
                },
              });
            } else {
              const newVariant = await prisma.variant.create({
                data: {
                  productId: product.id,
                  weightG: rv.weightG,
                  price: rv.price,
                  pricePer100g: rv.pricePer100g,
                  isBestValue,
                  sku: skuVal,
                  isAvailable: rv.available,
                },
              });

              await prisma.priceHistory.create({
                data: {
                  variantId: newVariant.id,
                  price: rv.price,
                },
              });
            }
          }
        }
      }

      await prisma.roaster.update({
        where: { id: roaster.id },
        data: {
          syncStatus: 'SUCCESS',
          lastSyncAt: new Date(),
          syncError: null,
        },
      });

      console.log(`Successfully synced ${roaster.name}`);
    } catch (err: any) {
      console.error(`Sync failed for ${roaster.name}:`, err.message);
      await prisma.roaster.update({
        where: { id: roaster.id },
        data: {
          syncStatus: 'FAILED',
          failedSyncAt: new Date(),
          syncError: err.message,
        },
      });
    }
  }

  console.log('--- Roaster Synchronization Finished ---');
}

syncAllRoasters()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
