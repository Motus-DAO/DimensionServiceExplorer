import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useScrollReveal } from '../../lib/hooks/useScrollReveal';
import { HoloText, HoloPanel } from '../ui/holo';

const BuyersInsightSection: React.FC = () => {
  const { ref, motionProps } = useScrollReveal({ direction: 'up', delay: 0.2 });
  const [counters, setCounters] = useState({ ai: 0, research: 0, wellness: 0, corporate: 0 });
  
  const targetCounters = { ai: 12, research: 8, wellness: 5, corporate: 3 };
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    const interval = setInterval(() => {
      setCounters(prev => ({
        ai: Math.min(prev.ai + (targetCounters.ai / steps), targetCounters.ai),
        research: Math.min(prev.research + (targetCounters.research / steps), targetCounters.research),
        wellness: Math.min(prev.wellness + (targetCounters.wellness / steps), targetCounters.wellness),
        corporate: Math.min(prev.corporate + (targetCounters.corporate / steps), targetCounters.corporate)
      }));
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, []);

  const buyerData = [
    {
      count: Math.floor(counters.ai),
      label: 'AI Companies',
      sublabel: 'OpenAI, Anthropic, Google',
      color: 'text-cyan-400',
      bgColor: 'from-cyan-400/10 to-blue-500/10'
    },
    {
      count: Math.floor(counters.research),
      label: 'Research Labs',
      sublabel: 'Stanford, MIT, Harvard',
      color: 'text-emerald-400',
      bgColor: 'from-emerald-400/10 to-green-500/10'
    },
    {
      count: Math.floor(counters.wellness),
      label: 'Wellness Apps',
      sublabel: 'Headspace, Calm, BetterHelp',
      color: 'text-purple-400',
      bgColor: 'from-purple-400/10 to-fuchsia-500/10'
    },
    {
      count: Math.floor(counters.corporate),
      label: 'Corporate',
      sublabel: 'Fortune 500 Companies',
      color: 'text-orange-400',
      bgColor: 'from-orange-400/10 to-red-500/10'
    }
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div ref={ref} {...motionProps}>
        <HoloPanel variant="elevated" size="xl" className="relative overflow-hidden">
          {/* Holographic grid background */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                animation: 'moveGrid 20s linear infinite'
              }}
            />
          </div>
          
          <div className="relative z-10">
            <HoloText size="xl" weight="bold" className="text-center mb-8">
              Who's Buying Your Data
            </HoloText>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {buyerData.map((buyer, index) => (
                <motion.div
                  key={buyer.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <HoloPanel
                    variant="floating"
                    size="lg"
                    className={`text-center group hover:border-cyan-400/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300 bg-gradient-to-br ${buyer.bgColor}`}
                    interactive={true}
                  >
                    <motion.div 
                      className={`text-3xl font-bold ${buyer.color} mb-2`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      {buyer.count}
                    </motion.div>
                    <HoloText size="sm" className="text-white/60 mb-1">{buyer.label}</HoloText>
                    <HoloText size="xs" className="text-white/50">{buyer.sublabel}</HoloText>
                  </HoloPanel>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <HoloPanel variant="default" size="lg" className="bg-cyan-400/10 border-cyan-400/20">
                <HoloText size="sm" className="text-white/80">
                  <span className="text-cyan-400 font-bold">Verified & Ethics-Approved:</span> All data buyers are verified and ethics-approved. 
                  Your mental health insights help advance AI empathy, academic research, and wellness innovation.
                </HoloText>
              </HoloPanel>
            </motion.div>
          </div>
        </HoloPanel>
      </motion.div>
    </section>
  );
};

export default BuyersInsightSection;
