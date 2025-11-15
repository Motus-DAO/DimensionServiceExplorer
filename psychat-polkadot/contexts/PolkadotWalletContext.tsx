import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface PolkadotWalletContextType {
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  selectAccount: (account: InjectedAccountWithMeta) => void;
  getSigner: (address: string) => Promise<any>;
}

const PolkadotWalletContext = createContext<PolkadotWalletContextType | undefined>(undefined);

export function PolkadotWalletProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    if (typeof window === 'undefined') return;
    
    setIsConnecting(true);
    try {
      // Dynamically import to avoid SSR issues
      const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');
      
      // Enable the extension
      const extensions = await web3Enable('PsyChat');
      
      if (extensions.length === 0) {
        throw new Error('No Polkadot wallet extension found. Please install Polkadot.js Extension.');
      }

      // Get all accounts
      const allAccounts = await web3Accounts();
      
      if (allAccounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your Polkadot wallet.');
      }

      setAccounts(allAccounts);
      
      // Try to restore previously selected account
      const savedAddress = localStorage.getItem('polkadot_wallet_address');
      const savedAccount = savedAddress 
        ? allAccounts.find(acc => acc.address === savedAddress)
        : null;
      
      const accountToSelect = savedAccount || allAccounts[0];
      setSelectedAccount(accountToSelect);
      setIsConnected(true);
      
      // Save to localStorage
      localStorage.setItem('polkadot_wallet_address', accountToSelect.address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Load saved account from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('polkadot_wallet_address');
      if (savedAddress) {
        // Try to reconnect with saved address
        connect();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnect = () => {
    setSelectedAccount(null);
    setAccounts([]);
    setIsConnected(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('polkadot_wallet_address');
    }
  };

  const selectAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
    if (typeof window !== 'undefined') {
      localStorage.setItem('polkadot_wallet_address', account.address);
    }
  };

  const getSigner = async (address: string): Promise<any> => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot get signer on server side');
    }
    
    try {
      const { web3FromAddress } = await import('@polkadot/extension-dapp');
      const injector = await web3FromAddress(address);
      return injector.signer;
    } catch (error) {
      console.error('Failed to get signer:', error);
      throw error;
    }
  };

  return (
    <PolkadotWalletContext.Provider
      value={{
        accounts,
        selectedAccount,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        selectAccount,
        getSigner,
      }}
    >
      {children}
    </PolkadotWalletContext.Provider>
  );
}

export function usePolkadotWallet() {
  const context = useContext(PolkadotWalletContext);
  if (context === undefined) {
    throw new Error('usePolkadotWallet must be used within a PolkadotWalletProvider');
  }
  return context;
}

