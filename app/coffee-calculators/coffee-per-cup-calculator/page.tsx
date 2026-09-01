'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Coffee,
  Droplets,
  Scale,
  Calculator,
} from 'lucide-react';

export default function CoffeePerCupCalculatorPage() {
  const [cups, setCups] = useState('2');
  const [coffeePerCup, setCoffeePerCup] = useState('15');
  const [waterPerCup, setWaterPerCup] = useState('250');
  const [ratio, setRatio] = useState('16.7');

  const result = useMemo(() => {
    const numberOfCups = Number(cups) || 0;
    const gramsPerCup = Number(coffeePerCup) || 0;
    const mlPerCup = Number(waterPerCup) || 0;

    const totalCoffee = numberOfCups * gramsPerCup;
    const totalWater = numberOfCups * mlPerCup;

    const calculatedRatio =
      totalCoffee > 0
        ? totalWater / totalCoffee
        : 0;

    return {
      totalCoffee,
      totalWater,
      calculatedRatio,
      numberOfCups,
    };
  }, [cups, coffeePerCup, waterPerCup]);

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
              <Calculator size={14} />
              Coffee Calculator
            </div>

            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-stone-950 sm:text-6xl">
              Coffee Per Cup Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Calculate how much coffee and water you need for one cup
              or a larger batch. Enter your cups and recipe to get the
              total amounts instantly.
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
                  Build your brew
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Enter your measurements
                </h2>
              </div>

              {/* CUPS */}
              <div>
                <label
                  htmlFor="cups"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Number of cups
                </label>

                <div className="relative">
                  <Coffee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="cups"
                    type="number"
                    min="1"
                    step="1"
                    value={cups}
                    onChange={(e) =>
                      setCups(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-20 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    cups
                  </span>
                </div>
              </div>

              {/* COFFEE PER CUP */}
              <div className="mt-6">
                <label
                  htmlFor="coffeePerCup"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Coffee per cup
                </label>

                <div className="relative">
                  <Scale
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="coffeePerCup"
                    type="number"
                    min="1"
                    step="0.5"
                    value={coffeePerCup}
                    onChange={(e) =>
                      setCoffeePerCup(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    g
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  15 g is a useful starting point for a typical cup.
                </p>
              </div>

              {/* WATER PER CUP */}
              <div className="mt-6">
                <label
                  htmlFor="waterPerCup"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Water per cup
                </label>

                <div className="relative">
                  <Droplets
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="waterPerCup"
                    type="number"
                    min="1"
                    step="5"
                    value={waterPerCup}
                    onChange={(e) =>
                      setWaterPerCup(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    ml
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  Adjust this according to your preferred coffee-to-water
                  ratio.
                </p>
              </div>

              {/* QUICK RATIOS */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Quick ratio presets
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Strong', value: '15' },
                    { label: 'Balanced', value: '16.7' },
                    { label: 'Light', value: '18' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        setRatio(preset.value);
                        setCoffeePerCup(
                          (
                            Number(waterPerCup) /
                            Number(preset.value)
                          ).toFixed(1)
                        );
                      }}
                      className="rounded-xl border border-stone-300 bg-[#F3EBDD] px-3 py-3 text-sm transition hover:border-stone-500"
                    >
                      <span className="block font-medium text-stone-900">
                        {preset.label}
                      </span>

                      <span className="mt-1 block text-xs text-stone-500">
                        1:{preset.value}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RESULT */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Your coffee recipe
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                For {result.numberOfCups || 0}{' '}
                {result.numberOfCups === 1 ? 'cup' : 'cups'}
              </h2>

              {/* COFFEE */}
              <div className="mt-8 rounded-2xl bg-stone-800 p-6">
                <div className="flex items-center gap-2 text-sm text-stone-400">
                  <Scale size={16} />
                  Coffee
                </div>

                <p className="mt-3 text-5xl font-semibold tracking-tight">
                  {result.totalCoffee
                    ? result.totalCoffee.toFixed(1)
                    : '0'}
                  <span className="ml-2 text-lg font-normal text-stone-400">
                    g
                  </span>
                </p>

                <p className="mt-2 text-sm text-stone-500">
                  {coffeePerCup || 0} g per cup
                </p>
              </div>

              {/* WATER */}
              <div className="mt-3 rounded-2xl bg-stone-800 p-6">
                <div className="flex items-center gap-2 text-sm text-stone-400">
                  <Droplets size={16} />
                  Water
                </div>

                <p className="mt-3 text-4xl font-semibold tracking-tight">
                  {result.totalWater
                    ? result.totalWater.toFixed(0)
                    : '0'}
                  <span className="ml-2 text-lg font-normal text-stone-400">
                    ml
                  </span>
                </p>

                <p className="mt-2 text-sm text-stone-500">
                  {waterPerCup || 0} ml per cup
                </p>
              </div>

              {/* RATIO */}
              <div className="mt-8 border-t border-stone-700 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-400">
                    Coffee-to-water ratio
                  </span>

                  <span className="text-xl font-semibold">
                    1:
                    {result.calculatedRatio
                      ? result.calculatedRatio.toFixed(1)
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW MUCH COFFEE DO I NEED */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Coffee measurements
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            How much coffee do you need per cup?
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              The amount of coffee needed for a cup depends on your
              brewing method, serving size and preferred strength.
              Instead of relying on a generic scoop measurement, weighing
              your coffee gives you much more consistent results.
            </p>

            <p>
              A useful starting point is around 15 grams of coffee for
              approximately 250 ml of water. This produces a coffee-to-water
              ratio of roughly 1:16.7.
            </p>

            <p>
              You can make the coffee stronger by using more coffee or
              less water, or make it lighter by using less coffee or more
              water. The ideal ratio ultimately depends on your coffee and
              taste.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK REFERENCE */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Quick reference
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Coffee and water for common serving sizes
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-300">
            <div className="grid grid-cols-3 bg-stone-900 px-5 py-4 text-sm font-medium text-[#E8DCC8]">
              <span>Cups</span>
              <span className="text-center">Coffee</span>
              <span className="text-right">Water</span>
            </div>

            {[
              { cups: 1, coffee: 15, water: 250 },
              { cups: 2, coffee: 30, water: 500 },
              { cups: 3, coffee: 45, water: 750 },
              { cups: 4, coffee: 60, water: 1000 },
              { cups: 6, coffee: 90, water: 1500 },
              { cups: 8, coffee: 120, water: 2000 },
            ].map((row, index) => (
              <div
                key={row.cups}
                className={`grid grid-cols-3 px-5 py-4 ${
                  index % 2 === 0
                    ? 'bg-[#E8DCC8]'
                    : 'bg-[#F7F2E8]'
                }`}
              >
                <span className="text-sm font-medium text-stone-900">
                  {row.cups}
                </span>

                <span className="text-center text-sm text-stone-700">
                  {row.coffee} g
                </span>

                <span className="text-right text-sm text-stone-700">
                  {row.water} ml
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-stone-500">
            Reference values use 15 g of coffee and 250 ml of water per
            cup. Adjust them to match your preferred recipe and brewing
            method.
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
              <Scale size={20} />

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
              <Calculator size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Cost Per Cup
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate what each cup of coffee costs.
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
            Coffee per cup questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How many grams of coffee do I need for one cup?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Around 15 grams of coffee for approximately 250 ml of
                water is a useful starting point. You can adjust the
                amount depending on your preferred strength and brewing
                method.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much coffee do I need for 2 cups?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Using a starting point of 15 grams per cup, you would
                need about 30 grams of coffee for 2 cups and around
                500 ml of water.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much coffee do I need for 4 cups?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Using 15 grams of coffee and 250 ml of water per cup,
                4 cups would require approximately 60 grams of coffee
                and 1,000 ml of water.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is a good coffee-to-water ratio?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A ratio around 1:16 to 1:17 is a useful starting point
                for many brewed coffees. You can adjust the ratio to
                make your coffee stronger or lighter.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Should I measure coffee by grams or tablespoons?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Grams are more consistent because coffee density varies.
                A tablespoon can contain different amounts depending on
                the bean size, grind and how tightly it is packed.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}