"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePolkadotWallet } from './PolkadotWalletContext';

// Standalone functions to interact with Arkiv without hooks
async function loadXXIdentityFromArkiv(walletAddress: string): Promise<string | null> {
  try {
    const arkivChat = (window as any).__arkivChatInstance;
    if (!arkivChat || !arkivChat.getXXIdentity) {
      console.log('[XX] Arkiv chat not available, cannot load identity');
      return null;
    }
    const identity = await arkivChat.getXXIdentity();
    console.log('[XX] Loaded identity from Arkiv', { found: !!identity });
    return identity;
  } catch (e) {
    console.error('[XX] Failed to load identity from Arkiv', e);
    return null;
  }
}

async function storeXXIdentityToArkiv(walletAddress: string, identity: string): Promise<void> {
  try {
    const arkivChat = (window as any).__arkivChatInstance;
    if (!arkivChat || !arkivChat.storeXXIdentity) {
      console.log('[XX] Arkiv chat not available, cannot store identity');
      return;
    }
    await arkivChat.storeXXIdentity(identity);
    console.log('[XX] Stored identity to Arkiv');
  } catch (e) {
    console.error('[XX] Failed to store identity to Arkiv', e);
  }
}

interface XXMessage {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: number;
  channelId: string;
}

interface XXChannel {
  channelId: string;
  sessionId: string;
  createdAt: number;
  messageCount: number;
}

type XXContextType = {
  ready: boolean;
  sendDirectMessage: (text: string) => Promise<boolean>;
  received: string[];
  selfPubkeyBase64: string | null;
  selfToken: string | null;
  walletAddress: string | null;
  // Channel-based messaging
  createTherapyChannel: (sessionId: string) => Promise<string>;
  sendChannelMessage: (channelId: string, role: 'user' | 'assistant', text: string) => Promise<boolean>;
  getChannelMessages: (channelId: string) => Promise<XXMessage[]>;
  getTherapyChannel: (sessionId: string) => string | null;
  channelReady: boolean;
  // Encryption for Arkiv storage
  encryptForArkiv: (text: string) => Promise<string>;
  decryptFromArkiv: (encrypted: string) => Promise<string>;
};

const XXContext = createContext<XXContextType | null>(null);

export function XXNetworkProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [received, setReceived] = useState<string[]>([]);
  const dmClientRef = useRef<any>(null);
  const [selfPubkeyBase64, setSelfPubkeyBase64] = useState<string | null>(null);
  const [selfToken, setSelfToken] = useState<string | null>(null);
  const { selectedAccount } = usePolkadotWallet();
  const walletAddress = selectedAccount?.address || null;
  
  // Channel-based state
  const [channelReady, setChannelReady] = useState(false);
  const channelsRef = useRef<Map<string, XXChannel>>(new Map());
  const messagesRef = useRef<Map<string, XXMessage[]>>(new Map());

  // XX Network initialization
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        try { console.log('[XX] Init start', { hasWindow: typeof window !== 'undefined' }); } catch {}
        let xxdk: any = null;
        try {
          const mod: any = await import('xxdk-wasm');
          xxdk = mod?.default ?? mod;
        } catch (e1) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const reqMod: any = require('xxdk-wasm');
            xxdk = reqMod?.default ?? reqMod;
          } catch (e2) {
            xxdk = null;
          }
        }
        try { console.log('[XX] import xxdk-wasm', { imported: !!xxdk }); } catch {}
        if (!xxdk || typeof window === 'undefined') {
          try { console.warn('[XX] Missing window or xxdk-wasm'); } catch {}
          setReady(false);
          return;
        }
        if (xxdk.setXXDKBasePath) {
          const base = window.location.origin + '/xxdk-wasm';
          xxdk.setXXDKBasePath(base);
          try { console.log('[XX] Base path set', { base }); } catch {}
        }
        const XX = await xxdk.InitXXDK();
        try { console.log('[XX] InitXXDK ok', { methods: Object.keys(XX || {}) }); } catch {}
        let ndfJson = '';
        try {
          // Try primary path
          let resp = await fetch('/xxdk-wasm/ndf.json');
          try { console.log('[XX] NDF fetch status (primary)', { ok: resp.ok, status: resp.status }); } catch {}
          
          // Try backup path if primary fails
          if (!resp.ok) {
            resp = await fetch('/ndf.json');
            try { console.log('[XX] NDF fetch status (backup)', { ok: resp.ok, status: resp.status }); } catch {}
          }
          
          if (resp.ok) {
            const ndfBase64 = (await resp.text()).trim();
            // Decode base64 - it's protobuf-wrapped JSON
            const decoded = Buffer.from(ndfBase64, 'base64').toString('utf-8');
            
            // Extract JSON from protobuf wrapper - find where JSON starts
            const jsonStart = decoded.indexOf('{"Timestamp"');
            if (jsonStart < 0) {
              throw new Error('Could not find JSON start in NDF');
            }
            
            // Parse incrementally to find where valid JSON ends
            let validJson = '';
            let braceCount = 0;
            let inString = false;
            let escape = false;
            
            for (let i = jsonStart; i < decoded.length; i++) {
              const char = decoded[i];
              
              if (escape) {
                escape = false;
                continue;
              }
              
              if (char === '\\') {
                escape = true;
                continue;
              }
              
              if (char === '"' && !escape) {
                inString = !inString;
              }
              
              if (!inString) {
                if (char === '{') braceCount++;
                if (char === '}') {
                  braceCount--;
                  if (braceCount === 0) {
                    // Found the end of JSON
                    validJson = decoded.substring(jsonStart, i + 1);
                    break;
                  }
                }
              }
            }
            
            if (!validJson) {
              throw new Error('Could not extract complete JSON from NDF');
            }
            
            // Validate it's parseable
            try {
              JSON.parse(validJson);
              ndfJson = validJson;
              try { console.log('[XX] NDF extracted and validated JSON', { totalLength: decoded.length, jsonLength: ndfJson.length, preview: ndfJson.substring(0, 80) }); } catch {}
            } catch (parseErr) {
              throw new Error(`NDF JSON parse failed: ${parseErr}`);
            }
          } else if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_XX_NDF_JSON) {
            const envNdf = String(process.env.NEXT_PUBLIC_XX_NDF_JSON).trim();
            // Assume env might be base64 or plain JSON
            if (envNdf.startsWith('CpPt') || envNdf.startsWith('Cp')) {
              ndfJson = Buffer.from(envNdf, 'base64').toString('utf-8');
            } else {
              ndfJson = envNdf;
            }
            try { console.log('[XX] NDF loaded from env', { length: ndfJson.length }); } catch {}
          } else {
            throw new Error('NDF not found - cannot initialize XX Network without Network Definition File');
          }
        } catch (e) {
          try { console.error('[XX] NDF fetch failed', e); } catch {}
          throw e;
        }
        // Namespace state path per wallet to avoid signature collisions
        const safeAddr = (walletAddress || 'default').replace(/[^a-zA-Z0-9_-]/g, '').slice(-12);
        const statePath = `xx_${safeAddr}`;
        const secret = Buffer.from('Hello');
        const registrationCode = '';
        console.log('[XX] State path', { statePath, wallet: walletAddress });
        
        // Check if we need to initialize (per wallet)
        const cMixInitKey = `cMixInit_${statePath}`;
        const exists = typeof window !== 'undefined' && window.localStorage.getItem(cMixInitKey) === 'true';
        if (!exists) {
          try {
            // NewCmix(ndf: string, storageDir: string, password: Uint8Array, registrationCode: string)
            await XX.NewCmix(ndfJson, statePath, secret, registrationCode);
            if (typeof window !== 'undefined') window.localStorage.setItem(cMixInitKey, 'true');
            console.log('[XX] NewCmix completed for', statePath);
          } catch (initError) {
            // Clear the flag so we can retry
            if (typeof window !== 'undefined') window.localStorage.removeItem(cMixInitKey);
            throw initError;
          }
        } else {
          try { console.log('[XX] Skipping NewCmix, already initialized'); } catch {}
        }
        try { console.log('[XX] LoadCmix start'); } catch {}
        const cmixParams = Buffer.from(''); // Empty cmix parameters
        const net = await XX.LoadCmix(statePath, secret, cmixParams);
        try { console.log('[XX] LoadCmix ok', { netId: net?.GetID?.() }); } catch {}
        
        // Derive XX identity from wallet signature OR generate temporary
        let dmIDStr: string | null = null;
        
        // Try wallet-derived identity if wallet connected
        if (walletAddress && typeof window !== 'undefined') {
          try {
            console.log('[XX] Requesting wallet signature for identity');
            const { web3FromAddress } = await import('@polkadot/extension-dapp');
            const injector = await web3FromAddress(walletAddress);
            const message = `PsyChat XX Network Identity for ${walletAddress}`;
            const signRaw = injector?.signer?.signRaw;
            
            if (signRaw) {
              const { signature } = await signRaw({
                address: walletAddress,
                data: Buffer.from(message).toString('hex'),
                type: 'bytes'
              });
              
              // Use signature to derive deterministic 32-byte XX identity
              const { sha3_256 } = await import('js-sha3');
              const hash = sha3_256(signature);
              const identityBytes = Buffer.from(hash, 'hex').slice(0, 32);
              dmIDStr = identityBytes.toString('base64');
              console.log('[XX] Identity derived from wallet signature');
            }
          } catch (e) {
            console.error('[XX] Failed to get wallet signature', e);
          }
        }
        
        // Fallback: generate random identity (won't persist)
        if (!dmIDStr) {
          console.log('[XX] Generating temporary identity (no wallet)');
          dmIDStr = Buffer.from(XX.GenerateChannelIdentity(net.GetID())).toString('base64');
        }
        
        const dmID = new Uint8Array(Buffer.from(dmIDStr as string, 'base64'));
        try { console.log('[XX] LoadNotificationsDummy start'); } catch {}
        const notifications = XX.LoadNotificationsDummy(net.GetID());
        try { console.log('[XX] LoadNotificationsDummy ok', { notifId: notifications?.GetID?.() }); } catch {}
        try { console.log('[XX] NewDatabaseCipher start'); } catch {}
        const cipher = XX.NewDatabaseCipher(net.GetID(), Buffer.from('MessageStoragePassword'), 725);
        try { console.log('[XX] NewDatabaseCipher ok', { cipherId: cipher?.GetID?.() }); } catch {}
        const onDmEvent = (_type: number, data: Uint8Array) => {
          const msg = Buffer.from(data).toString('utf-8');
          setReceived((prev) => [...prev, msg]);
          console.log('[XX] Message received');
        };
        try { console.log('[XX] dmIndexedDbWorkerPath start'); } catch {}
        const workerPath = await xxdk.dmIndexedDbWorkerPath();
        try { console.log('[XX] dmIndexedDbWorkerPath ok', { workerPath: String(workerPath) }); } catch {}
        try { console.log('[XX] NewDMClientWithIndexedDb start'); } catch {}
        const client = await XX.NewDMClientWithIndexedDb(
          net.GetID(),
          notifications.GetID(),
          cipher.GetID(),
          workerPath.toString(),
          dmID,
          { EventUpdate: onDmEvent }
        );
        dmClientRef.current = client;
        try {
          const pkB64 = Buffer.from(client.GetPublicKey()).toString('base64');
          const tok = String(client.GetToken());
          setSelfPubkeyBase64(pkB64);
          setSelfToken(tok);
          try { console.log('[XX] Self pubkey/token', { pubkeyBase64: pkB64, token: tok }); } catch {}
        } catch {}
        try { console.log('[XX] StartNetworkFollower start'); } catch {}
        net.StartNetworkFollower(10000);
        try { console.log('[XX] WaitForNetwork start'); } catch {}
        net.WaitForNetwork(30000);
        try { console.log('[XX] DM client ready'); } catch {}
        setReady(true);
        try { console.log('[XX] Init finished'); } catch {}
      } catch (e) {
        try { console.error('[XX] Init error', e); } catch {}
        // Clear initialization flag on error to allow retry
        if (typeof window !== 'undefined') window.localStorage.removeItem('cMixInitialized');
        setReady(false);
      }
    };
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load channels from localStorage (temporary - will move to Arkiv)
  useEffect(() => {
    if (typeof window === 'undefined' || !walletAddress) return;
    try {
      const key = `xx_channels_${walletAddress}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        channelsRef.current = new Map(Object.entries(parsed));
      }
      // Load messages from localStorage
      const msgKey = `xx_messages_${walletAddress}`;
      const storedMsgs = localStorage.getItem(msgKey);
      if (storedMsgs) {
        const parsed = JSON.parse(storedMsgs);
        messagesRef.current = new Map(Object.entries(parsed).map(([k, v]) => [k, v as XXMessage[]]));
      }
      setChannelReady(true);
      try { console.log('[XX] Channels loaded', { count: channelsRef.current.size }); } catch {}
    } catch (e) {
      try { console.error('[XX] Failed to load channels', e); } catch {}
    }
  }, [walletAddress]);

  // Persist channels to localStorage
  const persistChannels = () => {
    if (typeof window === 'undefined' || !walletAddress) return;
    try {
      const key = `xx_channels_${walletAddress}`;
      const obj = Object.fromEntries(channelsRef.current.entries());
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      try { console.error('[XX] Failed to persist channels', e); } catch {}
    }
  };

  // Persist messages to localStorage
  const persistMessages = () => {
    if (typeof window === 'undefined' || !walletAddress) return;
    try {
      const msgKey = `xx_messages_${walletAddress}`;
      const obj = Object.fromEntries(messagesRef.current.entries());
      localStorage.setItem(msgKey, JSON.stringify(obj));
    } catch (e) {
      try { console.error('[XX] Failed to persist messages', e); } catch {}
    }
  };

  // Create a therapy channel for a session
  const createTherapyChannel = async (sessionId: string): Promise<string> => {
    try {
      // Check if channel already exists
      for (const [channelId, channel] of Array.from(channelsRef.current.entries())) {
        if (channel.sessionId === sessionId) {
          try { console.log('[XX] Channel already exists', { channelId, sessionId }); } catch {}
          return channelId;
        }
      }
      
      // Create new channel (use sessionId as channelId for simplicity)
      const channelId = `therapy_${sessionId}`;
      const channel: XXChannel = {
        channelId,
        sessionId,
        createdAt: Date.now(),
        messageCount: 0,
      };
      
      channelsRef.current.set(channelId, channel);
      messagesRef.current.set(channelId, []);
      persistChannels();
      persistMessages();
      
      try { console.log('[XX] Channel created', { channelId, sessionId }); } catch {}
      return channelId;
    } catch (e) {
      try { console.error('[XX] Failed to create channel', e); } catch {}
      throw e;
    }
  };

  // Send a message to a channel
  const sendChannelMessage = async (channelId: string, role: 'user' | 'assistant', text: string): Promise<boolean> => {
    try {
      if (!ready) {
        try { console.warn('[XX] Not ready to send'); } catch {}
        return false;
      }
      
      const channel = channelsRef.current.get(channelId);
      if (!channel) {
        try { console.error('[XX] Channel not found', { channelId }); } catch {}
        return false;
      }
      
      // Send via XX Network DM
      const dm = dmClientRef.current;
      if (!dm) return false;
      
      const token = dm.GetToken();
      const pubkey = dm.GetPublicKey();
      
      // Prepend metadata to message for channel routing
      const metadata = JSON.stringify({ channelId, role, timestamp: Date.now() });
      const fullText = `[CHANNEL:${metadata}]${text}`;
      
      try { console.log('[XX] Sending channel message', { channelId, role, textLength: text.length }); } catch {}
      await dm.SendText(pubkey, token, fullText, 0, Buffer.from(''));
      
      // Store message locally
      const message: XXMessage = {
        id: `xx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text,
        role,
        timestamp: Date.now(),
        channelId,
      };
      
      const channelMessages = messagesRef.current.get(channelId) || [];
      channelMessages.push(message);
      messagesRef.current.set(channelId, channelMessages);
      
      // Update channel metadata
      channel.messageCount++;
      channelsRef.current.set(channelId, channel);
      
      persistChannels();
      persistMessages();
      
      return true;
    } catch (e) {
      try { console.error('[XX] Failed to send channel message', e); } catch {}
      return false;
    }
  };

  // Get messages for a channel
  const getChannelMessages = async (channelId: string): Promise<XXMessage[]> => {
    try {
      const messages = messagesRef.current.get(channelId) || [];
      try { console.log('[XX] Retrieved messages', { channelId, count: messages.length }); } catch {}
      return messages;
    } catch (e) {
      try { console.error('[XX] Failed to get messages', e); } catch {}
      return [];
    }
  };

  // Get therapy channel for a session
  const getTherapyChannel = (sessionId: string): string | null => {
    for (const [channelId, channel] of Array.from(channelsRef.current.entries())) {
      if (channel.sessionId === sessionId) {
        return channelId;
      }
    }
    return null;
  };

  // Encrypt text for Arkiv storage using XX identity
  const encryptForArkiv = async (text: string): Promise<string> => {
    try {
      if (!selfPubkeyBase64) {
        throw new Error('XX identity not ready');
      }
      // Use XX pubkey as encryption key (simple XOR for demo, use AES in production)
      const { sha3_256 } = await import('js-sha3');
      const key = sha3_256(selfPubkeyBase64);
      const textBytes = Buffer.from(text, 'utf-8');
      const keyBytes = Buffer.from(key, 'hex');
      
      // XOR encryption
      const encrypted = Buffer.alloc(textBytes.length);
      for (let i = 0; i < textBytes.length; i++) {
        encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      
      return encrypted.toString('base64');
    } catch (error) {
      console.error('[XX] Encryption failed', error);
      return text; // Fallback to plaintext
    }
  };

  // Decrypt text from Arkiv storage using XX identity
  const decryptFromArkiv = async (encrypted: string): Promise<string> => {
    try {
      if (!selfPubkeyBase64) {
        throw new Error('XX identity not ready');
      }
      // Use same key to decrypt
      const { sha3_256 } = await import('js-sha3');
      const key = sha3_256(selfPubkeyBase64);
      const encryptedBytes = Buffer.from(encrypted, 'base64');
      const keyBytes = Buffer.from(key, 'hex');
      
      // XOR decryption (same as encryption)
      const decrypted = Buffer.alloc(encryptedBytes.length);
      for (let i = 0; i < encryptedBytes.length; i++) {
        decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      
      return decrypted.toString('utf-8');
    } catch (error) {
      console.error('[XX] Decryption failed', error);
      return encrypted; // Fallback to encrypted text
    }
  };

  const sendDirectMessage = async (text: string) => {
    try {
      const dm = dmClientRef.current;
      if (!dm) return false;
      const token = dm.GetToken();
      const pubkey = dm.GetPublicKey();
      await dm.SendText(pubkey, token, text, 0, Buffer.from(''));
      return true;
    } catch {
      return false;
    }
  };

  const value = useMemo<XXContextType>(() => ({
    ready,
    sendDirectMessage,
    received,
    selfPubkeyBase64,
    selfToken,
    walletAddress,
    // Channel functions
    createTherapyChannel,
    sendChannelMessage,
    getChannelMessages,
    getTherapyChannel,
    channelReady,
    // Encryption functions
    encryptForArkiv,
    decryptFromArkiv,
  }), [ready, received, selfPubkeyBase64, selfToken, walletAddress, channelReady]);
  return <XXContext.Provider value={value}>{children}</XXContext.Provider>;
}

export function useXXNetwork() {
  const ctx = useContext(XXContext);
  if (!ctx) throw new Error('useXXNetwork must be used within XXNetworkProvider');
  return ctx;
}

type XXDKUtils = any;
type CMix = any;
export const XXLegacyUtilsContext = createContext<XXDKUtils | null>(null);
export const XXLegacyNetContext = createContext<CMix | null>(null);

export function XXNetwork({ children }: { children: React.ReactNode }) {
  const [XXDKUtilsState, setXXDKUtilsState] = useState<XXDKUtils | null>(null);
  const [XXCMixState, setXXCMixState] = useState<CMix | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        try { console.log('[XX] Init start (legacy)'); } catch {}
        const xxdk: any = await (0, eval)('import("xxdk-wasm")').catch(() => null);
        if (!xxdk || typeof window === 'undefined') {
          try { console.warn('[XX] Legacy missing window or xxdk-wasm'); } catch {}
          return;
        }
        try {
          xxdk.setXXDKBasePath(window.location.href + 'xxdk-wasm');
          console.log('[XX] Legacy base path set', { base: window.location.href + 'xxdk-wasm' });
        } catch {}
        const XX = await xxdk.InitXXDK();
        setXXDKUtilsState(XX);
        try { console.log('[XX] Legacy InitXXDK ok'); } catch {}
        
        // Load NDF
        let ndf = '';
        try {
          const resp = await fetch('/xxdk-wasm/ndf.json');
          if (resp.ok) {
            const ndfBase64 = (await resp.text()).trim();
            const decoded = Buffer.from(ndfBase64, 'base64').toString('utf-8');
            
            // Extract JSON properly by counting braces
            const jsonStart = decoded.indexOf('{"Timestamp"');
            if (jsonStart >= 0) {
              let braceCount = 0;
              let inString = false;
              let escape = false;
              
              for (let i = jsonStart; i < decoded.length; i++) {
                const char = decoded[i];
                if (escape) { escape = false; continue; }
                if (char === '\\') { escape = true; continue; }
                if (char === '"' && !escape) inString = !inString;
                if (!inString) {
                  if (char === '{') braceCount++;
                  if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                      ndf = decoded.substring(jsonStart, i + 1);
                      break;
                    }
                  }
                }
              }
            }
            try { console.log('[XX] Legacy NDF extracted', { length: ndf.length }); } catch {}
          }
        } catch {}
        
        const statePath = 'xx';
        const secret = Buffer.from('Hello');
        const registrationCode = '';
        const stateExists = typeof window !== 'undefined' ? window.localStorage.getItem('cMixInitialized') === 'true' : false;
        if (!stateExists) {
          try {
            await XX.NewCmix(ndf, statePath, secret, registrationCode);
            if (typeof window !== 'undefined') window.localStorage.setItem('cMixInitialized', 'true');
            try { console.log('[XX] Legacy NewCmix completed'); } catch {}
          } catch (initError) {
            if (typeof window !== 'undefined') window.localStorage.removeItem('cMixInitialized');
            throw initError;
          }
        } else {
          try { console.log('[XX] Legacy skipping NewCmix, already initialized'); } catch {}
        }
        const cmixParams = Buffer.from('');
        const net = await XX.LoadCmix(statePath, secret, cmixParams);
        setXXCMixState(net);
        try { console.log('[XX] Legacy LoadCmix ok'); } catch {}
      } catch (e) {
        try { console.error('[XX] Legacy init error', e); } catch {}
        if (typeof window !== 'undefined') window.localStorage.removeItem('cMixInitialized');
      }
    };
    run();
  }, []);

  return (
    <XXLegacyUtilsContext.Provider value={XXDKUtilsState}>
      <XXLegacyNetContext.Provider value={XXCMixState}>{children}</XXLegacyNetContext.Provider>
    </XXLegacyUtilsContext.Provider>
  );
}
