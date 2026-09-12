import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { EquipmentItem, TOP_EQUIPMENT_ITEMS } from '@/lib/equipmentRegistry';
import EquipmentCatalogClient from './EquipmentCatalogClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explore Coffee Equipment, Grinders & Espresso Machines | Setup Guide',
  description:
    'Search and compare top coffee grinders, espresso machines, gooseneck kettles, barista scales, and drip coffee makers from Baratza, Fellow, Breville, and Acaia.',
  keywords: [
    'coffee grinders',
    'best espresso machines',
    'Baratza Encore ESP',
    'Breville Barista Express',
    'Fellow Ode Gen 2',
    'Fellow Stagg EKG',
    'Moccamaster KBGV Select',
    'Acaia Pearl Scale',
    'coffee equipment reviews',
  ],
  alternates: {
    canonical: '/equipment',
  },
};

export default async function EquipmentPage() {
  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({
      where: {
        OR: [
          { productType: 'EQUIPMENT' },
          {
            commerceCategory: {
              in: [
                'GRINDER',
                'ESPRESSO_MACHINE',
                'BREWER',
                'KETTLE',
                'SCALE',
                'DRINKWARE',
                'FILTERS_ACCESSORIES',
                'ACCESSORY',
              ],
            },
          },
        ],
      },
      include: {
        roaster: true,
        variants: true,
      },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Failed to load equipment products from database:', error);
  }

  // Map database equipment products to EquipmentItem structure
  const dbEquipment: EquipmentItem[] = dbProducts.map((p) => {
    const variant = p.variants[0] || { price: 150 };
    const brandName = p.brand || p.roaster?.name?.replace(/ Equipment| Products| Coffee/g, '') || 'Specialty Brand';

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: brandName,
      category: (p.commerceCategory || 'GRINDER') as any,
      price: variant.price,
      currency: 'USD',
      imageUrl: p.imageUrl || '',
      affiliateUrl: p.affiliateUrl || p.productUrl || p.roaster?.websiteUrl || 'https://fellowproducts.com',
      affiliateNetwork: p.roaster?.affiliateNetwork || 'Impact / Awin',
      commissionRate: p.roaster?.commissionRate || 8.0,
      estimatedYieldUsd: (variant.price * (p.roaster?.commissionRate || 8.0)) / 100,
      editorialRating: p.editorialRating || 4.8,
      description: p.description || `${p.name} engineered for precision specialty coffee brewing.`,
      features: ['Precision Engineering', 'Barista Approved', 'Commercial Durability'],
      bestFor: `Top Choice in ${p.commerceCategory || 'Equipment'}`,
      isFeatured: p.roaster?.affiliateTier === 'FEATURED_AFFILIATE',
    };
  });

  // Combine curated top equipment with database equipment (deduping by slug)
  const combinedMap = new Map<string, EquipmentItem>();
  TOP_EQUIPMENT_ITEMS.forEach((item) => combinedMap.set(item.slug, item));
  dbEquipment.forEach((item) => combinedMap.set(item.slug, item));
  const allEquipment = Array.from(combinedMap.values());

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-900 animate-fade-up">
      <EquipmentCatalogClient initialEquipment={allEquipment} />
    </main>
  );
}
