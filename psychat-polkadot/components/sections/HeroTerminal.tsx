import React from 'react';
import { motion } from 'framer-motion';
import HeroTerminal from '../HeroTerminal';
import ScrollCommandOrchestrator from '../ScrollCommandOrchestrator';
import { useScrollReveal } from '../../lib/hooks/useScrollReveal';
import { HoloText, HoloPanel, HoloDivider } from '../ui/holo';

interface HeroTerminalSectionProps {
  onConnect: () => Promise<void>;
  onNavigate: (tab: string) => void;
}

const HeroTerminalSection: React.FC<HeroTerminalSectionProps> = ({ onConnect, onNavigate }) => {
  const { ref: heroRef, motionProps: heroMotionProps } = useScrollReveal({ 
    direction: 'up', 
    delay: 0.1 
  });

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div ref={heroRef} {...heroMotionProps}>
        {/* Hero Section - CRT Terminal with Holo wrapper */}
        <HoloPanel variant="elevated" size="xl" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-fuchsia-500/5 rounded-2xl blur-xl" />
          <div className="relative z-10">
            <HeroTerminal
              onConnect={onConnect}
              onNavigate={onNavigate}
            />
          </div>
        </HoloPanel>

        {/* Terminal Description */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
        </motion.div>
      </motion.div>

      {/* Scrollytelling Orchestrator */}
      <ScrollCommandOrchestrator threshold={0.6} />
    </section>
  );
};

export default HeroTerminalSection;
