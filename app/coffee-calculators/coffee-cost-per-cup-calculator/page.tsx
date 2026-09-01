'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Coffee,
  Coins,
  Calculator,
  CalendarDays,
  Scale,
} from 'lucide-react';

export default function CoffeeCostPerCupCalculatorPage() {
  const [bagPrice, setBagPrice] = useState('15');
  const [bagWeight, setBagWeight] = useState('250');
  const [coffeePerCup, setCoffeePerCup] = useState('15');
  const [cupsPerDay, setCupsPerDay] = useState('2');
  const [currency, setCurrency] = useState('€');

  const result = useMemo(() => {
    const price = Number(bagPrice) || 0;
    const weight = Number(bagWeight) || 0;
    const gramsPerCup = Number(coffeePerCup) || 0;
    const dailyCups = Number(cupsPerDay) || 0;

    if (price <= 0 || weight <= 0 || gramsPerCup <= 0) {
      return {
        pricePerGram: 0,
        costPerCup: 0,
        cupsPerBag: 0,
        dailyCost: 0,
        monthlyCost: 0,
        yearlyCost: 0,
      };
    }

    const pricePerGram = price / weight;
    const costPerCup = pricePerGram * gramsPerCup;
    const cupsPerBag = weight / gramsPerCup;
    const dailyCost = costPerCup * dailyCups;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;

    return {
      pricePerGram,
      costPerCup,
      cupsPerBag,
      dailyCost,
      monthlyCost,
      yearlyCost,
    };
  }, [bagPrice, bagWeight, coffeePerCup, cupsPerDay]);

  const formatMoney = (value: number) =>
    `${currency}${value.toFixed(2)}`;

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
              Coffee Cost Per Cup Calculator
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Find out what your coffee actually costs per cup and
              estimate how much you spend on coffee each day, month
              and year.
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
                  Enter your coffee
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Coffee bag details
                </h2>
              </div>

              {/* CURRENCY */}
              <div>
                <label
                  htmlFor="currency"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Currency
                </label>

                <select
                  id="currency"
                  value={currency}
                  onChange={(e) =>
                    setCurrency(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-stone-300 bg-[#F7F2E8] px-4 py-3.5 text-stone-900 outline-none transition focus:border-stone-700"
                >
                  <option value="€">Euro (€)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="₹">Indian Rupee (₹)</option>
                  <option value="A$">Australian Dollar (A$)</option>
                  <option value="C$">Canadian Dollar (C$)</option>
                </select>
              </div>

              {/* BAG PRICE */}
              <div className="mt-6">
                <label
                  htmlFor="bagPrice"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Coffee bag price
                </label>

                <div className="relative">
                  <Coins
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="bagPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={bagPrice}
                    onChange={(e) =>
                      setBagPrice(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    {currency}
                  </span>
                </div>
              </div>

              {/* BAG WEIGHT */}
              <div className="mt-6">
                <label
                  htmlFor="bagWeight"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Bag weight
                </label>

                <div className="relative">
                  <Scale
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="bagWeight"
                    type="number"
                    min="1"
                    step="1"
                    value={bagWeight}
                    onChange={(e) =>
                      setBagWeight(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 pr-16 text-stone-900 outline-none transition focus:border-stone-700"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    g
                  </span>
                </div>
              </div>

              {/* COFFEE PER CUP */}
              <div className="mt-6">
                <label
                  htmlFor="coffeePerCup"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Coffee used per cup
                </label>

                <div className="relative">
                  <Coffee
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
              </div>

              {/* CUPS PER DAY */}
              <div className="mt-6">
                <label
                  htmlFor="cupsPerDay"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Cups per day
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                  />

                  <input
                    id="cupsPerDay"
                    type="number"
                    min="1"
                    step="1"
                    value={cupsPerDay}
                    onChange={(e) =>
                      setCupsPerDay(e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-300 bg-[#F7F2E8] px-12 py-3.5 text-stone-900 outline-none transition focus:border-stone-700"
                  />
                </div>
              </div>
            </div>

            {/* RESULTS */}
            <div className="rounded-3xl bg-stone-900 p-6 text-[#E8DCC8] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Your coffee costs
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Cost per cup
              </h2>

              <div className="mt-8 rounded-2xl bg-stone-800 p-6">
                <p className="text-sm text-stone-400">
                  One cup
                </p>

                <p className="mt-2 text-5xl font-semibold tracking-tight">
                  {formatMoney(result.costPerCup)}
                </p>
              </div>

              {/* BAG */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-800 p-5">
                  <p className="text-sm text-stone-400">
                    Price per gram
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {formatMoney(result.pricePerGram)}
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-800 p-5">
                  <p className="text-sm text-stone-400">
                    Cups per bag
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {result.cupsPerBag
                      ? result.cupsPerBag.toFixed(1)
                      : '0'}
                  </p>
                </div>
              </div>

              {/* DAILY */}
              <div className="mt-8 border-t border-stone-700 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Your estimated coffee spending
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-stone-400">
                      Daily
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {formatMoney(result.dailyCost)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-stone-400">
                      Monthly
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {formatMoney(result.monthlyCost)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-stone-400">
                      Yearly
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {formatMoney(result.yearlyCost)}
                    </p>
                  </div>
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
            The calculation
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            How coffee cost per cup is calculated
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
            <p>
              First, the calculator works out the price of your coffee
              per gram by dividing the bag price by the total weight of
              the bag.
            </p>

            <p>
              Next, that price per gram is multiplied by the number of
              grams you use to make one cup. This gives you the estimated
              coffee cost of each cup.
            </p>

            <p>
              For example, a €15 bag containing 250 grams of coffee costs
              €0.06 per gram. If you use 15 grams for one cup, the coffee
              itself costs about €0.90 per cup.
            </p>

            <p>
              The calculator can then estimate your daily, monthly and
              yearly coffee spending based on how many cups you drink.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT IS INCLUDED */}
      <section className="border-y border-stone-300/70 bg-[#F3EBDD]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Know your real coffee cost
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            What this calculator tells you
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6">
              <Coins
                size={22}
                className="text-stone-700"
              />

              <h3 className="mt-5 font-semibold text-stone-900">
                Cost per cup
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                See exactly how much of your coffee bag goes into one
                cup based on your recipe.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6">
              <Scale
                size={22}
                className="text-stone-700"
              />

              <h3 className="mt-5 font-semibold text-stone-900">
                Price per gram
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Compare coffees more fairly by looking at their price
                relative to weight.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6">
              <Coffee
                size={22}
                className="text-stone-700"
              />

              <h3 className="mt-5 font-semibold text-stone-900">
                Cups per bag
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Estimate how many cups you can brew from one bag.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-300 bg-[#E8DCC8] p-6">
              <CalendarDays
                size={22}
                className="text-stone-700"
              />

              <h3 className="mt-5 font-semibold text-stone-900">
                Long-term spending
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Estimate what your daily coffee habit costs over a
                month or an entire year.
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

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/coffee-calculators/coffee-caffeine-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <ZapIcon />

              <h3 className="mt-4 font-semibold">
                Coffee Caffeine Calculator
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Estimate caffeine based on coffee type and serving
                size.
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
              href="/coffee-calculators/coffee-ratio-calculator"
              className="group rounded-2xl border border-stone-300 bg-[#F3EBDD] p-5 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <Coffee size={20} />

              <h3 className="mt-4 font-semibold">
                Coffee Ratio Calculator
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Calculate the coffee-to-water ratio for your brew.
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
            Coffee cost questions
          </h2>

          <div className="mt-10 divide-y divide-stone-300/80 border-y border-stone-300/80">
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How much does a cup of coffee cost at home?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                It depends on the price and size of your coffee bag and
                how much coffee you use per cup. Calculate the price per
                gram first, then multiply it by the grams used for one
                cup.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How do I calculate coffee cost per cup?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Divide the coffee bag price by its weight to find the
                price per gram. Then multiply the price per gram by the
                amount of coffee you use for one cup.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                How many cups are in a 250g bag of coffee?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                It depends on your recipe. If you use 15 grams per cup,
                a 250 gram bag contains approximately 16.7 cups. Using
                more or less coffee per brew will change the number of
                cups.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Is brewing coffee at home cheaper than buying coffee?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Often, the coffee itself costs considerably less per
                serving when brewed at home, but the exact difference
                depends on the beans, equipment, recipe and price of
                purchased coffee.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-stone-900">
                Does the calculator include water and electricity costs?
                <span className="text-2xl font-light text-stone-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-base leading-7 text-stone-600">
                No. This calculator focuses on the cost of the coffee
                beans themselves. Water, electricity, filters, milk and
                other preparation costs can be added separately if you
                want to calculate the complete cost of a cup.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}

function ZapIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center">
      <span className="text-lg">⚡</span>
    </div>
  );
}