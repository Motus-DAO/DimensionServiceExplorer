import React, { useState } from "react";
import { motion } from "framer-motion";
import { TerminalWindow, SystemStats, NetworkStatus, ControlDock } from "./index";

/**
 * Demo component showing all molecular components working together
 * This demonstrates the responsive layout and holographic theme
 */
export const MoleculesDemo: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleAnalyze = () => {
    if (isConnected) {
      setIsAnalyzing(!isAnalyzing);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent mb-2">
          PsyChat Molecular Components
        </h1>
        <p className="text-white/60">
          Futuristic holographic UI modules with glassmorphism and neon effects
        </p>
      </motion.div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-6 lg:gap-8">
        {/* Terminal Window - Takes up left column */}
        <div className="md:col-span-6 lg:col-span-7">
          <TerminalWindow maxHeight="500px" />
        </div>

        {/* Right Column - Stacked components */}
        <div className="md:col-span-6 lg:col-span-5 space-y-6">
          {/* System Stats */}
          <SystemStats />

          {/* Network Status */}
          <NetworkStatus showDetails={true} />

          {/* Control Dock */}
          <ControlDock
            isConnected={isConnected}
            isAnalyzing={isAnalyzing}
            onConnect={handleConnect}
            onAnalyze={handleAnalyze}
          />
        </div>
      </div>

      {/* Mobile Stack Layout */}
      <div className="md:hidden space-y-6">
        <TerminalWindow maxHeight="300px" />
        <SystemStats compact={true} />
        <NetworkStatus showDetails={false} />
        <ControlDock
          isConnected={isConnected}
          isAnalyzing={isAnalyzing}
          onConnect={handleConnect}
          onAnalyze={handleAnalyze}
        />
      </div>

      {/* Usage Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 p-6 bg-black/40 backdrop-blur-xl border border-cyan-400/20 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Usage Instructions</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-white/80">
          <div>
            <h4 className="font-semibold text-fuchsia-400 mb-2">Desktop Layout</h4>
            <ul className="space-y-1">
              <li>• Terminal window on the left (6-7 columns)</li>
              <li>• System stats, network status, and controls on the right</li>
              <li>• All components use consistent holographic theme</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-fuchsia-400 mb-2">Mobile Layout</h4>
            <ul className="space-y-1">
              <li>• Components stack vertically</li>
              <li>• Compact versions for smaller screens</li>
              <li>• Touch-friendly interactions</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
