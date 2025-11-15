import { createContext, useContext, useMemo, useState } from 'react';

type HyperbridgeContextType = {
  isReady: boolean;
  setup: (config?: { indexerUrl?: string }) => Promise<void>;
  requestSessionVerification: (entityKey: string, polkadotAddress: string, sessionId: string) => Promise<{ commitmentHash: string }>;
  monitorVerification: (commitmentHash: string) => Promise<'delivered' | 'timeout' | 'unknown'>;
  markVerified: (polkadotAddress: string, sessionId: string) => void;
  isSessionVerified: (polkadotAddress: string, sessionId: string) => boolean;
};

const HyperbridgeContext = createContext<HyperbridgeContextType | null>(null);

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {}
}

export function HyperbridgeProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [indexer, setIndexer] = useState<any>(null);

  const setup = async (config?: { indexerUrl?: string }) => {
    const url = config?.indexerUrl || process.env.NEXT_PUBLIC_HYPERBRIDGE_INDEXER_URL || '';
    if (!url) {
      setIsReady(true);
      return;
    }
    try { console.log('[Hyperbridge] setup', { url }); } catch {}
    try {
      const mod: any = await (0, eval)('import("@hyperbridge/sdk")');
      const qc = mod.createQueryClient({ url });
      const idx = new mod.IndexerClient({ queryClient: qc, pollInterval: 1000 });
      setIndexer(idx);
      try { console.log('[Hyperbridge] indexer ready'); } catch {}
      setIsReady(true);
    } catch {
      try { console.warn('[Hyperbridge] failed to load sdk, proceeding without indexer'); } catch {}
      setIsReady(true);
    }
  };

  const requestSessionVerification = async (entityKey: string, polkadotAddress: string, sessionId: string) => {
    const hash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
    const k = `psychat_hyperbridge_commit_${polkadotAddress}`;
    const arr = readLocal<{ hash: string; entityKey: string; sessionId: string }[]>(k, []);
    arr.push({ hash, entityKey, sessionId });
    writeLocal(k, arr);
    return { commitmentHash: hash };
  };

  const monitorVerification = async (commitmentHash: string) => {
    if (!indexer) return 'unknown';
    try {
      const req = await indexer.queryRequestWithStatus(commitmentHash);
      const statuses = (req as any)?.statuses || [];
      const delivered = statuses.some((s: any) => String(s.status || '').toLowerCase().includes('delivered'));
      if (delivered) return 'delivered';
      const timedOut = statuses.some((s: any) => String(s.status || '').toLowerCase().includes('timeout'));
      if (timedOut) return 'timeout';
      return 'unknown';
    } catch {
      return 'unknown';
    }
  };

  const markVerified = (polkadotAddress: string, sessionId: string) => {
    const k = `psychat_verified_${polkadotAddress}`;
    const obj = readLocal<Record<string, boolean>>(k, {});
    obj[sessionId] = true;
    writeLocal(k, obj);
  };

  const isSessionVerified = (polkadotAddress: string, sessionId: string) => {
    const k = `psychat_verified_${polkadotAddress}`;
    const obj = readLocal<Record<string, boolean>>(k, {});
    return !!obj[sessionId];
  };

  const value = useMemo<HyperbridgeContextType>(() => ({
    isReady,
    setup,
    requestSessionVerification,
    monitorVerification,
    markVerified,
    isSessionVerified,
  }), [isReady, indexer]);

  return <HyperbridgeContext.Provider value={value}>{children}</HyperbridgeContext.Provider>;
}

export function useHyperbridge() {
  const ctx = useContext(HyperbridgeContext);
  if (!ctx) throw new Error('useHyperbridge must be used within a HyperbridgeProvider');
  return ctx;
}
