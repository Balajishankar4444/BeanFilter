'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Clock, Server, AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [roasters, setRoasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRoasters();
  }, []);

  const fetchRoasters = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/roasters');
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

  const handleTriggerSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage('Roaster synchronization completed successfully!');
        fetchRoasters();
      } else {
        setMessage(`Sync error: ${data.error}`);
      }
    } catch (e: any) {
      setMessage(`Error triggering sync: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center gap-2">
            <Server className="h-7 w-7 text-amber-800" />
            <span>Admin Data Ingestion Dashboard</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Monitor public Shopify data connectors, product counts, and last synchronization timestamps.
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={syncing}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow transition-all ${
            syncing ? 'bg-amber-800 opacity-75 cursor-not-allowed' : 'bg-amber-900 hover:bg-amber-800 active:scale-95'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Synchronizing...' : 'Trigger Sync Job'}</span>
        </button>
      </div>

      {message && (
        <div className="rounded-xl bg-amber-100 border border-amber-300 p-4 text-xs font-bold text-amber-900">
          {message}
        </div>
      )}

      {/* Roasters Status Table (Spec Section 17) */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50 px-6 py-4">
          <h3 className="text-sm font-bold text-stone-900">Configured Specialty Roasters</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="border-b border-stone-200 bg-stone-100/70 uppercase text-[10px] font-bold tracking-wider text-stone-500">
              <tr>
                <th className="px-6 py-3">Roaster</th>
                <th className="px-6 py-3">Source API</th>
                <th className="px-6 py-3">Products</th>
                <th className="px-6 py-3">Shipping Rule</th>
                <th className="px-6 py-3">Last Sync</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {roasters.map((r) => (
                <tr key={r.id} className="hover:bg-amber-50/40">
                  <td className="px-6 py-4 font-bold text-stone-900">{r.name}</td>
                  <td className="px-6 py-4 text-stone-500">Shopify Public JSON</td>
                  <td className="px-6 py-4 font-bold text-stone-900">{r.productCount} products</td>
                  <td className="px-6 py-4 text-stone-600">
                    {r.shippingThreshold
                      ? `Free over $${r.shippingThreshold.toFixed(2)}`
                      : `$${r.baseShippingCost.toFixed(2)} flat`}
                  </td>
                  <td className="px-6 py-4 text-stone-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{r.lastSyncAt ? new Date(r.lastSyncAt).toLocaleTimeString() : 'Never'}</span>
                  </td>
                  <td className="px-6 py-4">
                    {r.syncStatus === 'SUCCESS' || r.syncStatus === 'IDLE' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 🟢 Active
                      </span>
                    ) : r.syncStatus === 'SYNCING' ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold animate-pulse">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Syncing...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700 font-bold">
                        <XCircle className="h-4 w-4 text-red-600" /> 🔴 Sync Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
