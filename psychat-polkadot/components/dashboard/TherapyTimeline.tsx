import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Session {
  id: string;
  date: Date;
  type: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'general';
  earnings: number;
  impact: number; // People helped
  encrypted: boolean;
}

interface TherapyTimelineProps {
  sessions: Session[];
  onSessionClick?: (session: Session) => void;
  className?: string;
}

const sessionTypeColors = {
  anxiety: '#FF8000',
  depression: '#8000FF', 
  stress: '#FF0000',
  relationships: '#FF00FF',
  general: '#00FFFF'
};

const sessionTypeIcons = {
  anxiety: '⚡',
  depression: '🌊',
  stress: '🔥',
  relationships: '💕',
  general: '🧠'
};

export default function TherapyTimeline({
  sessions,
  onSessionClick,
  className = ""
}: TherapyTimelineProps) {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className={`relative ${className}`}>
      {/* Timeline container */}
      <div className="relative h-32 overflow-x-auto overflow-y-visible">
        {/* Timeline line */}
        <motion.div
          className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
          }}
        />

        {/* Sessions */}
        <div className="relative flex items-center space-x-8 px-4">
          {sortedSessions.map((session, index) => {
            const color = sessionTypeColors[session.type];
            const icon = sessionTypeIcons[session.type];
            const isHovered = hoveredSession === session.id;
            
            return (
              <motion.div
                key={session.id}
                className="relative flex flex-col items-center cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                onHoverStart={() => setHoveredSession(session.id)}
                onHoverEnd={() => setHoveredSession(null)}
                onClick={() => onSessionClick?.(session)}
              >
                {/* Session node */}
                <motion.div
                  className="relative w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg"
                  style={{
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    boxShadow: isHovered 
                      ? `0 0 20px ${color}60` 
                      : `0 0 10px ${color}40`
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: [0, -5, 5, 0]
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Session icon */}
                  <motion.span
                    animate={isHovered ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {icon}
                  </motion.span>

                  {/* Encryption indicator */}
                  {session.encrypted && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-xs"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      🔒
                    </motion.div>
                  )}

                  {/* Connection line to next session */}
                  {index < sortedSessions.length - 1 && (
                    <motion.div
                      className="absolute top-6 left-6 w-8 h-0.5"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 5px ${color}`
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    />
                  )}
                </motion.div>

                {/* Session details tooltip */}
                <motion.div
                  className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-lg rounded-lg p-3 border border-cyan-400/30 min-w-48 z-10"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={isHovered ? {
                    opacity: 1,
                    y: 0,
                    scale: 1
                  } : {
                    opacity: 0,
                    y: 10,
                    scale: 0.9
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    boxShadow: `0 0 20px ${color}40`
                  }}
                >
                  {/* Tooltip arrow */}
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                    style={{ borderTopColor: color }}
                  />

                  <div className="text-center">
                    <div className="text-sm font-terminal text-white mb-1">
                      {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session
                    </div>
                    <div className="text-xs text-cyan-400 font-terminal mb-1">
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-green-400 font-terminal">
                      +{session.earnings.toFixed(2)} PSY
                    </div>
                    <div className="text-xs text-purple-400 font-terminal">
                      {session.impact} people helped
                    </div>
                  </div>
                </motion.div>

                {/* Session label */}
                <motion.div
                  className="mt-2 text-xs font-terminal text-white/60 text-center"
                  animate={isHovered ? { color: color } : {}}
                  transition={{ duration: 0.2 }}
                >
                  Session {index + 1}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Terminal scanline overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.1, 0],
          y: ['-100%', '100%']
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)',
          transform: 'skewX(-15deg)'
        }}
      />

      {/* Data stream effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.3, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {sortedSessions.map((session, index) => (
          <motion.div
            key={`stream-${session.id}`}
            className="absolute top-16 left-4 w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${(index / (sortedSessions.length - 1)) * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
