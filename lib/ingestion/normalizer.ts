import { RawIngestedProduct, RawIngestedVariant } from './types';

export function parseWeightG(title: string, description: string = ''): number {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('1kg') || text.includes('1 kg')) return 1000;
  if (text.includes('500g') || text.includes('500 g')) return 500;
  if (text.includes('454g') || text.includes('1lb') || text.includes('1 lb') || text.includes('16oz') || text.includes('16 oz')) return 454;
  if (text.includes('340g') || text.includes('12oz') || text.includes('12 oz') || text.includes('340 g')) return 340;
  if (text.includes('250g') || text.includes('250 g')) return 250;
  if (text.includes('200g') || text.includes('200 g')) return 200;
  if (text.includes('100g') || text.includes('100 g')) return 100;

  const gMatch = text.match(/(\d{3,4})\s*g/i);
  if (gMatch && gMatch[1]) {
    const parsed = parseInt(gMatch[1], 10);
    if ([100, 200, 250, 300, 340, 454, 500, 1000].includes(parsed)) return parsed;
    if (parsed >= 100 && parsed <= 5000) return parsed;
  }

  const ozMatch = text.match(/(\d{1,2})\s*oz/i);
  if (ozMatch && ozMatch[1]) {
    const oz = parseInt(ozMatch[1], 10);
    return Math.round(oz * 28.3495);
  }

  return 250;
}

export function calculatePricePer100g(price: number, weightG: number): number {
  if (weightG <= 0) return 0;
  return Number(((price / weightG) * 100).toFixed(2));
}

export function calculateCostPerCup(price: number, weightG: number, doseG: number = 15): number {
  if (weightG <= 0) return 0;
  return Number(((price / weightG) * doseG).toFixed(2));
}

export function parseCoffeeCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('decaf') || lower.includes('swiss water') || lower.includes('sugarcane decaf') || lower.includes('ea decaf')) {
    return 'Decaf';
  }
  if (lower.includes('cold brew') || lower.includes('cold-brew')) {
    return 'Cold Brew';
  }
  if (lower.includes('instant') || lower.includes('freeze-dried')) {
    return 'Instant';
  }
  if (lower.includes('espresso')) {
    return 'Espresso';
  }
  if (lower.includes('filter') || lower.includes('pour over') || lower.includes('drip')) {
    return 'Filter';
  }
  return 'Omni-roast';
}

export function parseFarmName(text: string): string | null {
  const farmMatch = text.match(/(finca|estate|farm|hacienda)\s+([a-z0-9\s]+)/i);
  if (farmMatch && farmMatch[0]) {
    return farmMatch[0].trim().substring(0, 50);
  }
  return null;
}

const COMMON_FLAVOR_NOTES = [
  'Jasmine', 'Peach', 'Blueberry', 'Bergamot', 'Caramel', 'Chocolate',
  'Honey', 'Citrus', 'Floral', 'Pecan', 'Apple', 'Vanilla', 'Strawberry',
  'Raspberry', 'Blackberry', 'Lemon', 'Lime', 'Orange', 'Grape', 'Plum',
  'Cherry', 'Mango', 'Passionfruit', 'Papaya', 'Toffee', 'Molasses',
  'Hazelnut', 'Almond', 'Cacao', 'Nectarine', 'Apricot', 'Raisin', 'Fig'
];

export function extractFlavorNotes(text: string): string[] {
  const notes = new Set<string>();
  const lower = text.toLowerCase();

  for (const note of COMMON_FLAVOR_NOTES) {
    if (lower.includes(note.toLowerCase())) {
      notes.add(note);
    }
  }

  return Array.from(notes);
}

export function parseProcessMethod(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('anaerobic')) return 'Anaerobic';
  if (lower.includes('carbonic maceration')) return 'Carbonic Maceration';
  if (lower.includes('experimental')) return 'Experimental';
  if (lower.includes('honey')) return 'Honey';
  if (lower.includes('natural')) return 'Natural';
  if (lower.includes('washed') || lower.includes('fully washed')) return 'Washed';
  return 'Washed';
}

export function parseRoastLevel(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('light-medium') || lower.includes('med-light')) return 'Medium-Light';
  if (lower.includes('medium-dark') || lower.includes('med-dark')) return 'Medium-Dark';
  if (lower.includes('dark')) return 'Dark';
  if (lower.includes('medium')) return 'Medium';
  if (lower.includes('light')) return 'Light';
  return 'Light';
}

export function parseOriginCountry(text: string): string {
  const lower = text.toLowerCase();
  const origins = ['Ethiopia', 'Colombia', 'Kenya', 'Guatemala', 'Costa Rica', 'Honduras', 'El Salvador', 'Panama', 'Brazil', 'Rwanda', 'Burundi', 'Yemen', 'Indonesia', 'Mexico', 'Peru', 'Ecuador'];
  for (const origin of origins) {
    if (lower.includes(origin.toLowerCase())) {
      return origin;
    }
  }
  return 'Single Origin';
}

export function flagBestValueVariant(variants: { pricePer100g: number }[]): boolean[] {
  if (variants.length <= 1) return variants.map(() => false);
  const minPrice100g = Math.min(...variants.map((v) => v.pricePer100g));
  return variants.map((v) => v.pricePer100g === minPrice100g);
}

export function classifyProductCategory(
  title: string,
  description: string = '',
  tags: string = '',
  rawProductType: string = ''
): {
  productType: 'COFFEE' | 'EQUIPMENT';
  commerceCategory: string;
  equipmentCategory?: string;
} {
  const text = `${title} ${description} ${tags} ${rawProductType}`.toLowerCase();

  // Check Espresso Machines
  if (
    text.includes('espresso machine') ||
    text.includes('bambino') ||
    text.includes('barista express') ||
    text.includes('barista pro') ||
    text.includes('barista touch') ||
    text.includes('gaggia classic') ||
    text.includes('marax') ||
    text.includes('lelit') ||
    text.includes('rancilio silvia') ||
    (text.includes('coffee machine') && !text.includes('bean') && !text.includes('roast'))
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'ESPRESSO_MACHINE', equipmentCategory: 'ESPRESSO_MACHINE' };
  }

  // Check Grinders
  if (
    text.includes('grinder') ||
    text.includes('encore esp') ||
    text.includes('ode brew grinder') ||
    text.includes('virtuoso+') ||
    text.includes('hand grinder') ||
    text.includes('burr set') ||
    text.includes('conical burr')
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'GRINDER', equipmentCategory: 'GRINDER' };
  }

  // Check Brewers & Drippers
  if (
    text.includes('aeropress') ||
    text.includes('chemex') ||
    text.includes('french press') ||
    text.includes('moka pot') ||
    text.includes('moka express') ||
    text.includes('pour over dripper') ||
    text.includes('coffee dripper') ||
    text.includes('v60 dripper') ||
    text.includes('cone dripper') ||
    text.includes('moccamaster') ||
    text.includes('luxe brewer') ||
    text.includes('kalita wave') ||
    text.includes('origami dripper') ||
    text.includes('fetco brewer') ||
    text.includes('origami cone')
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'BREWER', equipmentCategory: 'BREWER' };
  }

  // Check Kettles
  if (
    text.includes('kettle') ||
    text.includes('gooseneck') ||
    text.includes('stagg ekg') ||
    text.includes('buono')
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'KETTLE', equipmentCategory: 'KETTLE' };
  }

  // Check Scales
  if (
    text.includes('coffee scale') ||
    text.includes('barista scale') ||
    text.includes('acaia pearl') ||
    text.includes('black mirror') ||
    (text.includes('precision scale') && !text.includes('coffee beans'))
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'SCALE', equipmentCategory: 'SCALE' };
  }

  // Check Drinkware (Cups, Mugs, Bottles, Tumblers, Carafes, Server Bottles, Canisters)
  if (
    text.includes('mug') ||
    text.includes('cup') ||
    text.includes('tumbler') ||
    text.includes('bottle') ||
    text.includes('flask') ||
    text.includes('carafe') ||
    text.includes('server bottle') ||
    text.includes('coffee server') ||
    text.includes('glassware') ||
    text.includes('beer glass') ||
    text.includes('shot glass') ||
    text.includes('storage canister') ||
    text.includes('atmos canister') ||
    text.includes('vacuum canister') ||
    text.includes('cold cup') ||
    text.includes('travel mug') ||
    text.includes('carter move')
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'DRINKWARE', equipmentCategory: 'DRINKWARE' };
  }

  // Check Filters & Accessories
  if (
    text.includes('filter paper') ||
    text.includes('paper filter') ||
    text.includes('cone filter') ||
    text.includes('coffee filter') ||
    text.includes('v60 filter') ||
    text.includes('tamper') ||
    text.includes('pitcher') ||
    text.includes('frothing pitcher') ||
    text.includes('cafiza') ||
    text.includes('cleaning powder') ||
    text.includes('cleaning brush') ||
    text.includes('descaler')
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'FILTERS_ACCESSORIES', equipmentCategory: 'FILTERS_ACCESSORIES' };
  }

  // Check Subscriptions
  if (
    title.toLowerCase().includes('subscription') ||
    title.toLowerCase().includes('prepaid')
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'SUBSCRIPTION', equipmentCategory: 'SUBSCRIPTION' };
  }

  // Check Apparel, Merchandise, Tea, and Non-Coffee Consumables
  if (
    text.includes('shirt') ||
    text.includes('top') ||
    text.includes('t-shirt') ||
    text.includes('hoodie') ||
    text.includes('sweatshirt') ||
    text.includes('beanie') ||
    text.includes('hat') ||
    text.includes('cap') ||
    text.includes('sock') ||
    text.includes('pin') ||
    text.includes('tote') ||
    text.includes('apparel') ||
    text.includes('merch') ||
    text.includes('tea') ||
    text.includes('matcha') ||
    text.includes('chai') ||
    text.includes('chamomile') ||
    text.includes('sprite') ||
    text.includes('coke') ||
    text.includes('soda') ||
    text.includes('syrup') ||
    text.includes('sauce') ||
    text.includes('gift card') ||
    text.includes('voucher') ||
    text.includes('keychain') ||
    text.includes('class') ||
    text.includes('workshop') ||
    text.includes('course')
  ) {
    return { productType: 'EQUIPMENT', commerceCategory: 'ACCESSORY', equipmentCategory: 'ACCESSORY' };
  }

  // Default: Genuine Coffee Beans
  return { productType: 'COFFEE', commerceCategory: 'BEANS' };
}

