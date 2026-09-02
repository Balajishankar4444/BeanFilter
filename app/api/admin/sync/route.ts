import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { syncSingleRoaster } from '@/lib/ingestion/syncEngine';

export const maxDuration = 60; // Vercel serverless execution limit

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { roasterId, force = true } = body;

    if (roasterId) {
      const result = await syncSingleRoaster(roasterId, { force });
      return NextResponse.json({
        success: result.status !== 'FAILED',
        ...result,
      });
    }

    // Sync all roasters sequentially if no single roasterId passed
    const roasters = await prisma.roaster.findMany({ select: { id: true } });
    let totalSyncedProducts = 0;
    let totalAlertsTriggered = 0;
    let successCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const r of roasters) {
      const res = await syncSingleRoaster(r.id, { force });
      if (res.status === 'SYNCED') {
        successCount++;
        totalSyncedProducts += res.productsSynced;
        totalAlertsTriggered += res.priceAlertsTriggered;
      } else if (res.status === 'SKIPPED_FRESH') {
        skippedCount++;
      } else {
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Completed sync: ${successCount} synced (${totalSyncedProducts} products), ${skippedCount} skipped (fresh), ${failedCount} failed.`,
      totalSyncedProducts,
      totalAlertsTriggered,
      successCount,
      skippedCount,
      failedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
