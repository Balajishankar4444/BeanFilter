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
    name: 'Ready to Drink',
    ratio: 10,
    description: 'Balanced cold brew',
  },
  {
    name: 'Strong',
    ratio: 8,
    description: 'More concentrated',
  },
  {
    name: 'Concentrate',
    ratio: 5,
    description: 'Dilute before drinking',
  },
];

export default function ColdBrewCalculatorPage() {
  const [water, setWater] = useState('1000');
  const [ratio, setRatio] = useState('10');
  const [coffee, setCoffee] = useState('100');

  const result = useMemo(() => {
    const waterAmount = Number(water) || 0;
    const coffeeAmount = Number(coffee) || 0;

    if (waterAmount <= 0 || coffeeAmount <= 0) {
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
  }, [water, coffee]);

  const updateRatio = (newRatio: number) => {
    const currentWater = Number(water) || 0;

    setRatio(String(newRatio));

    if (currentWater > 0) {
      setCoffee(
        (currentWater / newRatio).toFixed(1)
      );
    }
  };

  const updateCoffee = (value: string) => {
    setCoffee(value);

    const coffeeAmount = Number(value) || 0;
    const waterAmount = Number(water) || 0;

    if (coffeeAmount > 0 && waterAmount > 0) {
      setRatio(
        (waterAmount / coffeeAmount).toFixed(1)
      );
    }
  };

  const updateWater = (value: string) => {
    setWater(value);

    const waterAmount = Number(value) || 0;
    const coffeeAmount = Number(coffee) || 0;

    if (waterAmount > 0 && coffeeAmount > 0) {
      setRatio(
        (waterAmount / coffeeAmount).toFixed(1)
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
              Cold Brew Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Calculate how much coffee and water you need to make
              cold brew. Choose a ready-to-drink recipe, strong brew,
              or concentrate and scale your batch instantly.
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
                  Build your cold brew
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Choose your batch
                </h2>
              </div>

              {/* WATER */}
              <div>
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
                    step="50"
                    value={water}
                    onChange={(e) =>
                      updateWater(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    ml
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  Enter the amount of water you want to use.
                </p>
              </div>

              {/* RATIO */}
              <div className="mt-6">
                <label
                  htmlFor="ratio"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Cold brew ratio
                </label>

                <div className="relative">
                  <Coffee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="ratio"
                    type="number"
                    min="1"
                    step="0.5"
                    value={ratio}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRatio(value);

                      const newRatio = Number(value);
                      const waterAmount = Number(water);

                      if (
                        newRatio > 0 &&
                        waterAmount > 0
                      ) {
                        setCoffee(
                          (
                            waterAmount / newRatio
                          ).toFixed(1)
                        );
                      }
                    }}
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-20 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    1 : X
                  </span>
                </div>
              </div>

              {/* COFFEE */}
              <div className="mt-6">
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
                    step="1"
                    value={coffee}
                    onChange={(e) =>
                      updateCoffee(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    g
                  </span>
                </div>
              </div>

              {/* PRESETS */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Cold brew presets
                </p>

                <div className="grid gap-2 sm:grid-cols-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        updateRatio(preset.ratio)
                      }
                      className="rounded-xl border border-stone-300 bg-[#F3EBDD] px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-stone-500"
                    >
                      <span className="block text-sm font-medium text-stone-900">
                        {preset.name}
                      </span>

                      <span className="mt-1 block text-xs font-medium text-stone-600">
                        1:{preset.ratio}
                      </span>

                      <span className="mt-1 block text-[11px] text-stone-500">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RESULT */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Your cold brew recipe
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Cold brew batch
              </h2>

              {/* RATIO */}
              <div className="mt-8 rounded-2xl bg-stone-800 p-6 text-center">
                <p className="text-sm text-stone-400">
                  Coffee-to-water ratio
                </p>

                <p className="mt-3 text-6xl font-semibold tracking-tight">
                  1:
                  {result.ratio
                    ? result.ratio.toFixed(1)
                    : '—'}
                </p>
              </div>

              {/* VALUES */}
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

              {/* SIMPLE RECIPE */}
              <div className="mt-8 border-t border-stone-700 pt-6">
                <p className="text-sm font-medium text-stone-300">
                  Simple recipe
                </p>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Combine {result.coffee
                    ? result.coffee.toFixed(1)
                    : '0'}{' '}
                  g of coarsely ground coffee with{' '}
                  {result.water
                    ? result.water.toFixed(0)
                    : '0'}{' '}
                  ml of water. Steep, then filter before serving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS COLD BREW */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Cold brew fundamentals
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            How does a cold brew ratio work?
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              A cold brew ratio tells you how much water to use for
              every gram of coffee. For example, a 1:10 ratio means
              using 1 gram of coffee for every 10 grams or milliliters
              of water.
            </p>

            <p>
              Cold brew recipes can vary significantly depending on
              whether you want a ready-to-drink coffee or a stronger
              concentrate that will be diluted with water or milk.
            </p>

            <p>
              The calculator lets you scale your recipe while keeping
              the same ratio, making it easier to prepare a small glass
              or a larger batch without doing the calculations yourself.
            </p>
          </div>
        </div>
      </section>

      {/* COLD BREW RATIO GUIDE */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Ratio guide
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Common cold brew ratios
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-300">
            <div className="grid grid-cols-[0.8fr_1fr_1.5fr] bg-stone-900 px-5 py-4 text-sm font-medium text-[#E8DCC8]">
              <span>Ratio</span>
              <span className="text-center">1 litre water</span>
              <span className="text-right">Use</span>
            </div>

            {[
              {
                ratio: '1:5',
                coffee: '200 g',
                use: 'Strong concentrate',
              },
              {
                ratio: '1:8',
                coffee: '125 g',
                use: 'Concentrated',
              },
              {
                ratio: '1:10',
                coffee: '100 g',
                use: 'Ready to drink',
              },
              {
                ratio: '1:12',
                coffee: '83 g',
                use: 'Lighter cold brew',
              },
              {
                ratio: '1:15',
                coffee: '67 g',
                use: 'Very light',
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
                  {row.coffee}
                </span>

                <span className="text-right text-sm text-stone-600">
                  {row.use}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-stone-500">
            These are starting points. Cold brew strength depends on
            factors including coffee, grind size, steeping time and
            whether the finished brew is diluted.
          </p>
        </div>
      </section>

      {/* CONCENTRATE VS READY TO DRINK */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Choose your style
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Cold brew concentrate vs ready-to-drink
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6">
              <h3 className="text-xl font-semibold text-stone-900">
                Concentrate
              </h3>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                A stronger brew that can be diluted with water, milk
                or ice when you are ready to serve it.
              </p>

              <div className="mt-5 border-t border-stone-300 pt-5">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">
                  Example
                </p>

                <p className="mt-2 text-lg font-semibold text-stone-900">
                  1:5 – 1:8
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6">
              <h3 className="text-xl font-semibold text-stone-900">
                Ready to drink
              </h3>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                Brewed at a higher water ratio so the coffee can be
                served directly after filtering.
              </p>

              <div className="mt-5 border-t border-stone-300 pt-5">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">
                  Example
                </p>

                <p className="mt-2 text-lg font-semibold text-stone-900">
                  1:9 – 1:12
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BATCH SIZE */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Scale your batch
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Example cold brew batches
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                size: '500 ml',
                coffee: '50 g',
                ratio: '1:10',
              },
              {
                size: '1 litre',
                coffee: '100 g',
                ratio: '1:10',
              },
              {
                size: '2 litres',
                coffee: '200 g',
                ratio: '1:10',
              },
            ].map((batch) => (
              <div
                key={batch.size}
                className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  {batch.ratio}
                </p>

                <p className="mt-4 text-2xl font-semibold text-stone-900">
                  {batch.size}
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  {batch.coffee} coffee
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base leading-8 text-stone-600">
            Keeping the same ratio makes it easy to scale your cold brew.
            If you double the water, double the coffee as well.
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

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              href="/coffee-calculators/coffee-ratio-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Scale size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Ratio
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate coffee-to-water ratios for your brew.
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
              href="/coffee-calculators/coffee-per-cup-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Per Cup
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Find how much coffee you need for each cup.
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
                Work out the cost of each cup or batch.
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
            Cold brew questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is the best ratio for cold brew?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                There is no single best ratio. Around 1:10 is a useful
                starting point for ready-to-drink cold brew, while
                stronger ratios such as 1:5 to 1:8 can be used for
                concentrate that will be diluted.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much coffee do I need for 1 litre of cold brew?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                At a 1:10 ratio, you would use about 100 grams of coffee
                for 1 litre of water. You can increase or decrease the
                coffee amount depending on the strength you want.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What ratio should I use for cold brew concentrate?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Stronger ratios such as 1:5 to 1:8 are commonly used as
                starting points for concentrate. The finished concentrate
                can then be diluted to your preferred drinking strength.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Is cold brew stronger than regular coffee?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                It depends on the recipe and serving size. Cold brew
                concentrate can be very strong, but a ready-to-drink
                cold brew does not automatically contain more caffeine
                than every hot-brewed coffee.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How long should cold brew steep?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Many cold brew recipes use a long steep at room
                temperature or in the refrigerator. The ideal time
                depends on grind size, coffee, temperature and recipe,
                so taste is a useful guide when dialing in your batch.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}