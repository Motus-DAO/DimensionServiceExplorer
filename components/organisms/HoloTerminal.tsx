import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalWindow, SystemStats, NetworkStatus, ControlDock } from "../molecules";

interface HoloTerminalProps {
  className?: string;
  onConnect?: () => void;
  onAnalyze?: () => void;
}

export const HoloTerminal: React.FC<HoloTerminalProps> = ({
  className,
  onConnect,
  onAnalyze
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (onConnect) onConnect();
  };

  const handleAnalyze = () => {
    if (isConnected) {
      setIsAnalyzing(!isAnalyzing);
      if (onAnalyze) onAnalyze();
    }
  };

  // Handle window size for SSR compatibility
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative min-h-screen overflow-hidden ${className}`}
    >
      {/* Animated Holographic Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 -z-10"
      >
        {/* Primary radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-fuchsia-500/20" />
        
        {/* Secondary gradient overlay */}
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 0, 255, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.15) 0%, transparent 50%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        />
        
        {/* Animated blur orbs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 50, -100, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl"
        />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-transparent via-cyan-500/5 to-transparent" />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Central Flex Container - Optimized for 1440px */}
        <div className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-8 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[800px]">
            
            {/* Left Column - System Stats and Network Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-4 space-y-6 motion-crystal-hover"
            >
              {/* System Stats */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <SystemStats />
              </motion.div>

              {/* Network Status */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <NetworkStatus showDetails={true} />
              </motion.div>
            </motion.div>

            {/* Right Column - Terminal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
              className="lg:col-span-8 motion-crystal-hover"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <TerminalWindow maxHeight="600px" />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Row - Control Dock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            className="mt-8 motion-crystal-hover"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <ControlDock
                isConnected={isConnected}
                isAnalyzing={isAnalyzing}
                onConnect={handleConnect}
                onAnalyze={handleAnalyze}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * windowSize.width],
              y: [0, Math.random() * windowSize.height],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%"
            }}
          />
        ))}
      </div>

      {/* Scan Line Effect */}
      <motion.div
        animate={{
          y: ["-100%", "100%"]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      </motion.div>
    </motion.div>
  );
};
