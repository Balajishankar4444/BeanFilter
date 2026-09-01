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

  const baseWhere: any = {
    isActive: true,
    productType: 'COFFEE',
    commerceCategory: 'BEANS',
    NOT: [
      { name: { contains: "Men's Long Sleeve Top" } },
      { name: { contains: 'T-Shirt' } },
      { name: { contains: 'Long Sleeve' } },
      { name: { contains: 'Apparel' } },
      { name: { contains: 'Enamel Pin' } },
      { name: { contains: 'Tote Bag' } },
      { name: { contains: 'Coffee Filter Papers' } },
      { name: { contains: 'Course' } },
      { name: { contains: 'Class' } },
      { name: { contains: 'Workshop' } },
      { name: { contains: 'Masterclass' } },
      { name: { contains: 'Syrup' } },
      { name: { contains: 'Sauce' } },
      { name: { contains: 'Bowl' } },
      { name: { contains: 'Gift Card' } },
      { name: { contains: 'Voucher' } },
      { name: { contains: 'Subscription' } },
      { name: { contains: 'Cleaner' } },
    ],
  };

  // Search Query
  if (query.trim()) {
    baseWhere.OR = [
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
    baseWhere.category = { contains: categoryParam };
  }

  // Roaster filter
  if (roastersParam) {
    const slugs = roastersParam.split(',').map((s) => s.trim());
    baseWhere.roaster = { slug: { in: slugs } };
  }

  // Origin filter
  if (originsParam) {
    const origins = originsParam.split(',').map((o) => o.trim());
    baseWhere.originCountry = { in: origins };
  }

  // Process filter
  if (processParam) {
    baseWhere.process = { contains: processParam };
  }

  // Roast level filter
  if (roastLevelParam) {
    baseWhere.roastLevel = { contains: roastLevelParam };
  }

  // Flavor Note filter
  if (flavorNotesParam) {
    const notes = flavorNotesParam.split(',').map((n) => n.trim().toLowerCase());
    baseWhere.flavorNotes = {
      some: {
        flavorNote: {
          slug: { in: notes },
        },
      },
    };
  }

  // Variant price filtering
  const variantWhere: any = {};
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

  try {
    const skip = (page - 1) * limit;

    // Build In-Stock vs Out-Of-Stock queries to guarantee IN-STOCK items on front pages,
    // pushing Out-Of-Stock items to the very end of the 1,650+ catalog
    const inStockWhere: any = {
      ...baseWhere,
      variants: {
        some: {
          ...variantWhere,
          isAvailable: true,
        },
      },
    };

    const outOfStockWhere: any = {
      ...baseWhere,
      NOT: [
        ...(baseWhere.NOT || []),
        {
          variants: {
            some: {
              isAvailable: true,
            },
          },
        },
      ],
    };

    if (Object.keys(variantWhere).length > 0) {
      outOfStockWhere.variants = { some: variantWhere };
    }

    const [inStockCount, outOfStockCount] = await Promise.all([
      prisma.product.count({ where: inStockWhere }),
      inStockOnly ? 0 : prisma.product.count({ where: outOfStockWhere }),
    ]);

    const totalCount = inStockCount + outOfStockCount;

    let products: any[] = [];

    const includeOptions = {
      roaster: true,
      variants: { orderBy: { pricePer100g: 'asc' as const } },
      flavorNotes: { include: { flavorNote: true } },
    };

    if (skip < inStockCount) {
      // Current page falls within in-stock range
      const takeInStock = Math.min(limit, inStockCount - skip);
      const inStockBatch = await prisma.product.findMany({
        where: inStockWhere,
        skip,
        take: takeInStock,
        include: includeOptions,
        orderBy: { id: 'asc' },
      });

      products = [...inStockBatch];

      // If page overflows into out-of-stock range, fetch remainder from out-of-stock
      if (products.length < limit && !inStockOnly && outOfStockCount > 0) {
        const needMore = limit - products.length;
        const outOfStockBatch = await prisma.product.findMany({
          where: outOfStockWhere,
          skip: 0,
          take: needMore,
          include: includeOptions,
          orderBy: { id: 'asc' },
        });
        products = [...products, ...outOfStockBatch];
      }
    } else if (!inStockOnly && outOfStockCount > 0) {
      // Current page is beyond in-stock range: fetch strictly from out-of-stock
      const outOfStockSkip = skip - inStockCount;
      products = await prisma.product.findMany({
        where: outOfStockWhere,
        skip: outOfStockSkip,
        take: limit,
        include: includeOptions,
        orderBy: { id: 'asc' },
      });
    }

    const formattedProducts = products.map((p) => ({
      ...p,
      flavorNotes: p.flavorNotes.map((fn: any) => fn.flavorNote.name),
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
