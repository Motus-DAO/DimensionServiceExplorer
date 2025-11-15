import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineBanknotes } from 'react-icons/hi2';
import { useScrollReveal } from '../../lib/hooks/useScrollReveal';
import { HoloText, HoloPanel, HoloButton } from '../ui/holo';

const FeaturesShowcaseSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const { ref, motionProps } = useScrollReveal({ direction: 'up', delay: 0.2 });

  const features = [
    {
      icon: <HiOutlineLockClosed className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'Arcium ZK proofs ensure your data is encrypted while proving integrity.',
      color: 'from-cyan-400/10 to-blue-500/10'
    },
    {
      icon: <HiOutlineEye className="w-8 h-8" />,
      title: 'Full Transparency',
      description: 'See exactly who\'s buying your data and why.',
      color: 'from-fuchsia-400/10 to-purple-500/10'
    },
    {
      icon: <HiOutlineBanknotes className="w-8 h-8" />,
      title: 'Fair Economics',
      description: '70% of all revenue goes to you; 30% sustains the network.',
      color: 'from-emerald-400/10 to-green-500/10'
    }
  ];

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    
    if (velocity > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (velocity < -threshold && currentIndex < features.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div ref={ref} {...motionProps}>
        <HoloPanel variant="elevated" size="xl" className="relative overflow-hidden">
          <HoloText size="xl" weight="bold" className="text-center mb-8">
            Key Features
          </HoloText>
          
          {/* Desktop: Draggable carousel */}
          <div className="hidden md:block">
            <motion.div
              className="flex gap-6 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -400, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ x }}
              animate={{ x: -currentIndex * 400 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {features.map((feature, index) => (
                <HoloPanel
                  key={index}
                  variant="floating"
                  size="lg"
                  className="flex-shrink-0 w-80 group hover:border-cyan-400/30 transition-all duration-300"
                  interactive={true}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10 text-center">
                    <motion.div 
                      className="flex items-center justify-center mb-4 text-emerald-400 hover:scale-110 hover:rotate-[5deg] transition-transform duration-300"
                    >
                      {feature.icon}
                    </motion.div>
                    <HoloText size="lg" weight="semibold" className="mb-3">{feature.title}</HoloText>
                    <HoloText size="sm" className="text-white/70">{feature.description}</HoloText>
                    <div className="mt-4">
                      <HoloButton variant="ghost" size="sm">
                        Learn More
                      </HoloButton>
                    </div>
                  </div>
                </HoloPanel>
              ))}
            </motion.div>
            
            {/* Carousel indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {features.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-120 ${
                    currentIndex === index ? 'bg-cyan-400' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Mobile: Static grid */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HoloPanel variant="floating" size="lg" className="text-center">
                  <div className="flex items-center justify-center mb-4 text-emerald-400">
                    {feature.icon}
                  </div>
                  <HoloText size="lg" weight="semibold" className="mb-3">{feature.title}</HoloText>
                  <HoloText size="sm" className="text-white/70 mb-4">{feature.description}</HoloText>
                  <HoloButton variant="ghost" size="sm">
                    Learn More
                  </HoloButton>
                </HoloPanel>
              </motion.div>
            ))}
          </div>
        </HoloPanel>
      </motion.div>
    </section>
  );
};

export default FeaturesShowcaseSection;
