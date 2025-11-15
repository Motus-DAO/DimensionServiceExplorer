import { useState, useEffect } from 'react';
import { usePolkadotWallet } from '../contexts/PolkadotWalletContext';

export default function ClientWalletButton() {
  const [mounted, setMounted] = useState(false);
  const { isConnected, isConnecting, connect, disconnect, selectedAccount, accounts, selectAccount } = usePolkadotWallet();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="psychat-button px-6 py-3 opacity-50">
        Loading...
      </div>
    );
  }

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
      setShowAccountMenu(false);
    } else {
      await connect();
    }
  };

  const abbreviateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      {isConnected && selectedAccount ? (
        <div className="relative">
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="psychat-button px-6 py-3 flex items-center space-x-2"
          >
            <span>{abbreviateAddress(selectedAccount.address)}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-black/90 border border-cyan-400/30 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-cyan-400/20">
                <div className="text-sm text-white/80 mb-1">Connected Account</div>
                <div className="text-xs text-cyan-400 font-mono break-all">{selectedAccount.address}</div>
                <div className="text-xs text-white/60 mt-1">{selectedAccount.meta.name || 'Account'}</div>
              </div>
              
              {accounts.length > 1 && (
                <div className="p-2 max-h-48 overflow-y-auto">
                  <div className="text-xs text-white/60 px-2 mb-2">Switch Account</div>
                  {accounts.map((account) => (
                    <button
                      key={account.address}
                      onClick={() => {
                        selectAccount(account);
                        setShowAccountMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-cyan-400/10 transition-colors ${
                        account.address === selectedAccount.address
                          ? 'bg-cyan-400/20 text-cyan-400'
                          : 'text-white/80'
                      }`}
                    >
                      <div className="font-medium">{account.meta.name || 'Account'}</div>
                      <div className="text-xs text-white/60 font-mono">{abbreviateAddress(account.address)}</div>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="p-2 border-t border-cyan-400/20">
                <button
                  onClick={handleConnect}
                  className="w-full px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="psychat-button px-6 py-3 disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}

