import type { Metadata } from 'next';

import { Plus_Jakarta_Sans } from 'next/font/google';

import './globals.css';

import { AuthProvider } from '@/context/AuthContext';

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
    'Compare specialty coffee prices from trusted roasters and find the best overall delivered price. Compare price per 100g, cost per cup, shipping and basket savings.',

  applicationName: 'Leaf to Bean',

  keywords: [
    'specialty coffee',
    'specialty coffee price comparison',
    'coffee price comparison',
    'coffee deals',
    'best coffee deals',
    'specialty coffee roasters',
    'coffee price per 100g',
    'coffee cost per cup',
    'coffee roaster comparison',
    'coffee shipping comparison',
    'cheapest specialty coffee',
    'best specialty coffee prices',
    'buy specialty coffee',
    'coffee basket optimizer',
    'coffee shopping',
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

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Leaf to Bean',

    title: 'Specialty Coffee Price Comparison & Best Deals | Leaf to Bean',

    description:
      'Compare specialty coffee prices across trusted roasters and find the best overall delivered price, including coffee prices, shipping and free-shipping thresholds.',

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

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  other: {
    'impact-site-verification': '2264b258-5d77-4de1-84d3-12edc6971eb2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <head>
        <meta name="impact-site-verification" content="2264b258-5d77-4de1-84d3-12edc6971eb2" />
        <meta {...({ name: 'impact-site-verification', value: '2264b258-5d77-4de1-84d3-12edc6971eb2' } as Record<string, string>)} />
      </head>
      <body className="min-h-screen flex flex-col justify-between antialiased bg-[#faf7f2] text-stone-900 selection:bg-amber-900 selection:text-amber-50">
        <AuthProvider>
          <BasketProvider>
            <Navbar />

            <main className="flex-1">
              {children}
            </main>

            <BasketDrawer />

            <PriceAlertsDrawer />

            <Footer />
          </BasketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}