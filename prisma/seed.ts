import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roasters ecosystem...');

  // Delete stale Blue Bottle roaster record if exists
  await prisma.roaster.deleteMany({
    where: { slug: 'blue-bottle-coffee' },
  });

  const roastersToSeed = [
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

  for (const r of roastersToSeed) {
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

  console.log('Seeded roasters ecosystem successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
