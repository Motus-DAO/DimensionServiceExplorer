import { motion } from 'framer-motion';
import { HoloPanel, HoloButton, HoloText } from '../ui/holo';
import HNFTMintingFlow from './HNFTMintingFlow';

interface HNFTIdentityCardProps {
  hnftPda: string | null;
  hnftSig: string | null;
  onMint: () => Promise<string>;
  isMinting: boolean;
  error: string | null;
  success: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
  publicKey: any;
}

export default function HNFTIdentityCard({
  hnftPda,
  hnftSig,
  onMint,
  isMinting,
  error,
  success,
  isExpanded,
  onToggle,
  onClose,
  publicKey
}: HNFTIdentityCardProps) {
  // Placeholder for transaction URL builder (to be replaced with Polkadot explorer)
  const buildTxUrl = (sig: string) => {
    return `#${sig}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="hnft-identity-card"
    >
      <HoloPanel className="crystal-glass alive-glass rounded-2xl border border-electric-cyan/20 p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <HoloText size="lg" weight="bold" className="neon-solid-cyan">
            PsyChat Identity
          </HoloText>
          {hnftPda && (
            <div className="header-buttons">
              <button
                onClick={onToggle}
                className="expand-button px-2 py-1"
                title={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                {isExpanded ? '−' : '+'}
              </button>
              <button
                onClick={onClose}
                className="close-button px-2 py-1"
                title="Close identity card"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {!hnftPda ? (
          <HNFTMintingFlow
            onMint={onMint}
            isMinting={isMinting}
            publicKey={publicKey}
          />
        ) : isExpanded ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* HNFT Details */}
            <div className="crystal-glass alive-glass rounded-lg p-4 border border-electric-cyan/20 relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-electric-cyan neon-solid-cyan">🎫</span>
                <HoloText size="sm" weight="bold" className="neon-solid-cyan">
                  Identity HNFT
                </HoloText>
              </div>
              
              <div className="space-y-2">
                <div className="text-white/80 text-sm">
                  <span className="text-white/60">PDA:</span>
                  <span className="ml-2 font-mono text-xs break-all">{hnftPda}</span>
                </div>
                
                {hnftSig && hnftSig !== 'existing_hnft' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60 text-sm">Transaction:</span>
                    <a
                      href={buildTxUrl(hnftSig)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline text-sm cursor-pointer relative z-10 pointer-events-auto hover:bg-cyan-400/10 px-2 py-1 rounded transition-all duration-200"
                    >
                      View Transaction →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="crystal-glass alive-glass border border-vibrant-magenta/30 rounded-lg p-3">
                <div className="text-vibrant-magenta text-sm neon-solid-magenta">
                  ❌ {error}
                </div>
              </div>
            )}

            {success && (
              <div className="crystal-glass alive-glass border border-electric-cyan/30 rounded-lg p-3">
                <div className="text-electric-cyan text-sm neon-solid-cyan">
                  ✅ {success}
                </div>
              </div>
            )}

            {/* Ready to Chat */}
            <div className="crystal-glass alive-glass border border-electric-cyan/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-electric-cyan neon-solid-cyan">💬</span>
                <HoloText size="sm" weight="bold" className="neon-solid-cyan">
                  Ready to Chat
                </HoloText>
              </div>
              <p className="text-white/80 text-sm">
                Your identity is verified. You can now start secure conversations with Grok.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Collapsed state - show minimal info */
          <div className="collapsed-state">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-electric-cyan neon-solid-cyan">🎫</span>
                <span className="text-white/80 text-sm">Identity Active</span>
              </div>
              <button
                onClick={onToggle}
                className="expand-button px-2 py-1 text-xs"
                title="Expand details"
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
