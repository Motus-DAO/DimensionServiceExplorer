import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineXCircle, HiOutlineShieldCheck } from 'react-icons/hi2';
import { useScrollReveal } from '../../lib/hooks/useScrollReveal';
import { HoloText, HoloPanel } from '../ui/holo';

const ProblemSolutionSection: React.FC = () => {
  const { ref: problemRef, motionProps: problemMotionProps } = useScrollReveal({ 
    direction: 'left', 
    delay: 0.1 
  });
  
  const { ref: solutionRef, motionProps: solutionMotionProps } = useScrollReveal({ 
    direction: 'right', 
    delay: 0.3 
  });

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      {/* Problem & Solution with Holo components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          ref={problemRef}
          {...problemMotionProps}
        >
          <HoloPanel variant="floating" size="lg" className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
            <div className="relative z-10">
              <HoloText as="div" size="lg" weight="bold" className="text-red-400 mb-4 flex items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="mr-3"
                >
                  <HiOutlineXCircle className="w-6 h-6" />
                </motion.div>
                The Problem
              </HoloText>
              <ul className="space-y-3 text-white/80">
                {[
                  'Mental health data is exploited by Big Tech',
                  'Users earn nothing from their valuable data',
                  'Privacy is compromised for profit',
                  'No transparency in data usage'
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <HiOutlineXCircle className="text-red-400 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <HoloText as="span" size="sm" className="text-white/80">{item}</HoloText>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/10 rounded-full blur-2xl" />
          </HoloPanel>
        </motion.div>

        <motion.div 
          ref={solutionRef}
          {...solutionMotionProps}
        >
          <HoloPanel variant="elevated" size="lg" className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
            <div className="relative z-10">
              <HoloText as="div" size="lg" weight="bold" className="text-green-400 mb-4 flex items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="mr-3"
                >
                  <HiOutlineShieldCheck className="w-6 h-6" />
                </motion.div>
                Our Solution
              </HoloText>
              <ul className="space-y-3 text-white/80">
                {[
                  'You own your therapy data completely',
                  'Earn 70% from anonymized data sales',
                  'ZK-encrypted privacy protection',
                  'Full transparency in data buyers'
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <HiOutlineShieldCheck className="text-green-400 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <HoloText as="span" size="sm" className="text-white/80">{item}</HoloText>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full blur-2xl" />
          </HoloPanel>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
