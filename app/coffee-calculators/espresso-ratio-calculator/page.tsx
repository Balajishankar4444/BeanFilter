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
    name: 'Ristretto',
    ratio: 1.5,
    description: 'Short & concentrated',
  },
  {
    name: 'Espresso',
    ratio: 2,
    description: 'Balanced starting point',
  },
  {
    name: 'Lungo',
    ratio: 2.5,
    description: 'Longer & lighter',
  },
];

export default function EspressoRatioCalculatorPage() {
  const [dose, setDose] = useState('18');
  const [yieldAmount, setYieldAmount] = useState('36');
  const [ratio, setRatio] = useState('2');

  const result = useMemo(() => {
    const doseValue = Number(dose) || 0;
    const yieldValue = Number(yieldAmount) || 0;

    if (doseValue <= 0 || yieldValue <= 0) {
      return {
        ratio: 0,
        dose: 0,
        yield: 0,
      };
    }

    return {
      ratio: yieldValue / doseValue,
      dose: doseValue,
      yield: yieldValue,
    };
  }, [dose, yieldAmount]);

  const updateFromRatio = (newRatio: number) => {
    const currentDose = Number(dose) || 0;

    setRatio(String(newRatio));

    if (currentDose > 0) {
      setYieldAmount(
        (currentDose * newRatio).toFixed(1)
      );
    }
  };

  const updateDose = (value: string) => {
    setDose(value);

    const doseValue = Number(value) || 0;
    const currentRatio = Number(ratio) || 0;

    if (doseValue > 0 && currentRatio > 0) {
      setYieldAmount(
        (doseValue * currentRatio).toFixed(1)
      );
    }
  };

  const updateYield = (value: string) => {
    setYieldAmount(value);

    const yieldValue = Number(value) || 0;
    const doseValue = Number(dose) || 0;

    if (yieldValue > 0 && doseValue > 0) {
      setRatio(
        (yieldValue / doseValue).toFixed(2)
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
              Espresso Calculator
            </div>

            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-stone-950 sm:text-6xl">
              Espresso Ratio Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Calculate your espresso brew ratio from the coffee dose
              and shot yield. Find the right yield for ristretto,
              espresso and longer shots.
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
                  Build your shot
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Espresso measurements
                </h2>
              </div>

              {/* DOSE */}
              <div>
                <label
                  htmlFor="dose"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Coffee dose
                </label>

                <div className="relative">
                  <Scale
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="dose"
                    type="number"
                    min="0"
                    step="0.1"
                    value={dose}
                    onChange={(e) =>
                      updateDose(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    g
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  Amount of ground coffee going into the basket.
                </p>
              </div>

              {/* RATIO */}
              <div className="mt-6">
                <label
                  htmlFor="ratio"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Espresso ratio
                </label>

                <div className="relative">
                  <Coffee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="ratio"
                    type="number"
                    min="0.5"
                    step="0.1"
                    value={ratio}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRatio(value);

                      const ratioValue = Number(value);
                      const doseValue = Number(dose);

                      if (
                        ratioValue > 0 &&
                        doseValue > 0
                      ) {
                        setYieldAmount(
                          (
                            doseValue * ratioValue
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

                <p className="mt-2 text-xs text-stone-500">
                  Yield divided by dose.
                </p>
              </div>

              {/* YIELD */}
              <div className="mt-6">
                <label
                  htmlFor="yield"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Shot yield
                </label>

                <div className="relative">
                  <Droplets
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="yield"
                    type="number"
                    min="0"
                    step="0.5"
                    value={yieldAmount}
                    onChange={(e) =>
                      updateYield(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    g
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  The weight of espresso in the cup.
                </p>
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
            </div>

            {/* RESULT CARD */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Your espresso recipe
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Shot ratio
              </h2>

              <div className="mt-8 rounded-2xl bg-stone-800 p-6 text-center">
                <p className="text-sm text-stone-400">
                  Espresso ratio
                </p>

                <p className="mt-3 text-6xl font-semibold tracking-tight">
                  1:
                  {result.ratio
                    ? result.ratio.toFixed(2)
                    : '—'}
                </p>

                <p className="mt-3 text-sm text-stone-500">
                  For every 1 g of coffee, you get approximately{' '}
                  {result.ratio
                    ? result.ratio.toFixed(2)
                    : '—'}{' '}
                  g of espresso.
                </p>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-800 p-5">
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Scale size={16} />
                    Dose
                  </div>

                  <p className="mt-3 text-3xl font-semibold">
                    {result.dose
                      ? result.dose.toFixed(1)
                      : '0'}
                    <span className="ml-1 text-base font-normal text-stone-400">
                      g
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-800 p-5">
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Droplets size={16} />
                    Yield
                  </div>

                  <p className="mt-3 text-3xl font-semibold">
                    {result.yield
                      ? result.yield.toFixed(1)
                      : '0'}
                    <span className="ml-1 text-base font-normal text-stone-400">
                      g
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-stone-700 pt-6">
                <p className="text-sm font-medium text-stone-300">
                  Example
                </p>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  A {result.dose
                    ? result.dose.toFixed(1)
                    : '18'}{' '}
                  g dose at a 1:
                  {result.ratio
                    ? result.ratio.toFixed(1)
                    : '2'}{' '}
                  ratio produces approximately{' '}
                  {result.yield
                    ? result.yield.toFixed(1)
                    : '36'}{' '}
                  g of espresso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS ESPRESSO RATIO */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Espresso fundamentals
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            What is an espresso ratio?
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              Espresso ratio compares the amount of coffee you put into
              the portafilter with the amount of espresso that comes out.
              It is usually written as dose-to-yield, such as 1:2.
            </p>

            <p>
              For example, if you use 18 grams of ground coffee and
              produce 36 grams of espresso, your brew ratio is 1:2.
            </p>

            <p>
              Changing the ratio changes the amount of beverage produced
              from the same dose. It is one of the key variables used
              when dialing in an espresso recipe.
            </p>
          </div>
        </div>
      </section>

      {/* RATIO GUIDE */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Espresso ratio guide
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Common espresso ratios
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-300">
            <div className="grid grid-cols-[0.8fr_1fr_1.5fr] bg-stone-900 px-5 py-4 text-sm font-medium text-[#E8DCC8]">
              <span>Ratio</span>
              <span className="text-center">18 g dose</span>
              <span className="text-right">Style</span>
            </div>

            {[
              {
                ratio: '1:1',
                yield: '18 g',
                style: 'Very short',
              },
              {
                ratio: '1:1.5',
                yield: '27 g',
                style: 'Ristretto',
              },
              {
                ratio: '1:2',
                yield: '36 g',
                style: 'Classic starting point',
              },
              {
                ratio: '1:2.5',
                yield: '45 g',
                style: 'Longer shot',
              },
              {
                ratio: '1:3',
                yield: '54 g',
                style: 'Lungo-style',
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
                  {row.yield}
                </span>

                <span className="text-right text-sm text-stone-600">
                  {row.style}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-stone-500">
            These are useful starting points rather than universal rules.
            Coffee origin, roast level, grind size, water and extraction
            time all influence the final result.
          </p>
        </div>
      </section>

      {/* DOSE TO YIELD EXAMPLES */}
      <section className="bg-[#E8DCC8]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Scale your shot
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Espresso recipes at 1:2
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                dose: '16 g',
                yield: '32 g',
              },
              {
                dose: '18 g',
                yield: '36 g',
              },
              {
                dose: '20 g',
                yield: '40 g',
              },
            ].map((recipe) => (
              <div
                key={recipe.dose}
                className="rounded-2xl border border-stone-300 bg-[#F3EBDD] p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  1:2 ratio
                </p>

                <p className="mt-4 text-2xl font-semibold text-stone-900">
                  {recipe.dose}
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  → {recipe.yield} espresso
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base leading-8 text-stone-600">
            Keeping the same ratio allows you to scale the shot while
            maintaining the same dose-to-yield relationship.
          </p>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Dialing in espresso
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            How to use an espresso ratio
          </h2>

          <div className="mt-8 grid gap-4">
            {[
              {
                number: '01',
                title: 'Choose your dose',
                text: 'Start with the amount of coffee your espresso basket is designed to hold.',
              },
              {
                number: '02',
                title: 'Choose a target ratio',
                text: 'A 1:2 ratio is a practical starting point for many espresso recipes.',
              },
              {
                number: '03',
                title: 'Measure the yield',
                text: 'Place your cup on a scale and stop the shot when you reach your target yield.',
              },
              {
                number: '04',
                title: 'Taste and adjust',
                text: 'Use taste to decide whether you need to change the grind, ratio or other brewing variables.',
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
                Calculate coffee-to-water ratios for brewed coffee.
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
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Caffeine
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Estimate caffeine in different coffee servings.
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
                Calculate what each espresso or coffee costs.
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
            Espresso ratio questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is the best espresso ratio?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                There is no single best espresso ratio for every coffee.
                A 1:2 dose-to-yield ratio is a common starting point,
                after which you can adjust the recipe according to taste.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What does a 1:2 espresso ratio mean?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A 1:2 ratio means that the espresso yield is twice the
                weight of the coffee dose. For example, 18 grams of
                coffee produces a target yield of approximately 36 grams.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much espresso should 18 g of coffee produce?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                At a 1:2 ratio, an 18 gram dose produces approximately
                36 grams of espresso. A shorter ratio would produce less,
                while a longer ratio would produce more.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                What is the difference between ristretto and lungo?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                A ristretto generally uses a shorter yield relative to
                the coffee dose, while a lungo uses a longer yield.
                The exact ratio varies between recipes.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Should I change the ratio or grind size first?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Ratio and grind size affect different aspects of the
                extraction. A useful approach is to establish a target
                ratio and then adjust grind size and extraction time
                while tasting the results.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}