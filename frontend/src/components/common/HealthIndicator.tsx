'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { HealthStatus } from '@/types';

export function HealthIndicator() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API offline');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const runCheck = async () => {
      try {
        const data = await api.getHealth();
        if (isMounted) {
          setHealth(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'API offline');
          setHealth(null);
          setLoading(false);
        }
      }
    };

    runCheck();
    const interval = setInterval(runCheck, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading && !health && !error) {
    return (
      <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Connecting API...</span>
      </div>
    );
  }

  if (error || !health) {
    return (
      <button
        onClick={checkHealth}
        title={`Backend unreachable: ${error}. Click to retry.`}
        className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded-full hover:bg-rose-900/30 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <span>Backend Offline (Retry)</span>
      </button>
    );
  }

  return (
    <div
      title={`Backend: ${health.message} | DB: ${health.database || 'unknown'}`}
      className="flex items-center space-x-2.5 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-full"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>API Online</span>
      <span className="text-slate-500 text-[10px]">|</span>
      <span className="text-slate-400 text-[11px]">
        DB: {health.database === 'connected' ? 'PostgreSQL' : 'Checking'}
      </span>
    </div>
  );
}
