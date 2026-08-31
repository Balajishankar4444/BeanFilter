import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BasketProvider } from '@/context/BasketContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BasketDrawer } from '@/components/BasketDrawer';
import { PriceAlertsDrawer } from '@/components/PriceAlertsDrawer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'BeanDeals — Specialty Coffee Price & Delivered Basket Aggregator',
  description: 'Find the cheapest way to buy specialty coffee across multiple roasters, including shipping.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <body className="min-h-screen flex flex-col justify-between antialiased bg-[#faf7f2] text-stone-900 selection:bg-amber-900 selection:text-amber-50">
        <BasketProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <BasketDrawer />
          <PriceAlertsDrawer />
          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}
