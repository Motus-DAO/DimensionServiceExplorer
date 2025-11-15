import React from "react";
import { motion } from "framer-motion";
import { EvervaultCard, Icon } from "../ui/evervault-card";
import { HoloText, HoloPanel } from "../ui/holo";
import { ComplexMolecule, WaterMolecule } from "../ui";

export default function DataconomySection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Section background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/25 to-purple-900/25" />
      
      {/* Subtle floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 -z-10"
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -10, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.1), transparent)',
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 -z-10"
        animate={{
          x: [0, -15, 10, 0],
          y: [0, 15, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255,0,255,0.1), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <HoloText 
            size="xl" 
            weight="bold" 
            className="text-4xl md:text-5xl font-bold mb-6 neon-solid-cyan"
          >
            The Digital Renaissance of AI Dataconomy
          </HoloText>
          <HoloText 
            size="base" 
            weight="normal" 
            className="text-lg max-w-3xl mx-auto neon-solid-magenta opacity-80"
          >
            Experience the future of mental health in Web3 through our revolutionary AI dataconomy
          </HoloText>
        </div>

        {/* Three Cards Grid - Enhanced with Crystal Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Card 1: Enhanced with Crystal Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative motion-crystal-hover"
          >
            <HoloPanel variant="elevated" size="lg" className="h-[30rem] relative overflow-hidden">
              {/* Crystal corner accents */}
              <div className="crystal-corner-tl" />
              <div className="crystal-corner-tr" />
              <div className="crystal-corner-bl" />
              <div className="crystal-corner-br" />
              
              {/* Geometric overlay */}
              <div className="geometric-overlay" />
              
              {/* Crystal lines */}
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line" />
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
              <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line-purple" />
              <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />
              
              {/* Evervault Card with enhanced styling */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 neon-solid-cyan" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 neon-solid-magenta" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 neon-solid-purple" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 neon-solid-cyan" />
                    <EvervaultCard text="lunar" className="font-orbitron" />
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <HoloText 
                    size="sm" 
                    weight="normal" 
                    className="neon-solid-cyan"
                  >
                    Experience the power of AI dataconomy for mental health in Web3.
                  </HoloText>
                  
                  <div className="flex justify-center">
                    <span className="crystal-border-purple px-3 py-1 text-xs font-mono neon-solid-purple">
                      Mental Health
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Crystal scan line effect */}
              <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
            </HoloPanel>
          </motion.div>

          {/* Card 2: Enhanced with Crystal Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,0,255,0.3)" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="relative motion-crystal-hover"
          >
            <HoloPanel variant="floating" size="lg" className="h-[30rem] relative overflow-hidden">
              {/* Crystal corner accents */}
              <div className="crystal-corner-tl" />
              <div className="crystal-corner-tr" />
              <div className="crystal-corner-bl" />
              <div className="crystal-corner-br" />
              
              {/* Geometric overlay */}
              <div className="geometric-overlay" />
              
              {/* Crystal lines */}
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line" />
              <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />
              <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line-purple" />
              
              {/* Evervault Card with enhanced styling */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 neon-solid-magenta" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 neon-solid-cyan" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 neon-solid-cyan" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 neon-solid-purple" />
                    <EvervaultCard text="punk" className="font-orbitron" />
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <HoloText 
                    size="sm" 
                    weight="normal" 
                    className="neon-solid-magenta"
                  >
                    Own your therapy data, earn from anonymized insights, and build sustainable wealth through the dataconomy.
                  </HoloText>
                  
                  <div className="flex justify-center">
                    <span className="crystal-border-cyan px-3 py-1 text-xs font-mono neon-solid-cyan">
                      Data Ownership
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Crystal scan line effect */}
              <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
            </HoloPanel>
          </motion.div>

          {/* Card 3: Enhanced with Crystal Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(157,104,255,0.3)" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            className="relative motion-crystal-hover"
          >
            <HoloPanel variant="elevated" size="lg" className="h-[30rem] relative overflow-hidden">
              {/* Crystal corner accents */}
              <div className="crystal-corner-tl" />
              <div className="crystal-corner-tr" />
              <div className="crystal-corner-bl" />
              <div className="crystal-corner-br" />
              
              {/* Geometric overlay */}
              <div className="geometric-overlay" />
              
              {/* Crystal lines */}
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line-purple" />
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
              <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line-magenta" />
              <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />
              
              {/* Evervault Card with enhanced styling */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 neon-solid-purple" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 neon-solid-magenta" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 neon-solid-magenta" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 neon-solid-cyan" />
                    <EvervaultCard text="(r)evolution" className="font-orbitron" />
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <HoloText 
                    size="sm" 
                    weight="normal" 
                    className="neon-solid-purple"
                  >
                    Your privacy is protected by design, your data is your most valuable asset.
                  </HoloText>
                  
                  <div className="flex justify-center">
                    <span className="crystal-border-magenta px-3 py-1 text-xs font-mono neon-solid-magenta">
                      Privacy First
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Crystal scan line effect */}
              <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
            </HoloPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
