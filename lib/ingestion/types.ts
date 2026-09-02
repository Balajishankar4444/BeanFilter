export interface RawIngestedVariant {
  title: string;
  price: number;
  weightG?: number;
  sku?: string;
  available: boolean;
}

export interface RawIngestedProduct {
  externalId?: string;
  name: string;
  slug: string;
  originCountry?: string;
  region?: string;
  farm?: string;
  producer?: string;
  category?: string;
  process?: string;
  roastLevel?: string;
  description?: string;
  imageUrl?: string;
  productUrl: string;
  affiliateUrl?: string;
  currency?: string;
  flavorNotes?: string[];
  variants: RawIngestedVariant[];
}

export interface DataSource {
  name: string;
  type: 'SHOPIFY' | 'WOOCOMMERCE' | 'FEED' | 'MANUAL';
  fetchProducts(roasterWebsiteUrl: string): Promise<RawIngestedProduct[]>;
}
