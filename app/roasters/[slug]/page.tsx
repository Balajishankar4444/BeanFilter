import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getAffiliateDetails } from '@/lib/affiliateRegistry';
import RoasterDirectoryClient, { EnrichedRoaster } from '../RoasterDirectoryClient';
import RoasterDetailClient, { RoasterDetailData } from './RoasterDetailClient';

export const dynamic = 'force-dynamic';

interface SlugPageProps {
  params: {
    slug: string;
  };
}

const COUNTRY_NAME_MAP: Record<string, string> = {
  'united-states': 'United States',
  usa: 'United States',
  uk: 'United Kingdom',
  'united-kingdom': 'United Kingdom',
  netherlands: 'Netherlands',
  germany: 'Germany',
  france: 'France',
  spain: 'Spain',
  italy: 'Italy',
  denmark: 'Denmark',
  sweden: 'Sweden',
  norway: 'Norway',
  canada: 'Canada',
  australia: 'Australia',
  'new-zealand': 'New Zealand',
  japan: 'Japan',
  india: 'India',
  singapore: 'Singapore',
  colombia: 'Colombia',
  brazil: 'Brazil',
};

// Metadata generator
export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const normalizedSlug = params.slug.toLowerCase();

  // Try finding roaster
  const roaster = await prisma.roaster.findUnique({
    where: { slug: normalizedSlug },
  });

  if (roaster) {
    return {
      title: `${roaster.name} | Coffee Beans & Specialty Roastery`,
      description: `Explore coffee beans, single origins, and specialty roasts from ${roaster.name}. Compare prices, bag sizes, and shipping rules.`,
      alternates: {
        canonical: `/roasters/${roaster.slug}`,
      },
    };
  }

  // Fallback to country page
  const countryName = COUNTRY_NAME_MAP[normalizedSlug] || params.slug.replace(/-/g, ' ');
  return {
    title: `Specialty Coffee Roasters in ${countryName} | Coffee Directory`,
    description: `Discover top specialty coffee roasters and craft coffee brands in ${countryName}.`,
    alternates: {
      canonical: `/roasters/${params.slug}`,
    },
  };
}

export default async function RoasterOrCountryPage({ params }: SlugPageProps) {
  const normalizedSlug = params.slug.toLowerCase();

  // 1. QUERY FOR ROASTER BY SLUG
  let roasterInDb: any = null;
  try {
    roasterInDb = await prisma.roaster.findUnique({
      where: { slug: normalizedSlug },
      include: {
        products: {
          include: {
            variants: true,
            flavorNotes: {
              include: {
                flavorNote: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to load roaster from DB:', error);
  }

  // 2. IF ROASTER EXISTS, RENDER DEDICATED ROASTER DETAIL PAGE
  if (roasterInDb) {
    const aff = getAffiliateDetails(roasterInDb.slug);

    const formattedProducts = roasterInDb.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      roaster: {
        id: roasterInDb.id,
        name: roasterInDb.name,
        slug: roasterInDb.slug,
        logoUrl: roasterInDb.logoUrl,
      },
      originCountry: p.originCountry,
      region: p.region,
      category: p.category || 'Filter',
      process: p.process || 'Washed',
      roastLevel: p.roastLevel || 'Medium',
      description: p.description,
      imageUrl: p.imageUrl,
      productUrl: p.productUrl,
      affiliateUrl: aff.trackingUrl || p.affiliateUrl || p.productUrl,
      flavorNotes: p.flavorNotes.map((fn: any) => fn.flavorNote.name),
      variants: p.variants.map((v: any) => ({
        id: v.id,
        weightG: v.weightG,
        price: v.price,
        pricePer100g: v.pricePer100g,
        isBestValue: v.isBestValue,
        isAvailable: v.isAvailable,
      })),
    }));

    const roasterDetailData: RoasterDetailData = {
      id: roasterInDb.id,
      name: roasterInDb.name,
      slug: roasterInDb.slug,
      websiteUrl: roasterInDb.websiteUrl,
      logoUrl: roasterInDb.logoUrl,
      defaultCurrency: roasterInDb.defaultCurrency || 'USD',
      shippingThreshold: roasterInDb.shippingThreshold,
      baseShippingCost: roasterInDb.baseShippingCost || 5.0,
      city: aff.city !== 'Unknown' ? aff.city : 'Specialty Hub',
      country: aff.country !== 'United States' ? aff.country : 'United States',
      description: `Specialty coffee roaster offering single-origin micro-lots, signature espresso blends, and fresh roasts.`,
      businessType: aff.businessType,
      affiliateStatus: aff.status,
      affiliateNetwork: aff.network,
      commissionDescription: aff.commission?.description,
      affiliateTrackingUrl: aff.trackingUrl,
      products: formattedProducts,
    };

    return (
      <main className="min-h-screen bg-[#FAF7F2] text-stone-900 animate-fade-up">
        <RoasterDetailClient roaster={roasterDetailData} />
      </main>
    );
  }

  // 3. IF NOT A ROASTER, RENDER COUNTRY ROASTERS LANDING PAGE
  const countryName = COUNTRY_NAME_MAP[normalizedSlug] || params.slug.replace(/-/g, ' ');

  let dbRoasters: any[] = [];
  try {
    dbRoasters = await prisma.roaster.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Failed to load roasters for country:', error);
  }

  const initialRoasters: EnrichedRoaster[] = dbRoasters
    .map((r) => {
      const aff = getAffiliateDetails(r.slug);
      const country = aff.country !== 'United States' ? aff.country : 'United States';

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        websiteUrl: r.websiteUrl,
        logoUrl: r.logoUrl,
        defaultCurrency: r.defaultCurrency || 'USD',
        shippingThreshold: r.shippingThreshold,
        baseShippingCost: r.baseShippingCost || 5.0,
        city: aff.city !== 'Unknown' ? aff.city : 'Specialty Hub',
        country: country,
        description: `Specialty coffee partner in ${country} offering single-origin micro-lots and specialty roasts.`,
        tags: ['Specialty', 'Single Origin'],
        isFeatured: aff.status === 'confirmed',
        productCount: r._count?.products || 0,
        businessType: aff.businessType,
        affiliateStatus: aff.status,
        affiliateNetwork: aff.network,
        commissionRate: aff.commission?.value,
        commissionDescription: aff.commission?.description,
        cookieDays: aff.cookieDays,
        averageOrderValue: aff.averageOrderValue,
        affiliateTrackingUrl: aff.trackingUrl,
      };
    })
    .filter((r) => r.affiliateStatus === 'confirmed');

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-900 animate-fade-up">
      <div className="bg-[#E8DCC8] border-b border-stone-300/70 py-10 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/roasters"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors"
          >
            ← All Roasters Directory
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Coffee Roasters in {countryName}
          </h1>
          <p className="mt-3 text-base text-stone-700 max-w-xl mx-auto">
            Explore verified specialty coffee roasters, craft roasting hubs, and coffee merchants delivering in {countryName}.
          </p>
        </div>
      </div>

      <RoasterDirectoryClient initialRoasters={initialRoasters} />
    </main>
  );
}
