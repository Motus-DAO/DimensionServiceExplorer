import React from 'react';
import { motion } from 'framer-motion';
import ClientWalletButton from '../ClientWalletButton';
import { useScrollReveal } from '../../lib/hooks/useScrollReveal';
import { HoloText, HoloPanel, HoloButton } from '../ui/holo';

const JoinCTASection: React.FC = () => {
  const { ref, motionProps } = useScrollReveal({ direction: 'up', delay: 0.2 });

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div ref={ref} {...motionProps}>
        {/* Call to Action with pulsing holographic border */}
        <div className="relative">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(0,255,255,0.3), 0 0 40px rgba(255,0,255,0.2)",
                "0 0 30px rgba(0,255,255,0.5), 0 0 60px rgba(255,0,255,0.3)",
                "0 0 20px rgba(0,255,255,0.3), 0 0 40px rgba(255,0,255,0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-fuchsia-500/20 to-cyan-400/20 blur-sm"
          />
          
          <HoloPanel variant="elevated" size="xl" className="text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HoloText size="xl" weight="bold" className="mb-4">
                Ready to Join the Digital Renaissance?
              </HoloText>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 max-w-2xl mx-auto"
            >
              <HoloText size="base" className="text-white/80">
                Connect your wallet and start earning from your mental health data today. 
                Your privacy is protected, your data is valuable.
              </HoloText>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <motion.div
                className="relative hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent rounded-lg blur-sm"
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                />
                <div className="relative z-10">
                  <ClientWalletButton />
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/60 text-sm space-y-1"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center"
              >
                <HoloText size="sm" className="text-white/60">🔒 Your data is encrypted with XX Network E2E encryption</HoloText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center"
              >
                <HoloText size="sm" className="text-white/60">💰 Earn from data marketplace via Polkadot DEX</HoloText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center"
              >
                <HoloText size="sm" className="text-white/60">🚀 Auto-compound earnings with Polkadot payments</HoloText>
              </motion.div>
            </motion.div>
          </HoloPanel>
        </div>
      </motion.div>
    </section>
  );
};

export default JoinCTASection;
