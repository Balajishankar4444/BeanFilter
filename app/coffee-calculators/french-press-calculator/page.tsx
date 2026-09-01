'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  Coffee,
  Droplets,
  Scale,
} from 'lucide-react';

const presets = [
  {
    name: 'Strong',
    ratio: 15,
    description: 'Fuller & stronger',
  },
  {
    name: 'Balanced',
    ratio: 16.7,
    description: 'Everyday starting point',
  },
  {
    name: 'Light',
    ratio: 18,
    description: 'Lighter & softer',
  },
];

export default function FrenchPressCalculatorPage() {
  const [coffee, setCoffee] = useState('30');
  const [water, setWater] = useState('500');
  const [ratio, setRatio] = useState('16.7');

  const result = useMemo(() => {
    const coffeeAmount = Number(coffee) || 0;
    const waterAmount = Number(water) || 0;

    if (coffeeAmount <= 0 || waterAmount <= 0) {
      return {
        ratio: 0,
        coffee: 0,
        water: 0,
        cups: 0,
      };
    }

    return {
      ratio: waterAmount / coffeeAmount,
      coffee: coffeeAmount,
      water: waterAmount,
      cups: waterAmount / 240,
    };
  }, [coffee, water]);

  const updateFromRatio = (newRatio: number) => {
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
              French Press Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Calculate how much coffee and water you need for your
              French press. Adjust your brew ratio and scale your recipe
              for one cup or a full pot.
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
                  Build your brew
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  French press measurements
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
                      updateCoffee(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    g
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  Amount of coarsely ground coffee.
                </p>
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
                    step="10"
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
                  Total brewing water.
                </p>
              </div>

              {/* RATIO */}
              <div className="mt-6">
                <label
                  htmlFor="ratio"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Coffee-to-water ratio
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
                    step="0.1"
                    value={ratio}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRatio(value);

                      const ratioValue = Number(value);
                      const waterAmount = Number(water);

                      if (
                        ratioValue > 0 &&
                        waterAmount > 0
                      ) {
                        setCoffee(
                          (
                            waterAmount / ratioValue
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
                        updateFromRatio(preset.ratio)
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

              {/* TIP */}
              <div className="mt-8 rounded-2xl border border-stone-300/80 bg-[#F3EBDD] p-5">
                <p className="text-sm leading-6 text-stone-600">
                  For French press, a coarse grind and a full immersion
                  brew are common starting points. Adjust the recipe
                  according to your coffee and taste.
                </p>
              </div>
            </div>

            {/* RESULT CARD */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Your French press recipe
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Brew recipe
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

              {/* CUPS */}
              <div className="mt-3 rounded-2xl bg-stone-800 p-5">
                <div className="flex items-center gap-2 text-sm text-stone-400">
                  <Coffee size={16} />
                  Approximate cups
                </div>

                <p className="mt-3 text-3xl font-semibold">
                  {result.cups
                    ? result.cups.toFixed(1)
                    : '0'}
                  <span className="ml-1 text-base font-normal text-stone-400">
                    × 240 ml
                  </span>
                </p>
              </div>

              <div className="mt-8 border-t border-stone-700 pt-6">
                <p className="text-sm font-medium text-stone-300">
                  Simple recipe
                </p>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Use{' '}
                  {result.coffee
                    ? result.coffee.toFixed(1)
                    : '30'}{' '}
                  g of coffee with{' '}
                  {result.water
                    ? result.water.toFixed(0)
                    : '500'}{' '}
                  ml of water. Steep, then slowly press the plunger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS FRENCH PRESS */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            French press fundamentals
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            How does a French press ratio work?
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              A French press coffee ratio describes how much water is
              used for each gram of coffee. For example, a 1:16 ratio
              means 1 gram of coffee for approximately 16 grams or
              milliliters of water.
            </p>

            <p>
              French press brewing is a full-immersion method, meaning
              the coffee grounds remain in contact with the brewing water
              throughout most of the brewing process.
            </p>

            <p>
              Your ratio is a useful starting point, but grind size,
              steeping time, water temperature and the coffee itself also
              influence the final cup.
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
            Common French press ratios
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-300">
            <div className="grid grid-cols-[0.8fr_1fr_1.5fr] bg-stone-900 px-5 py-4 text-sm font-medium text-[#E8DCC8]">
              <span>Ratio</span>
              <span className="text-center">30 g coffee</span>
              <span className="text-right">Style</span>
            </div>

            {[
              {
                ratio: '1:14',
                water: '420 ml',
                style: 'Stronger',
              },
              {
                ratio: '1:15',
                water: '450 ml',
                style: 'Fuller',
              },
              {
                ratio: '1:16',
                water: '480 ml',
                style: 'Balanced',
              },
              {
                ratio: '1:17',
                water: '510 ml',
                style: 'Lighter',
              },
              {
                ratio: '1:18',
                water: '540 ml',
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
            These ratios are starting points, not strict rules. Adjust
            the recipe based on your coffee and preferred strength.
          </p>
        </div>
      </section>

      {/* BATCH SIZE */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Batch sizes
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            French press recipes at 1:16
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                size: '250 ml',
                coffee: '15.6 g',
              },
              {
                size: '500 ml',
                coffee: '31.3 g',
              },
              {
                size: '1 litre',
                coffee: '62.5 g',
              },
            ].map((batch) => (
              <div
                key={batch.size}
                className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  1:16 ratio
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
            Choose a ratio you enjoy, then scale both the coffee and
            water together when making a larger or smaller batch.
          </p>
        </div>
      </section>

      {/* BREWING GUIDE */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Brewing basics
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            A simple French press starting point
          </h2>

          <div className="mt-8 grid gap-4">
            {[
              {
                number: '01',
                title: 'Measure your coffee',
                text: 'Weigh your coffee so you can consistently reproduce the recipe.',
              },
              {
                number: '02',
                title: 'Use a coarse grind',
                text: 'A coarse grind is a common starting point for French press brewing.',
              },
              {
                number: '03',
                title: 'Add your water',
                text: 'Pour the calculated amount of brewing water over the coffee grounds.',
              },
              {
                number: '04',
                title: 'Steep and press',
                text: 'Allow the coffee to brew before slowly pressing the plunger and serving.',
              },
            ].map((step) => (
              <div
                key={step.number}
                className="flex gap-5 rounded-2xl border border-stone-300 bg-[#E8DCC8] p-5 sm:p-6"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-[#E8DCC8]">
                  {step.number}
                </span>

                <div>
                  <h3 className="font-semibold text-stone-900">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
              href="/coffee-calculators/cold-brew-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                Cold Brew
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate coffee and water for cold brew batches.
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
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Calculator size={20} />

              <h3 className="mt-4 font-semibold">
                AeroPress
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Build an AeroPress recipe from your desired coffee
                amount.
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
            French press questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is the best coffee-to-water ratio for French press?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A ratio around 1:15 to 1:17 is a useful starting range
                for many French press recipes. Around 1:16 is a convenient
                starting point, after which you can adjust the strength
                to your preference.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much coffee do I need for 500 ml of water?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                At a 1:16 ratio, 500 ml of water requires approximately
                31 grams of coffee. You can use slightly more or less
                coffee depending on how strong you prefer your brew.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much coffee do I need for 1 litre of French press?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                At a 1:16 ratio, 1 litre of water requires approximately
                62.5 grams of coffee.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What grind size should I use for French press?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A coarse grind is a common starting point for French
                press. If the coffee tastes overly bitter or harsh,
                grind size and brewing time can be adjusted as part of
                dialing in the recipe.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Does French press coffee need a different ratio?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                French press uses full immersion, so its recipe can
                differ from pour-over or espresso. A ratio around 1:15
                to 1:17 is a useful starting range, but personal taste
                and brewing variables matter.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}