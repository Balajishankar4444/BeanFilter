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

const presets = [
  {
    name: 'Strong',
    ratio: 15,
    description: 'More concentrated',
  },
  {
    name: 'Balanced',
    ratio: 16.7,
    description: 'Everyday starting point',
  },
  {
    name: 'Light',
    ratio: 18,
    description: 'More diluted',
  },
];

export default function CoffeeRatioCalculatorPage() {
  const [coffee, setCoffee] = useState('20');
  const [water, setWater] = useState('335');
  const [ratio, setRatio] = useState('16.7');

  const result = useMemo(() => {
    const coffeeAmount = Number(coffee) || 0;
    const waterAmount = Number(water) || 0;

    if (coffeeAmount <= 0 || waterAmount <= 0) {
      return {
        ratio: 0,
        coffee: 0,
        water: 0,
      };
    }

    return {
      ratio: waterAmount / coffeeAmount,
      coffee: coffeeAmount,
      water: waterAmount,
    };
  }, [coffee, water]);

  const applyPreset = (presetRatio: number) => {
    const currentWater = Number(water) || 0;

    if (currentWater > 0) {
      setRatio(String(presetRatio));
      setCoffee(
        (currentWater / presetRatio).toFixed(1)
      );
    }
  };

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
              Coffee Ratio Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Calculate your coffee-to-water ratio and find out exactly
              how much coffee or water you need for your brew.
            </p>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-[#F3EBDD]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            {/* INPUT CARD */}
            <div className="rounded-3xl border border-stone-300 bg-[#E8DCC8] p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Build your recipe
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Coffee and water
                </h2>
              </div>

              {/* COFFEE */}
              <div>
                <label
                  htmlFor="coffee"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Coffee
                </label>

                <div className="relative">
                  <Scale
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="coffee"
                    type="number"
                    min="0"
                    step="0.5"
                    value={coffee}
                    onChange={(e) =>
                      setCoffee(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    g
                  </span>
                </div>
              </div>

              {/* WATER */}
              <div className="mt-6">
                <label
                  htmlFor="water"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Water
                </label>

                <div className="relative">
                  <Droplets
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="water"
                    type="number"
                    min="0"
                    step="1"
                    value={water}
                    onChange={(e) =>
                      setWater(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    ml
                  </span>
                </div>
              </div>

              {/* PRESETS */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Ratio presets
                </p>

                <div className="grid gap-2 sm:grid-cols-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        applyPreset(preset.ratio)
                      }
                      className="rounded-xl border border-stone-300 bg-[#F3EBDD] px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-stone-500"
                    >
                      <span className="block text-sm font-medium text-stone-900">
                        {preset.name}
                      </span>

                      <span className="mt-1 block text-xs text-stone-500">
                        1:{preset.ratio}
                      </span>

                      <span className="mt-1 block text-[11px] text-stone-500">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* EXPLANATION */}
              <div className="mt-8 rounded-2xl border border-stone-300/80 bg-[#F3EBDD] p-5">
                <p className="text-sm leading-6 text-stone-600">
                  The ratio is calculated by dividing the amount of
                  water by the amount of coffee. For example, 20 g of
                  coffee and 300 ml of water gives a 1:15 ratio.
                </p>
              </div>
            </div>

            {/* RESULT CARD */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Your coffee ratio
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Coffee to water
              </h2>

              <div className="mt-8 rounded-2xl bg-stone-800 p-6 text-center">
                <p className="text-sm text-stone-400">
                  Current ratio
                </p>

                <p className="mt-3 text-6xl font-semibold tracking-tight">
                  1:
                  {result.ratio
                    ? result.ratio.toFixed(1)
                    : '—'}
                </p>

                <p className="mt-3 text-sm text-stone-500">
                  1 gram of coffee for every{' '}
                  {result.ratio
                    ? result.ratio.toFixed(1)
                    : '—'}{' '}
                  ml of water
                </p>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-800 p-5">
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Scale size={16} />
                    Coffee
                  </div>

                  <p className="mt-3 text-3xl font-semibold">
                    {result.coffee
                      ? result.coffee.toFixed(1)
                      : '0'}
                    <span className="ml-1 text-base font-normal text-stone-400">
                      g
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-800 p-5">
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Droplets size={16} />
                    Water
                  </div>

                  <p className="mt-3 text-3xl font-semibold">
                    {result.water
                      ? result.water.toFixed(0)
                      : '0'}
                    <span className="ml-1 text-base font-normal text-stone-400">
                      ml
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-stone-700 pt-6">
                <p className="text-sm leading-6 text-stone-500">
                  Start with a ratio that suits your brewing method,
                  then adjust it according to the coffee and your
                  preferred strength.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS COFFEE RATIO */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Coffee fundamentals
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            What is a coffee-to-water ratio?
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              A coffee-to-water ratio describes how much water is used
              relative to the amount of coffee. It is usually written
              as a ratio such as 1:15 or 1:16.
            </p>

            <p>
              For example, a 1:16 ratio means that for every 1 gram of
              coffee, you use approximately 16 grams or milliliters of
              water. So 20 grams of coffee at a 1:16 ratio requires
              approximately 320 ml of water.
            </p>

            <p>
              The ratio is one of the most useful variables for making
              your brewing recipe repeatable. Once you find a ratio you
              enjoy, you can scale the recipe up or down while keeping
              the same balance.
            </p>
          </div>
        </div>
      </section>

      {/* RATIO GUIDE */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Ratio guide
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Common coffee-to-water ratios
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-300">
            <div className="grid grid-cols-[0.8fr_1fr_1.5fr] bg-stone-900 px-5 py-4 text-sm font-medium text-[#E8DCC8]">
              <span>Ratio</span>
              <span className="text-center">20 g coffee</span>
              <span className="text-right">Style</span>
            </div>

            {[
              {
                ratio: '1:14',
                water: '280 ml',
                style: 'Strong / concentrated',
              },
              {
                ratio: '1:15',
                water: '300 ml',
                style: 'Fuller strength',
              },
              {
                ratio: '1:16',
                water: '320 ml',
                style: 'Balanced',
              },
              {
                ratio: '1:17',
                water: '340 ml',
                style: 'Lighter',
              },
              {
                ratio: '1:18',
                water: '360 ml',
                style: 'More diluted',
              },
            ].map((row, index) => (
              <div
                key={row.ratio}
                className={`grid grid-cols-[0.8fr_1fr_1.5fr] px-5 py-4 ${
                  index % 2 === 0
                    ? 'bg-[#E8DCC8]'
                    : 'bg-[#F7F2E8]'
                }`}
              >
                <span className="text-sm font-semibold text-stone-900">
                  {row.ratio}
                </span>

                <span className="text-center text-sm text-stone-700">
                  {row.water}
                </span>

                <span className="text-right text-sm text-stone-600">
                  {row.style}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-stone-500">
            These ratios are useful starting points rather than fixed
            rules. Different brewing methods and coffees may work better
            with different ratios.
          </p>
        </div>
      </section>

      {/* SCALE YOUR RECIPE */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Scale your recipe
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Keep the same ratio at any size
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                coffee: '15 g',
                water: '240 ml',
                ratio: '1:16',
              },
              {
                coffee: '20 g',
                water: '320 ml',
                ratio: '1:16',
              },
              {
                coffee: '30 g',
                water: '480 ml',
                ratio: '1:16',
              },
            ].map((recipe) => (
              <div
                key={recipe.coffee}
                className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  {recipe.ratio}
                </p>

                <p className="mt-4 text-2xl font-semibold text-stone-900">
                  {recipe.coffee}
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  {recipe.water} water
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base leading-8 text-stone-600">
            Once you choose a ratio, scaling a recipe is simple. Multiply
            both the coffee and water by the same amount to maintain the
            same relationship between them.
          </p>
        </div>
      </section>

      {/* RELATED CALCULATORS */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Keep exploring
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
            Related coffee calculators
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              href="/coffee-calculators/coffee-per-cup-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#E8DCC8] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Per Cup
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate coffee and water for multiple cups.
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
              href="/coffee-calculators/aeropress-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#E8DCC8] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                AeroPress Calculator
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Build an AeroPress recipe with coffee and water.
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
              href="/coffee-calculators/coffee-caffeine-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#E8DCC8] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Caffeine
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Estimate caffeine in your coffee.
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
            Coffee ratio questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is the best coffee-to-water ratio?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                There is no single best ratio for every coffee or brewing
                method. A ratio around 1:16 is a useful starting point
                for many brewed coffees, after which you can adjust the
                recipe to your taste.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much water do I need for 20 g of coffee?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                At a 1:16 ratio, 20 grams of coffee requires about 320
                ml of water. A 1:15 ratio would use 300 ml, while a 1:17
                ratio would use 340 ml.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What does a 1:16 coffee ratio mean?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A 1:16 ratio means using 1 part coffee to 16 parts
                water. For example, 20 grams of coffee would use
                approximately 320 ml of water.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Does a higher ratio make coffee stronger?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Generally, using less water relative to the same amount
                of coffee produces a more concentrated brew. For example,
                1:15 is more concentrated than 1:18 when the coffee amount
                is kept the same.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Can I use the same ratio for every brewing method?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Not necessarily. Different brewing methods have different
                extraction characteristics, so their useful ratio ranges
                can differ. Use the ratio as a starting point and adjust
                it along with grind size, brew time and other variables.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}