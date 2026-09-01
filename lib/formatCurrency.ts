export function getCurrencySymbol(currencyCode?: string | null, roasterName?: string | null): string {
  if (roasterName) {
    const rName = roasterName.toLowerCase();
    if (rName.includes('blue tokai')) return '₹';
    if (rName.includes('square mile') || rName.includes('climpson') || rName.includes('pact') || rName.includes('hasbean')) return '£';
  }

  if (!currencyCode) return '$';
  const code = currencyCode.toUpperCase();
  if (code === 'GBP') return '£';
  if (code === 'EUR') return '€';
  if (code === 'INR') return '₹';
  if (code === 'CAD') return 'CA$';
  if (code === 'AUD') return 'A$';
  if (code === 'JPY') return '¥';
  return '$';
}

export function formatPrice(price: number, currencyCode?: string | null, roasterName?: string | null): string {
  const symbol = getCurrencySymbol(currencyCode, roasterName);
  return `${symbol}${price.toFixed(2)}`;
}
