'use client';

import React, { useState } from 'react';
import { TrendingDown, Calendar, Info, ShieldCheck, Clock } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/formatCurrency';

export interface PriceHistoryPoint {
  id: string;
  variantId?: string;
  price: number;
  recordedAt: string | Date;
}

export function PriceHistoryChart({
  histories,
  selectedWeightG = 250,
  currencyCode = 'USD',
  roasterName,
}: {
  histories: PriceHistoryPoint[];
  selectedWeightG?: number;
  currencyCode?: string | null;
  roasterName?: string | null;
}) {
  const currencySymbol = getCurrencySymbol(currencyCode, roasterName);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number; date: string } | null>(null);

  if (!histories || histories.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center text-xs text-stone-500 font-semibold">
        No price history recorded for {selectedWeightG}g bag size yet.
      </div>
    );
  }

  // Sort authentic database history points by recorded date
  const sorted = [...histories].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const prices = sorted.map((h) => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = (prices.reduce((sum, p) => sum + p, 0) / prices.length).toFixed(2);
  const latestPrice = prices[prices.length - 1];

  // Format date label for X-axis
  const formatDateLabel = (d: string | Date) => {
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format full date AND exact time for hover tooltip (e.g., Aug 31, 2026, 9:40 PM)
  const formatFullDateTime = (d: string | Date) => {
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // SVG dimensions
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const priceRange = maxPrice - minPrice || 1;
  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  // Single price point case: render authentic current price status without fake line trend
  if (sorted.length === 1) {
    const singlePoint = sorted[0];
    const formattedDate = formatFullDateTime(singlePoint.recordedAt);

    return (
      <div key={selectedWeightG} className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900 font-bold">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-stone-900">Price History</h4>
                <span className="rounded-lg bg-amber-900 px-2.5 py-0.5 text-[11px] font-black text-white shadow-sm">
                  {selectedWeightG > 1 ? `${selectedWeightG}g Bag` : 'Item Price'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                Authentic live price tracking feed
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-900">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Backend Verified</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Current Active Price</span>
            <div className="text-3xl font-black text-emerald-950 mt-1">{currencySymbol}{singlePoint.price.toFixed(2)}</div>
            <p className="text-xs text-stone-600 font-medium mt-1">
              Last synced from merchant API: <strong className="text-stone-900">{formattedDate}</strong>
            </p>
          </div>

          <div className="rounded-xl bg-white border border-emerald-200 p-3.5 text-xs text-stone-700 font-semibold shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <TrendingDown size={14} />
              <span>Price Tracker Active</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              Our background sync monitors price updates daily. Any merchant price drops will automatically populate trend points here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const points = sorted.map((h, index) => {
    const x = paddingLeft + (index / (sorted.length - 1 || 1)) * usableWidth;
    const y = maxPrice === minPrice 
      ? paddingTop + usableHeight / 2 
      : paddingTop + usableHeight - ((h.price - minPrice) / priceRange) * usableHeight;
    return {
      x,
      y,
      price: h.price,
      date: formatDateLabel(h.recordedAt),
      fullDateTime: formatFullDateTime(h.recordedAt),
    };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight - paddingBottom} L ${points[0].x},${chartHeight - paddingBottom} Z`;

  return (
    <div key={selectedWeightG} className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900 font-bold">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-stone-900">7-Day Price History</h4>
              <span className="rounded-lg bg-amber-900 px-2.5 py-0.5 text-[11px] font-black text-white shadow-sm">
                {selectedWeightG > 1 ? `${selectedWeightG}g Bag` : 'Item Price'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
              Authentic live price tracking feed
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-900">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Authentic Live Feed</span>
        </div>
      </div>

      {/* Specific Gram Weight Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Current Price ({selectedWeightG > 1 ? `${selectedWeightG}g` : 'Item'})</span>
          <strong className="text-base font-black text-stone-950">{currencySymbol}{latestPrice.toFixed(2)}</strong>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Lowest Recorded</span>
          <strong className="text-base font-black text-emerald-800">{currencySymbol}{minPrice.toFixed(2)}</strong>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Highest Recorded</span>
          <strong className="text-base font-black text-stone-900">{currencySymbol}{maxPrice.toFixed(2)}</strong>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Average Price</span>
          <strong className="text-base font-black text-stone-800">{currencySymbol}{avgPrice}</strong>
        </div>
      </div>

      {/* SVG Authentic Chart */}
      <div className="relative rounded-2xl border border-stone-200 bg-stone-50/40 p-4 shadow-inner">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
          <defs>
            <linearGradient id="priceGradientDateTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Y-Axis Grid Lines & Price Labels */}
          <g className="text-[10px] font-bold fill-stone-400">
            <line x1={paddingLeft} y1={paddingTop} x2={chartWidth - paddingRight} y2={paddingTop} stroke="#e7e5e4" strokeDasharray="3 3" />
            <text x={paddingLeft - 8} y={paddingTop + 3} textAnchor="end">{currencySymbol}{maxPrice.toFixed(2)}</text>

            <line x1={paddingLeft} y1={paddingTop + usableHeight / 2} x2={chartWidth - paddingRight} y2={paddingTop + usableHeight / 2} stroke="#e7e5e4" strokeDasharray="3 3" />
            <text x={paddingLeft - 8} y={paddingTop + usableHeight / 2 + 3} textAnchor="end">{currencySymbol}{((maxPrice + minPrice) / 2).toFixed(2)}</text>

            <line x1={paddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingRight} y2={chartHeight - paddingBottom} stroke="#e7e5e4" strokeDasharray="3 3" />
            <text x={paddingLeft - 8} y={chartHeight - paddingBottom + 3} textAnchor="end">{currencySymbol}{minPrice.toFixed(2)}</text>
          </g>

          {/* Area Fill Below Trend Line */}
          {areaD && <path d={areaD} fill="url(#priceGradientDateTime)" />}

          {/* Main Trend Line */}
          <path d={pathD} fill="none" stroke="#92400e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-amber-900 stroke-white stroke-2 cursor-pointer transition-all hover:r-6 hover:fill-amber-600"
              onMouseEnter={() => setHoveredPoint({ x: p.x, y: p.y, price: p.price, date: p.fullDateTime })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* X-Axis Date Labels */}
          <g className="text-[10px] font-bold fill-stone-500">
            <text x={points[0].x} y={chartHeight - 10} textAnchor="start">{points[0].date}</text>
            <text x={points[points.length - 1].x} y={chartHeight - 10} textAnchor="end">{points[points.length - 1].date}</text>
          </g>
        </svg>

        {/* Hover Tooltip displaying Date AND Exact Time */}
        {hoveredPoint && (
          <div
            style={{ left: `${(hoveredPoint.x / chartWidth) * 100}%`, top: '5%' }}
            className="absolute -translate-x-1/2 rounded-2xl bg-stone-950 px-4 py-2 text-center text-white shadow-2xl pointer-events-none z-30 animate-scale-in border border-stone-800"
          >
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-amber-400" />
              <span>{hoveredPoint.date}</span>
            </div>
            <div className="text-sm font-black text-white mt-0.5">{currencySymbol}{hoveredPoint.price.toFixed(2)}</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <span>Hover over any point to view exact timestamp (Date & Time) and price.</span>
        </div>
      </div>
    </div>
  );
}
