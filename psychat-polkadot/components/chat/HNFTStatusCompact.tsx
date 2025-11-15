import { motion } from 'framer-motion';
import { HoloButton, HoloText } from '../ui/holo';

interface HNFTStatusCompactProps {
  hnftPda: string;
  hnftSig: string;
  onExpand: () => void;
  onHide?: () => void;
}

export default function HNFTStatusCompact({
  hnftPda,
  hnftSig,
  onExpand,
  onHide
}: HNFTStatusCompactProps) {
  // Placeholder for transaction URL builder (to be replaced with Polkadot explorer)
  const buildTxUrl = (sig: string) => {
    return `#${sig}`;
  };

  const abbreviatePDA = (pda: string) => {
    return `${pda.slice(0, 4)}...${pda.slice(-4)}`;
  };

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
            <span className="text-electric-cyan neon-solid-cyan">🎫</span>
            <HoloText size="sm" weight="bold" className="neon-solid-cyan">
              Digtial Identity
            </HoloText>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExpand}
              className="text-electric-cyan hover:text-electric-cyan/80 transition-colors text-sm px-2 py-1 rounded hover:bg-electric-cyan/10"
            >
              Expand
            </button>
            {onHide && (
              <button
                onClick={onHide}
                className="text-white/60 hover:text-white/80 transition-colors text-sm px-2 py-1 rounded hover:bg-white/10"
                title="Hide Panel"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <div className="inline-flex items-center space-x-2 bg-electric-cyan/20 text-electric-cyan px-2 py-1 rounded-full text-xs neon-solid-cyan">
            <div className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        </div>

        {/* PDA Display */}
        <div className="mb-3">
          <div className="text-white/60 text-xs mb-1">PDA</div>
          <div className="font-mono text-white/80 text-xs break-all">
            {abbreviatePDA(hnftPda)}
          </div>
        </div>

        {/* Transaction Link */}
        {hnftSig && hnftSig !== 'existing_hnft' && (
          <div className="mb-3">
            <a
              href={buildTxUrl(hnftSig)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-cyan hover:text-electric-cyan/80 underline text-xs neon-solid-cyan"
            >
              View Transaction →
            </a>
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
