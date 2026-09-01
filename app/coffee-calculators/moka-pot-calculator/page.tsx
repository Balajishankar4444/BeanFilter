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
    name: '1 Cup',
    coffee: 15,
    water: 250,
    description: 'Single serving',
  },
  {
    name: '2 Cups',
    coffee: 30,
    water: 500,
    description: 'Two servings',
  },
  {
    name: '4 Cups',
    coffee: 60,
    water: 1000,
    description: 'Larger batch',
  },
];

export default function PourOverCalculatorPage() {
  const [coffee, setCoffee] = useState('15');
  const [water, setWater] = useState('250');
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
      cups: waterAmount / 250,
    };
  }, [coffee, water]);

  const updateCoffee = (value: string) => {
    setCoffee(value);

    const coffeeAmount = Number(value) || 0;

    if (coffeeAmount > 0) {
      setWater(
        (coffeeAmount * Number(ratio || 16.7)).toFixed(0)
      );
    }
  };

  const updateWater = (value: string) => {
    setWater(value);

    const waterAmount = Number(value) || 0;

    if (waterAmount > 0) {
      setCoffee(
        (
          waterAmount / Number(ratio || 16.7)
        ).toFixed(1)
      );
    }
  };

  const updateRatio = (value: string) => {
    setRatio(value);

    const ratioAmount = Number(value) || 0;
    const coffeeAmount = Number(coffee) || 0;

    if (ratioAmount > 0 && coffeeAmount > 0) {
      setWater(
        (coffeeAmount * ratioAmount).toFixed(0)
      );
    }
  };

  const applyPreset = (
    presetCoffee: number,
    presetWater: number
  ) => {
    setCoffee(String(presetCoffee));
    setWater(String(presetWater));
    setRatio(
      (presetWater / presetCoffee).toFixed(1)
    );
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
              Pour Over Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Calculate the coffee and water you need for a pour-over
              brew. Choose your coffee dose or water amount, adjust the
              brew ratio, and build a recipe that scales easily.
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
                  Pour-over measurements
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
                  Weight of ground coffee.
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
                    onChange={(e) =>
                      updateRatio(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-20 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    1 : X
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  A ratio around 1:15–1:17 is a useful starting range.
                </p>
              </div>

              {/* PRESETS */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Quick recipes
                </p>

                <div className="grid gap-2 sm:grid-cols-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        applyPreset(
                          preset.coffee,
                          preset.water
                        )
                      }
                      className="rounded-xl border border-stone-300 bg-[#F3EBDD] px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-stone-500"
                    >
                      <span className="block text-sm font-medium text-stone-900">
                        {preset.name}
                      </span>

                      <span className="mt-1 block text-xs font-medium text-stone-600">
                        {preset.coffee} g / {preset.water} ml
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
                  Pour-over recipes are highly adjustable. Use the ratio
                  as your starting point, then fine-tune grind size,
                  pouring technique and brew time to suit the coffee.
                </p>
              </div>
            </div>

            {/* RESULT CARD */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Your pour-over recipe
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
                  Approximate servings
                </div>

                <p className="mt-3 text-3xl font-semibold">
                  {result.cups
                    ? result.cups.toFixed(1)
                    : '0'}
                  <span className="ml-1 text-base font-normal text-stone-400">
                    × 250 ml
                  </span>
                </p>
              </div>

              {/* RECIPE SUMMARY */}
              <div className="mt-8 border-t border-stone-700 pt-6">
                <p className="text-sm font-medium text-stone-300">
                  Simple recipe
                </p>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Use{' '}
                  {result.coffee
                    ? result.coffee.toFixed(1)
                    : '15'}{' '}
                  g of coffee with{' '}
                  {result.water
                    ? result.water.toFixed(0)
                    : '250'}{' '}
                  ml of water at a{' '}
                  {result.ratio
                    ? `1:${result.ratio.toFixed(1)}`
                    : '1:16.7'}{' '}
                  ratio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS POUR OVER */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Pour-over fundamentals
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            How does a pour-over ratio work?
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              A pour-over coffee ratio tells you how much water to use
              relative to the amount of coffee. For example, a 1:16 ratio
              means 1 gram of coffee for approximately 16 grams or
              milliliters of water.
            </p>

            <p>
              Because pour-over coffee is brewed by passing water through
              a bed of coffee grounds, grind size, pouring technique,
              water temperature and brew time all influence extraction.
            </p>

            <p>
              The ratio gives you a consistent foundation. Once you have
              a recipe you enjoy, you can scale it up or down while
              maintaining the same ratio.
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
            Common pour-over ratios
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-300">
            <div className="grid grid-cols-[0.8fr_1fr_1.5fr] bg-stone-900 px-5 py-4 text-sm font-medium text-[#E8DCC8]">
              <span>Ratio</span>
              <span className="text-center">15 g coffee</span>
              <span className="text-right">Style</span>
            </div>

            {[
              {
                ratio: '1:15',
                water: '225 ml',
                style: 'Stronger',
              },
              {
                ratio: '1:16',
                water: '240 ml',
                style: 'Balanced',
              },
              {
                ratio: '1:16.7',
                water: '250 ml',
                style: 'Common starting point',
              },
              {
                ratio: '1:17',
                water: '255 ml',
                style: 'Lighter',
              },
              {
                ratio: '1:18',
                water: '270 ml',
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
            These are starting points rather than fixed rules. Coffee
            density, roast level, grinder, water and brewing technique
            can all change the result.
          </p>
        </div>
      </section>

      {/* SCALING GUIDE */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Scale your recipe
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Pour-over recipes at 1:16.7
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                serving: '1 cup',
                coffee: '15 g',
                water: '250 ml',
              },
              {
                serving: '2 cups',
                coffee: '30 g',
                water: '500 ml',
              },
              {
                serving: '4 cups',
                coffee: '60 g',
                water: '1,000 ml',
              },
            ].map((recipe) => (
              <div
                key={recipe.serving}
                className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  {recipe.serving}
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
            Scaling is simple: multiply the coffee dose and water by the
            same amount. This keeps your brew ratio consistent while
            changing the batch size.
          </p>
        </div>
      </section>

      {/* BREWING BASICS */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Brewing basics
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            How to dial in a pour-over
          </h2>

          <div className="mt-8 grid gap-4">
            {[
              {
                number: '01',
                title: 'Start with the ratio',
                text: 'Choose a consistent coffee-to-water ratio so you have a reliable recipe to work from.',
              },
              {
                number: '02',
                title: 'Adjust grind size',
                text: 'If the coffee tastes under-extracted or sour, a finer grind may help. If it tastes overly bitter or dry, a coarser grind may help.',
              },
              {
                number: '03',
                title: 'Keep your pouring consistent',
                text: 'Use a controlled pouring technique and try to maintain a repeatable brew process.',
              },
              {
                number: '04',
                title: 'Taste and adjust',
                text: 'Use taste as the final guide. Small changes to grind, ratio or technique can significantly affect the cup.',
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
              href="/coffee-calculators/french-press-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Droplets size={20} />

              <h3 className="mt-4 font-semibold">
                French Press
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate coffee and water for French press brewing.
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
              href="/coffee-calculators/espresso-ratio-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                Espresso Ratio
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate espresso dose, yield and brew ratio.
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
            Pour-over questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is the best coffee-to-water ratio for pour over?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A ratio around 1:15 to 1:17 is a useful starting range
                for pour-over coffee. Around 1:16 or 1:16.7 provides a
                practical starting point for many recipes.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much coffee do I need for 250 ml of water?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                At a 1:16.7 ratio, 250 ml of water requires approximately
                15 grams of coffee.
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
                At a 1:16.7 ratio, 500 ml of water requires approximately
                30 grams of coffee.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What grind size should I use for pour-over coffee?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A medium to medium-fine grind is a common starting point,
                but the ideal setting depends on the brewer, grinder,
                coffee and brew method. Adjust the grind based on taste
                and brew behavior.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Can I use this calculator for a V60?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Yes. The calculator provides the coffee dose, water
                amount and ratio, which can be used as a starting recipe
                for V60 and other pour-over brewers.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}