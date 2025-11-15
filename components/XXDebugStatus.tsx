import { useXXNetwork } from '@/contexts/XXNetworkContext';

export function XXDebugStatus() {
  const { ready, selfPubkeyBase64, selfToken, walletAddress, received } = useXXNetwork();

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs font-mono z-50">
      <div className="font-bold mb-2">XX Network Status</div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${ready ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{ready ? 'Connected' : 'Initializing...'}</span>
        </div>
        
        {selfPubkeyBase64 && (
          <div>
            <span className="text-gray-400">Pubkey:</span>{' '}
            <span className="text-green-400">{selfPubkeyBase64.substring(0, 20)}...</span>
          </div>
        )}
        
        {selfToken && (
          <div>
            <span className="text-gray-400">Token:</span>{' '}
            <span className="text-blue-400">{selfToken.substring(0, 20)}...</span>
          </div>
        )}
        
        {walletAddress && (
          <div>
            <span className="text-gray-400">Wallet:</span>{' '}
            <span className="text-purple-400">{walletAddress.substring(0, 20)}...</span>
          </div>
        )}
        
        {received.length > 0 && (
          <div>
            <span className="text-gray-400">Messages:</span>{' '}
            <span className="text-yellow-400">{received.length}</span>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
        Press F12 to see detailed logs
      </div>
    </div>
  );
}
