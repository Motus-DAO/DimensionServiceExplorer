'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Dynamically import SDK only on client side to avoid server-side ES module issues
let sdk: any = null;
const getSDK = async () => {
  if (typeof window === 'undefined') return null;
  if (!sdk) {
    const module = await import('@farcaster/miniapp-sdk');
    sdk = module.sdk;
  }
  return sdk;
};

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface FarcasterContextType {
  isReady: boolean;
  isConnected: boolean;
  user: FarcasterUser | null;
  walletAddress: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getWalletAddress: () => Promise<string | null>;
  signMessage: (message: string) => Promise<string | null>;
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined);

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Farcaster SDK
    const initSDK = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Dynamically load SDK
        const farcasterSDK = await getSDK();
        if (!farcasterSDK) return;

        // Check if we're in a Farcaster miniapp environment
        const isInMiniApp = await farcasterSDK.isInMiniApp();
        
        if (isInMiniApp) {
          // In Farcaster environment, initialize SDK
          await farcasterSDK.actions.ready();
          setIsReady(true);
          
          // Get user info from context
          try {
            const context = await farcasterSDK.context;
            if (context && context.user) {
              setUser({
                fid: context.user.fid,
                username: context.user.username,
                displayName: context.user.displayName,
                pfpUrl: context.user.pfpUrl,
              });
              setIsConnected(true);
            }
          } catch (e) {
            console.log('[Farcaster] User info not available:', e);
          }

          // Try to get wallet address from Ethereum provider
          try {
            const provider = await farcasterSDK.wallet.getEthereumProvider();
            if (provider) {
              const accounts = await provider.request({ method: 'eth_accounts' });
              if (accounts && accounts.length > 0) {
                setWalletAddress(accounts[0]);
              }
            }
          } catch (e) {
            console.log('[Farcaster] Wallet not available:', e);
          }
        } else {
          // In local development, mark as ready but not connected
          setIsReady(true);
          console.log('[Farcaster] Running in local development mode (not in miniapp)');
        }
      } catch (error) {
        console.error('[Farcaster] SDK initialization error:', error);
        setIsReady(true); // Still mark as ready to prevent infinite loading
      }
    };

    initSDK();
  }, []);

  const connect = async () => {
    try {
      if (typeof window === 'undefined') return;
      
      const farcasterSDK = await getSDK();
      if (!farcasterSDK) return;
      
      const isInMiniApp = await farcasterSDK.isInMiniApp();
      
      if (isInMiniApp) {
        // In Farcaster environment, get user from context
        const context = await farcasterSDK.context;
        if (context && context.user) {
          setUser({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
          });
          setIsConnected(true);
        }
      } else {
        // Mock connection for local development
        setIsConnected(true);
        setUser({
          fid: 1,
          username: 'dev_user',
          displayName: 'Dev User',
          pfpUrl: '',
        });
      }
    } catch (error) {
      console.error('[Farcaster] Connection error:', error);
    }
  };

  const disconnect = async () => {
    setIsConnected(false);
    setUser(null);
    setWalletAddress(null);
  };

  const getWalletAddress = async (): Promise<string | null> => {
    try {
      if (typeof window === 'undefined') return null;
      
      const farcasterSDK = await getSDK();
      if (!farcasterSDK) return null;
      
      const isInMiniApp = await farcasterSDK.isInMiniApp();
      
      if (isInMiniApp) {
        // In Farcaster environment, get wallet from Ethereum provider
        const provider = await farcasterSDK.wallet.getEthereumProvider();
        if (provider) {
          try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
              setWalletAddress(accounts[0]);
              return accounts[0];
            }
          } catch (e) {
            // User might have rejected the request
            console.log('[Farcaster] Wallet request rejected:', e);
          }
        }
      }
      return null;
    } catch (error) {
      console.error('[Farcaster] Get wallet error:', error);
      return null;
    }
  };

  const signMessage = async (message: string): Promise<string | null> => {
    try {
      if (typeof window === 'undefined') return null;
      
      const farcasterSDK = await getSDK();
      if (!farcasterSDK) return null;
      
      const isInMiniApp = await farcasterSDK.isInMiniApp();
      
      if (isInMiniApp) {
        // In Farcaster environment, use Ethereum provider to sign
        const provider = await farcasterSDK.wallet.getEthereumProvider();
        if (provider) {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const signature = await provider.request({
              method: 'personal_sign',
              params: [message, accounts[0]],
            });
            return signature as string;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('[Farcaster] Sign message error:', error);
      return null;
    }
  };

  const value: FarcasterContextType = {
    isReady,
    isConnected,
    user,
    walletAddress,
    connect,
    disconnect,
    getWalletAddress,
    signMessage,
  };

  return (
    <FarcasterContext.Provider value={value}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  const context = useContext(FarcasterContext);
  if (context === undefined) {
    throw new Error('useFarcaster must be used within a FarcasterProvider');
  }
  return context;
}

