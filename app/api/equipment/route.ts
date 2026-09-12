import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TOP_EQUIPMENT_ITEMS, EquipmentItem } from '@/lib/equipmentRegistry';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = (searchParams.get('q') || '').toLowerCase();
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const minPriceParam = parseFloat(searchParams.get('minPrice') || '0');
  const maxPriceParam = parseFloat(searchParams.get('maxPrice') || '10000');
  const sortBy = searchParams.get('sortBy') || 'recommended';

  // Fetch equipment products from Prisma database
  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({
      where: {
        OR: [
          { productType: 'EQUIPMENT' },
          {
            commerceCategory: {
              in: [
                'GRINDER',
                'ESPRESSO_MACHINE',
                'BREWER',
                'KETTLE',
                'SCALE',
                'DRINKWARE',
                'FILTERS_ACCESSORIES',
                'ACCESSORY',
              ],
            },
          },
        ],
      },
      include: {
        roaster: true,
        variants: true,
      },
    });
  } catch (err) {
    console.error('Failed to query equipment from database:', err);
  }

  // Map DB products to EquipmentItem structure
  const dbEquipmentItems: EquipmentItem[] = dbProducts.map((p) => {
    const variant = p.variants[0] || { price: 150 };
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand || p.roaster.name || 'Specialty Coffee',
      category: (p.commerceCategory || p.equipmentCategory || 'GRINDER') as any,
      price: variant.price,
      currency: 'USD',
      imageUrl: p.imageUrl || '',
      affiliateUrl: p.affiliateUrl || p.productUrl || p.roaster.websiteUrl,
      affiliateNetwork: p.affiliateNetwork || p.roaster.affiliateNetwork || 'Impact / Awin',
      commissionRate: p.roaster.commissionRate || 8.0,
      estimatedYieldUsd: (variant.price * (p.roaster.commissionRate || 8.0)) / 100,
      editorialRating: p.editorialRating || 4.8,
      description: p.description || `${p.name} engineered for precision specialty coffee brewing.`,
      features: ['Precision Engineering', 'Barista Approved', 'Commercial Durability'],
      bestFor: `Top Choice in ${p.commerceCategory || 'Equipment'}`,
      isFeatured: p.roaster.affiliateTier === 'FEATURED_AFFILIATE',
    };
  });

  // Combine DB equipment with predefined Equipment Registry items (preventing duplicate slugs)
  const combinedMap = new Map<string, EquipmentItem>();
  TOP_EQUIPMENT_ITEMS.forEach((item) => combinedMap.set(item.slug, item));
  dbEquipmentItems.forEach((item) => combinedMap.set(item.slug, item));

  let results = Array.from(combinedMap.values());

  // Filter by Search Query
  if (query) {
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.bestFor.toLowerCase().includes(query)
    );
  }

  // Filter by Category
  if (categoryParam && categoryParam !== 'ALL') {
    results = results.filter((item) => item.category === categoryParam);
  }

  // Filter by Brand
  if (brandParam && brandParam !== 'ALL') {
    results = results.filter((item) => item.brand.toLowerCase() === brandParam.toLowerCase());
  }

  // Filter by Price Range
  results = results.filter((item) => item.price >= minPriceParam && item.price <= maxPriceParam);

  // Sorting
  if (sortBy === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    results.sort((a, b) => b.editorialRating - a.editorialRating);
  } else {
    // Default: Recommended / Featured first
    results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.estimatedYieldUsd - a.estimatedYieldUsd);
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    equipment: results,
  });
}
