import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DataRippleProps {
  impact: number; // Number of people helped
  maxRipples?: number;
  autoTrigger?: boolean;
  onRippleComplete?: () => void;
}

export default function DataRipple({
  impact,
  maxRipples = 5,
  autoTrigger = true,
  onRippleComplete
}: DataRippleProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; timestamp: number }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-trigger ripples based on impact
  useEffect(() => {
    if (autoTrigger && impact > 0) {
      const interval = setInterval(() => {
        if (ripples.length < maxRipples) {
          triggerRipple();
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [impact, ripples.length, maxRipples, autoTrigger]);

  const triggerRipple = () => {
    const newRipple = {
      id: Date.now(),
      timestamp: Date.now()
    };
    
    setRipples(prev => [...prev.slice(-maxRipples + 1), newRipple]);
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsAnimating(false);
      onRippleComplete?.();
    }, 2000);
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Central data node */}
      <motion.div
        className="absolute w-8 h-8 bg-cyan-400 rounded-full z-10"
        style={{
          boxShadow: '0 0 20px #00FFFF, 0 0 40px #00FFFF',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Inner core */}
        <motion.div
          className="absolute inset-2 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </motion.div>

      {/* Ripple effects */}
      {ripples.map((ripple, index) => (
        <motion.div
          key={ripple.id}
          className="absolute border-2 border-cyan-400 rounded-full"
          style={{
            borderColor: `rgba(0, 255, 255, ${0.8 - index * 0.15})`,
            boxShadow: `0 0 ${20 + index * 10}px rgba(0, 255, 255, ${0.6 - index * 0.1})`
          }}
          initial={{
            width: 0,
            height: 0,
            opacity: 0.8
          }}
          animate={{
            width: 200 + index * 40,
            height: 200 + index * 40,
            opacity: 0
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
            delay: index * 0.2
          }}
          onAnimationComplete={() => {
            if (index === ripples.length - 1) {
              setIsAnimating(false);
            }
          }}
        />
      ))}

      {/* Impact counter */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-2xl font-bold font-terminal text-cyan-400">
          {impact}
        </div>
        <div className="text-xs text-white/60 font-terminal">
          People Helped
        </div>
      </motion.div>

      {/* Data stream lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isAnimating ? [0, 1, 0] : 0
        }}
        transition={{
          duration: 2,
          ease: "easeInOut"
        }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transformOrigin: '0 0'
            }}
            animate={{
              x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
              y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
              opacity: [1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Terminal scanline overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.1, 0],
          y: ['-100%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)',
          transform: 'skewX(-15deg)'
        }}
      />

      {/* Click to trigger ripple */}
      <motion.button
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={triggerRipple}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="sr-only">Trigger data ripple effect</span>
      </motion.button>
    </div>
  );
}
