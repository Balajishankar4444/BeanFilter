import { Calculator } from 'lucide-react';

export default function CoffeeCalculatorsLoading() {
  return (
    <main className="min-h-screen bg-[#E8DCC8] text-stone-900 flex flex-col items-center justify-center py-32 px-6">
      <div className="flex flex-col items-center gap-4 animate-fade-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 text-[#E8DCC8] shadow-xl">
          <Calculator className="h-8 w-8 animate-pulse text-amber-400" />
        </div>
        <div className="h-2 w-32 rounded-full bg-stone-400/40 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-stone-900 rounded-full animate-shimmer" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest text-stone-600">
          Loading Coffee Calculators...
        </p>
      </div>
    </main>
  );
}
