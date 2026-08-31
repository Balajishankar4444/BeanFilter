import React from 'react';

export function getFlavorColorClass(note: string): string {
  const lower = note.toLowerCase();

  if (lower.includes('jasmine') || lower.includes('floral') || lower.includes('bergamot') || lower.includes('violet')) {
    return 'bg-purple-100/80 text-purple-900 border-purple-200';
  }
  if (lower.includes('peach') || lower.includes('raspberry') || lower.includes('berry') || lower.includes('strawberry') || lower.includes('cherry') || lower.includes('plum')) {
    return 'bg-rose-100/80 text-rose-900 border-rose-200';
  }
  if (lower.includes('citrus') || lower.includes('lemon') || lower.includes('lime') || lower.includes('orange') || lower.includes('apple')) {
    return 'bg-amber-100/90 text-amber-900 border-amber-300';
  }
  if (lower.includes('chocolate') || lower.includes('caramel') || lower.includes('pecan') || lower.includes('toffee') || lower.includes('honey')) {
    return 'bg-amber-900/10 text-amber-950 border-amber-800/20';
  }

  return 'bg-stone-100 text-stone-700 border-stone-200';
}

export function FlavorBadge({ note }: { note: string }) {
  const colorClass = getFlavorColorClass(note);
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-all ${colorClass}`}>
      {note}
    </span>
  );
}
