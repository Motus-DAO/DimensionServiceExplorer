import React, { useState } from "react";
import { motion } from "framer-motion";
import { HoloPanel, HoloButton, HoloText } from "../ui";
import { FaPlug, FaChartLine, FaCog, FaPlay, FaPause } from "react-icons/fa";

interface ControlDockProps {
  className?: string;
  onConnect?: () => void;
  onAnalyze?: () => void;
  isConnected?: boolean;
  isAnalyzing?: boolean;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  className,
  onConnect,
  onAnalyze,
  isConnected = false,
  isAnalyzing = false
}) => {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleConnect = () => {
    if (onConnect) {
      onConnect();
    }
  };

  const handleAnalyze = () => {
    if (onAnalyze) {
      onAnalyze();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`motion-crystal-hover ${className}`}
    >
      <HoloPanel variant="elevated" size="lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaCog className="text-cyan-400 text-xl" />
            <HoloText size="lg" weight="bold">
              Control Dock
            </HoloText>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            } animate-pulse`} />
            <span className="text-sm text-white/60">
              {isConnected ? 'Active' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Connect Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered('connect')}
            onHoverEnd={() => setIsHovered(null)}
          >
            <HoloButton
              variant="primary"
              size="lg"
              onClick={handleConnect}
              disabled={isConnected}
              className="w-full h-20 flex flex-col items-center justify-center space-y-2"
            >
              <motion.div
                animate={{ 
                  rotate: isConnected ? 0 : isHovered === 'connect' ? 10 : 0,
                  scale: isHovered === 'connect' ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {isConnected ? (
                  <FaPause className="text-2xl" />
                ) : (
                  <FaPlug className="text-2xl" />
                )}
              </motion.div>
              <div className="text-center">
                <div className="font-semibold">
                  {isConnected ? 'Disconnect' : 'Connect'}
                </div>
                <div className="text-xs opacity-80">
                  {isConnected ? 'End session' : 'Start session'}
                </div>
              </div>
            </HoloButton>
          </motion.div>

          {/* Analyze Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered('analyze')}
            onHoverEnd={() => setIsHovered(null)}
          >
            <HoloButton
              variant="secondary"
              size="lg"
              onClick={handleAnalyze}
              disabled={!isConnected || isAnalyzing}
              className="w-full h-20 flex flex-col items-center justify-center space-y-2"
            >
              <motion.div
                animate={{ 
                  rotate: isAnalyzing ? 360 : isHovered === 'analyze' ? -10 : 0,
                  scale: isHovered === 'analyze' ? 1.1 : 1
                }}
                transition={{ 
                  rotate: { duration: isAnalyzing ? 2 : 0.3, repeat: isAnalyzing ? Infinity : 0 },
                  scale: { duration: 0.3 }
                }}
              >
                <FaChartLine className="text-2xl" />
              </motion.div>
              <div className="text-center">
                <div className="font-semibold">
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </div>
                <div className="text-xs opacity-80">
                  {isAnalyzing ? 'Processing data' : 'Run analysis'}
                </div>
              </div>
            </HoloButton>
          </motion.div>
        </div>

        {/* Status Indicators */}
        <div className="mt-6 pt-4 border-t border-cyan-400/20">
          <div className="grid grid-cols-2 gap-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
              <div>
                <div className="text-sm font-medium text-white/90">
                  Connection
                </div>
                <div className="text-xs text-white/60">
                  {isConnected ? 'Established' : 'Not connected'}
                </div>
              </div>
            </div>

            {/* Analysis Status */}
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-3 h-3 rounded-full ${
                  isAnalyzing ? 'bg-fuchsia-400' : 'bg-yellow-400'
                }`}
              />
              <div>
                <div className="text-sm font-medium text-white/90">
                  Analysis
                </div>
                <div className="text-xs text-white/60">
                  {isAnalyzing ? 'In progress' : 'Ready'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 bg-black/20 border border-cyan-400/30 rounded-lg text-xs text-cyan-400 hover:bg-cyan-400/10 transition-colors"
            >
              Settings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 bg-black/20 border border-fuchsia-400/30 rounded-lg text-xs text-fuchsia-400 hover:bg-fuchsia-400/10 transition-colors"
            >
              Logs
            </motion.button>
          </motion.div>
        </div>
      </HoloPanel>
    </motion.div>
  );
};
