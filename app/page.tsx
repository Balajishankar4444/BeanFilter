import type { Metadata } from 'next';

import Link from 'next/link';

import {
  Search,
  ShoppingBag,
  Truck,
  Coffee,
  ArrowRight,
  Trophy,
  BadgePercent,
  CupSoda,
  Calculator,
  Zap,
  Leaf,
  Grape,
  FlaskConical,
  CheckCircle2,
  Globe2,
  Scale,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { DoseCalculatorWidget } from '@/components/DoseCalculatorWidget';

export const revalidate = 60;

/* -------------------------------------------------------------------------- */
/*                                SEO METADATA                                */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Bean to Leaf — Explore Roasters & Specialty Coffee Worldwide',

  description:
    'Explore specialty coffee roasters and discover exceptional coffees from around the world. Browse coffees by roaster, origin, process, brewing style, price and more.',

  keywords: [
    'specialty coffee',
    'specialty coffee roasters',
    'coffee roasters',
    'coffee roasters worldwide',
    'specialty coffee beans',
    'best coffee roasters',
    'independent coffee roasters',
    'coffee beans',
    'specialty coffee discovery',
    'coffee by origin',
    'coffee by process',
    'natural process coffee',
    'anaerobic coffee',
    'filter coffee',
    'espresso coffee',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'Bean to Leaf — Explore Roasters & Specialty Coffee Worldwide',

    description:
      'Discover specialty coffee roasters and explore exceptional coffees from around the world. Find coffees by roaster, origin, process, brewing style and more.',

    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'Bean to Leaf — Explore Roasters & Specialty Coffee Worldwide',

    description:
      'Discover specialty coffee roasters and explore coffees from around the world.',
  },
};

/* -------------------------------------------------------------------------- */
/*                            PRODUCT FILTERING                               */
/* -------------------------------------------------------------------------- */

const SPECIFIC_NON_COFFEE_NAMES = [
  "men's long sleeve top",
  't-shirt',
  'long sleeve',
  'apparel',
  'enamel pin',
  'tote bag',
  'coffee filter',
  'filter paper',
  'paper filter',
  'course',
  'class',
  'workshop',
  'masterclass',
  'syrup',
  'sauce',
  'bowl',
  'gift card',
  'voucher',
  'subscription',
  'prepaid',
  'cleaner',
  'mug',
  'bottle',
  'tumbler',
  'flask',
  'machine',
  'grinder',
  'kettle',
  'scale',
  'carafe',
  'canister',
  'pitcher',
  'tamper',
  'dripper',
];

function isCoffeeProduct(product: {
  name: string;
  category?: string | null;
}) {
  const nameLower = product.name.toLowerCase();

  for (const kw of SPECIFIC_NON_COFFEE_NAMES) {
    if (nameLower.includes(kw)) {
      return false;
    }
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/*                              HOMEPAGE DATA                                 */
/* -------------------------------------------------------------------------- */

async function getHomepageData() {
  try {
    const totalProducts = await prisma.product.count({
      where: {
        isActive: true,
      },
    });

    const totalRoasters = await prisma.roaster.count();

    const inStockCount = await prisma.variant.count({
      where: {
        isAvailable: true,
      },
    });

    const origins = await prisma.product.groupBy({
      by: ['originCountry'],
      where: {
        originCountry: {
          not: null,
        },
      },
    });

    /*
     * Keep the existing featured coffee functionality.
     */
    const rawFeatured = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: {
          some: {
            isAvailable: true,
          },
        },
      },

      take: 60,

      include: {
        roaster: true,

        variants: {
          orderBy: {
            pricePer100g: 'asc',
          },
        },

        flavorNotes: {
          include: {
            flavorNote: true,
          },
        },
      },

      orderBy: {
        id: 'asc',
      },
    });

    const coffeeOnlyFeatured = rawFeatured.filter(
      isCoffeeProduct
    );

    /*
     * Interleave products across roasters so the homepage
     * represents multiple roasters instead of one dominating.
     */
    const roasterMap = new Map<
      string,
      typeof coffeeOnlyFeatured
    >();

    for (const p of coffeeOnlyFeatured) {
      const rId = p.roaster.id;

      if (!roasterMap.has(rId)) {
        roasterMap.set(rId, []);
      }

      roasterMap.get(rId)!.push(p);
    }

    const mixedFeatured: typeof coffeeOnlyFeatured = [];

    const queueList = Array.from(roasterMap.values());

    let maxLen = 0;

    for (const q of queueList) {
      if (q.length > maxLen) {
        maxLen = q.length;
      }
    }

    for (let i = 0; i < maxLen; i++) {
      for (const q of queueList) {
        if (q[i]) {
          mixedFeatured.push(q[i]);
        }
      }
    }

    const topFeatured = mixedFeatured.slice(0, 6);

    return {
      stats: {
        totalProducts,
        totalRoasters,
        originsCount: origins.length,
        inStockCount,
      },

      featuredProducts: topFeatured.map((p) => ({
        ...p,

        flavorNotes: p.flavorNotes.map(
          (fn) => fn.flavorNote.name
        ),
      })),
    };
  } catch (e) {
    return {
      stats: {
        totalProducts: 1622,
        totalRoasters: 10,
        originsCount: 22,
        inStockCount: 1550,
      },

      featuredProducts: [],
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                            STRUCTURED DATA                                 */
/* -------------------------------------------------------------------------- */

function HomeStructuredData() {
  const siteUrl = 'https://www.beantoleaf.com';

  const organizationSchema = {
    '@context': 'https://schema.org',

    '@type': 'Organization',

    name: 'Bean to Leaf',

    url: siteUrl,

    description:
      'A specialty coffee discovery platform helping people explore coffee roasters and exceptional coffees from around the world.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',

    '@type': 'WebSite',

    name: 'Bean to Leaf',

    url: siteUrl,

    description:
      'Explore specialty coffee roasters and discover coffees from around the world.',

    potentialAction: {
      '@type': 'SearchAction',

      target: `${siteUrl}/catalog?q={search_term_string}`,

      'query-input':
        'required name=search_term_string',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',

    '@type': 'FAQPage',

    mainEntity: [
      {
        '@type': 'Question',

        name: 'What is Bean to Leaf?',

        acceptedAnswer: {
          '@type': 'Answer',

          text:
            'Bean to Leaf is a specialty coffee discovery platform that helps people explore coffee roasters and discover coffees from around the world.',
        },
      },

      {
        '@type': 'Question',

        name: 'What can I discover on Bean to Leaf?',

        acceptedAnswer: {
          '@type': 'Answer',

          text:
            'You can discover specialty coffee roasters and explore coffees by origin, processing method, brewing style, flavor profile, price and other characteristics.',
        },
      },

      {
        '@type': 'Question',

        name: 'How can I find a specialty coffee roaster?',

        acceptedAnswer: {
          '@type': 'Answer',

          text:
            'Bean to Leaf brings specialty coffee from different roasters together in one searchable catalog, making it easier to discover roasters and explore their coffees.',
        },
      },

      {
        '@type': 'Question',

        name: 'Can I compare specialty coffees?',

        acceptedAnswer: {
          '@type': 'Answer',

          text:
            'Yes. Coffees can be explored and compared using information such as bag size, price, price per 100g, brewing cost, origin and processing method when available.',
        },
      },

      {
        '@type': 'Question',

        name: 'What is price per 100g?',

        acceptedAnswer: {
          '@type': 'Answer',

          text:
            'Price per 100g normalizes the price of coffees sold in different bag sizes, making it easier to compare their product value.',
        },
      },

      {
        '@type': 'Question',

        name: 'What is coffee cost per cup?',

        acceptedAnswer: {
          '@type': 'Answer',

          text:
            'Coffee cost per cup estimates the cost of the coffee used for one brew based on the bag price, bag weight and selected brewing dose.',
        },
      },

      {
        '@type': 'Question',

        name: 'Where do I buy the coffee?',

        acceptedAnswer: {
          '@type': 'Answer',

          text:
            'Bean to Leaf is a coffee discovery platform. Purchases are completed directly through the original coffee roaster or retailer website.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            organizationSchema
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            websiteSchema
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema
          ),
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                              HOMEPAGE                                      */
/* -------------------------------------------------------------------------- */

export default async function HomePage() {
  const {
    stats,
    featuredProducts,
  } = await getHomepageData();

  return (
    <div className="space-y-16 pb-16">

      <HomeStructuredData />

      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section
        className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900 py-24 text-white shadow-2xl"
        aria-labelledby="hero-heading"
      >

        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

          <div className="space-y-8">

            {/* BRAND POSITIONING */}

            <div className="animate-fade-up delay-1 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md shadow-lg transition-transform hover:scale-105">

              <Trophy className="h-4 w-4 text-amber-400" />

              <span>
                Explore specialty coffee roasters worldwide
              </span>

            </div>

            {/* PRIMARY SEO HEADING */}

            <h1
              id="hero-heading"
              className="animate-fade-up delay-2 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >

              Explore roasters.
              <br className="hidden sm:inline" />

              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                {' '}
                Discover great coffee.
              </span>

            </h1>

            <p className="animate-fade-up delay-3 mx-auto max-w-2xl text-base font-normal leading-relaxed text-stone-300 sm:text-lg">

              Bean to Leaf helps you discover specialty coffee, trusted roasters, coffee origins, and exceptional coffees worth brewing.

            </p>

            {/* SEARCH */}

            <form
              action="/catalog"
              method="GET"
              className="animate-fade-up delay-4 mx-auto flex max-w-2xl flex-col gap-2 pt-2 sm:flex-row"
              role="search"
            >

              <div className="relative flex-1">

                <Search
                  className="absolute left-4 top-4 h-5 w-5 text-stone-400"
                  aria-hidden="true"
                />

                <label
                  htmlFor="homepage-search"
                  className="sr-only"
                >
                  Search specialty coffee or roasters
                </label>

                <input
                  id="homepage-search"
                  type="text"
                  name="q"
                  placeholder="Search coffee, roaster, origin, flavor..."
                  className="w-full rounded-2xl border-0 bg-stone-800/90 py-4 pl-12 pr-4 text-sm text-white placeholder-stone-400 shadow-inner backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

              </div>

              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-4 text-sm font-extrabold text-white shadow-xl transition-all hover:from-amber-500 hover:to-amber-600 hover:shadow-2xl active:scale-95"
              >
                Explore
              </button>

            </form>

            {/* POPULAR DISCOVERY */}

            <div className="animate-fade-up delay-5 flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold">

              <span className="font-normal text-stone-400">
                Explore:
              </span>

              <Link
                href="/catalog?category=Filter"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-800/60 px-3.5 py-1.5 text-amber-300 transition-all hover:scale-105 hover:bg-stone-700 hover:text-white active:scale-95"
              >
                <Coffee className="h-3.5 w-3.5 text-amber-400" />
                <span>Filter Coffee</span>
              </Link>

              <Link
                href="/catalog?category=Espresso"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-800/60 px-3.5 py-1.5 text-amber-300 transition-all hover:scale-105 hover:bg-stone-700 hover:text-white active:scale-95"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Espresso</span>
              </Link>

              <Link
                href="/catalog?category=Decaf"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-800/60 px-3.5 py-1.5 text-amber-300 transition-all hover:scale-105 hover:bg-stone-700 hover:text-white active:scale-95"
              >
                <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                <span>Decaf</span>
              </Link>

              <Link
                href="/catalog?process=Natural"
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/20 px-3.5 py-1.5 text-amber-200 transition-all hover:scale-105 hover:bg-amber-500 hover:text-stone-950 active:scale-95"
              >
                <Grape className="h-3.5 w-3.5 text-amber-300" />
                <span>Natural Process</span>
              </Link>

              <Link
                href="/catalog?process=Anaerobic"
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/50 bg-purple-500/20 px-3.5 py-1.5 text-purple-200 transition-all hover:scale-105 hover:bg-purple-500 hover:text-white active:scale-95"
              >
                <FlaskConical className="h-3.5 w-3.5 text-purple-300" />
                <span>Anaerobic</span>
              </Link>

            </div>

            {/* PRIMARY ACTIONS */}

            <div className="animate-fade-up delay-5 flex flex-wrap justify-center gap-4 pt-4">

              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-stone-900 shadow-xl transition-all hover:scale-105 hover:bg-amber-100 active:scale-95"
              >
                <Search className="h-4 w-4 text-amber-800" />
                <span>Explore Coffee</span>
              </Link>

              <Link
                href="/roasters"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-700 bg-stone-800/80 px-7 py-3.5 text-sm font-black text-stone-200 transition-all hover:scale-105 hover:bg-stone-700 hover:text-white active:scale-95"
              >
                <Globe2 className="h-4 w-4 text-amber-400" />
                <span>Explore Roasters</span>
              </Link>

            </div>

            {/* STATISTICS */}

            <div className="animate-fade-up delay-5 grid max-w-3xl grid-cols-2 gap-4 border-t border-stone-800/80 pt-10 text-left sm:grid-cols-4">

              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm transition-all hover:border-amber-500/50">

                <div className="text-2xl font-black text-white">
                  {stats.totalProducts}+
                </div>

                <div className="mt-0.5 text-xs font-semibold text-stone-400">
                  coffees
                </div>

              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm transition-all hover:border-amber-500/50">

                <div className="text-2xl font-black text-white">
                  {stats.totalRoasters}
                </div>

                <div className="mt-0.5 text-xs font-semibold text-stone-400">
                  coffee roasters
                </div>

              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm transition-all hover:border-amber-500/50">

                <div className="text-2xl font-black text-white">
                  {stats.originsCount}
                </div>

                <div className="mt-0.5 text-xs font-semibold text-stone-400">
                  origin countries
                </div>

              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm transition-all hover:border-emerald-500/50">

                <div className="text-2xl font-black text-emerald-400">
                  {stats.inStockCount}
                </div>

                <div className="mt-0.5 text-xs font-semibold text-stone-400">
                  coffees available
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================================== */}
      {/* ROASTER DISCOVERY                                                  */}
      {/* ================================================================== */}

      <section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="roaster-discovery-heading"
      >

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">

            <Globe2 className="h-4 w-4" />

            <span>Roaster Discovery</span>

          </div>

          <h2
            id="roaster-discovery-heading"
            className="text-3xl font-black text-stone-900 sm:text-4xl"
          >
            Discover specialty coffee roasters
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">

            Explore specialty coffee from roasters around the
            world. Discover their coffees, origins, processing
            methods and brewing styles in one place.

          </p>

        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Globe2 className="h-6 w-6" />
            </div>

            <h3 className="text-base font-black text-stone-900">
              Explore roasters
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Discover specialty coffee roasters and explore
              the coffees they offer.
            </p>

          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Leaf className="h-6 w-6" />
            </div>

            <h3 className="text-base font-black text-stone-900">
              Discover origins
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Explore coffees from different countries,
              regions and growing origins.
            </p>

          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Coffee className="h-6 w-6" />
            </div>

            <h3 className="text-base font-black text-stone-900">
              Find your next coffee
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Discover coffees by process, brewing style,
              flavor and other characteristics.
            </p>

          </div>

        </div>

      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS                                                       */}
      {/* ================================================================== */}

      <section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="how-it-works-heading"
      >

        <div className="mb-12 text-center">

          <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">

            <Coffee className="h-4 w-4" />

            <span>How Bean to Leaf Works</span>

          </div>

          <h2
            id="how-it-works-heading"
            className="text-3xl font-black text-stone-900 sm:text-4xl"
          >
            From roaster to your cup
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-stone-600">
            Discover coffees, understand what makes them different,
            compare options and buy directly from the roaster.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-5">

          <div className="flex flex-col items-center rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-xl font-black text-amber-900">
              1
            </div>

            <h3 className="mb-1.5 text-sm font-extrabold text-stone-900">
              Explore roasters
            </h3>

            <p className="text-xs leading-relaxed text-stone-500">
              Discover specialty coffee roasters from around the world.
            </p>

          </div>

          <div className="flex flex-col items-center rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-xl font-black text-amber-900">
              2
            </div>

            <h3 className="mb-1.5 text-sm font-extrabold text-stone-900">
              Explore coffees
            </h3>

            <p className="text-xs leading-relaxed text-stone-500">
              Browse coffees by origin, process, brewing style and flavor.
            </p>

          </div>

          <div className="flex flex-col items-center rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-xl font-black text-amber-900">
              3
            </div>

            <h3 className="mb-1.5 text-sm font-extrabold text-stone-900">
              Compare options
            </h3>

            <p className="text-xs leading-relaxed text-stone-500">
              Compare price, bag size, price per 100g and brewing value.
            </p>

          </div>

          <div className="flex flex-col items-center rounded-3xl border border-amber-300 bg-amber-50/50 p-6 text-center shadow-md">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-900 text-xl font-black text-amber-50 shadow">
              4
            </div>

            <h3 className="mb-1.5 text-sm font-extrabold text-amber-950">
              Choose your coffee
            </h3>

            <p className="text-xs leading-relaxed text-amber-900/80">
              Find the coffee and roaster that fits your taste and budget.
            </p>

          </div>

          <div className="flex flex-col items-center rounded-3xl border border-emerald-300 bg-emerald-50/50 p-6 text-center shadow-sm">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-black text-white shadow">
              5
            </div>

            <h3 className="mb-1.5 text-sm font-extrabold text-emerald-950">
              Buy from the roaster
            </h3>

            <p className="text-xs leading-relaxed text-emerald-900/80">
              Complete your purchase directly on the original roaster website.
            </p>

          </div>

        </div>

      </section>

      {/* ================================================================== */}
      {/* FEATURED COFFEES                                                   */}
      {/* ================================================================== */}

      <section
        id="featured-coffees-section"
        className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8 scroll-mt-24"
        aria-labelledby="featured-heading"
      >
        <div className="flex items-center justify-between gap-4">

          <div>

            <h2
              id="featured-heading"
              className="text-2xl font-black text-stone-900 sm:text-3xl"
            >
              Discover Specialty Coffees
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              Explore selected coffees from specialty roasters.
            </p>

          </div>

          <Link
            href="/catalog"
            className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 transition-all hover:scale-105 hover:underline"
          >

            <span>Explore All</span>

            <ArrowRight className="h-4 w-4" />

          </Link>

        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">

          {featuredProducts.map((p: any) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}

        </div>

        {/* VALUE TOOLS */}

        <div className="mt-8 space-y-4 rounded-3xl border border-amber-900/20 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-6 shadow-sm">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900 font-bold text-amber-300 shadow">
              <Calculator className="h-5 w-5" />
            </div>

            <div>

              <h3 className="text-base font-black text-stone-900">
                Understand coffee value
              </h3>

              <p className="text-xs font-semibold text-stone-500">
                Useful tools for comparing coffees before you buy.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 text-xs font-semibold md:grid-cols-2">

            <div className="space-y-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-2 text-sm font-black text-stone-900">

                <CupSoda className="h-4 w-4 text-amber-800" />

                <span>Cost per Cup</span>

              </div>

              <p className="leading-relaxed text-stone-600">
                Estimate the cost of the coffee used for each brew
                based on bag price, bag weight and brewing dose.
              </p>

              <div className="rounded-xl border border-amber-200/60 bg-amber-50/80 p-2.5 font-mono text-[11px] text-amber-950">

                (Bag Price ÷ Bag Weight) × Dose

                {' = '}

                <strong>Cost per Cup</strong>

              </div>

            </div>

            <div className="space-y-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-2 text-sm font-black text-stone-900">

                <Scale className="h-4 w-4 text-amber-800" />

                <span>Compare Coffee Value</span>

              </div>

              <p className="leading-relaxed text-stone-600">
                Compare coffees using normalized price, bag size
                and other available product information.
              </p>

              <div className="rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-mono text-[11px] text-stone-900">

                Price ÷ Weight

                {' = '}

                <strong>Price per 100g</strong>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================================== */}
      {/* WHY BEAN TO LEAF                                                   */}
      {/* ================================================================== */}

      <section
        className="bg-stone-100/70 py-16"
        aria-labelledby="why-heading"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">

              <ShieldCheck className="h-4 w-4" />

              <span>Discover Better Coffee</span>

            </div>

            <h2
              id="why-heading"
              className="text-3xl font-black text-stone-900 sm:text-4xl"
            >
              More than a coffee catalog
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">

              Bean to Leaf helps you understand specialty coffee
              before you buy it — from the roaster behind the bag
              to its origin, processing method, brewing style and value.

            </p>

          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-stone-200 bg-white p-6">

              <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-600" />

              <h3 className="font-black text-stone-900">
                Discover Roasters
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Explore specialty coffee roasters and discover
                what they are brewing.
              </p>

            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">

              <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-600" />

              <h3 className="font-black text-stone-900">
                Explore Origins
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Discover coffees from different countries,
                regions and growing origins.
              </p>

            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">

              <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-600" />

              <h3 className="font-black text-stone-900">
                Understand Processing
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Explore natural, washed, anaerobic and other
                processing styles.
              </p>

            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">

              <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-600" />

              <h3 className="font-black text-stone-900">
                Compare Value
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Compare price, weight, cost per cup and other
                useful buying information.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================================== */}
      {/* COFFEE DISCOVERY                                                   */}
      {/* ================================================================== */}

      <section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="discover-heading"
      >

        <div className="mb-8">

          <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">

            <Globe2 className="h-4 w-4" />

            <span>Explore Specialty Coffee</span>

          </div>

          <h2
            id="discover-heading"
            className="text-3xl font-black text-stone-900"
          >
            Discover coffee your way
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
            Explore specialty coffee by brewing style and processing
            method to find coffees that match your preferences.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <Link
            href="/catalog?category=Filter"
            className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
          >

            <Coffee className="mb-3 h-6 w-6 text-amber-800" />

            <h3 className="font-black text-stone-900 group-hover:text-amber-800">
              Filter Coffee
            </h3>

            <p className="mt-1 text-xs text-stone-500">
              Explore coffees for filter brewing.
            </p>

          </Link>

          <Link
            href="/catalog?category=Espresso"
            className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
          >

            <Zap className="mb-3 h-6 w-6 text-amber-800" />

            <h3 className="font-black text-stone-900 group-hover:text-amber-800">
              Espresso
            </h3>

            <p className="mt-1 text-xs text-stone-500">
              Find coffees suited for espresso.
            </p>

          </Link>

          <Link
            href="/catalog?process=Natural"
            className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
          >

            <Grape className="mb-3 h-6 w-6 text-amber-800" />

            <h3 className="font-black text-stone-900 group-hover:text-amber-800">
              Natural Process
            </h3>

            <p className="mt-1 text-xs text-stone-500">
              Discover naturally processed coffees.
            </p>

          </Link>

          <Link
            href="/catalog?process=Anaerobic"
            className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
          >

            <FlaskConical className="mb-3 h-6 w-6 text-purple-700" />

            <h3 className="font-black text-stone-900 group-hover:text-amber-800">
              Anaerobic
            </h3>

            <p className="mt-1 text-xs text-stone-500">
              Explore distinctive anaerobic coffees.
            </p>

          </Link>

        </div>

      </section>

      {/* ================================================================== */}
      {/* FAQ                                                                */}
      {/* ================================================================== */}

      <section
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="faq-heading"
      >

        <div className="mb-10 text-center">

          <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">

            <HelpCircle className="h-4 w-4" />

            <span>Specialty Coffee FAQ</span>

          </div>

          <h2
            id="faq-heading"
            className="text-3xl font-black text-stone-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>

        </div>

        <div className="space-y-4">

          <details className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

            <summary className="cursor-pointer list-none pr-8 text-sm font-black text-stone-900">
              What is Bean to Leaf?
            </summary>

            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Bean to Leaf is a specialty coffee discovery platform
              that helps you explore coffee roasters and discover
              coffees from around the world.
            </p>

          </details>

          <details className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

            <summary className="cursor-pointer list-none pr-8 text-sm font-black text-stone-900">
              How can I discover coffee roasters?
            </summary>

            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Bean to Leaf brings coffees from different specialty
              roasters together in one searchable catalog, making
              it easier to discover new roasters and explore their coffees.
            </p>

          </details>

          <details className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

            <summary className="cursor-pointer list-none pr-8 text-sm font-black text-stone-900">
              Can I compare specialty coffees?
            </summary>

            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Yes. You can compare coffees using information such
              as price, bag size, price per 100g, brewing cost,
              origin and processing method when available.
            </p>

          </details>

          <details className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

            <summary className="cursor-pointer list-none pr-8 text-sm font-black text-stone-900">
              Why compare coffee by price per 100g?
            </summary>

            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Specialty coffee is sold in different bag sizes.
              Price per 100g provides a consistent way to compare
              the product price across different sizes.
            </p>

          </details>

          <details className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

            <summary className="cursor-pointer list-none pr-8 text-sm font-black text-stone-900">
              What is coffee cost per cup?
            </summary>

            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Cost per cup estimates how much your coffee dose costs
              based on the bag price, bag weight and selected brewing dose.
            </p>

          </details>

          <details className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

            <summary className="cursor-pointer list-none pr-8 text-sm font-black text-stone-900">
              Where do I buy the coffee?
            </summary>

            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Bean to Leaf is a discovery platform. Purchases are
              completed directly through the original coffee roaster
              or retailer website.
            </p>

          </details>

        </div>

      </section>

      {/* ================================================================== */}
      {/* FINAL CTA                                                           */}
      {/* ================================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-[2rem] bg-stone-950 px-6 py-14 text-center text-white shadow-2xl sm:px-12">

          <h2 className="text-3xl font-black sm:text-4xl">
            Discover your next great coffee
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-300">

            Explore specialty coffee roasters, discover new origins
            and processing methods, compare coffees and find your
            next favorite brew.

          </p>

          <Link
            href="/catalog"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-stone-950 shadow-xl transition-all hover:scale-105 hover:bg-amber-100 active:scale-95"
          >

            <Search className="h-4 w-4 text-amber-800" />

            Explore Specialty Coffee

            <ArrowRight className="h-4 w-4" />

          </Link>

        </div>

      </section>

    </div>
  );
}