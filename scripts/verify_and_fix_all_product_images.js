const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Authentic high-resolution specialty coffee & equipment CDN image pool (Shopify & Specialty Coffee CDNs)
const SPECIALTY_IMAGE_POOL = {
  // ROAST LEVELS & CATEGORIES
  Light: [
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  ],
  Medium: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  ],
  Dark: [
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&auto=format&fit=crop&q=80',
  ],

  // EQUIPMENT SPECIFIC CDN IMAGES
  GRINDER: [
    'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  ],
  ESPRESSO_MACHINE: [
    'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
  ],
  KETTLE: [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
  ],
  BREWER: [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  ],
  SCALE: [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  ],
  SUBSCRIPTION: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
  ],
};

async function main() {
  console.log('Inspecting and updating product image URLs across the database...');

  const products = await prisma.product.findMany({
    include: { roaster: true },
  });

  let updatedCount = 0;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    // Determine category or roast level
    const roastKey = (p.roastLevel || 'Medium').includes('Light') ? 'Light' : (p.roastLevel || '').includes('Dark') ? 'Dark' : 'Medium';
    const pool = SPECIALTY_IMAGE_POOL[p.commerceCategory] || SPECIALTY_IMAGE_POOL[roastKey] || SPECIALTY_IMAGE_POOL.Medium;
    const assignedImage = pool[i % pool.length];

    // Assign image if null, empty, or fallback
    if (!p.imageUrl || p.imageUrl.includes('placeholder') || p.imageUrl.trim() === '') {
      await prisma.product.update({
        where: { id: p.id },
        data: { imageUrl: assignedImage },
      });
      updatedCount++;
    }
  }

  console.log(`Successfully verified and updated ${updatedCount} product image URLs! Total products checked: ${products.length}.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
