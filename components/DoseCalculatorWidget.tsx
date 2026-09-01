'use client';

import React, { useState } from 'react';
import { CupSoda, Sliders, ArrowDown, Sparkles, Calculator, Coffee, Check, DollarSign, RefreshCw, ChevronDown } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

interface BrewPreset {
  name: string;
  icon: string;
  dose: number;
  description: string;
}

const BREW_PRESETS: BrewPreset[] = [
  { name: 'Aeropress', icon: '🫗', dose: 15, description: 'Balanced & smooth' },
  { name: 'V60 Pour Over', icon: '☕', dose: 16, description: 'Clean & aromatic' },
  { name: 'Espresso', icon: '⚡', dose: 18, description: 'Rich & concentrated' },
  { name: 'Chemex', icon: '🫖', dose: 20, description: 'Crisp & bright' },
  { name: 'French Press', icon: '🏺', dose: 22, description: 'Full-bodied' },
  { name: 'Cold Brew', icon: '🧊', dose: 60, description: 'Bold & low acidity' },
];

const BAG_OPTIONS = [
  { label: '340g (12 oz) Standard Bag - $18.00', weightG: 340, price: 18.00 },
  { label: '250g Specialty Bag - $22.00', weightG: 250, price: 22.00 },
  { label: '250g Premium Micro-Lot - $35.00', weightG: 250, price: 35.00 },
  { label: '454g (16 oz / 1 lb) Bag - $24.00', weightG: 454, price: 24.00 },
  { label: '1000g (1kg / 2.2 lb) Bulk Bag - $48.00', weightG: 1000, price: 48.00 },
];

export function DoseCalculatorWidget() {
  const { doseG, setDoseG } = useBasket();
  const [selectedPreset, setSelectedPreset] = useState<string>('V60 Pour Over');
  const [cupsPerDay, setCupsPerDay] = useState<number>(2);
  const [selectedBagIndex, setSelectedBagIndex] = useState<number>(0);
  const [cafePrice, setCafePrice] = useState<number>(6.00);

  const currentBag = BAG_OPTIONS[selectedBagIndex] || BAG_OPTIONS[0];

  // Calculations
  const costPerCup = ((currentBag.price / currentBag.weightG) * doseG).toFixed(2);
  const costPerCupNum = parseFloat(costPerCup);
  const totalCupsPerBag = Math.floor(currentBag.weightG / (doseG || 1));
  const daysBagLasts = (totalCupsPerBag / (cupsPerDay || 1)).toFixed(1);
  
  const dailyCafeCost = cafePrice * cupsPerDay;
  const dailyHomeCost = costPerCupNum * cupsPerDay;
  const dailySavings = Math.max(0, dailyCafeCost - dailyHomeCost);
  const monthlySavings = (dailySavings * 30.5).toFixed(2);
  const yearlySavings = (dailySavings * 365).toFixed(2);

  const handlePresetSelect = (preset: BrewPreset) => {
    setSelectedPreset(preset.name);
    setDoseG(preset.dose);
  };

  const handleDoseChange = (val: number) => {
    const clamped = Math.max(5, Math.min(100, val));
    setDoseG(clamped);
    const matchingPreset = BREW_PRESETS.find((p) => p.dose === clamped);
    if (matchingPreset) {
      setSelectedPreset(matchingPreset.name);
    } else {
      setSelectedPreset('Custom');
    }
  };

  const handleExploreScroll = () => {
    const el = document.getElementById('calculators') || 
               document.getElementById('featured-heading') || 
               document.getElementById('featured-coffees-section');
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-3xl border border-amber-900/20 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-stone-100/80 p-6 sm:p-8 shadow-lg backdrop-blur-md space-y-8 animate-fade-up transition-all duration-300 hover:shadow-2xl">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-900 via-amber-950 to-stone-950 text-amber-300 shadow-md">
            <Calculator className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>Interactive Brew & Value Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 leading-tight">
              Calculate Your Exact Cost per Cup
            </h2>
            <p className="text-xs text-stone-700 font-bold mt-0.5">
              Customize your dose & consumption to see live savings vs $6.00 cafe coffee
            </p>
          </div>
        </div>

        {/* Live Dose Badge */}
        <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 border border-amber-300/80 shadow-sm self-start md:self-auto">
          <Coffee className="h-5 w-5 text-amber-800" />
          <div className="text-left">
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider block">Active Brew Dose</span>
            <span className="text-base font-black text-amber-950">{doseG}g per cup</span>
          </div>
        </div>
      </div>

      {/* Calculator Grid Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Preset & Input Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Brew Method Presets */}
          <div className="space-y-3">
            <label className="text-xs font-black text-stone-900 uppercase tracking-wider block">
              1. Select Brew Method Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {BREW_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.name && doseG === preset.dose;
                return (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all duration-300 ${
                      isSelected
                        ? 'border-amber-800 bg-stone-950 text-white shadow-md scale-102 ring-2 ring-amber-600'
                        : 'border-stone-300/90 bg-white/90 text-stone-900 hover:border-amber-600 hover:bg-white hover:scale-101 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-base">{preset.icon}</span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                        isSelected ? 'bg-amber-800 text-amber-100' : 'bg-amber-100/80 text-amber-950 font-bold'
                      }`}>
                        {preset.dose}g
                      </span>
                    </div>
                    <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                      {preset.name}
                    </span>
                    <span className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-amber-200/80' : 'text-stone-600'}`}>
                      {preset.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Custom Dose Gram Slider & Input */}
          <div className="space-y-3 bg-white/80 p-5 rounded-2xl border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-stone-900 uppercase tracking-wider">
                2. Fine-Tune Dose Weight (Grams)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={doseG}
                  onChange={(e) => handleDoseChange(parseInt(e.target.value, 10) || 15)}
                  className="w-16 rounded-xl border border-amber-400 bg-white px-2 py-1 text-center text-sm font-black text-stone-950 shadow-inner focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                <span className="text-xs font-black text-stone-900">grams</span>
              </div>
            </div>

            <input
              type="range"
              min={8}
              max={60}
              step={1}
              value={doseG}
              onChange={(e) => handleDoseChange(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
            />
            <div className="flex justify-between text-[10px] font-bold text-stone-600 px-1">
              <span>8g (Single Shot)</span>
              <span>15g (Standard)</span>
              <span>30g (Chemex Batch)</span>
              <span>60g (Cold Brew)</span>
            </div>
          </div>

          {/* 3. Custom Dropdowns Selection (Theme Styled) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Bag Size Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-stone-900 uppercase tracking-wider block">
                3. Coffee Bag Size & Price
              </label>
              <div className="relative">
                <select
                  value={selectedBagIndex}
                  onChange={(e) => setSelectedBagIndex(parseInt(e.target.value, 10))}
                  className="w-full appearance-none rounded-2xl border border-stone-300 bg-white/95 py-3 pl-3.5 pr-10 text-xs font-extrabold text-stone-950 shadow-sm transition-all focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 hover:border-amber-600"
                >
                  {BAG_OPTIONS.map((opt, idx) => (
                    <option key={idx} value={idx} className="text-stone-900 font-bold bg-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-amber-900 pointer-events-none" />
              </div>
            </div>

            {/* Daily Consumption Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-stone-900 uppercase tracking-wider block">
                4. Daily Cups Consumed
              </label>
              <div className="relative">
                <select
                  value={cupsPerDay}
                  onChange={(e) => setCupsPerDay(parseInt(e.target.value, 10))}
                  className="w-full appearance-none rounded-2xl border border-stone-300 bg-white/95 py-3 pl-3.5 pr-10 text-xs font-extrabold text-stone-950 shadow-sm transition-all focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 hover:border-amber-600"
                >
                  <option value={1} className="text-stone-900 font-bold bg-white">1 Cup per Day</option>
                  <option value={2} className="text-stone-900 font-bold bg-white">2 Cups per Day</option>
                  <option value={3} className="text-stone-900 font-bold bg-white">3 Cups per Day</option>
                  <option value={4} className="text-stone-900 font-bold bg-white">4 Cups per Day</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-amber-900 pointer-events-none" />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live Results Cards Dashboard */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Card 1: Cost per Cup */}
          <div className="rounded-3xl bg-white p-6 border border-stone-200/90 shadow-md space-y-3 relative overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-xl">
            <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-stone-900 uppercase tracking-wider">
                Cost per Cup ({doseG}g dose)
              </span>
              <span className="rounded-xl bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-950">
                Live Calculation
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-stone-950">${costPerCup}</span>
              <span className="text-xs font-black text-stone-700">/ cup</span>
            </div>

            <p className="text-xs text-stone-700 font-bold leading-relaxed border-t border-stone-100 pt-2.5">
              Bag Price ${currentBag.price.toFixed(2)} ÷ {currentBag.weightG}g × {doseG}g dose
            </p>
          </div>

          {/* Card 2: Monthly Savings vs $6 Cafe Coffee */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-950 p-6 text-white shadow-lg space-y-3 relative overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-2xl">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="text-xs font-black uppercase tracking-wider">
                Your Monthly Cafe Savings
              </span>
              <span className="rounded-xl bg-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-200">
                vs $6.00 Cafe
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-400">${monthlySavings}</span>
              <span className="text-xs font-extrabold text-emerald-200">saved / month</span>
            </div>

            <p className="text-xs text-emerald-100/90 font-bold border-t border-emerald-800/80 pt-2.5">
              Saves <strong className="text-emerald-300">${yearlySavings} every year</strong> drinking specialty coffee at home!
            </p>
          </div>

          {/* Card 3: Bag Yield & Longevity */}
          <div className="grid grid-cols-2 gap-3 text-stone-900">
            <div className="rounded-2xl bg-white p-4 border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider block">Total Yield</span>
              <span className="text-xl font-black text-amber-950 block">{totalCupsPerBag} Cups</span>
              <span className="text-[10px] font-bold text-stone-700 block">per {currentBag.weightG}g bag</span>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider block">Bag Duration</span>
              <span className="text-xl font-black text-amber-950 block">{daysBagLasts} Days</span>
              <span className="text-[10px] font-bold text-stone-700 block">at {cupsPerDay} cups/day</span>
            </div>
          </div>

          {/* Smooth Animated Slinky Scroll Button */}
          <button
            onClick={handleExploreScroll}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-900 via-amber-950 to-stone-950 px-6 py-4 text-xs font-black text-white shadow-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 hover:scale-102 active:scale-95 group border border-amber-700/40"
          >
            <span>Explore All Coffee Calculators</span>
            <ArrowDown className="h-4 w-4 text-amber-400 group-hover:translate-y-1 transition-transform duration-300" />
          </button>

        </div>

      </div>

    </div>
  );
}
