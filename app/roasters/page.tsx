import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getAffiliateDetails } from '@/lib/affiliateRegistry';
import RoasterDirectoryClient, { EnrichedRoaster } from './RoasterDirectoryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Coffee Roasters | Find Specialty Coffee Roasters Near You',
  description:
    'Discover specialty coffee roasters by country, city and coffee style. Explore roasters, find new beans and discover your next favorite coffee.',
  keywords: [
    'coffee roasters',
    'specialty coffee roasters',
    'coffee roaster directory',
    'best coffee roasters',
    'coffee roasters near me',
    'specialty coffee roasters near me',
    'coffee roasters Netherlands',
    'coffee roasters Germany',
    'coffee roasters UK',
    'coffee roasters USA',
    'local coffee roasters',
    'specialty coffee',
  ],
  alternates: {
    canonical: '/roasters',
  },
  openGraph: {
    title: 'Coffee Roasters | Find Specialty Coffee Roasters Near You',
    description:
      'Discover specialty coffee roasters by country, city and coffee style. Explore roasters, find new beans and discover your next favorite coffee.',
    type: 'website',
  },
};

// Known roaster metadata enrichment
const ROASTER_METADATA: Record<
  string,
  { city: string; country: string; description: string; tags: string[]; isFeatured?: boolean }
> = {
  'onyx-coffee-lab': {
    city: 'Rogers, AR',
    country: 'United States',
    description:
      'Pioneering specialty coffee roaster from Arkansas known for exquisite micro-lots, uncompromising quality, and precise roast profiling.',
    tags: ['Specialty', 'Light Roast', 'Single Origin', 'Direct Trade'],
    isFeatured: true,
  },
  'sey-coffee': {
    city: 'Brooklyn, NY',
    country: 'United States',
    description:
      'Contemporary micro-roaster in Brooklyn dedicated to clean, elegant, ultra-light roast single-origin coffees with vibrant acidity.',
    tags: ['Specialty', 'Light Roast', 'Single Origin'],
    isFeatured: true,
  },
  'square-mile-coffee-roasters': {
    city: 'London',
    country: 'United Kingdom',
    description:
      'Multi-award-winning specialty coffee roastery based in East London, championing quality, transparency, and innovation.',
    tags: ['Specialty', 'Espresso', 'Single Origin'],
    isFeatured: true,
  },
  'verve-coffee-roasters': {
    city: 'Santa Cruz, CA',
    country: 'United States',
    description:
      'Craft coffee roaster bridging farm-level direct trade relationships with vibrant, approachable single-origin coffees.',
    tags: ['Specialty', 'Single Origin', 'Espresso'],
    isFeatured: true,
  },
  'stumptown-coffee-roasters': {
    city: 'Portland, OR',
    country: 'United States',
    description:
      'Pacific Northwest roasting pioneer producing exceptional single-origin coffees and iconic espresso blends since 1999.',
    tags: ['Specialty', 'Espresso', 'Single Origin'],
    isFeatured: false,
  },
  'heart-coffee-roasters': {
    city: 'Portland, OR',
    country: 'United States',
    description:
      'Minimalist specialty roaster focused on highlighting pristine green coffee quality with clean, delicate light roast profiles.',
    tags: ['Specialty', 'Light Roast', 'Single Origin'],
    isFeatured: false,
  },
  'olympia-coffee-roasters': {
    city: 'Olympia, WA',
    country: 'United States',
    description:
      'B-Corp certified craft roaster operating fair-trade, direct partnerships with smallholder farmers around the globe.',
    tags: ['Direct Trade', 'Specialty', 'Organic'],
    isFeatured: false,
  },
  'proud-mary-coffee': {
    city: 'Portland, OR',
    country: 'United States',
    description:
      'Australia-born specialty coffee powerhouse bringing wild, high-elevation varieties and experimental fermentations to North America.',
    tags: ['Specialty', 'Single Origin', 'Light Roast'],
    isFeatured: true,
  },
  'counter-culture-coffee': {
    city: 'Durham, NC',
    country: 'United States',
    description:
      'Sustainable specialty coffee company committing to environmental stewardship, direct trade, and educational brewing excellence.',
    tags: ['Specialty', 'Direct Trade', 'Organic'],
    isFeatured: false,
  },
  'equator-coffees': {
    city: 'San Rafael, CA',
    country: 'United States',
    description:
      'California-based B-Corp roaster committed to quality, sustainability, and supporting women producers across coffee regions.',
    tags: ['Specialty', 'Organic', 'Direct Trade'],
    isFeatured: false,
  },
  'intelligentsia-coffee': {
    city: 'Chicago, IL',
    country: 'United States',
    description:
      'Direct-trade coffee pioneer established in Chicago, building long-term farmer relationships and rigorous cupping standards.',
    tags: ['Direct Trade', 'Specialty', 'Single Origin'],
    isFeatured: false,
  },
};

export default async function RoastersPage() {
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
    console.error('Failed to load roasters from database:', error);
  }

  const initialRoasters: EnrichedRoaster[] = dbRoasters
    .map((r) => {
      const meta = ROASTER_METADATA[r.slug] || {
        city: 'Specialty Roastery',
        country: 'United States',
        description: 'Independent specialty coffee roaster dedicated to sourcing exceptional green coffees.',
        tags: ['Specialty', 'Single Origin'],
        isFeatured: false,
      };

      const aff = getAffiliateDetails(r.slug);

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        websiteUrl: r.websiteUrl,
        logoUrl: r.logoUrl,
        defaultCurrency: r.defaultCurrency || 'USD',
        shippingThreshold: r.shippingThreshold,
        baseShippingCost: r.baseShippingCost || 5.0,
        city: aff.city !== 'Unknown' ? aff.city : meta.city,
        country: aff.country !== 'United States' ? aff.country : meta.country,
        description: meta.description,
        tags: meta.tags,
        isFeatured: meta.isFeatured,
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
    });

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-900 animate-fade-up">
      <RoasterDirectoryClient initialRoasters={initialRoasters} />
    </main>
  );
}
