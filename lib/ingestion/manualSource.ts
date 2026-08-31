import { DataSource, RawIngestedProduct } from './types';

export class ManualSource implements DataSource {
  name = 'Manual Seed Connector';
  type = 'MANUAL' as const;

  private seedMap: Record<string, RawIngestedProduct[]> = {};

  constructor(seedMap: Record<string, RawIngestedProduct[]> = {}) {
    this.seedMap = seedMap;
  }

  async fetchProducts(roasterWebsiteUrl: string): Promise<RawIngestedProduct[]> {
    return this.seedMap[roasterWebsiteUrl] || [];
  }
}
