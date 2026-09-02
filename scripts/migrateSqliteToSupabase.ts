import { PrismaClient } from '@prisma/client';
import { ShopifySource } from '../lib/ingestion/shopifySource';
import { calculatePricePer100g, flagBestValueVariant } from '../lib/ingestion/normalizer';

const prisma = new PrismaClient();

const initialRoasters = [
  {
    name: 'Onyx Coffee Lab',
    slug: 'onyx-coffee-lab',
    websiteUrl: 'https://onyxcoffeelab.com',
    logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 40.00,
    baseShippingCost: 6.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Sey Coffee',
    slug: 'sey-coffee',
    websiteUrl: 'https://www.seycoffee.com',
    logoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 50.00,
    baseShippingCost: 5.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Verve Coffee Roasters',
    slug: 'verve-coffee-roasters',
    websiteUrl: 'https://www.vervecoffee.com',
    logoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 35.00,
    baseShippingCost: 5.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Counter Culture Coffee',
    slug: 'counter-culture-coffee',
    websiteUrl: 'https://counterculturecoffee.com',
    logoUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 35.00,
    baseShippingCost: 5.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Square Mile Coffee Roasters',
    slug: 'square-mile-coffee-roasters',
    websiteUrl: 'https://shop.squaremilecoffee.com',
    logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150',
    defaultCurrency: 'GBP',
    shippingThreshold: 45.00,
    baseShippingCost: 4.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Equator Coffees',
    slug: 'equator-coffees',
    websiteUrl: 'https://www.equatorcoffees.com',
    logoUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 40.00,
    baseShippingCost: 5.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Intelligentsia Coffee',
    slug: 'intelligentsia-coffee',
    websiteUrl: 'https://www.intelligentsiacoffee.com',
    logoUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 40.00,
    baseShippingCost: 5.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Stumptown Coffee Roasters',
    slug: 'stumptown-coffee-roasters',
    websiteUrl: 'https://www.stumptowncoffee.com',
    logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 40.00,
    baseShippingCost: 5.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Heart Coffee Roasters',
    slug: 'heart-coffee-roasters',
    websiteUrl: 'https://www.heartroasters.com',
    logoUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 45.00,
    baseShippingCost: 5.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Olympia Coffee Roasters',
    slug: 'olympia-coffee-roasters',
    websiteUrl: 'https://www.olympiacoffee.com',
    logoUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 40.00,
    baseShippingCost: 5.00,
    syncSource: 'SHOPIFY',
  },
  {
    name: 'Proud Mary Coffee',
    slug: 'proud-mary-coffee',
    websiteUrl: 'https://www.proudmarycoffee.com',
    logoUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=150',
    defaultCurrency: 'USD',
    shippingThreshold: 45.00,
    baseShippingCost: 6.00,
    syncSource: 'SHOPIFY',
  },
];

async function setupSupabaseData() {
  console.log('🚀 Starting Supabase PostgreSQL Data Setup & Migration...');

  // 1. Seed Roasters
  console.log('Seeding roasters ecosystem to Supabase...');
  for (const r of initialRoasters) {
    await prisma.roaster.upsert({
      where: { slug: r.slug },
      update: {
        websiteUrl: r.websiteUrl,
        shippingThreshold: r.shippingThreshold,
        baseShippingCost: r.baseShippingCost,
      },
      create: {
        name: r.name,
        slug: r.slug,
        websiteUrl: r.websiteUrl,
        logoUrl: r.logoUrl,
        defaultCurrency: r.defaultCurrency,
        shippingThreshold: r.shippingThreshold,
        baseShippingCost: r.baseShippingCost,
        syncStatus: 'IDLE',
        syncSource: r.syncSource,
      },
    });
  }
  console.log('✅ Roasters seeded successfully!');

  // 2. Perform live sync for products & variants into Supabase
  console.log('Syncing product catalogs into Supabase PostgreSQL...');
  const shopifyConnector = new ShopifySource();
  const roasters = await prisma.roaster.findMany();

  for (const roaster of roasters) {
    console.log(`Syncing ${roaster.name}...`);
    try {
      if (roaster.syncSource === 'SHOPIFY') {
        const rawProducts = await shopifyConnector.fetchProducts(roaster.websiteUrl);

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
              where: { productId: product.id, weightG: rv.weightG },
            });

            if (existingVariant) {
              if (existingVariant.price !== rv.price) {
                await prisma.priceHistory.create({
                  data: { variantId: existingVariant.id, price: rv.price },
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
                data: { variantId: newVariant.id, price: rv.price },
              });
            }
          }
        }
      }

      await prisma.roaster.update({
        where: { id: roaster.id },
        data: { syncStatus: 'SUCCESS', lastSyncAt: new Date(), syncError: null },
      });
      console.log(`✅ Synced ${roaster.name}`);
    } catch (err: any) {
      console.error(`❌ Sync error for ${roaster.name}:`, err.message);
    }
  }

  console.log('🎉 Supabase PostgreSQL Setup & Import Complete!');
}

setupSupabaseData()
  .catch((err) => {
    console.error('Migration execution failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
