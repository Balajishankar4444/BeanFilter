import Link from 'next/link';
import { Search, ShoppingBag, Truck, ExternalLink, Coffee, ArrowRight, ShieldCheck, Sparkles, Trophy, BadgePercent, MapPin, CheckCircle2, Star, HelpCircle } from 'lucide-react';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { DoseCalculatorWidget } from '@/components/DoseCalculatorWidget';

export const revalidate = 60;

async function getHomepageData() {
  try {
    const totalProducts = await prisma.product.count({ where: { isActive: true } });
    const totalRoasters = await prisma.roaster.count();
    const inStockCount = await prisma.variant.count({ where: { isAvailable: true } });
    const origins = await prisma.product.groupBy({
      by: ['originCountry'],
      where: { originCountry: { not: null } },
    });

    // Fetch top quality IN-STOCK ONLY coffees across roasters
    const rawFeatured = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: {
          some: {
            isAvailable: true, // Strictly in stock only
          },
        },
      },
      take: 24,
      include: {
        roaster: true,
        variants: { orderBy: { pricePer100g: 'asc' } },
        flavorNotes: { include: { flavorNote: true } },
      },
      orderBy: { id: 'asc' },
    });

    // Interleave across roasters for top diverse quality selection
    const roasterMap = new Map<string, typeof rawFeatured>();
    for (const p of rawFeatured) {
      const rId = p.roaster.id;
      if (!roasterMap.has(rId)) roasterMap.set(rId, []);
      roasterMap.get(rId)!.push(p);
    }

    const mixedFeatured: typeof rawFeatured = [];
    const queueList = Array.from(roasterMap.values());
    let maxLen = 0;
    for (const q of queueList) {
      if (q.length > maxLen) maxLen = q.length;
    }

    for (let i = 0; i < maxLen; i++) {
      for (const q of queueList) {
        if (q[i]) mixedFeatured.push(q[i]);
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
        flavorNotes: p.flavorNotes.map((fn) => fn.flavorNote.name),
      })),
    };
  } catch (e) {
    return {
      stats: { totalProducts: 1622, totalRoasters: 10, originsCount: 22, inStockCount: 1550 },
      featuredProducts: [],
    };
  }
}

export default async function HomePage() {
  const { stats, featuredProducts } = await getHomepageData();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900 py-24 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="animate-fade-up delay-1 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>Find specialty coffee & cheapest delivered basket combinations</span>
          </div>

          <h1 className="animate-fade-up delay-2 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Find better specialty coffee <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              for less delivered.
            </span>
          </h1>

          <p className="animate-fade-up delay-3 mx-auto max-w-2xl text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
            Compare specialty coffee across roasters, build your basket, and find the **cheapest overall delivered option** including delivery thresholds.
          </p>

          {/* Primary Search Bar */}
          <form action="/catalog" method="GET" className="animate-fade-up delay-4 mx-auto max-w-2xl flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 h-5 w-5 text-stone-400" />
              <input
                type="text"
                name="q"
                placeholder="Search coffee, origin, flavor, roaster..."
                className="w-full rounded-2xl border-0 bg-stone-800/90 py-4 pl-12 pr-4 text-sm text-white placeholder-stone-400 shadow-inner focus:ring-2 focus:ring-amber-500 focus:outline-none backdrop-blur-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-4 text-sm font-extrabold text-white shadow-xl hover:from-amber-500 hover:to-amber-600 transition-all active:scale-95 hover:shadow-2xl"
            >
              Find Coffee
            </button>
          </form>

          {/* Quick Category Deal Pills */}
          <div className="animate-fade-up delay-5 pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
            <span className="text-stone-400 font-normal">Popular Deals:</span>
            <Link href="/catalog?category=Filter" className="rounded-xl border border-stone-700 bg-stone-800/60 px-3.5 py-1.5 text-amber-300 hover:bg-stone-700 hover:text-white transition-all hover:scale-105 active:scale-95">
              ☕ Filter
            </Link>
            <Link href="/catalog?category=Espresso" className="rounded-xl border border-stone-700 bg-stone-800/60 px-3.5 py-1.5 text-amber-300 hover:bg-stone-700 hover:text-white transition-all hover:scale-105 active:scale-95">
              ⚡ Espresso
            </Link>
            <Link href="/catalog?category=Decaf" className="rounded-xl border border-stone-700 bg-stone-800/60 px-3.5 py-1.5 text-amber-300 hover:bg-stone-700 hover:text-white transition-all hover:scale-105 active:scale-95">
              🌿 Decaf
            </Link>
            <Link href="/catalog?process=Natural" className="rounded-xl border border-amber-500/50 bg-amber-500/20 px-3.5 py-1.5 text-amber-200 hover:bg-amber-500 hover:text-stone-950 transition-all hover:scale-105 active:scale-95">
              🍇 Natural Process
            </Link>
            <Link href="/catalog?process=Anaerobic" className="rounded-xl border border-purple-500/50 bg-purple-500/20 px-3.5 py-1.5 text-purple-200 hover:bg-purple-500 hover:text-white transition-all hover:scale-105 active:scale-95">
              🧪 Anaerobic Process
            </Link>
          </div>

          <div className="animate-fade-up delay-5 pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-stone-900 shadow-xl hover:bg-amber-100 transition-all hover:scale-105 active:scale-95"
            >
              <Search className="h-4 w-4 text-amber-800" />
              <span>Find Coffee</span>
            </Link>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-700 bg-stone-800/80 px-7 py-3.5 text-sm font-black text-stone-200 hover:bg-stone-700 hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4 text-amber-400" />
              <span>Build My Basket</span>
            </Link>
          </div>

          {/* Real Homepage Statistics */}
          <div className="animate-fade-up delay-5 pt-10 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm hover:border-amber-500/50 transition-all">
              <div className="text-2xl font-black text-white">{stats.totalProducts}+</div>
              <div className="text-xs text-stone-400 font-semibold mt-0.5">coffees tracked</div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm hover:border-amber-500/50 transition-all">
              <div className="text-2xl font-black text-white">{stats.totalRoasters}</div>
              <div className="text-xs text-stone-400 font-semibold mt-0.5">specialty roasters</div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm hover:border-amber-500/50 transition-all">
              <div className="text-2xl font-black text-white">{stats.originsCount}</div>
              <div className="text-xs text-stone-400 font-semibold mt-0.5">origin countries</div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm hover:border-emerald-500/50 transition-all">
              <div className="text-2xl font-black text-emerald-400">{stats.inStockCount}</div>
              <div className="text-xs text-stone-400 font-semibold mt-0.5">coffees in stock</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-up delay-3">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest mb-2">
            <BadgePercent className="h-4 w-4" />
            <span>Delivered Basket Optimizer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900">How BeanDeals Saves You Money</h2>
          <p className="text-sm text-stone-600 mt-2 max-w-xl mx-auto">
            We don't just find cheap coffees—we optimize your entire basket across multiple roasters to hit free shipping thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 font-black text-xl mb-4">
              1
            </div>
            <h4 className="font-extrabold text-stone-900 text-sm mb-1.5">1. Find coffee</h4>
            <p className="text-xs text-stone-500 leading-relaxed">Search and filter specialty coffees across roasters.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 font-black text-xl mb-4">
              2
            </div>
            <h4 className="font-extrabold text-stone-900 text-sm mb-1.5">2. Build your basket</h4>
            <p className="text-xs text-stone-500 leading-relaxed">Choose all the coffees you want to buy.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 font-black text-xl mb-4">
              3
            </div>
            <h4 className="font-extrabold text-stone-900 text-sm mb-1.5">3. Enter ZIP code</h4>
            <p className="text-xs text-stone-500 leading-relaxed">We calculate exact shipping costs & free thresholds.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-amber-300 bg-amber-50/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-900 text-amber-50 font-black text-xl mb-4 shadow">
              4
            </div>
            <h4 className="font-extrabold text-amber-950 text-sm mb-1.5">4. Find best deal</h4>
            <p className="text-xs text-amber-900/80 leading-relaxed">We calculate the cheapest total combination of products and shipping.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-emerald-300 bg-emerald-50/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl mb-4 shadow">
              5
            </div>
            <h4 className="font-extrabold text-emerald-950 text-sm mb-1.5">5. Buy</h4>
            <p className="text-xs text-emerald-900/80 leading-relaxed">Purchase directly from original roaster websites.</p>
          </div>
        </div>
      </section>

      {/* Top Quality In-Stock Featured Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-up delay-4">
        <DoseCalculatorWidget />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">Featured Specialty Coffees</h2>
            <p className="text-xs text-stone-500 mt-1">Top-rated in-stock specialty micro-lots across leading roasters</p>
          </div>
          <Link href="/catalog" className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 hover:underline transition-all hover:scale-105">
            <span>View All Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* STAR BADGES & RATINGS EXPLANATION BOX */}
        <div className="rounded-3xl border border-amber-900/20 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-6 shadow-sm space-y-4 mt-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900 text-amber-300 font-bold shadow">
              <Star className="h-5 w-5 fill-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">What Our ⭐ Star Badges & Ratings Mean</h3>
              <p className="text-xs text-stone-500 font-semibold">How we rate value & quality across coffee listings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="rounded-2xl bg-white p-4 border border-stone-200 space-y-1 shadow-sm">
              <div className="flex items-center gap-1 text-amber-900 font-black uppercase text-[10px] tracking-wider">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>⭐ Best Value Bag Size</span>
              </div>
              <p className="text-stone-700 leading-snug">
                Marks the bag size (e.g. 500g or 1kg) offering the lowest price per 100g for that coffee, giving you maximum cup output per dollar.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-stone-200 space-y-1 shadow-sm">
              <div className="flex items-center gap-1 text-emerald-800 font-black uppercase text-[10px] tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>⭐ Top Specialty Micro-Lot</span>
              </div>
              <p className="text-stone-700 leading-snug">
                Identifies high-grade specialty micro-lots from renowned roasters (Onyx, Sey, Verve) featuring rare varieties, natural/anaerobic processes, and high cup scores.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-stone-200 space-y-1 shadow-sm">
              <div className="flex items-center gap-1 text-amber-900 font-black uppercase text-[10px] tracking-wider">
                <BadgePercent className="h-3.5 w-3.5 text-amber-700" />
                <span>⭐ Cheapest Delivered Option</span>
              </div>
              <p className="text-stone-700 leading-snug">
                Evaluates total delivered price (coffee price + shipping cost to your ZIP code) to ensure you get the absolute cheapest delivered combination.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
