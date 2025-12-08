import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HoloText, HoloButton } from './ui/holo';
import { ComplexMolecule, WaterMolecule } from './ui';
import DecryptedText from './DecryptedText';

type HeroTerminalProps = {
  onConnect?: () => Promise<void> | void;
  onNavigate?: (tab: 'home' | 'chat' | 'learn') => void;
};

export default function HeroTerminal({ onConnect, onNavigate }: HeroTerminalProps) {
  const [showCommand, setShowCommand] = useState(false);
  const [showCheckmarks, setShowCheckmarks] = useState(false);
  const [showBullets, setShowBullets] = useState(false);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showLine4, setShowLine4] = useState(false);
  const [showLine5, setShowLine5] = useState(false);
  const [showBullet1, setShowBullet1] = useState(false);
  const [showBullet2, setShowBullet2] = useState(false);
  const [showBullet3, setShowBullet3] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const loopCleanupRef = useRef<(() => void) | null>(null);
  const initialCleanupRef = useRef<(() => void) | null>(null);

  const resetAnimation = () => {
    // Don't reset showCommand - command line should always be visible
    setShowCheckmarks(false);
    setShowBullets(false);
    setShowLine1(false);
    setShowLine2(false);
    setShowLine3(false);
    setShowLine4(false);
    setShowLine5(false);
    setShowBullet1(false);
    setShowBullet2(false);
    setShowBullet3(false);
    // Increment animation key to force re-mounting of DecryptedText components
    setAnimationKey(prev => prev + 1);
  };

  const startAnimation = () => {
    const timer1 = setTimeout(() => setShowCommand(true), 500);
    const timer2 = setTimeout(() => setShowCheckmarks(true), 1200);
    const timer3 = setTimeout(() => setShowBullets(true), 3000);
    
    // Staggered delays for checkmark lines (2 seconds between each)
    const lineTimer1 = setTimeout(() => setShowLine1(true), 2000);
    const lineTimer2 = setTimeout(() => setShowLine2(true), 4000);
    const lineTimer3 = setTimeout(() => setShowLine3(true), 6000);
    const lineTimer4 = setTimeout(() => setShowLine4(true), 8000);
    const lineTimer5 = setTimeout(() => setShowLine5(true), 10000);
    
    // Staggered delays for bullet points (2 seconds between each)
    const bulletTimer1 = setTimeout(() => setShowBullet1(true), 12000);
    const bulletTimer2 = setTimeout(() => setShowBullet2(true), 14000);
    const bulletTimer3 = setTimeout(() => setShowBullet3(true), 16000);
    
    // Mark animation as complete when all content is shown
    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 17000); // After all content is shown
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(lineTimer1);
      clearTimeout(lineTimer2);
      clearTimeout(lineTimer3);
      clearTimeout(lineTimer4);
      clearTimeout(lineTimer5);
      clearTimeout(bulletTimer1);
      clearTimeout(bulletTimer2);
      clearTimeout(bulletTimer3);
      clearTimeout(completeTimer);
    };
  };

  useEffect(() => {
    const cleanup = startAnimation();
    initialCleanupRef.current = cleanup;
    
    return () => {
      if (initialCleanupRef.current) {
        initialCleanupRef.current();
        initialCleanupRef.current = null;
      }
    };
  }, []);

  // Set up looping after first animation completes
  useEffect(() => {
    if (animationComplete) {
      const interval = setInterval(() => {
        // Clean up any existing loop animation
        if (loopCleanupRef.current) {
          loopCleanupRef.current();
          loopCleanupRef.current = null;
        }
        
        resetAnimation();
        setTimeout(() => {
          const cleanup = startLoopAnimation();
          loopCleanupRef.current = cleanup;
        }, 100);
      }, 18000); // Loop every 18 seconds (16s animation + 2s pause)

      return () => {
        clearInterval(interval);
        // Clean up any pending loop animation
        if (loopCleanupRef.current) {
          loopCleanupRef.current();
          loopCleanupRef.current = null;
        }
      };
    }
  }, [animationComplete]);

  // Loop animation function with same timing as initial animation
  const startLoopAnimation = () => {
    // Start with checkmarks section
    const timer2 = setTimeout(() => setShowCheckmarks(true), 1200);
    
    // Staggered delays for checkmark lines (2 seconds between each)
    const lineTimer1 = setTimeout(() => setShowLine1(true), 2000);
    const lineTimer2 = setTimeout(() => setShowLine2(true), 4000);
    const lineTimer3 = setTimeout(() => setShowLine3(true), 6000);
    const lineTimer4 = setTimeout(() => setShowLine4(true), 8000);
    const lineTimer5 = setTimeout(() => setShowLine5(true), 10000);
    
    // Start bullets section after checkmarks are done
    const timer3 = setTimeout(() => setShowBullets(true), 12000);
    
    // Staggered delays for bullet points (2 seconds between each)
    const bulletTimer1 = setTimeout(() => setShowBullet1(true), 12000);
    const bulletTimer2 = setTimeout(() => setShowBullet2(true), 14000);
    const bulletTimer3 = setTimeout(() => setShowBullet3(true), 16000);
    
    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(lineTimer1);
      clearTimeout(lineTimer2);
      clearTimeout(lineTimer3);
      clearTimeout(lineTimer4);
      clearTimeout(lineTimer5);
      clearTimeout(bulletTimer1);
      clearTimeout(bulletTimer2);
      clearTimeout(bulletTimer3);
    };
  };

  const handleExploreFractales = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/fractales';
    }
  };

  return (
    <div className="w-full flex justify-center relative overflow-hidden">
      {/* Terminal background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-purple-900/5" />
      
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

      <div className="w-full max-w-4xl mx-2 sm:mx-4 relative z-10 px-2 sm:px-0 md:px-0">
        {/* Terminal Frame */}
        <div
          className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-md overflow-hidden shadow-2xl crt-curvature"
          role="region"
          aria-label="PsyChat interactive terminal hero"
          onClick={() => {}}
        >
          {/* Header */}
          <div className="bg-black/90 border-b border-gray-600/60 px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="ml-4 text-gray-300 text-caption text-mono select-none">PsyChat Terminal v1.1</div>
          </div>

          {/* Body */}
          <div className="relative">
            {/* CRT overlays */}
            <div className="absolute inset-0 pointer-events-none crt-scanlines"></div>
            <div className="absolute inset-0 pointer-events-none crt-vignette"></div>

            <div 
              ref={terminalRef}
              className="relative p-4 sm:p-6 md:p-6 font-mono text-green-400 bg-black/20 backdrop-blur-sm leading-relaxed text-sm sm:text-base md:text-lg min-h-[300px] sm:min-h-[400px]"
            >
              {/* Command line - Always visible and fixed at top */}
              <div className="text-green-500 mb-4">
                $ psychat --public-goods --lunarpunks
              </div>

              {/* Staged Terminal Content */}
              <div className="mb-6">
                <div className="space-y-2">
                  
                  {/* Checkmarks - appear gradually with DecryptedText */}
                  {showCheckmarks && (
                    <div className="space-y-3 sm:space-y-3 mt-4">
                      {showLine1 && (
                        <div>
                          <DecryptedText
                            key={`line1-${animationKey}`}
                            text="✓ Decentralized privacy infrastructure"
                            speed={80}
                            maxIterations={15}
                            sequential={true}
                            revealDirection="start"
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                            className="text-emerald-400"
                            encryptedClassName="text-emerald-700"
                            animateOn="view"
                          />
                        </div>
                      )}
                      {showLine2 && (
                        <div>
                          <DecryptedText
                            key={`line2-${animationKey}`}
                            text="✓ Censorship-resistant communication"
                            speed={80}
                            maxIterations={15}
                            sequential={true}
                            revealDirection="start"
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                            className="text-emerald-400"
                            encryptedClassName="text-emerald-700"
                            animateOn="view"
                          />
                        </div>
                      )}
                      {showLine3 && (
                        <div>
                          <DecryptedText
                            key={`line3-${animationKey}`}
                            text="✓ Data sovereignty: 100% user-owned"
                            speed={80}
                            maxIterations={15}
                            sequential={true}
                            revealDirection="start"
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                            className="text-emerald-400"
                            encryptedClassName="text-emerald-700"
                            animateOn="view"
                          />
                        </div>
                      )}
                      {showLine4 && (
                        <div>
                          <DecryptedText
                            key={`line4-${animationKey}`}
                            text="✓ Open source privacy tools"
                            speed={80}
                            maxIterations={15}
                            sequential={true}
                            revealDirection="start"
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                            className="text-emerald-400"
                            encryptedClassName="text-emerald-700"
                            animateOn="view"
                          />
                        </div>
                      )}
                      {showLine5 && (
                        <div>
                          <DecryptedText
                            key={`line5-${animationKey}`}
                            text="✓ XX Network E2E encryption active"
                            speed={80}
                            maxIterations={15}
                            sequential={true}
                            revealDirection="start"
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                            className="text-emerald-400"
                            encryptedClassName="text-emerald-700"
                            animateOn="view"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Bullet points - appear last with DecryptedText */}
                  {showBullets && (
                    <div className="space-y-3 sm:space-y-3 mt-4">
                      {showBullet1 && (
                        <div>
                          <DecryptedText
                            key={`bullet1-${animationKey}`}
                            text="- Data marketplace + AMM + RWAs"
                            speed={80}
                            maxIterations={15}
                            sequential={true}
                            revealDirection="start"
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                            className="text-cyan-400"
                            encryptedClassName="text-cyan-700"
                            animateOn="view"
                          />
                        </div>
                      )}
                      {showBullet2 && (
                        <div>
                          <DecryptedText
                            key={`bullet2-${animationKey}`}
                            text="- Built for everyone"
                            speed={80}
                            maxIterations={15}
                            sequential={true}
                            revealDirection="start"
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                            className="text-cyan-400"
                            encryptedClassName="text-cyan-700"
                            animateOn="view"
                          />
                        </div>
                      )}
                      {showBullet3 && (
                        <div>
                          <DecryptedText
                            key={`bullet3-${animationKey}`}
                            text="- Own your data"
                            speed={80}
                            maxIterations={15}
                            sequential={true}
                            revealDirection="start"
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                            className="text-cyan-400"
                            encryptedClassName="text-cyan-700"
                            animateOn="view"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Action Button - Outside terminal, same card */}
          {animationComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="p-4 bg-black/20 border-t border-cyan-500/20 flex justify-center items-center"
            >
              <HoloButton
                onClick={handleExploreFractales}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto tracking-wider px-6 py-3 text-sm sm:text-base font-display"
              >
                <span className="font-display">
                  Explore Fractales
                </span>
              </HoloButton>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}


