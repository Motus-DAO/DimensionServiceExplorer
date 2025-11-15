import React from "react";
import { motion } from "framer-motion";
import { HoloTerminal } from "../components/organisms";
import { HoloText, ComplexMolecule, WaterMolecule } from "../components/ui";

export default function HoloPage() {
  const handleConnect = () => {
    console.log("Connect action triggered");
  };

  const handleAnalyze = () => {
    console.log("Analyze action triggered");
  };

  return (
    // Experimental page for testing atomic/molecular designs - independent background system
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced background with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 via-transparent to-vibrant-magenta/5" />
      <div className="absolute inset-0 bg-gradient-to-tl from-slate-500/3 via-transparent to-electric-cyan/3" />
      
      {/* Enhanced ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-cyan/10 rounded-full blur-3xl opacity-30 depth-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vibrant-magenta/10 rounded-full blur-3xl opacity-30 depth-glow" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl opacity-20 depth-glow" style={{ animationDelay: '2s' }} />
      
      {/* Additional depth layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/2 via-transparent to-vibrant-magenta/2 blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-cyan/1 to-transparent blur-xl" />
      
      {/* Crystal Grid Background */}
      <div className="absolute inset-0 crystal-grid-sparse -z-10" />
      
      {/* Multilayer Crystal Background */}
      <motion.div
        className="absolute inset-0 -z-10 crystal-layer-1"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Crystal Geometric Overlays */}
      <div className="absolute inset-0 geometric-overlay-dense -z-10" />
      
      {/* Floating Crystal Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 crystal-layer-2 -z-10"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.8, 1],
          rotate: [0, 90, 180, 360]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(45deg, rgba(0,255,255,0.05), rgba(255,0,255,0.05))',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 crystal-layer-2 -z-10"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 50, -100, 0],
          scale: [1, 0.8, 1.2, 1],
          rotate: [360, 270, 180, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(45deg, rgba(157,104,255,0.05), rgba(0,255,255,0.05))',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        }}
      />

      {/* Atomic Structure Background Elements */}
      <div className="absolute top-20 left-20 crystal-layer-3 -z-10">
        <ComplexMolecule className="opacity-15" />
      </div>
      
      <div className="absolute bottom-20 right-20 crystal-layer-1 -z-10">
        <WaterMolecule className="opacity-10" />
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-8 left-8 crystal-layer-4 z-20"
      >
        <HoloText size="xl" weight="bold" className="font-futuristic-sans neon-solid-cyan">
          PsyChat Crystal Terminal
        </HoloText>
        <HoloText size="sm" weight="normal" className="mt-2 opacity-80 neon-solid-magenta">
          Advanced Atomic Interface
        </HoloText>
      </motion.div>

      {/* HoloTerminal Component - Centered */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-[1440px]"
        >
          <HoloTerminal
            onConnect={handleConnect}
            onAnalyze={handleAnalyze}
            className="w-full"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 right-8 crystal-layer-4 z-20"
      >
        <HoloText size="xs" weight="normal" className="opacity-60 neon-solid-purple">
          © 2025 MotusDAO — Crystal Interface v3.0
        </HoloText>
      </motion.div>

    </div>
  );
}
