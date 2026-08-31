import Link from 'next/link';
import { Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-lg mb-3">
              <Coffee className="h-5 w-5 text-amber-500" />
              <span>BeanDeals</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Find the cheapest delivered specialty coffee basket across independent roasters. Not a marketplace — we redirect you directly to roasters.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Shop Specialty</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/catalog" className="hover:text-amber-400">All Specialty Coffees</Link></li>
              <li><Link href="/catalog?process=Washed" className="hover:text-amber-400">Washed Process</Link></li>
              <li><Link href="/catalog?process=Natural" className="hover:text-amber-400">Natural Process</Link></li>
              <li><Link href="/catalog?roastLevel=Light" className="hover:text-amber-400">Light Roast</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Core Differentiator</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>🏆 Lowest Basket Cost Optimizer</li>
              <li>📦 Free Shipping Threshold Matching</li>
              <li>📊 Normalized Price per 100g</li>
              <li>☕ Cost Per Cup Calculator</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Administration</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/admin" className="hover:text-amber-400">Roaster Ingestion Dashboard</Link></li>
              <li><a href="/api/roasters" target="_blank" className="hover:text-amber-400">API Endpoint (/api/roasters)</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
          &copy; {new Date().getFullYear()} BeanDeals Specialty Coffee Aggregator. All external brand names, logos, and coffee names belong to their respective roasters.
        </div>
      </div>
    </footer>
  );
}
