import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category');
  const roastersParam = searchParams.get('roasters');
  const originsParam = searchParams.get('origins');
  const processParam = searchParams.get('process');
  const roastLevelParam = searchParams.get('roastLevel');
  const flavorNotesParam = searchParams.get('flavorNotes');
  const maxPriceParam = searchParams.get('maxPrice');
  const maxPricePer100gParam = searchParams.get('maxPrice100g');
  const inStockOnly = searchParams.get('inStockOnly') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '18', 10);

  const whereClause: any = {
    isActive: true,
    NOT: [
      { name: { contains: "Men's Long Sleeve Top" } },
      { name: { contains: 'T-Shirt' } },
      { name: { contains: 'Long Sleeve' } },
      { name: { contains: 'Apparel' } },
      { name: { contains: 'Enamel Pin' } },
      { name: { contains: 'Tote Bag' } },
      { name: { contains: 'Coffee Filter Papers' } },
    ],
  };

  // Search Query
  if (query.trim()) {
    whereClause.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { originCountry: { contains: query } },
      { region: { contains: query } },
      { category: { contains: query } },
      { process: { contains: query } },
      { roaster: { name: { contains: query } } },
    ];
  }

  // Category filter
  if (categoryParam && categoryParam !== 'All') {
    whereClause.category = { contains: categoryParam };
  }

  // Roaster filter
  if (roastersParam) {
    const slugs = roastersParam.split(',').map((s) => s.trim());
    whereClause.roaster = { slug: { in: slugs } };
  }

  // Origin filter
  if (originsParam) {
    const origins = originsParam.split(',').map((o) => o.trim());
    whereClause.originCountry = { in: origins };
  }

  // Process filter
  if (processParam) {
    whereClause.process = { contains: processParam };
  }

  // Roast level filter
  if (roastLevelParam) {
    whereClause.roastLevel = { contains: roastLevelParam };
  }

  // Flavor Note filter
  if (flavorNotesParam) {
    const notes = flavorNotesParam.split(',').map((n) => n.trim().toLowerCase());
    whereClause.flavorNotes = {
      some: {
        flavorNote: {
          slug: { in: notes },
        },
      },
    };
  }

  // Variant level filtering
  const variantWhere: any = {};
  if (inStockOnly) {
    variantWhere.isAvailable = true;
  }

  if (maxPriceParam) {
    const parsedMaxPrice = parseFloat(maxPriceParam);
    if (!isNaN(parsedMaxPrice) && parsedMaxPrice < 200) {
      variantWhere.price = { lte: parsedMaxPrice };
    }
  }

  if (maxPricePer100gParam) {
    const parsedMax100g = parseFloat(maxPricePer100gParam);
    if (!isNaN(parsedMax100g) && parsedMax100g < 100) {
      variantWhere.pricePer100g = { lte: parsedMax100g };
    }
  }

  if (Object.keys(variantWhere).length > 0) {
    whereClause.variants = {
      some: variantWhere,
    };
  }

  try {
    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          roaster: true,
          variants: {
            orderBy: { pricePer100g: 'asc' },
          },
          flavorNotes: {
            include: {
              flavorNote: true,
            },
          },
        },
        orderBy: { id: 'asc' },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    // Sort products in-memory so in-stock items are prioritized at the top of the page
    const sortedProducts = [...products].sort((a, b) => {
      const aInStock = a.variants.some((v) => v.isAvailable !== false);
      const bInStock = b.variants.some((v) => v.isAvailable !== false);
      if (aInStock && !bInStock) return -1;
      if (!aInStock && bInStock) return 1;
      return 0;
    });

    const formattedProducts = sortedProducts.map((p) => ({
      ...p,
      flavorNotes: p.flavorNotes.map((fn) => fn.flavorNote.name),
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error: any) {
    console.error('Error fetching products API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
