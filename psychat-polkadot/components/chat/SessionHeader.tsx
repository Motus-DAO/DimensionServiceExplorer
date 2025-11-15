import { motion } from 'framer-motion';
import { HoloText } from '../ui/holo';

interface SessionHeaderProps {
  messageCount: number;
  sessionDuration: string;
  topics: string[];
}

export default function SessionHeader({ 
  messageCount, 
  sessionDuration, 
  topics 
}: SessionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="session-header mb-6 sticky top-0 z-30"
    >
      <div className="crystal-glass alive-glass rounded-xl border border-electric-cyan/20 p-4">
        <div className="flex items-center justify-between">
          {/* Session Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <HoloText size="sm" weight="bold" className="neon-solid-cyan">
                Therapy Session
              </HoloText>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-white/80">
              <div className="flex items-center space-x-1">
                <span className="text-electric-cyan">💬</span>
                <span>{messageCount} messages</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="text-electric-cyan">⏱️</span>
                <span>{sessionDuration}</span>
              </div>
            </div>
          </div>

          {/* Topics */}
          {topics.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-sm">Topics:</span>
              <div className="flex flex-wrap gap-1">
                {topics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="text-xs bg-electric-cyan/20 text-electric-cyan px-2 py-1 rounded-full neon-solid-cyan"
                  >
                    {topic}
                  </span>
                ))}
                {topics.length > 3 && (
                  <span className="text-xs text-white/60">
                    +{topics.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>Session Progress</span>
            <span>{Math.min(messageCount * 5, 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-electric-cyan to-vibrant-magenta h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(messageCount * 5, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
