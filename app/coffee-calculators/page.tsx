
import Link from 'next/link';
import ExploreCalculatorsButton from '@/components/ExploreCalculatorsButton';
import {
  ArrowRight,
  Calculator,
  Coffee,
  Droplets,
  Zap,
  Wallet,
  Scale,
  CupSoda,
  FlaskConical,
  Timer,
} from 'lucide-react';

export const metadata = {
  title: 'Coffee Calculators | Brewing Ratios, Cost, Caffeine & More',
  description:
    'Use our free coffee calculators to find coffee-to-water ratios, servings, brewing measurements, caffeine estimates and cost per cup for your favorite coffee.',
  keywords: [
    'coffee calculator',
    'coffee calculators',
    'coffee ratio calculator',
    'coffee per cup calculator',
    'coffee cost calculator',
    'coffee caffeine calculator',
    'espresso ratio calculator',
    'french press calculator',
    'pour over calculator',
    'cold brew calculator',
  ],
  alternates: {
    canonical: '/coffee-calculators',
  },
  openGraph: {
    title: 'Coffee Calculators | Brew Better, Measure Smarter',
    description:
      'Free coffee calculators for brewing ratios, coffee servings, caffeine, cost per cup and more.',
    type: 'website',
  },
};

const brewingCalculators = [
  {
    title: 'Coffee Ratio Calculator',
    description:
      'Find the right coffee-to-water ratio and calculate exactly how much coffee or water you need.',
    href: '/coffee-calculators/coffee-ratio-calculator',
    icon: Scale,
  },
  {
    title: 'Coffee Per Cup Calculator',
    description:
      'Calculate how many grams of coffee you need based on your cups, serving size and preferred strength.',
    href: '/coffee-calculators/coffee-per-cup-calculator',
    icon: CupSoda,
  },
  {
    title: 'Pour Over Calculator',
    description:
      'Calculate coffee and water amounts for a balanced pour over brew.',
    href: '/coffee-calculators/pour-over-calculator',
    icon: Droplets,
  },
  {
    title: 'French Press Calculator',
    description:
      'Find the right coffee and water measurements for your French press.',
    href: '/coffee-calculators/french-press-calculator',
    icon: Coffee,
  },
  {
    title: 'Espresso Ratio Calculator',
    description:
      'Calculate espresso dose, yield and brew ratio for dialing in your shot.',
    href: '/coffee-calculators/espresso-ratio-calculator',
    icon: Timer,
  },
  {
    title: 'Cold Brew Calculator',
    description:
      'Calculate coffee, water and dilution for cold brew and concentrate recipes.',
    href: '/coffee-calculators/cold-brew-calculator',
    icon: FlaskConical,
  },
  {
    title: 'AeroPress Calculator',
    description:
      'Calculate coffee and water amounts for your AeroPress recipe.',
    href: '/coffee-calculators/aeropress-calculator',
    icon: Coffee,
  },
  {
    title: 'Moka Pot Calculator',
    description:
      'Find the right amount of coffee and water for your moka pot.',
    href: '/coffee-calculators/moka-pot-calculator',
    icon: Coffee,
  },
];

const otherCalculators = [
  {
    title: 'Coffee Caffeine Calculator',
    description:
      'Estimate the caffeine in your coffee based on type, serving size and number of servings.',
    href: '/coffee-calculators/coffee-caffeine-calculator',
    icon: Zap,
  },
  {
    title: 'Coffee Cost Per Cup Calculator',
    description:
      'Calculate how much each cup costs and understand the real value of your coffee bag.',
    href: '/coffee-calculators/coffee-cost-per-cup-calculator',
    icon: Wallet,
  },
];

function CalculatorCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-stone-400 hover:bg-[#F7F2E8] hover:shadow-md"
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-900 text-[#E8DCC8]">
          <Icon size={22} strokeWidth={1.7} />
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition-all duration-300 group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-[#E8DCC8]">
          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-stone-900">
        {title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-stone-600">
        {description}
      </p>

      <div className="mt-6 text-sm font-medium text-stone-800">
        Calculate <span className="ml-1">→</span>
      </div>
    </Link>
  );
}

export default function CoffeeCalculatorsPage() {
  return (
    <main className="min-h-screen bg-[#E8DCC8] text-stone-900">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-stone-300/70">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:px-8 lg:px-12 lg:pb-20 lg:pt-20">
          <div className="max-w-3xl">
            <div className="animate-fade-up delay-1 mb-7 inline-flex items-center gap-2 rounded-full border border-stone-400/70 bg-[#F3EBDD]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-700">
              <Calculator size={14} />
              Coffee Tools
            </div>

            <h1 className="animate-fade-up delay-2 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-stone-950 sm:text-6xl lg:text-7xl">
              Coffee Calculators
            </h1>

            <p className="animate-fade-up delay-3 mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Brew better. Measure smarter.
            </p>

            <p className="animate-fade-up delay-4 mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              From coffee-to-water ratios to cost per cup, caffeine and
              brewing measurements, our free coffee calculators make the math
              simple so you can focus on the coffee.
            </p>

            <div className="animate-fade-up delay-5 mt-8 flex flex-wrap gap-3">
              <ExploreCalculatorsButton targetId="calculators" />

              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-full border border-stone-400 bg-transparent px-6 py-3.5 text-sm font-medium text-stone-800 transition-all duration-300 hover:bg-[#F3EBDD] hover:scale-[1.02] active:scale-95"
              >
                Explore Coffee
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-stone-400/30" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-stone-400/20" />
      </section>

      {/* INTRO + CALCULATORS */}
      <section
        id="calculators"
        className="scroll-mt-24 border-b border-stone-300/70 bg-[#F3EBDD]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Find your tool
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Simple tools for better coffee
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-base leading-7 text-stone-600 sm:text-lg">
                Whether you are dialing in espresso, making a French press,
                preparing a pour over or simply trying to work out how much
                coffee you need, these calculators help you get the numbers
                right.
              </p>

              <p className="mt-5 text-base leading-7 text-stone-600">
                Choose a calculator below, enter your measurements and get a
                practical answer in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BREWING CALCULATORS */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                01 · Brewing
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Brewing Calculators
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-stone-600">
              Get your coffee, water and brewing measurements right for the
              way you like to brew.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brewingCalculators.map((calculator) => (
              <CalculatorCard
                key={calculator.href}
                title={calculator.title}
                description={calculator.description}
                href={calculator.href}
                icon={calculator.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* OTHER CALCULATORS */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                02 · Coffee essentials
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                More Coffee Calculators
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-stone-600">
                Go beyond brewing. Understand caffeine and the real cost of
                the coffee you drink.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {otherCalculators.map((calculator) => (
                <CalculatorCard
                  key={calculator.href}
                  title={calculator.title}
                  description={calculator.description}
                  href={calculator.href}
                  icon={calculator.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Why use them?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Better numbers. Better coffee.
            </h2>

            <p className="mt-5 text-base leading-7 text-stone-600 sm:text-lg">
              Coffee is part craft and part measurement. Small changes in
              coffee, water, ratio and serving size can make a noticeable
              difference in your cup.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-stone-300 bg-stone-300 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-[#F3EBDD] p-7">
              <Scale
                className="text-stone-700"
                size={23}
                strokeWidth={1.6}
              />

              <h3 className="mt-6 font-semibold text-stone-900">
                Precise ratios
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Find a reliable starting point for coffee-to-water ratios.
              </p>
            </div>

            <div className="bg-[#F3EBDD] p-7">
              <Coffee
                className="text-stone-700"
                size={23}
                strokeWidth={1.6}
              />

              <h3 className="mt-6 font-semibold text-stone-900">
                Any brew style
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Explore tools for espresso, pour over, French press and more.
              </p>
            </div>

            <div className="bg-[#F3EBDD] p-7">
              <Zap
                className="text-stone-700"
                size={23}
                strokeWidth={1.6}
              />

              <h3 className="mt-6 font-semibold text-stone-900">
                Quick answers
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Enter your numbers and get useful results without complicated
                math.
              </p>
            </div>

            <div className="bg-[#F3EBDD] p-7">
              <Wallet
                className="text-stone-700"
                size={23}
                strokeWidth={1.6}
              />

              <h3 className="mt-6 font-semibold text-stone-900">
                Know your cost
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Understand what your coffee really costs per cup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="border-t border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Coffee guide
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Why coffee measurements matter
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              A good cup of coffee is not only about the beans you choose.
              The amount of coffee, water and the relationship between them
              can have a major effect on the final brew. Using a consistent
              ratio gives you a reliable starting point and makes it easier
              to adjust your recipe.
            </p>

            <p>
              A coffee-to-water ratio describes the relationship between the
              weight of coffee and the amount of water used to brew it. For
              example, a 1:15 ratio means one part coffee to fifteen parts
              water. The ideal ratio depends on the brewing method, coffee and
              personal taste.
            </p>

            <p>
              Coffee measurements are also useful when comparing the value of
              different bags. A larger bag is not necessarily cheaper once
              you calculate its price per gram and the amount of coffee you
              use for each cup.
            </p>

            <p>
              Our coffee calculators are designed to make these calculations
              quick and practical, whether you are brewing one cup at home,
              dialing in espresso or comparing the cost of your daily coffee.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — LAST SECTION */}
      <section className="border-t border-stone-300/70 bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Frequently asked questions
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Coffee calculator questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is a coffee calculator?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
                A coffee calculator helps you work out measurements such as
                coffee-to-water ratios, the amount of coffee needed for a
                number of cups, caffeine estimates or the cost of each cup.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much coffee should I use per cup?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
                A common starting point for filter-style coffee is around
                15–17 grams of coffee for 250 ml of water. Your preferred
                strength and brewing method can change that amount.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is a coffee-to-water ratio?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
                A coffee-to-water ratio describes how much water is used for a
                given amount of coffee. A 1:15 ratio, for example, means one
                part coffee to fifteen parts water.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How can I calculate the cost of a cup of coffee?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
                Divide the price of the coffee by the total weight of the bag
                to find the price per gram. Then multiply that figure by the
                number of grams you use for one cup.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}