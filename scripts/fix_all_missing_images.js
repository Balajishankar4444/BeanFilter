const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const https = require('https');
const http = require('http');

function fetchJson(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) return resolve(null);
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
  });
}

// Normalize a string for fuzzy matching
function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function main() {
  console.log('=== COMPREHENSIVE BACKEND API IMAGE SYNC ===\n');

  const roasters = await prisma.roaster.findMany({
    include: { products: true },
  });

  let totalFixed = 0;
  let totalStillMissing = 0;

  for (const roaster of roasters) {
    if (!roaster.websiteUrl) continue;

    const fallbackProducts = roaster.products.filter(
      (p) => !p.imageUrl || p.imageUrl.includes('unsplash')
    );

    if (fallbackProducts.length === 0) continue;

    const cleanUrl = roaster.websiteUrl.replace(/\/$/, '');

    // Try fetching all pages of products (Shopify paginates at 250)
    let allShopifyProducts = [];
    let page = 1;
    while (true) {
      const endpoint = `${cleanUrl}/products.json?limit=250&page=${page}`;
      const data = await fetchJson(endpoint);
      if (!data || !data.products || data.products.length === 0) break;
      allShopifyProducts = allShopifyProducts.concat(data.products);
      if (data.products.length < 250) break;
      page++;
    }

    if (allShopifyProducts.length === 0) {
      console.log(`❌ ${roaster.name}: API returned 0 products (blocked or empty)`);
      totalStillMissing += fallbackProducts.length;

      // For these, try to construct a plausible product page URL and scrape the og:image
      for (const dbp of fallbackProducts) {
        // Last resort: try /products/{slug}.json for individual product
        const singleEndpoint = `${cleanUrl}/products/${dbp.slug}.json`;
        const singleData = await fetchJson(singleEndpoint);
        if (singleData && singleData.product && singleData.product.images && singleData.product.images[0]) {
          await prisma.product.update({
            where: { id: dbp.id },
            data: { imageUrl: singleData.product.images[0].src },
          });
          totalFixed++;
          totalStillMissing--;
          console.log(`  ✅ Fixed via single-product API: "${dbp.name}"`);
        }
      }
      continue;
    }

    console.log(`🔍 ${roaster.name}: ${allShopifyProducts.length} API products, ${fallbackProducts.length} need fixing`);

    // Build lookup maps for matching
    const byHandle = {};
    const byNormTitle = {};
    for (const sp of allShopifyProducts) {
      if (!sp.images || !sp.images[0] || !sp.images[0].src) continue;
      byHandle[sp.handle] = sp.images[0].src;
      byNormTitle[norm(sp.title)] = sp.images[0].src;
    }

    for (const dbp of fallbackProducts) {
      let matchedUrl = null;

      // Strategy 1: Exact slug match
      if (byHandle[dbp.slug]) {
        matchedUrl = byHandle[dbp.slug];
      }

      // Strategy 2: Normalized title match
      if (!matchedUrl && byNormTitle[norm(dbp.name)]) {
        matchedUrl = byNormTitle[norm(dbp.name)];
      }

      // Strategy 3: Partial slug match (slug contains handle or handle contains slug)
      if (!matchedUrl) {
        for (const [handle, imgUrl] of Object.entries(byHandle)) {
          if (dbp.slug.includes(handle) || handle.includes(dbp.slug)) {
            matchedUrl = imgUrl;
            break;
          }
        }
      }

      // Strategy 4: Fuzzy keyword match - find best overlap
      if (!matchedUrl) {
        const dbWords = norm(dbp.name).match(/.{3,}/g) || [];
        let bestScore = 0;
        let bestUrl = null;
        for (const sp of allShopifyProducts) {
          if (!sp.images || !sp.images[0] || !sp.images[0].src) continue;
          const spNorm = norm(sp.title);
          let score = 0;
          for (const w of dbWords) {
            if (spNorm.includes(w)) score++;
          }
          if (score > bestScore) {
            bestScore = score;
            bestUrl = sp.images[0].src;
          }
        }
        if (bestScore >= 2) {
          matchedUrl = bestUrl;
        }
      }

      // Strategy 5: Try individual product JSON endpoint
      if (!matchedUrl) {
        const singleEndpoint = `${cleanUrl}/products/${dbp.slug}.json`;
        const singleData = await fetchJson(singleEndpoint);
        if (singleData && singleData.product && singleData.product.images && singleData.product.images[0]) {
          matchedUrl = singleData.product.images[0].src;
        }
      }

      if (matchedUrl) {
        await prisma.product.update({
          where: { id: dbp.id },
          data: { imageUrl: matchedUrl },
        });
        totalFixed++;
        console.log(`  ✅ "${dbp.name}" → ${matchedUrl.substring(0, 80)}...`);
      } else {
        totalStillMissing++;
        console.log(`  ⚠️  No API match: "${dbp.name}" (slug: ${dbp.slug})`);
      }
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Fixed: ${totalFixed}`);
  console.log(`Still missing: ${totalStillMissing}`);

  // Final count
  const totalProducts = await prisma.product.count();
  const stillUnsplash = await prisma.product.count({
    where: { imageUrl: { contains: 'unsplash' } },
  });
  const withCdn = await prisma.product.count({
    where: { imageUrl: { contains: 'cdn.shopify.com' } },
  });
  console.log(`\nTotal products: ${totalProducts}`);
  console.log(`With real CDN images: ${withCdn} (${((withCdn / totalProducts) * 100).toFixed(1)}%)`);
  console.log(`Still on Unsplash fallback: ${stillUnsplash} (${((stillUnsplash / totalProducts) * 100).toFixed(1)}%)`);

  if (stillUnsplash > 0) {
    console.log('\n--- REMAINING UNSPLASH PRODUCTS ---');
    const remaining = await prisma.product.findMany({
      where: { imageUrl: { contains: 'unsplash' } },
      select: { id: true, name: true, slug: true, roaster: { select: { name: true } } },
    });
    for (const r of remaining) {
      console.log(`  ${r.roaster.name} | "${r.name}" | slug: ${r.slug}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
