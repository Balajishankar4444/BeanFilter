export function getCurrencySymbol(currencyCode?: string | null, roasterName?: string | null): string {
  if (currencyCode) {
    const code = currencyCode.trim().toUpperCase();
    if (code === 'EUR' || code.includes('EUR') || code.includes('€')) return '€';
    if (code === 'GBP' || code.includes('GBP') || code.includes('£')) return '£';
    if (code === 'INR' || code.includes('INR') || code.includes('₹')) return '₹';
    if (code === 'CAD' || code.includes('CAD')) return 'CA$';
    if (code === 'AUD' || code.includes('AUD')) return 'A$';
    if (code === 'JPY' || code.includes('JPY') || code.includes('¥')) return '¥';
    if (code === 'USD' || code.includes('USD') || code === '$') return '$';
  }

  if (roasterName) {
    const rName = roasterName.toLowerCase();
    if (rName.includes('blue tokai')) return '₹';
    if (
      rName.includes('square mile') ||
      rName.includes('climpson') ||
      rName.includes('pact') ||
      rName.includes('hasbean')
    ) {
      return '£';
    }
    if (
      rName.includes('the barn') ||
      rName.includes('five elephant') ||
      rName.includes('drop coffee') ||
      rName.includes('tim wendelboe') ||
      rName.includes('april coffee') ||
      rName.includes('dak') ||
      rName.includes('coffee collective') ||
      rName.includes('bonanza') ||
      rName.includes('manhattan') ||
      rName.includes('la cabra')
    ) {
      return '€';
    }
  }

  return '$';
}

export function formatPrice(price: number, currencyCode?: string | null, roasterName?: string | null): string {
  const symbol = getCurrencySymbol(currencyCode, roasterName);
  return `${symbol}${price.toFixed(2)}`;
}
