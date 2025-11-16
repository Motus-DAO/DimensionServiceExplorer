import { createContext, useContext, useMemo, useState } from 'react';
import { keccak256 } from 'js-sha3';
import { createPublicClient, createWalletClient, http, type WalletArkivClient, type PublicArkivClient } from '@arkiv-network/sdk';
import { mendoza } from '@arkiv-network/sdk/chains';
import { privateKeyToAccount, type Account } from '@arkiv-network/sdk/accounts';
import { eq as sdkEqFn } from '@arkiv-network/sdk/query';

type ArkivAttribute = { key: string; value: string };

type CreateEntityInput = {
  payload: Uint8Array;
  contentType: string;
  attributes: ArkivAttribute[];
  expiresIn?: number;
};

type ArkivReceipt = { entityKey: string; txHash?: string };

type ArkivContextType = {
  accountAddress: string | null;
  isConnected: boolean;
  sdkReady: boolean;
  connect: (config?: { accountAddress?: string; privateKey?: string }) => Promise<void>;
  createEntity: (input: CreateEntityInput) => Promise<ArkivReceipt>;
  mutateEntities: (params: { creates: CreateEntityInput[] }) => Promise<{ receipts: ArkivReceipt[] }>;
  queryEntities: (where: ArkivAttribute[]) => Promise<{ entities: any[] }>;
  ensureChatBase: (polkadotAddress: string) => Promise<string>;
  deriveChatBaseKey: (polkadotAddress: string) => string;
  walletClient: any;
  publicClient: any;
  enc: { encode: (text: string) => Uint8Array };
  eq: (key: string, value: string | number) => any;
};

const ArkivContext = createContext<ArkivContextType | null>(null);

function encodeText(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function toEntityKeyFromParts(parts: any[]): string {
  const s = JSON.stringify(parts);
  return '0x' + keccak256(s);
}

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

export function ArkivProvider({ children }: { children: React.ReactNode }) {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkWalletClient, setSdkWalletClient] = useState<WalletArkivClient | null>(null);
  const [sdkPublicClient, setSdkPublicClient] = useState<PublicArkivClient | null>(null);
  const [sdkEq, setSdkEq] = useState<(key: string, value: string | number) => any>(((key: string, value: string | number) => ({ key, value })));
  const [sdkEnc, setSdkEnc] = useState<{ encode: (text: string) => Uint8Array }>({ encode: (text: string) => new TextEncoder().encode(text) });

  const connect = async (config?: { accountAddress?: string; privateKey?: string }) => {
    const envAddr = process.env.NEXT_PUBLIC_ARKIV_ACCOUNT_ADDRESS;
    const addr = config?.accountAddress || envAddr || null;
    setAccountAddress(addr);
    setIsConnected(!!addr);
    if (addr) {
      writeLocal('arkiv_account_address', addr);
    }
    if (config?.privateKey) {
      writeLocal('arkiv_private_key_set', true);
    }
    try {
      const pk = config?.privateKey || process.env.NEXT_PUBLIC_ARKIV_PRIVATE_KEY;
      let account: Account | undefined = undefined;
      if (pk) {
        account = privateKeyToAccount(pk as `0x${string}`);
      }
      const publicClient = createPublicClient({ chain: mendoza, transport: http('https://mendoza.hoodi.arkiv.network/rpc') });
      const walletClient = createWalletClient({ chain: mendoza, transport: http('https://mendoza.hoodi.arkiv.network/rpc'), account });
      setSdkPublicClient(publicClient);
      setSdkWalletClient(walletClient);
      setSdkEq(() => sdkEqFn);
      setSdkEnc({ encode: (text: string) => new TextEncoder().encode(text) });
      setSdkReady(true);
      console.log('[Arkiv] SDK ready');
    } catch (e) {
      console.error('[Arkiv] SDK init failed', e);
      setSdkReady(false);
    }
  };

  const deriveChatBaseKey = (polkadotAddress: string): string => {
    return '0x' + keccak256('polkadot:' + polkadotAddress.toLowerCase());
  };

  const enc = { encode: (text: string) => new TextEncoder().encode(text) };
  const eq = (key: string, value: string): ArkivAttribute => ({ key, value });

  const createEntity = async (input: CreateEntityInput): Promise<ArkivReceipt> => {
    if (!sdkWalletClient) {
      throw new Error('Arkiv SDK not connected - cannot create entity');
    }
    const res = await (sdkWalletClient as any).createEntity(input);
    try {
      console.log('[Arkiv] createEntity', { contentType: input.contentType, attributes: input.attributes, expiresIn: input.expiresIn, entityKey: res?.entityKey, txHash: res?.txHash });
    } catch {}
    return { entityKey: res?.entityKey as string, txHash: res?.txHash as string };
  };

  const mutateEntities = async (params: { creates: CreateEntityInput[] }) => {
    if (!sdkWalletClient) {
      throw new Error('Arkiv SDK not connected - cannot mutate entities');
    }
    const res = await (sdkWalletClient as any).mutateEntities(params);
    try {
      console.log('[Arkiv] mutateEntities', { creates: params.creates?.length, receipts: res });
    } catch {}
    return res as { receipts: ArkivReceipt[] };
  };

  const queryEntities = async (where: ArkivAttribute[]) => {
    if (!sdkPublicClient) {
      console.warn('[Arkiv] SDK not ready, returning empty results');
      return { entities: [] };
    }
    try {
      const qb = (sdkPublicClient as any).buildQuery();
      const predicates = where.map((c) => sdkEq(c.key, c.value));
      const result = await qb.where(predicates).fetch();
      console.log('[Arkiv] queryEntities', { where, count: (result as any)?.entities?.length ?? (result as any)?.length });
      return result as { entities: any[] };
    } catch (e) {
      console.error('[Arkiv] Query failed', e);
      return { entities: [] };
    }
  };

  const ensureChatBase = async (polkadotAddress: string): Promise<string> => {
    const baseKey = deriveChatBaseKey(polkadotAddress);
    const existing = await queryEntities([
      { key: 'type', value: 'chatBase' },
      { key: 'polkadotAddress', value: polkadotAddress },
    ]);
    if (existing.entities.length > 0) {
      return existing.entities[0].entityKey as string;
    }
    const payload = encodeText('chat-base:' + polkadotAddress);
    const { entityKey } = await createEntity({
      payload,
      contentType: 'text/plain',
      attributes: [
        { key: 'type', value: 'chatBase' },
        { key: 'polkadotAddress', value: polkadotAddress },
        { key: 'chatBaseKey', value: baseKey },
        { key: 'version', value: '1' },
      ],
      expiresIn: 24 * 3600,
    });
    return entityKey;
  };

  const value = useMemo<ArkivContextType>(() => ({
    accountAddress,
    isConnected,
    sdkReady,
    connect,
    createEntity,
    mutateEntities,
    queryEntities,
    ensureChatBase,
    deriveChatBaseKey,
    walletClient: (sdkWalletClient as any) || {
      account: { address: accountAddress || '' },
      createEntity,
      mutateEntities,
    },
    publicClient: (sdkPublicClient as any) || {
      buildQuery: () => ({
        where: (conds: ArkivAttribute[]) => ({ fetch: () => queryEntities(conds) }),
      }),
    },
    enc: sdkEnc,
    eq: sdkEq,
  }), [accountAddress, isConnected, sdkReady, sdkWalletClient, sdkPublicClient, sdkEnc, sdkEq]);

  return <ArkivContext.Provider value={value}>{children}</ArkivContext.Provider>;
}

export function useArkiv() {
  const ctx = useContext(ArkivContext);
  if (!ctx) {
    throw new Error('useArkiv must be used within an ArkivProvider');
  }
  return ctx;
}
