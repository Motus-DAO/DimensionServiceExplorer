import { motion } from 'framer-motion';
import { HoloText } from '../ui/holo';

interface ChatNFTStatusCompactProps {
  chatNFTCount: number;
  onExpand: () => void;
  onHide: () => void;
}

export default function ChatNFTStatusCompact({
  chatNFTCount,
  onExpand,
  onHide
}: ChatNFTStatusCompactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="hnft-status-compact w-64"
    >
      <div className="crystal-glass alive-glass rounded-lg border border-electric-cyan/20 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-electric-cyan neon-solid-cyan">💬</span>
            <HoloText size="sm" weight="bold" className="neon-solid-cyan">
              ChatNFTs
            </HoloText>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExpand}
              className="text-electric-cyan hover:text-electric-cyan/80 transition-colors text-sm px-2 py-1 rounded hover:bg-electric-cyan/10"
            >
              Expand
            </button>
            <button
              onClick={onHide}
              className="text-white/60 hover:text-white/80 transition-colors text-sm px-2 py-1 rounded hover:bg-white/10"
              title="Hide Panel"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <div className="inline-flex items-center space-x-2 bg-electric-cyan/20 text-electric-cyan px-2 py-1 rounded-full text-xs neon-solid-cyan">
            <div className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse"></div>
            <span>{chatNFTCount > 0 ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {/* Count Display */}
        <div className="mb-3">
          <div className="text-white/60 text-xs mb-1">Minted</div>
          <div className="text-white/80 text-sm font-medium">
            {chatNFTCount} ChatNFT{chatNFTCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Status Message */}
        {chatNFTCount === 0 ? (
          <div className="mb-3">
            <div className="text-white/60 text-xs">
              End a chat session to mint your first ChatNFT
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <div className="text-white/60 text-xs">
              Click expand to view transaction details
            </div>
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={onExpand}
          className="w-full py-2 px-3 text-xs bg-electric-cyan/20 hover:bg-electric-cyan/30 text-electric-cyan border border-electric-cyan/30 hover:border-electric-cyan/50 rounded-lg transition-all duration-200 hover:scale-105"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}
