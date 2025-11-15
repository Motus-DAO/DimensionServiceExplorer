import React from 'react';
import { motion } from 'framer-motion';

interface LevelBadgeProps {
  level: number;
  title: string;
  description: string;
  unlocked: boolean;
  isNew?: boolean;
  onUnlock?: () => void;
}

const levelConfig = {
  1: { 
    title: "Script Kiddie", 
    description: "First steps in data liberation",
    color: "#00FF00",
    icon: "🔓"
  },
  2: { 
    title: "Code Warrior", 
    description: "Advanced data hacking techniques",
    color: "#00FFFF",
    icon: "⚡"
  },
  3: { 
    title: "Data Anarchist", 
    description: "Master of mental health data sovereignty",
    color: "#8000FF",
    icon: "🔥"
  },
  4: { 
    title: "Cypherpunk Legend", 
    description: "Ultimate data liberation warrior",
    color: "#FF8000",
    icon: "👑"
  }
};

export default function LevelBadge({
  level,
  title,
  description,
  unlocked,
  isNew = false,
  onUnlock
}: LevelBadgeProps) {
  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig[1];
  const badgeColor = config.color;
  
  return (
    <motion.div
      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
        unlocked 
          ? 'border-opacity-60 bg-opacity-10' 
          : 'border-opacity-20 bg-opacity-5'
      }`}
      style={{
        borderColor: badgeColor,
        backgroundColor: `${badgeColor}20`,
        boxShadow: unlocked ? `0 0 20px ${badgeColor}40` : 'none'
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: unlocked ? 1 : 0.6, 
        y: 0, 
        scale: unlocked ? 1 : 0.95 
      }}
      whileHover={unlocked ? { 
        scale: 1.05, 
        boxShadow: `0 0 30px ${badgeColor}60` 
      } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Matrix code rain effect for new unlocks */}
      {isNew && (
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${badgeColor}40, transparent)`,
              transform: 'skewX(-15deg)'
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.div>
      )}
      
      {/* Terminal border effect */}
      <div className="relative z-10">
        {/* Corner accents */}
        <div 
          className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2"
          style={{ borderColor: badgeColor }}
        />
        <div 
          className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2"
          style={{ borderColor: badgeColor }}
        />
        <div 
          className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2"
          style={{ borderColor: badgeColor }}
        />
        <div 
          className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2"
          style={{ borderColor: badgeColor }}
        />
        
        {/* Badge content */}
        <div className="flex items-center space-x-3">
          <motion.div
            className="text-2xl"
            animate={unlocked ? { 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1] 
            } : {}}
            transition={{ 
              duration: 0.6, 
              delay: 0.8,
              repeat: isNew ? 2 : 0 
            }}
          >
            {config.icon}
          </motion.div>
          
          <div className="flex-1">
            <motion.h3
              className="text-lg font-bold font-terminal"
              style={{ color: badgeColor }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {title}
            </motion.h3>
            
            <motion.p
              className="text-sm text-white/70 font-terminal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {description}
            </motion.p>
          </div>
          
          {/* Unlock status indicator */}
          <motion.div
            className={`w-3 h-3 rounded-full ${
              unlocked ? 'bg-green-400' : 'bg-gray-500'
            }`}
            style={{
              boxShadow: unlocked ? `0 0 10px ${badgeColor}` : 'none'
            }}
            animate={unlocked ? { 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1] 
            } : {}}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              delay: 1 
            }}
          />
        </div>
        
        {/* Progress bar for locked badges */}
        {!unlocked && (
          <motion.div
            className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: badgeColor }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(level * 25, 100)}%` }}
              transition={{ delay: 1, duration: 1 }}
            />
          </motion.div>
        )}
      </div>
      
      {/* Glitch effect for new unlocks */}
      {isNew && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0, 1, 0],
            filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
          }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(45deg, transparent, ${badgeColor}20, transparent)`,
              mixBlendMode: 'overlay'
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
