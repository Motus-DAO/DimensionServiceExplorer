import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  animated?: boolean;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#00FFFF',
  label,
  animated = true
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
          className="drop-shadow-sm"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={animated ? strokeDashoffset : strokeDashoffset}
          className="drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        
        {/* Terminal scanline effect */}
        <motion.rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="url(#scanline)"
          opacity={0.1}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {/* Gradient definition for scanlines */}
      <svg width="0" height="0">
        <defs>
          <pattern id="scanline" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="1" fill="rgba(0,255,255,0.3)" />
            <rect y="1" width="4" height="3" fill="transparent" />
          </pattern>
        </defs>
      </svg>
      
      {/* Progress text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="text-center">
          <div className="text-2xl font-bold font-terminal" style={{ color }}>
            {Math.round(progress)}%
          </div>
          {label && (
            <div className="text-xs text-white/60 font-terminal mt-1">
              {label}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Neon glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          filter: `blur(8px)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0 ? 0.3 : 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      />
    </div>
  );
}
