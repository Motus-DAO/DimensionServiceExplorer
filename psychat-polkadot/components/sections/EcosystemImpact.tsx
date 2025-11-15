import React from 'react';
import { motion } from 'framer-motion';
import CrystalCarousel from '../CrystalCarousel';
import { useScrollReveal } from '../../lib/hooks/useScrollReveal';
import { HoloText, HoloPanel, HoloDivider } from '../ui/holo';

const EcosystemImpactSection: React.FC = () => {
  const { ref: techRef, motionProps: techMotionProps } = useScrollReveal({ direction: 'up', delay: 0.1 });
  const { ref: motusRef, motionProps: motusMotionProps } = useScrollReveal({ direction: 'up', delay: 0.3 });
  const { ref: impactRef, motionProps: impactMotionProps } = useScrollReveal({ direction: 'up', delay: 0.5 });

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      {/* Technology Stack */}
      <motion.div ref={techRef} {...techMotionProps}>
        <HoloPanel variant="elevated" size="xl" className="mb-12 relative overflow-hidden">
          
          <HoloText size="xl" weight="bold" className="text-center mb-8 neon-solid-cyan">
            Powered by Web3
          </HoloText>
          <div className="relative w-full h-auto min-h-[400px] flex items-center justify-center">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(0,255,255,0.3)",
                  "0 0 40px rgba(255,0,255,0.3)",
                  "0 0 20px rgba(0,255,255,0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="rounded-2xl w-full max-w-4xl"
            >
              <div className="relative z-10">
                <CrystalCarousel
                  baseWidth={280}
                  autoplay={true}
                  autoplayDelay={3000}
                  pauseOnHover={true}
                  loop={true}
                  items={[
                    {
                      title: 'Solana',
                      description: 'Fast & Cheap blockchain',
                      id: 1,
                      icon: <span className="text-2xl">🔗</span>
                    },
                    {
                      title: 'Phantom',
                      description: 'Wallet integration',
                      id: 2,
                      icon: <span className="text-2xl">👻</span>
                    },
                    {
                      title: 'Arcium',
                      description: 'ZK Privacy protection',
                      id: 3,
                      icon: <span className="text-2xl">🔒</span>
                    },
                    {
                      title: 'Raydium',
                      description: 'AMM Trading',
                      id: 4,
                      icon: <span className="text-2xl">🏪</span>
                    },
                    {
                      title: 'Reflect',
                      description: '$rUSD Payments',
                      id: 5,
                      icon: <span className="text-2xl">💰</span>
                    }
                  ]}
                />
              </div>
              
            </motion.div>
          </div>
        </HoloPanel>
      </motion.div>

      {/* MotusDAO Ecosystem */}
      <motion.div ref={motusRef} {...motusMotionProps}>
        <HoloPanel variant="elevated" size="xl" className="mb-12 relative overflow-hidden">
          <HoloText size="xl" weight="bold" className="text-center mb-8">
            MotusDAO Complete Ecosystem
          </HoloText>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <HoloPanel variant="floating" size="lg" className="group relative">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-3xl mb-4"
                >
                  🎯
                </motion.div>
                <HoloText size="lg" weight="semibold" className="mb-3">PsyChat: Top of Funnel</HoloText>
                <HoloText size="sm" className="text-white/80 mb-4">
                  PsyChat serves as the entry point, providing accessible AI therapy while identifying 
                  patients who need human intervention. This creates a sustainable funnel to 
                  qualified psychologists.
                </HoloText>
                <div className="space-y-2 text-sm text-white/70">
                  {[
                    'AI-Human Hybrid Care Model',
                    'Price Accessible Mental Health',
                    'Economically Sound & Sustainable'
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center"
                    >
                      <span className="text-purple-400 mr-2">→</span>
                      <HoloText size="sm" className="text-white/70">{item}</HoloText>
                    </motion.div>
                  ))}
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl" />
              </HoloPanel>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <HoloPanel variant="elevated" size="lg" className="group relative">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="text-3xl mb-4"
                >
                  🎓
                </motion.div>
                <HoloText size="lg" weight="semibold" className="mb-3">MotusDAO Academy</HoloText>
                <HoloText size="sm" className="text-white/80 mb-4">
                  Professional training program bridging the gap between AI and mental health 
                  state-of-the-art practices. Ensures ethical AI implementation and legal compliance.
                </HoloText>
                <div className="space-y-2 text-sm text-white/70">
                  {[
                    'AI-Mental Health Integration Training',
                    'Ethical AI Implementation',
                    'Legal Compliance & Best Practices'
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center"
                    >
                      <span className="text-cyan-400 mr-2">→</span>
                      <HoloText size="sm" className="text-white/70">{item}</HoloText>
                    </motion.div>
                  ))}
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-400/10 rounded-full blur-2xl" />
              </HoloPanel>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <HoloPanel variant="floating" size="lg" className="bg-gradient-to-r from-purple-400/20 to-cyan-400/20 border-purple-400/30">
              <HoloText size="lg" weight="semibold" className="text-center mb-4">Complete Ethical AI Solution</HoloText>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/80">
                {[
                  { icon: '🤖', title: 'AI-First Approach', desc: 'Accessible, scalable mental health support' },
                  { icon: '👨‍⚕️', title: 'Human Oversight', desc: 'Qualified professionals when needed' },
                  { icon: '⚖️', title: 'Legal Compliance', desc: 'Ethical standards & regulatory adherence' }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div 
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="text-2xl mb-2"
                    >
                      {item.icon}
                    </motion.div>
                    <HoloText size="sm" weight="semibold" className="mb-1">{item.title}</HoloText>
                    <HoloText size="xs" className="text-white/60">{item.desc}</HoloText>
                  </motion.div>
                ))}
              </div>
            </HoloPanel>
          </motion.div>
        </HoloPanel>
      </motion.div>

      {/* Impact Metrics */}
      <motion.div ref={impactRef} {...impactMotionProps}>
        <HoloPanel variant="elevated" size="xl" className="relative overflow-hidden">
          <HoloText size="xl" weight="bold" className="text-center mb-8">
            Impact & Vision
          </HoloText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: '$30B', label: 'Total Addressable Market', sublabel: 'Mental health data economy', color: 'text-emerald-400' },
              { value: '40%', label: 'Therapy Cost Reduction', sublabel: 'Through tokenized subsidies', color: 'text-cyan-400' },
              { value: '1M+', label: 'Scalable Users', sublabel: 'Platform capacity', color: 'text-purple-400' }
            ].map((metric, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <HoloPanel
                  variant="floating"
                  size="lg"
                  className="text-center group hover:border-cyan-400/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300"
                  interactive={true}
                >
                  <motion.div 
                    className={`text-4xl font-bold ${metric.color} mb-2`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {metric.value}
                  </motion.div>
                  <HoloText size="sm" className="text-white/60 mb-1">{metric.label}</HoloText>
                  <HoloText size="xs" className="text-white/50">{metric.sublabel}</HoloText>
                </HoloPanel>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <HoloPanel variant="default" size="lg" className="bg-cyan-400/10 border-cyan-400/20">
              <HoloText size="sm" className="text-white/80">
                <span className="text-cyan-400 font-bold">MotusDAO Vision:</span> PsyChat is the entry point to our complete ecosystem. 
                We're building a sustainable, ethical AI-human hybrid mental health solution that 
                democratizes access while maintaining professional standards and legal compliance.
              </HoloText>
            </HoloPanel>
          </motion.div>
        </HoloPanel>
      </motion.div>
    </section>
  );
};

export default EcosystemImpactSection;
