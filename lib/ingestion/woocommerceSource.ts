import { DataSource, RawIngestedProduct, RawIngestedVariant } from './types';
import { extractFlavorNotes, parseOriginCountry, parseProcessMethod, parseRoastLevel, parseWeightG } from './normalizer';

export class WooCommerceSource implements DataSource {
  name = 'WooCommerce Store Connector';
  type = 'WOOCOMMERCE' as const;

  async fetchProducts(roasterWebsiteUrl: string): Promise<RawIngestedProduct[]> {
    const cleanUrl = roasterWebsiteUrl.replace(/\/$/, '');
    const endpoint = `${cleanUrl}/wp-json/wc/store/v1/products?per_page=100`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          'User-Agent': 'CoffeePriceAggregatorBot/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${endpoint}`);
      }

      const products = await response.json();
      const rawProducts: RawIngestedProduct[] = [];

      for (const p of products) {
        const titleLower = (p.name || '').toLowerCase();
        if (titleLower.includes('mug') || titleLower.includes('shirt') || titleLower.includes('gift card')) {
          continue;
        }

        const description = p.description ? p.description.replace(/<[^>]*>?/gm, ' ') : '';
        const combinedText = `${p.name} ${description}`;

        const price = parseFloat(p.prices?.price ? (parseInt(p.prices.price, 10) / 100).toFixed(2) : '0') || 18.00;
        const weightG = parseWeightG(p.name, description);

        const variants: RawIngestedVariant[] = [
          {
            title: `${weightG}g Bag`,
            price,
            weightG,
            available: p.is_in_stock !== false,
          },
        ];

        const imageUrl = p.images && p.images[0] ? p.images[0].src : undefined;
        const flavorNotes = extractFlavorNotes(combinedText);
        const originCountry = parseOriginCountry(combinedText);
        const process = parseProcessMethod(combinedText);
        const roastLevel = parseRoastLevel(combinedText);

        rawProducts.push({
          externalId: String(p.id),
          name: p.name,
          slug: p.slug || p.id.toString(),
          originCountry,
          process,
          roastLevel,
          description: description.substring(0, 300),
          imageUrl,
          productUrl: p.permalink || `${cleanUrl}/product/${p.slug}`,
          flavorNotes,
          variants,
        });
      }

      return rawProducts;
    } catch (error) {
      console.error(`Failed to fetch WooCommerce products for ${roasterWebsiteUrl}:`, error);
      return [];
    }
  }
}
