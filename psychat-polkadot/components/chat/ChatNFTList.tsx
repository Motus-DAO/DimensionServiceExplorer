import { motion } from 'framer-motion';
import { HoloPanel, HoloText } from '../ui/holo';

interface ChatNFT {
  transactionSignature: string;
  sessionId: string;
  timestamp: Date;
  messageCount?: number;
}

interface ChatNFTListProps {
  chatNFTs: ChatNFT[];
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ChatNFTList({
  chatNFTs,
  isExpanded,
  onToggle
}: ChatNFTListProps) {
  // Placeholder for transaction URL builder (to be replaced with Polkadot explorer)
  const buildTxUrl = (sig: string) => {
    return `#${sig}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="chatnft-list"
    >
      <HoloPanel className="crystal-glass alive-glass rounded-2xl border border-cyan-400/20 p-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <HoloText size="lg" weight="bold" className="text-cyan-400">
            ChatNFTs ({chatNFTs.length})
          </HoloText>
          <button
            onClick={onToggle}
            className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 text-sm px-2 py-1 rounded border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/10 relative z-10 pointer-events-auto"
            title={isExpanded ? 'Collapse ChatNFTs' : 'Expand ChatNFTs'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {/* Content */}
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {chatNFTs.length === 0 ? (
              <div className="text-center py-4 text-white/60">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-sm">No ChatNFTs minted yet</p>
                <p className="text-xs text-white/40 mt-1">
                  End a chat session to mint your first ChatNFT
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {chatNFTs.map((chatNFT, index) => (
                  <div
                    key={chatNFT.transactionSignature}
                    className="crystal-glass alive-glass rounded-lg p-3 border border-cyan-400/20 relative z-10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-cyan-400 text-sm">💬</span>
                        <span className="text-white/80 text-sm font-medium">
                          Session #{index + 1}
                        </span>
                      </div>
                      <span className="text-white/60 text-xs">
                        {formatDate(chatNFT.timestamp)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {chatNFT.messageCount && (
                        <div className="text-white/60 text-xs">
                          <span className="text-white/40">Messages:</span>
                          <span className="ml-1">{chatNFT.messageCount}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 text-xs">Transaction:</span>
                        <a
                          href={buildTxUrl(chatNFT.transactionSignature)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline text-xs cursor-pointer relative z-10 pointer-events-auto hover:bg-cyan-400/10 px-2 py-1 rounded transition-all duration-200"
                        >
                          View Transaction →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* Collapsed state - show minimal info */
          <div className="collapsed-state">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400">💬</span>
                <span className="text-white/80 text-sm">
                  {chatNFTs.length} ChatNFT{chatNFTs.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={onToggle}
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 text-xs px-2 py-1 rounded border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/10 relative z-10 pointer-events-auto"
                title="Expand ChatNFTs"
              >
                +
              </button>
            </div>
          </div>
        )}
      </HoloPanel>
    </motion.div>
  );
}
