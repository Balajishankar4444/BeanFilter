'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Coffee,
  CupSoda,
  Info,
  Zap,
} from 'lucide-react';

const coffeeTypes = {
  brewed: {
    name: 'Brewed Coffee',
    caffeinePer100ml: 40,
    description: 'Regular filter or drip coffee',
  },
  espresso: {
    name: 'Espresso',
    caffeinePer100ml: 212,
    description: 'Espresso shot',
  },
  americano: {
    name: 'Americano',
    caffeinePer100ml: 40,
    description: 'Espresso diluted with water',
  },
  frenchPress: {
    name: 'French Press',
    caffeinePer100ml: 45,
    description: 'Immersion-brewed coffee',
  },
  coldBrew: {
    name: 'Cold Brew',
    caffeinePer100ml: 80,
    description: 'Ready-to-drink cold brew',
  },
  instant: {
    name: 'Instant Coffee',
    caffeinePer100ml: 30,
    description: 'Prepared instant coffee',
  },
  decaf: {
    name: 'Decaf Coffee',
    caffeinePer100ml: 2,
    description: 'Decaffeinated brewed coffee',
  },
};

type CoffeeType = keyof typeof coffeeTypes;

export default function CoffeeCaffeineCalculatorPage() {
  const [coffeeType, setCoffeeType] =
    useState<CoffeeType>('brewed');

  const [servingSize, setServingSize] = useState('250');
  const [servings, setServings] = useState('1');

  const result = useMemo(() => {
    const size = Number(servingSize) || 0;
    const numberOfServings = Number(servings) || 0;

    const caffeinePer100ml =
      coffeeTypes[coffeeType].caffeinePer100ml;

    const caffeinePerServing =
      (size / 100) * caffeinePer100ml;

    const totalCaffeine =
      caffeinePerServing * numberOfServings;

    return {
      perServing: Math.round(caffeinePerServing),
      total: Math.round(totalCaffeine),
    };
  }, [coffeeType, servingSize, servings]);

  return (
    <main className="min-h-screen bg-[#E8DCC8] text-stone-900 animate-fade-up">
      {/* HERO */}
      <section className="border-b border-stone-300/70">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-14 sm:px-8 lg:px-12 lg:pb-20 lg:pt-20">
          <Link
            href="/coffee-calculators"
            className="mb-8 inline-flex items-center gap-2 text-sm text-stone-600 transition hover:text-stone-950"
          >
            <ArrowRight
              size={15}
              className="rotate-180"
            />
            All Coffee Calculators
          </Link>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-400/70 bg-[#F3EBDD]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-700">
              <Zap size={14} />
              Coffee Calculator
            </div>

            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-stone-950 sm:text-6xl">
              Coffee Caffeine Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Estimate how much caffeine is in your coffee based on
              the coffee type, serving size and number of servings.
            </p>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-[#F3EBDD]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            {/* INPUTS */}
            <div className="rounded-3xl border border-stone-300 bg-[#E8DCC8] p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Calculate caffeine
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Your coffee
                </h2>
              </div>

              {/* COFFEE TYPE */}
              <div>
                <label
                  htmlFor="coffeeType"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Coffee type
                </label>

                <div className="relative">
                  <Coffee
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <select
                    id="coffeeType"
                    value={coffeeType}
                    onChange={(e) =>
                      setCoffeeType(
                        e.target.value as CoffeeType
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 text-stone-900 outline-none transition focus:border-stone-700"
                  >
                    {Object.entries(coffeeTypes).map(
                      ([key, coffee]) => (
                        <option key={key} value={key}>
                          {coffee.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  {coffeeTypes[coffeeType].description}
                </p>
              </div>

              {/* SERVING SIZE */}
              <div className="mt-6">
                <label
                  htmlFor="servingSize"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Serving size
                </label>

                <div className="relative">
                  <CupSoda
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="servingSize"
                    type="number"
                    min="1"
                    step="10"
                    value={servingSize}
                    onChange={(e) =>
                      setServingSize(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    ml
                  </span>
                </div>
              </div>

              {/* NUMBER OF SERVINGS */}
              <div className="mt-6">
                <label
                  htmlFor="servings"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Number of servings
                </label>

                <input
                  id="servings"
                  type="number"
                  min="1"
                  step="1"
                  value={servings}
                  onChange={(e) =>
                    setServings(e.target.value)
                  }
                  className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-4 py-3.5 text-stone-900 outline-none transition focus:border-stone-700"
                />
              </div>

              {/* INFO */}
              <div className="mt-8 flex gap-3 rounded-2xl border border-stone-300/80 bg-[#F3EBDD] p-5">
                <Info
                  size={18}
                  className="mt-0.5 shrink-0 text-stone-600"
                />

                <p className="text-sm leading-6 text-stone-600">
                  Caffeine varies significantly depending on the
                  coffee, roast, brewing method and preparation.
                  This calculator provides an estimate rather than
                  an exact measurement.
                </p>
              </div>
            </div>

            {/* RESULT */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Estimated caffeine
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Your coffee contains
              </h2>

              <div className="mt-8 rounded-2xl bg-stone-800 p-6">
                <p className="text-sm text-stone-400">
                  Per serving
                </p>

                <p className="mt-2 text-5xl font-semibold tracking-tight">
                  {result.perServing}
                  <span className="ml-2 text-lg font-normal text-stone-400">
                    mg
                  </span>
                </p>
              </div>

              <div className="mt-3 rounded-2xl bg-stone-800 p-6">
                <p className="text-sm text-stone-400">
                  Total caffeine
                </p>

                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {result.total}
                  <span className="ml-2 text-lg font-normal text-stone-400">
                    mg
                  </span>
                </p>

                <p className="mt-2 text-sm text-stone-500">
                  {servings || 0} serving
                  {Number(servings) === 1 ? '' : 's'} ×{' '}
                  {servingSize || 0} ml
                </p>
              </div>

              <div className="mt-8 border-t border-stone-700 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800">
                    <Zap size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {coffeeTypes[coffeeType].name}
                    </p>

                    <p className="text-xs text-stone-500">
                      Estimated caffeine density:{' '}
                      {coffeeTypes[coffeeType].caffeinePer100ml} mg
                      / 100 ml
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAFFEINE GUIDE */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Understanding caffeine
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Why caffeine levels vary
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              The amount of caffeine in a cup of coffee is not fixed.
              Coffee species, bean variety, roast level, grind size,
              brewing method and brewing time can all influence how
              much caffeine ends up in your drink.
            </p>

            <p>
              Serving size also matters. A small espresso has a high
              caffeine concentration, while a larger brewed coffee
              may contain more total caffeine simply because there is
              more coffee in the serving.
            </p>

            <p>
              For that reason, caffeine calculators should be treated
              as estimates. The actual caffeine content of a particular
              coffee can be higher or lower than the calculated value.
            </p>
          </div>
        </div>
      </section>

      {/* COFFEE TYPES */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Coffee comparison
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Estimated caffeine by coffee type
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-300">
            <div className="grid grid-cols-[1.4fr_0.8fr] bg-stone-900 px-5 py-4 text-sm font-medium text-[#E8DCC8]">
              <span>Coffee</span>
              <span className="text-right">
                Estimated / 100 ml
              </span>
            </div>

            {Object.values(coffeeTypes).map((coffee, index) => (
              <div
                key={coffee.name}
                className={`grid grid-cols-[1.4fr_0.8fr] px-5 py-4 ${
                  index % 2 === 0
                    ? 'bg-[#E8DCC8]'
                    : 'bg-[#F7F2E8]'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {coffee.name}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {coffee.description}
                  </p>
                </div>

                <p className="text-right text-sm font-medium text-stone-800">
                  {coffee.caffeinePer100ml} mg
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-stone-500">
            Values shown are general estimates used for calculation
            purposes. Actual caffeine content varies by product and
            preparation.
          </p>
        </div>
      </section>

      {/* RELATED CALCULATORS */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Keep exploring
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
            Related coffee calculators
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/coffee-calculators/coffee-ratio-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Ratio Calculator
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Find the right coffee-to-water ratio for your brew.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                Calculate
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>

            <Link
              href="/coffee-calculators/coffee-cost-per-cup-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <CupSoda size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Cost Per Cup
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Find out how much each cup of coffee really costs.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                Calculate
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — LAST */}
      <section className="border-t border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Frequently asked questions
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Coffee caffeine questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much caffeine is in a cup of coffee?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                It varies considerably depending on the coffee and
                serving size. A typical 250 ml serving of brewed coffee
                can contain roughly 100 mg of caffeine, but the actual
                amount can be higher or lower.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Does espresso have more caffeine than brewed coffee?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Espresso has a much higher caffeine concentration per
                milliliter, but a typical espresso serving is much
                smaller than a mug of brewed coffee. Total caffeine
                therefore depends on serving size as well as
                concentration.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Does roast level affect caffeine?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Roast level can affect the measured caffeine amount,
                but differences are generally smaller than the effects
                of coffee quantity, brewing method and serving size.
                The amount of coffee used is particularly important
                when comparing brews.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How accurate is a coffee caffeine calculator?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A caffeine calculator provides an estimate. Actual
                caffeine levels vary with bean variety, coffee amount,
                grind size, extraction, brewing method and other
                preparation factors.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Is decaf coffee completely caffeine free?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                No. Decaffeinated coffee normally still contains a
                small amount of caffeine. The exact amount depends on
                the product and preparation method.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}