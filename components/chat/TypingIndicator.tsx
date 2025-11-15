import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="typing-indicator mb-4"
    >
      <div className="flex items-center space-x-2">
        {/* AI Avatar */}
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        
        {/* Typing Bubble */}
        <div className="typing-bubble rounded-2xl p-4 border border-white/20 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <motion.span
                className="w-2 h-2 bg-white/60 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.span
                className="w-2 h-2 bg-white/60 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
              <motion.span
                className="w-2 h-2 bg-white/60 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4
                }}
              />
            </div>
            <span className="text-white/80 text-sm font-medium">
              Psychat is thinking...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
