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

const siteUrl = 'https://www.leaftobean.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Specialty Coffee Price Comparison & Best Deals | Leaf to Bean',
    template: '%s | Leaf to Bean',
  },

  description:
    'Compare specialty coffee prices across trusted roasters and find the best overall delivered price. Compare price per 100g, cost per cup, shipping and basket savings.',

  applicationName: 'Leaf to Bean',

  keywords: [
    'specialty coffee',
    'specialty coffee price comparison',
    'coffee price comparison',
    'coffee deals',
    'best coffee deals',
    'cheap specialty coffee',
    'coffee price per 100g',
    'coffee cost per cup',
    'coffee roaster comparison',
    'specialty coffee roasters',
    'coffee shipping comparison',
    'cheapest coffee delivered',
    'coffee basket optimizer',
    'coffee shopping',
    'buy specialty coffee',
    'best specialty coffee prices',
  ],

  authors: [
    {
      name: 'Leaf to Bean',
      url: siteUrl,
    },
  ],

  creator: 'Leaf to Bean',
  publisher: 'Leaf to Bean',

  category: 'Shopping',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Leaf to Bean',

    title: 'Specialty Coffee Price Comparison & Best Deals | Leaf to Bean',

    description:
      'Compare specialty coffee across trusted roasters and find the cheapest overall delivered option, including coffee prices, shipping and free-shipping thresholds.',

    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Leaf to Bean — Specialty Coffee Price Comparison',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Specialty Coffee Price Comparison | Leaf to Bean',

    description:
      'Compare specialty coffee prices, price per 100g, cost per cup and delivery costs to find the best overall value.',

    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Browser tab favicon
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <body className="min-h-screen flex flex-col justify-between antialiased bg-[#faf7f2] text-stone-900 selection:bg-amber-900 selection:text-amber-50">
        <BasketProvider>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <BasketDrawer />

          <PriceAlertsDrawer />

          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}