import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface TerminalCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  className?: string;
}

export default function TerminalCard({
  children,
  title,
  subtitle,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  className = ""
}: TerminalCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (velocity > 0 || offset > threshold) {
        onSwipeRight?.();
      } else if (velocity < 0 || offset < -threshold) {
        onSwipeLeft?.();
      }
    }
  };

  return (
    <motion.div
      className={`relative crystal-glass rounded-xl p-6 cursor-pointer select-none ${className}`}
      style={{
        border: '1px solid rgba(0, 255, 255, 0.2)',
        boxShadow: isHovered 
          ? '0 0 30px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 0 10px rgba(0, 255, 255, 0.1)'
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onTap}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Terminal border corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
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

      {/* Header */}
      {(title || subtitle) && (
        <motion.div
          className="mb-4 pb-3 border-b border-cyan-400/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title && (
            <h3 className="text-lg font-bold font-terminal text-cyan-400 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-white/60 font-terminal">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {children}
      </motion.div>

      {/* Terminal status indicator */}
      <motion.div
        className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full"
        animate={{
          opacity: [1, 0.5, 1],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          boxShadow: '0 0 8px #00FF00'
        }}
      />

      {/* Glitch effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        animate={isHovered ? {
          opacity: [0, 0.1, 0],
          filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
        } : {}}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(0,255,255,0.1), transparent)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Swipe indicators */}
      <motion.div
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cyan-400/60 font-terminal text-xs"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ←
      </motion.div>
      <motion.div
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400/60 font-terminal text-xs"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        →
      </motion.div>
    </motion.div>
  );
}
