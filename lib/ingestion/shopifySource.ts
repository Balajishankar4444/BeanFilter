import { DataSource, RawIngestedProduct, RawIngestedVariant } from './types';
import { extractFlavorNotes, parseCoffeeCategory, parseFarmName, parseOriginCountry, parseProcessMethod, parseRoastLevel, parseWeightG } from './normalizer';

export class ShopifySource implements DataSource {
  name = 'Shopify Public Endpoint Connector';
  type = 'SHOPIFY' as const;

  async fetchProducts(roasterWebsiteUrl: string): Promise<RawIngestedProduct[]> {
    const cleanUrl = roasterWebsiteUrl.replace(/\/$/, '');
    const endpoint = `${cleanUrl}/products.json?limit=250`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          'User-Agent': 'CoffeePriceAggregatorBot/1.0 (+https://coffee-aggregator.com)',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${endpoint}`);
      }

      const data = await response.json();
      const shopifyProducts = data.products || [];

      const rawProducts: RawIngestedProduct[] = [];

      for (const p of shopifyProducts) {
        const titleLower = p.title.toLowerCase();
        const typeLower = (p.product_type || '').toLowerCase();
        const tagsLower = (p.tags || []).join(' ').toLowerCase();

        if (
          typeLower.includes('merch') ||
          typeLower.includes('gear') ||
          typeLower.includes('equipment') ||
          titleLower.includes('t-shirt') ||
          titleLower.includes('mug') ||
          titleLower.includes('filter paper') ||
          titleLower.includes('gift card')
        ) {
          continue;
        }

        const fullDescription = p.body_html ? p.body_html.replace(/<[^>]*>?/gm, ' ') : '';
        const combinedText = `${p.title} ${fullDescription} ${tagsLower}`;

        const variants: RawIngestedVariant[] = (p.variants || []).map((v: any) => {
          const rawPrice = parseFloat(v.price) || 0;
          const weightG = parseWeightG(v.title || p.title, combinedText);

          return {
            title: v.title,
            price: rawPrice,
            weightG,
            sku: v.sku || undefined,
            available: v.available !== false,
          };
        });

        if (variants.length === 0) continue;

        const imageUrl = p.images && p.images[0] ? p.images[0].src : undefined;
        const productUrl = `${cleanUrl}/products/${p.handle}`;
        const flavorNotes = extractFlavorNotes(combinedText);
        const originCountry = parseOriginCountry(combinedText);
        const process = parseProcessMethod(combinedText);
        const roastLevel = parseRoastLevel(combinedText);
        const category = parseCoffeeCategory(combinedText);
        const farm = parseFarmName(combinedText) || undefined;

        // Detect currency if available in Shopify variant object
        const detectedCurrency =
          p.variants && p.variants[0]?.price_currency
            ? String(p.variants[0].price_currency).toUpperCase()
            : p.currency
            ? String(p.currency).toUpperCase()
            : undefined;

        rawProducts.push({
          externalId: String(p.id),
          name: p.title,
          slug: p.handle,
          originCountry,
          farm,
          category,
          process,
          roastLevel,
          description: fullDescription.substring(0, 300),
          imageUrl,
          productUrl,
          currency: detectedCurrency,
          flavorNotes,
          variants,
        });
      }

      return rawProducts;
    } catch (error) {
      console.error(`Failed to fetch Shopify products for ${roasterWebsiteUrl}:`, error);
      return [];
    }
  }
}
