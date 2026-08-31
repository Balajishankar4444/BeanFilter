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

  // Process filter (contains instead of strict equals for flexible matching like Natural, Anaerobic)
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
    const totalCount = await prisma.product.count({ where: whereClause });

    // Fetch all matching products
    const allMatchingProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        roaster: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            shippingThreshold: true,
            baseShippingCost: true,
          },
        },
        variants: {
          orderBy: { price: 'asc' },
        },
        flavorNotes: {
          include: {
            flavorNote: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    const formattedAll = allMatchingProducts.map((p) => {
      let eligibleVariants = p.variants;
      if (maxPriceParam) {
        const pMax = parseFloat(maxPriceParam);
        if (!isNaN(pMax) && pMax < 200) {
          const matching = p.variants.filter((v) => v.price <= pMax);
          if (matching.length > 0) eligibleVariants = matching;
        }
      }

      const cheapestVariant = eligibleVariants.reduce((prev, curr) => {
        return curr.pricePer100g < prev.pricePer100g ? curr : prev;
      }, eligibleVariants[0] || p.variants[0] || {});

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        roaster: p.roaster,
        originCountry: p.originCountry,
        region: p.region,
        farm: p.farm,
        category: p.category,
        process: p.process,
        roastLevel: p.roastLevel,
        description: p.description,
        imageUrl: p.imageUrl,
        productUrl: p.productUrl,
        affiliateUrl: p.affiliateUrl,
        flavorNotes: p.flavorNotes.map((fn) => fn.flavorNote.name),
        variants: eligibleVariants,
        cheapestPricePer100g: cheapestVariant?.pricePer100g || 0,
        inStock: p.variants.some((v) => v.isAvailable),
        updatedAt: p.updatedAt,
      };
    });

    // Helper to interleave a list of products across roaster queues
    const interleaveRoasters = (items: typeof formattedAll) => {
      const roasterQueues = new Map<string, typeof formattedAll>();
      for (const prod of items) {
        const rId = prod.roaster.id;
        if (!roasterQueues.has(rId)) {
          roasterQueues.set(rId, []);
        }
        roasterQueues.get(rId)!.push(prod);
      }

      const mixed: typeof formattedAll = [];
      const queueList = Array.from(roasterQueues.values());

      let maxLen = 0;
      for (const q of queueList) {
        if (q.length > maxLen) maxLen = q.length;
      }

      for (let i = 0; i < maxLen; i++) {
        for (const q of queueList) {
          if (q[i]) {
            mixed.push(q[i]);
          }
        }
      }
      return mixed;
    };

    // Partition products into In-Stock (FIRST) and Out-of-Stock (LAST)
    const inStockList = formattedAll.filter((p) => p.inStock);
    const outOfStockList = formattedAll.filter((p) => !p.inStock);

    const mixedInStock = interleaveRoasters(inStockList);
    const mixedOutOfStock = interleaveRoasters(outOfStockList);

    // In-Stock products ALWAYS come first!
    const finalMixedProducts = [...mixedInStock, ...mixedOutOfStock];

    // Paginate mixed result
    const skip = (page - 1) * limit;
    const paginatedProducts = finalMixedProducts.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      count: paginatedProducts.length,
      products: paginatedProducts,
    });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
