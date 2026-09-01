'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Coffee,
  Droplets,
  Scale,
  Timer,
  Thermometer,
} from 'lucide-react';

export default function AeroPressCalculatorPage() {
  const [coffee, setCoffee] = useState('16');
  const [water, setWater] = useState('240');
  const [strength, setStrength] = useState('balanced');

  const result = useMemo(() => {
    const coffeeAmount = Number(coffee) || 0;
    const waterAmount = Number(water) || 0;

    if (coffeeAmount <= 0 || waterAmount <= 0) {
      return {
        ratio: '—',
        recommendedCoffee: 0,
        recommendedWater: 0,
      };
    }

    const ratio = waterAmount / coffeeAmount;

    let targetRatio = 15;

    if (strength === 'strong') targetRatio = 13;
    if (strength === 'light') targetRatio = 17;

    const recommendedCoffee = waterAmount / targetRatio;

    return {
      ratio: `1:${ratio.toFixed(1)}`,
      recommendedCoffee: Math.round(recommendedCoffee * 10) / 10,
      recommendedWater: waterAmount,
    };
  }, [coffee, water, strength]);

  return (
    <main className="min-h-screen bg-[#E8DCC8] text-stone-900 animate-fade-up">
      {/* HERO */}
      <section className="border-b border-stone-300/70">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-14 sm:px-8 lg:px-12 lg:pb-20 lg:pt-20">
          <Link
            href="/coffee-calculators"
            className="mb-8 inline-flex items-center gap-2 text-sm text-stone-600 transition hover:text-stone-950"
          >
            <ArrowRight size={15} className="rotate-180" />
            All Coffee Calculators
          </Link>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-400/70 bg-[#F3EBDD]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-700">
              <Coffee size={14} />
              Brewing Calculator
            </div>

            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-stone-950 sm:text-6xl">
              AeroPress Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Calculate the coffee and water you need for your AeroPress brew,
              then adjust the recipe to match your preferred strength.
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
                  AeroPress brew settings
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
                    min="1"
                    step="0.5"
                    value={coffee}
                    onChange={(e) => setCoffee(e.target.value)}
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
                    min="1"
                    step="5"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    ml
                  </span>
                </div>
              </div>

              {/* STRENGTH */}
              <div className="mt-6">
                <label
                  htmlFor="strength"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Preferred strength
                </label>

                <select
                  id="strength"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-stone-300 bg-[#F7F2E8] px-4 py-3.5 text-stone-900 outline-none transition focus:border-stone-700"
                >
                  <option value="strong">Strong</option>
                  <option value="balanced">Balanced</option>
                  <option value="light">Light</option>
                </select>
              </div>

              <div className="mt-8 rounded-2xl border border-stone-300/80 bg-[#F3EBDD] p-5">
                <p className="text-sm leading-6 text-stone-600">
                  These settings are a starting point. AeroPress brewing is
                  flexible, so you can adjust the ratio, grind, temperature
                  and brew time to suit your coffee and taste.
                </p>
              </div>
            </div>

            {/* RESULT CARD */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Your AeroPress recipe
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Start with these numbers
              </h2>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-800 p-5">
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Scale size={16} />
                    Coffee
                  </div>

                  <p className="mt-3 text-3xl font-semibold">
                    {result.recommendedCoffee || '—'}
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
                    {result.recommendedWater || '—'}
                    <span className="ml-1 text-base font-normal text-stone-400">
                      ml
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-stone-800 p-5">
                <p className="text-sm text-stone-400">Current ratio</p>

                <p className="mt-2 text-4xl font-semibold">
                  {result.ratio}
                </p>
              </div>

              <div className="mt-8 grid gap-4 border-t border-stone-700 pt-6 sm:grid-cols-3">
                <div>
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Thermometer size={15} />
                    Temperature
                  </div>
                  <p className="mt-2 font-medium">80–85°C</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Timer size={15} />
                    Brew time
                  </div>
                  <p className="mt-2 font-medium">~1–2 min</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Coffee size={15} />
                    Grind
                  </div>
                  <p className="mt-2 font-medium">Medium-fine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            How to use the AeroPress calculator
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              Enter the amount of coffee you want to use and the amount of
              water you plan to brew with. The calculator works out the
              resulting coffee-to-water ratio and provides a starting amount
              based on your preferred strength.
            </p>

            <p>
              For a balanced starting point, the calculator uses a ratio of
              about 1:15. Choosing a stronger or lighter brew changes the
              suggested coffee amount while keeping your selected water
              volume.
            </p>

            <p>
              AeroPress recipes are highly adjustable. The manufacturer notes
              that brewing variables such as water temperature, coffee-to-water
              ratio and brew time can all be changed, and there is no single
              recipe that is right for every coffee or every person.
            </p>
          </div>
        </div>
      </section>

      {/* BREWING GUIDE */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            AeroPress basics
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            A good starting point for AeroPress brewing
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6">
              <Scale size={22} className="text-stone-700" />

              <h3 className="mt-5 font-semibold text-stone-900">
                Coffee
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Around 16–18 g is a useful starting point for a single cup.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6">
              <Droplets size={22} className="text-stone-700" />

              <h3 className="mt-5 font-semibold text-stone-900">
                Water
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Start around 240 ml and adjust according to your preferred
                strength and recipe.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6">
              <Thermometer size={22} className="text-stone-700" />

              <h3 className="mt-5 font-semibold text-stone-900">
                Temperature
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Around 80–85°C is a useful starting range, depending on roast
                and taste.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6">
              <Coffee size={22} className="text-stone-700" />

              <h3 className="mt-5 font-semibold text-stone-900">
                Grind
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Medium-fine is a common starting point for AeroPress brewing.
              </p>
            </div>
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

              <h3 className="mt-4 font-semibold">Coffee Ratio Calculator</h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Find your coffee-to-water ratio.
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

              <h3 className="mt-4 font-semibold">Coffee Per Cup</h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate coffee for any number of cups.
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
              <Droplets size={20} />

              <h3 className="mt-4 font-semibold">Cold Brew Calculator</h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate coffee, water and dilution.
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

      {/* FAQ — LAST SECTION */}
      <section className="border-t border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Frequently asked questions
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            AeroPress calculator questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much coffee should I use in an AeroPress?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Around 16–18 grams is a useful starting point for a single
                cup. AeroPress also notes that its scoop measurements vary
                depending on whether the scoop is level or heaped, so weighing
                your coffee gives you greater consistency.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What coffee-to-water ratio should I use for AeroPress?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                There is no single best ratio for every AeroPress recipe. A
                ratio around 1:15 is a useful balanced starting point, after
                which you can adjust the amount of coffee or water to suit
                your taste.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What grind size is best for AeroPress?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Medium-fine is a good starting point. AeroPress describes its
                preferred grind as being between drip and espresso, while
                noting that grind size can be adjusted depending on the recipe
                and brewing behavior.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What temperature should I use for AeroPress?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Around 80–85°C is a useful starting range. AeroPress currently
                suggests approximately 80°C for dark roasts and 85°C for
                medium and light roasts, while encouraging brewers to
                experiment with temperature.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Can I make stronger or lighter coffee with an AeroPress?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Yes. You can change the coffee-to-water ratio, grind size,
                water temperature and brew time to change the character and
                strength of the brew. The best settings depend on the coffee
                and your personal preference.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}