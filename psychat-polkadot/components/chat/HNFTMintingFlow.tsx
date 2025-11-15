import { motion } from 'framer-motion';
import { HoloButton, HoloText } from '../ui/holo';
interface HNFTMintingFlowProps {
  onMint: () => Promise<string>;
  isMinting: boolean;
  publicKey: string | null;
}

export default function HNFTMintingFlow({
  onMint,
  isMinting,
  publicKey
}: HNFTMintingFlowProps) {
  const steps = [
    {
      id: 'wallet',
      title: 'Wallet Connected',
      description: 'Your wallet is ready',
      completed: !!publicKey
    },
    {
      id: 'mint',
      title: 'Mint Identity',
      description: 'Create your soulbound PsyChat identity',
      completed: false,
      active: isMinting
    },
    {
      id: 'ready',
      title: 'Ready to Chat',
      description: 'Start secure conversations',
      completed: false
    }
  ];

  return (
    <div className="hnft-minting-flow space-y-6">
      {/* Header */}
      <div className="text-center">
        <HoloText size="lg" weight="bold" className="neon-solid-cyan mb-2">
          Create Your PsyChat Identity
        </HoloText>
        <p className="text-white/80 text-sm">
          Mint your soulbound HNFT to enable secure, private therapy sessions
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              step.completed
                ? 'crystal-glass alive-glass border border-electric-cyan/30'
                : step.active
                ? 'crystal-glass alive-glass border border-vibrant-magenta/30'
                : 'border border-white/10'
            }`}
          >
            {/* Step Indicator */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step.completed
                ? 'bg-electric-cyan text-black neon-solid-cyan'
                : step.active
                ? 'bg-vibrant-magenta text-white neon-solid-magenta animate-pulse'
                : 'bg-white/10 text-white/60'
            }`}>
              {step.completed ? '✓' : index + 1}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <HoloText size="sm" weight="bold" className={
                step.completed ? 'neon-solid-cyan' : step.active ? 'neon-solid-magenta' : 'text-white/80'
              }>
                {step.title}
              </HoloText>
              <p className="text-white/60 text-xs mt-1">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mint Button */}
      {publicKey && !isMinting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <HoloButton
            onClick={onMint}
            disabled={isMinting}
            className="w-full py-3"
          >
            {isMinting ? 'Minting Identity...' : 'Mint Identity HNFT'}
          </HoloButton>
          
          <p className="text-white/60 text-xs mt-2">
            This creates a non-transferable soulbound token for your identity
          </p>
        </motion.div>
      )}

      {/* Wallet Not Connected */}
      {!publicKey && (
        <div className="text-center p-4 crystal-glass alive-glass border border-vibrant-magenta/30 rounded-lg">
          <div className="text-vibrant-magenta text-sm neon-solid-magenta mb-2">
            🔗 Connect Your Wallet
          </div>
          <p className="text-white/80 text-sm">
            Please connect your wallet to mint your PsyChat identity
          </p>
        </div>
      )}

      {/* Minting Progress */}
      {isMinting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 crystal-glass alive-glass border border-vibrant-magenta/30 rounded-lg"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-4 h-4 border-2 border-vibrant-magenta border-t-transparent rounded-full animate-spin"></div>
            <span className="text-vibrant-magenta text-sm neon-solid-magenta">
              Minting your identity...
            </span>
          </div>
          <p className="text-white/80 text-xs">
            This may take a few moments. Please don't close this window.
          </p>
        </motion.div>
      )}
    </div>
  );
}
