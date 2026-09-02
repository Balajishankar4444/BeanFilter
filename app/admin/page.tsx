'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Clock, Server, AlertCircle, Play, Layers, Zap, ShieldCheck } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/formatCurrency';

export default function AdminDashboardPage() {
  const [roasters, setRoasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number; currentRoasterName: string } | null>(null);
  const [syncingSingleId, setSyncingSingleId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    fetchRoasters();
  }, []);

  const fetchRoasters = async () => {
    try {
      const res = await fetch('/api/roasters', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setRoasters(data.roasters);
      }
    } catch (e) {
      console.error('Failed to fetch roasters', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSingleRoaster = async (roasterId: string, roasterName: string, force = true) => {
    setSyncingSingleId(roasterId);
    setMessage(null);
    setErrorDetails(null);

    setRoasters((prev) =>
      prev.map((r) => (r.id === roasterId ? { ...r, syncStatus: 'SYNCING' } : r))
    );

    try {
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roasterId, force }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(data.message || `Successfully synced ${roasterName}!`);
      } else {
        setErrorDetails(`Sync note for ${roasterName}: ${data.message || data.error}`);
      }
    } catch (e: any) {
      setErrorDetails(`Error syncing ${roasterName}: ${e.message}`);
    } finally {
      setSyncingSingleId(null);
      await fetchRoasters();
    }
  };

  const handleTriggerSyncAll = async (force: boolean) => {
    if (roasters.length === 0) return;

    setSyncing(true);
    setMessage(null);
    setErrorDetails(null);

    let totalSyncedProducts = 0;
    let successCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < roasters.length; i++) {
      const targetRoaster = roasters[i];
      setSyncProgress({
        current: i + 1,
        total: roasters.length,
        currentRoasterName: targetRoaster.name,
      });

      setRoasters((prev) =>
        prev.map((r) => (r.id === targetRoaster.id ? { ...r, syncStatus: 'SYNCING' } : r))
      );

      try {
        const res = await fetch('/api/admin/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roasterId: targetRoaster.id, force }),
        });

        const data = await res.json();
        if (data.status === 'SYNCED') {
          totalSyncedProducts += data.productsSynced || 0;
          successCount++;
        } else if (data.status === 'SKIPPED_FRESH') {
          skippedCount++;
        } else {
          failedCount++;
        }
      } catch (e) {
        failedCount++;
      }

      await fetchRoasters();
    }

    setSyncProgress(null);
    setSyncing(false);

    setMessage(
      `🎉 Sync complete: ${successCount} synced (${totalSyncedProducts} products), ${skippedCount} skipped (fresh), ${failedCount} failed.`
    );
  };

  const totalProducts = roasters.reduce((acc, r) => acc + (r.productCount || 0), 0);
  const activeSyncingRoaster = roasters.find((r) => r.syncStatus === 'SYNCING');

  const getFreshnessLabel = (lastSyncAt: string | null) => {
    if (!lastSyncAt) return { text: 'Stale (Never Synced)', color: 'text-amber-800 bg-amber-100' };
    const diffHours = (Date.now() - new Date(lastSyncAt).getTime()) / (1000 * 60 * 60);
    if (diffHours < 6) {
      return { text: `Fresh (${diffHours < 1 ? 'just now' : `${Math.round(diffHours)}h ago`})`, color: 'text-emerald-800 bg-emerald-100' };
    }
    return { text: `Stale (${Math.round(diffHours)}h ago)`, color: 'text-stone-700 bg-stone-200' };
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center gap-2">
            <Server className="h-7 w-7 text-amber-800" />
            <span>Intelligent Sync & Ingestion Dashboard</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Automated scheduled cron syncs, smart cache invalidation, price drop alert tracking, and live roaster metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriggerSyncAll(false)}
            disabled={syncing || syncingSingleId !== null}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-stone-900 bg-amber-200 border border-amber-300 hover:bg-amber-300 transition-all ${
              syncing ? 'opacity-75 cursor-not-allowed' : 'active:scale-95'
            }`}
            title="Only sync roasters that are stale or failed"
          >
            <Zap className="h-4 w-4 text-amber-900" />
            <span>Smart Sync (Only Stale)</span>
          </button>

          <button
            onClick={() => handleTriggerSyncAll(true)}
            disabled={syncing || syncingSingleId !== null}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow transition-all ${
              syncing
                ? 'bg-amber-800 opacity-75 cursor-not-allowed'
                : 'bg-amber-900 hover:bg-amber-800 active:scale-95'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Synchronizing All...' : 'Force Sync All'}</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase">Configured Roasters</span>
            <Server className="h-4 w-4 text-amber-800" />
          </div>
          <p className="text-2xl font-black text-stone-900">{roasters.length}</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase">Total Products</span>
            <Layers className="h-4 w-4 text-amber-800" />
          </div>
          <p className="text-2xl font-black text-amber-900">{totalProducts}</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase">Automated Cron</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-base font-extrabold text-emerald-800">Active (Twice Daily)</p>
          <span className="text-[10px] font-semibold text-stone-400">Vercel Cron /api/cron/sync</span>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase">System Status</span>
            <RefreshCw className={`h-4 w-4 ${syncing || syncingSingleId ? 'animate-spin text-amber-600' : 'text-emerald-600'}`} />
          </div>
          <p className="text-base font-extrabold text-stone-900">
            {syncProgress
              ? `Syncing (${syncProgress.current}/${syncProgress.total})`
              : syncingSingleId
              ? 'Syncing Single...'
              : 'Idle (Ready)'}
          </p>
        </div>
      </div>

      {/* Live Step-by-Step Sync Progress Banner */}
      {syncProgress && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-900 to-stone-900 text-white p-5 shadow-lg border border-amber-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-black">
                  Syncing {syncProgress.currentRoasterName} ({syncProgress.current} of {syncProgress.total})
                </p>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  Fetching live products from Shopify API & saving to Supabase PostgreSQL...
                </p>
              </div>
            </div>
            <span className="text-xs font-black bg-amber-400 text-stone-950 px-2.5 py-1 rounded-full">
              {Math.round((syncProgress.current / syncProgress.total) * 100)}%
            </span>
          </div>

          <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Feedback Messages */}
      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {errorDetails && (
        <div className="rounded-xl bg-red-50 border border-red-300 p-4 text-xs font-bold text-red-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{errorDetails}</span>
        </div>
      )}

      {/* Roasters Status Table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Configured Specialty Roasters</h3>
          <span className="text-xs font-semibold text-stone-500">Live Status Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="border-b border-stone-200 bg-stone-100/70 uppercase text-[10px] font-bold tracking-wider text-stone-500">
              <tr>
                <th className="px-6 py-3">Roaster</th>
                <th className="px-6 py-3">Source API</th>
                <th className="px-6 py-3">Products</th>
                <th className="px-6 py-3">Freshness</th>
                <th className="px-6 py-3">Last Sync</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-stone-400 font-bold">
                    Loading roasters...
                  </td>
                </tr>
              ) : roasters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-stone-400 font-bold">
                    No roasters configured.
                  </td>
                </tr>
              ) : (
                roasters.map((r) => {
                  const isRowSyncing = r.syncStatus === 'SYNCING' || syncingSingleId === r.id;
                  const freshness = getFreshnessLabel(r.lastSyncAt);

                  return (
                    <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-stone-900">
                        <a
                          href={r.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-amber-900"
                        >
                          {r.name}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-stone-500">Shopify Public JSON</td>
                      <td className="px-6 py-4 font-extrabold text-stone-900">
                        {r.productCount} products
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${freshness.color}`}>
                          {freshness.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-stone-400" />
                          <span>{r.lastSyncAt ? new Date(r.lastSyncAt).toLocaleTimeString() : 'Never'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isRowSyncing ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-800 font-extrabold animate-pulse">
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Syncing...
                          </span>
                        ) : r.syncStatus === 'SUCCESS' || r.syncStatus === 'IDLE' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 font-extrabold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Active
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-red-800 font-extrabold"
                            title={r.syncError || 'Sync failed'}
                          >
                            <XCircle className="h-3.5 w-3.5 text-red-600" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSyncSingleRoaster(r.id, r.name, true)}
                          disabled={syncing || syncingSingleId !== null}
                          className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:border-amber-800 hover:text-amber-900 active:scale-95 disabled:opacity-50"
                          title={`Sync ${r.name} now`}
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Sync</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
