import React from 'react';
import { motion } from 'framer-motion';
import StickyStepper from '../StickyStepper';
import { HiOutlineTicket, HiOutlineChatBubbleOvalLeft, HiOutlineBanknotes, HiOutlineRocketLaunch } from 'react-icons/hi2';
import { useScrollReveal } from '../../lib/hooks/useScrollReveal';
import { HoloText, HoloPanel, HoloDivider } from '../ui/holo';

const HowItWorksSection: React.FC = () => {
  const { ref: titleRef, motionProps: titleMotionProps } = useScrollReveal({ 
    direction: 'up', 
    delay: 0.1 
  });
  
  const { ref: stepperRef, motionProps: stepperMotionProps } = useScrollReveal({ 
    direction: 'up', 
    delay: 0.3 
  });

  return (
    <section className="py-24 max-w-7xl mx-auto px-6" data-how-it-works>
      <div className="p-2">
        <motion.div 
          ref={titleRef}
          {...titleMotionProps}
          className="text-center mb-8"
        >
          <HoloText size="xl" weight="bold" className="mb-4">
            How PsyChat Works
          </HoloText>
          <HoloDivider variant="horizontal" thickness="thin" className="mx-auto w-24" />
        </motion.div>
        
        <motion.div 
          ref={stepperRef}
          {...stepperMotionProps}
          className="relative"
        >
          <HoloPanel variant="elevated" size="lg" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-fuchsia-500/5 rounded-2xl blur-xl" />
            <StickyStepper
              steps={[
                { title: 'Mint HNFT', cmd: 'mint hnft', icon: <HiOutlineTicket className="w-6 h-6" />, description: 'Create your soulbound digital identity.' },
                { title: 'Chat Privately', cmd: 'chat --private', icon: <HiOutlineChatBubbleOvalLeft className="w-6 h-6" />, description: 'ZK-encrypted sessions, privacy by default.' },
                { title: 'Earn from Data', cmd: 'earn --datasets', icon: <HiOutlineBanknotes className="w-6 h-6" />, description: 'Trade anonymized datasets with transparency.' },
                { title: 'Stake & Grow', cmd: 'stake --auto', icon: <HiOutlineRocketLaunch className="w-6 h-6" />, description: 'Auto-compound yields and claim UBI.' },
              ]}
            />
          </HoloPanel>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
