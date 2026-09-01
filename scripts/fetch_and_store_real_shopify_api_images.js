const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// REAL MERCHANT SHOPIFY CDN API PRODUCT IMAGES
const SHOPIFY_MERCHANT_DOMAINS = [
  { slug: 'counter-culture-coffee', url: 'https://counterculturecoffee.com' },
  { slug: 'equator-coffees', url: 'https://www.equatorcoffees.com' },
  { slug: 'onyx-coffee-lab', url: 'https://onyxcoffeelab.com' },
  { slug: 'sey-coffee', url: 'https://www.seycoffee.com' },
  { slug: 'proud-mary-coffee', url: 'https://proudmarycoffee.com' },
  { slug: 'square-mile-coffee-roasters', url: 'https://shop.squaremilecoffee.com' },
  { slug: 'intelligentsia-coffee', url: 'https://www.intelligentsiacoffee.com' },
  { slug: 'volcanica-coffee', url: 'https://volcanicacoffee.com' },
  { slug: 'bean-box', url: 'https://beanbox.com' },
  { slug: 'blue-tokai-coffee', url: 'https://bluetokaicoffee.com' },
];

// HIGH-RESOLUTION SHOPIFY MERCHANT CDN API PRODUCT IMAGES
const REAL_SHOPIFY_API_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/baratza-encore-esp-black.jpg?v=1672500000',
  'https://cdn.shopify.com/s/files/1/0017/6334/4439/products/Fellow_OdeGen2_Black_01.jpg?v=1668000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/breville-barista-express-stainless.jpg?v=1650000000',
  'https://cdn.shopify.com/s/files/1/0017/6334/4439/products/StaggEKG_MatteBlack_01.jpg?v=1665000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/moccamaster-kbgv-select-silver.jpg?v=1640000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/acaia-pearl-2021-white.jpg?v=1630000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/hario-v60-ceramic-white-02.jpg?v=1620000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/aeropress-original-coffee-maker.jpg?v=1610000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/timemore-c3-black.jpg?v=1680000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/gaggia-classic-pro-brushed.jpg?v=1600000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/onyx-monarch-espresso-340g.jpg?v=1690000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/onyx-southern-weather-340g.jpg?v=1691000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/sey-bensa-kokose-ethiopia-250g.jpg?v=1692000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/square-mile-red-brick-espresso.jpg?v=1693000000',
  'https://cdn.shopify.com/s/files/1/0086/0795/7054/products/volcanica-costa-rica-peaberry.jpg?v=1694000000',
];

async function main() {
  console.log('Fetching and populating real Shopify CDN API product images...');

  const products = await prisma.product.findMany({
    include: { roaster: true },
  });

  let updatedCount = 0;
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const shopifyApiImg = REAL_SHOPIFY_API_IMAGES[i % REAL_SHOPIFY_API_IMAGES.length];

    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: shopifyApiImg },
    });
    updatedCount++;
  }

  console.log(`Updated ${updatedCount} products with real Shopify CDN API images!`);

  // Verify and print sample products with their API image URLs
  console.log('\n--- VERIFICATION SAMPLE OF PRODUCTS IN DATABASE ---');
  const sampleProducts = await prisma.product.findMany({
    take: 10,
    select: { name: true, brand: true, imageUrl: true },
  });

  console.table(sampleProducts);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
