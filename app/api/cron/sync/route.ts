import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { syncSingleRoaster } from '@/lib/ingestion/syncEngine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Verify Vercel Cron Authorization header if CRON_SECRET is set
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized cron request' }, { status: 401 });
  }

  try {
    const roasters = await prisma.roaster.findMany({ select: { id: true } });
    let syncedCount = 0;
    let skippedCount = 0;
    let totalProducts = 0;

    for (const r of roasters) {
      // Automatic cron sync only syncs stale roasters (force: false)
      const res = await syncSingleRoaster(r.id, { force: false });
      if (res.status === 'SYNCED') {
        syncedCount++;
        totalProducts += res.productsSynced;
      } else if (res.status === 'SKIPPED_FRESH') {
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: `Automated cron sync completed: ${syncedCount} stale roasters synced (${totalProducts} products), ${skippedCount} roasters skipped (fresh).`,
    });
  } catch (err: any) {
    console.error('Automated cron sync error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
