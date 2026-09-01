import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Globe, Repeat, PackageCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Best Coffee Subscriptions 2026 | Trade, Atlas, Bean Box & Pact',
  description:
    'Compare the top specialty coffee subscriptions. Discover multi-roaster discovery boxes, world single-origin tours, and recurring coffee deliveries.',
  keywords: [
    'coffee subscriptions',
    'best coffee subscription 2026',
    'Trade Coffee subscription',
    'Atlas Coffee Club review',
    'Bean Box subscription',
    'Pact Coffee subscription',
    'recurring coffee delivery',
  ],
  alternates: {
    canonical: '/coffee-subscriptions',
  },
};

interface SubscriptionProvider {
  id: string;
  name: string;
  slug: string;
  country: string;
  pricePerBag: string;
  commissionNote: string;
  affiliateUrl: string;
  rating: number;
  badge: string;
  description: string;
  highlights: string[];
  bestFor: string;
}

const SUBSCRIPTION_PROVIDERS: SubscriptionProvider[] = [
  {
    id: 'trade-coffee',
    name: 'Trade Coffee',
    slug: 'trade-coffee',
    country: 'United States',
    pricePerBag: '$15.75 – $20.00 / bag',
    commissionNote: 'Verified 8% Commission + Bounty',
    affiliateUrl: 'https://www.drinktrade.com/?ref=beandeals',
    rating: 4.9,
    badge: 'Best Multi-Roaster Discovery',
    description: 'Matches coffee lovers with 450+ fresh micro-lots from 55+ top independent craft roasters across North America based on a personalized taste quiz.',
    highlights: ['55+ Top Craft Roasters', 'Personalized Taste Matching Quiz', 'Freshly roasted on demand', 'Free shipping on subscription'],
    bestFor: 'Best for Discovering New Craft Roasters',
  },
  {
    id: 'atlas-coffee-club',
    name: 'Atlas Coffee Club',
    slug: 'atlas-coffee-club',
    country: 'United States & Canada',
    pricePerBag: '$14.00 – $18.00 / bag',
    commissionNote: 'Verified 15% Commission',
    affiliateUrl: 'https://atlascoffeeclub.com/?ref=beandeals',
    rating: 4.9,
    badge: 'Best World Coffee Tour',
    description: 'A global monthly coffee journey curating single-origin micro-lots from Kenya, Ethiopia, Colombia, Costa Rica, Peru, and Indonesia with picturesque postcards.',
    highlights: ['Different country featured every month', 'Custom roast level & grind options', 'Includes country origin postcard & notes', '100% Arabica micro-lots'],
    bestFor: 'Best for International Origin Discovery',
  },
  {
    id: 'bean-box',
    name: 'Bean Box',
    slug: 'bean-box',
    country: 'United States & Canada',
    pricePerBag: '$16.50 – $24.00 / box',
    commissionNote: 'Verified 10% Commission',
    affiliateUrl: 'https://beanbox.com/?ref=beandeals',
    rating: 4.8,
    badge: 'Best Gift & Sampler Subscriptions',
    description: 'Curates premium Pacific Northwest craft coffee tasting samplers and full-bag subscriptions delivered fresh with free US shipping.',
    highlights: ['4-Roaster Sampler Tasting Boxes', 'Top Seattle & Portland roasteries', 'Holiday & Birthday Gift Subscriptions', 'Includes artisanal chocolates'],
    bestFor: 'Best for Coffee Gifting & Sampler Boxes',
  },
  {
    id: 'pact-coffee',
    name: 'Pact Coffee',
    slug: 'pact-coffee',
    country: 'United Kingdom',
    pricePerBag: '£8.95 – £11.95 / bag',
    commissionNote: 'Verified 5% Commission',
    affiliateUrl: 'https://www.pactcoffee.com/?ref=beandeals',
    rating: 4.8,
    badge: 'Best UK Specialty Subscription',
    description: 'Direct-trade specialty coffee subscription delivering ethically sourced single-origin coffees directly to UK coffee drinkers.',
    highlights: ['Direct trade ethical sourcing', 'Flexible letterbox delivery', 'Custom brewing method selection', '100% recyclable packaging'],
    bestFor: 'Best for UK & European Coffee Drinkers',
  },
];

export default function CoffeeSubscriptionsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-900 animate-fade-up">
      {/* HERO SECTION */}
      <section className="bg-[#E8DCC8] border-b border-stone-300/70 py-12 sm:py-16 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-400/60 bg-[#FAF7F2]/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-stone-800 mb-4">
            <Repeat size={13} className="text-amber-900" /> Recurring Coffee Discovery Engine
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Best Specialty Coffee Subscriptions
          </h1>
          <p className="mt-4 text-base text-stone-700 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Never run out of freshly roasted specialty coffee. Compare recurring subscriptions, multi-roaster discovery boxes, and world coffee tours.
          </p>
        </div>
      </section>

      {/* VALUE HIGHLIGHTS */}
      <section className="border-b border-stone-300/60 bg-[#F3EBDD] py-6 px-6 sm:px-12">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm font-medium text-stone-800">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-emerald-800 shrink-0" />
            <span>Freshly Roasted on Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-900 shrink-0" />
            <span>Single-Origin Micro-Lots & Country Tours</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-900 shrink-0" />
            <span>Flexible Pause or Cancel Anytime</span>
          </div>
        </div>
      </section>

      {/* PROVIDERS LIST */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12">
        <div className="space-y-8">
          {SUBSCRIPTION_PROVIDERS.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-col lg:flex-row items-stretch justify-between rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6 sm:p-8 transition-all hover:border-stone-400 hover:shadow-md gap-6"
            >
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-amber-900 px-3 py-1 text-xs font-bold text-white">
                    {sub.badge}
                  </span>
                  <span className="rounded-full bg-emerald-800/10 border border-emerald-700/30 px-3 py-1 text-xs font-semibold text-emerald-900">
                    ★ {sub.rating} Editorial Rating
                  </span>
                  <span className="text-xs font-medium text-stone-500">📍 {sub.country}</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-stone-950">{sub.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-amber-900">{sub.pricePerBag}</p>
                </div>

                <p className="text-sm text-stone-700 leading-relaxed max-w-3xl">
                  {sub.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {sub.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-stone-800">
                      <Check size={14} className="text-emerald-700 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between items-start lg:items-end border-t lg:border-t-0 lg:border-l border-stone-300/70 pt-6 lg:pt-0 lg:pl-8 shrink-0 min-w-[220px]">
                <div className="text-left lg:text-right">
                  <span className="text-xs font-bold uppercase text-stone-500">Best For</span>
                  <p className="text-sm font-bold text-stone-950 mt-0.5">{sub.bestFor}</p>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200">
                    {sub.commissionNote}
                  </span>
                </div>

                <a
                  href={sub.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-900 px-6 py-3 text-sm font-bold text-white hover:bg-amber-800 transition-colors shadow-sm"
                >
                  <span>Start Subscription</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
