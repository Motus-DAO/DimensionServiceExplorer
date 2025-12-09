import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Profile from '../components/Profile';
// import LetterGlitch from '../components/backgrounds/LetterGlitch';
import Dock from '../components/Dock';
import DecryptedText from '../components/DecryptedText';
import FaultyTerminal from '../components/FaultyTerminal';
// import TerminalLoader from '../components/TerminalLoader';
import { HoloPanel, HoloText } from '../components/ui/holo';
import { ComplexMolecule, WaterMolecule } from '../components/ui';
import PageGridDistortion from '../components/PageGridDistortion';
import BackgroundLayer from '../components/BackgroundLayer';
import { useFarcaster } from '../contexts/FarcasterContext';
import { 
  HiHome, 
  HiUser,
  HiPhotograph
} from 'react-icons/hi';
import { useRouter } from 'next/router';

// Section Components
import {
  HeroTerminalSection
} from '../components/sections';

export default function Home() {
  const router = useRouter();
  const { isConnected, user, isReady } = useFarcaster();
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isDockVisible, setIsDockVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  // Listen for navigation events from other components
  useEffect(() => {
    const handleNavigateToProfile = () => {
      setActiveTab('profile');
    };

    window.addEventListener('navigateToProfile', handleNavigateToProfile);
    
    return () => {
      window.removeEventListener('navigateToProfile', handleNavigateToProfile);
    };
  }, []);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  // Memoize the background grid distortion based on active tab
  const backgroundGrid = useMemo(() => (
    <PageGridDistortion
      className="w-full h-full"
      isActive={true}
      onError={() => console.error('Homepage GridDistortion Error')}
    />
  ), [activeTab]); // Re-render when activeTab changes

  if (!mounted || showLoader) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 15, 35, 0.95) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 100
      }}>
        {/* FaultyTerminal Background */}
        <div className="absolute inset-0 z-0">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={1}
            pause={false}
            scanlineIntensity={0.3}
            glitchAmount={0.5}
            flickerAmount={0.3}
            noiseAmp={0.8}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#00ff00"
            mouseReact={true}
            mouseStrength={0.3}
            pageLoadAnimation={false}
            brightness={0.4}
          />
        </div>
        
        {/* Terminal Container */}
        <div className="w-full max-w-4xl mx-4 relative z-10">
          {/* Terminal Header */}
          <div className="bg-black border border-gray-500 px-4 py-2 flex items-center space-x-2">
            <button 
              onClick={handleLoaderComplete}
              className="w-2 h-2 bg-red-500 hover:bg-red-400 transition-colors cursor-pointer rounded-full"
              title="Close loader"
            ></button>
            <div className="w-2 h-2 bg-yellow-500"></div>
            <div className="w-2 h-2 bg-green-500"></div>
            <div className="ml-4 text-gray-300 text-xs font-mono">
              DimensionServiceExplorer Terminal v1.0.0
            </div>
          </div>

          {/* Terminal Body */}
          <div className="bg-black border border-gray-500 p-6 font-mono text-green-500 min-h-[400px]">
            {/* Terminal Prompt */}
            <div className="flex items-center mb-4">
              <span className="text-green-500 mr-2">$</span>
              <span className="text-gray-400">dse --init --lunarpunk</span>
              <div className="w-2 h-4 bg-green-500 ml-1 animate-pulse"></div>
            </div>

            {/* Welcome Message with Decrypted Animation */}
            <div className="space-y-2 mb-6">
              <DecryptedText
                text="Welcome to the Dimension Service Explorer,"
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
              <DecryptedText
                text="A new kind of Liquid Public Goods."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
              <DecryptedText
                text="Dimensions that empowers humans."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
              <DecryptedText
                text="From Degen to Regen tokenomics."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
    
              <DecryptedText
                text="This is the future of mental health in Web3."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
            </div>

            {/* Loading Animation */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-500">Loading The Digital Renaissance...</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-yellow-500 animate-bounce"></div>
                  <div className="w-1 h-1 bg-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              
              <div className="w-full bg-gray-800 h-1 mb-4">
                <div className="bg-green-500 h-1 animate-pulse"></div>
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="mt-8 pt-4 border-t border-gray-500">
              <div className="text-gray-400 text-sm">
                <div>Initializing Web3 connection...</div>
                <div>Setting up decentralized storage...</div>
              </div>
            </div>

            {/* Cursor */}
            <div className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dock Navigation - Outside overflow container */}
      {isDockVisible && (
        <div className="fixed inset-y-0 left-0 z-50">
          <Dock 
            items={[
              { icon: <HiHome className="text-cyan-400" size={24} />, label: 'Home', onClick: () => setActiveTab('home') },
              { icon: <HiPhotograph className="text-yellow-400" size={24} />, label: 'Gallery', onClick: () => router.push('/fractales') },
              { icon: <HiUser className="text-orange-400" size={24} />, label: 'Profile', onClick: () => setActiveTab('profile') },
            ]}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      )}

      <div className="min-h-screen relative overflow-hidden cursor-crosshair" style={{ backgroundColor: '#0B101A' }}>
        {/* GridDistortion Background - Full homepage background */}
        <div className="fixed inset-0 z-0">
          {backgroundGrid}
        </div>
        
        <div className="relative" style={{ zIndex: 10 }}>
          {/* Header */}
          <header className="p-4 relative z-50">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Hamburger Menu - Outside and left of holo container */}
                  <button
                    onClick={() => setIsDockVisible(!isDockVisible)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 border border-cyan-400 hover:bg-black/60 transition-colors shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                    title={isDockVisible ? "Hide Navigation" : "Show Navigation"}
                  >
                    <div className="w-4 h-4 flex flex-col justify-center space-y-1">
                      <div className={`w-full h-0.5 bg-cyan-400 transition-all duration-300 ${isDockVisible ? 'rotate-45 translate-y-1' : ''}`} />
                      <div className={`w-full h-0.5 bg-cyan-400 transition-all duration-300 ${isDockVisible ? 'opacity-0' : ''}`} />
                      <div className={`w-full h-0.5 bg-cyan-400 transition-all duration-300 ${isDockVisible ? '-rotate-45 -translate-y-1' : ''}`} />
                    </div>
                  </button>

                  {/* Compact Holo Container */}
                  <div className="relative overflow-hidden rounded-lg crystal-glass crystal-glass-hover refraction-overlay transition-all duration-300 border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] crystal-panel crystal-layer-2">
                    {/* Geometric overlay */}
                    <div className="geometric-overlay" />

                    {/* Crystal corner accents */}
                    <div className="crystal-corner-tl" />
                    <div className="crystal-corner-tr" />
                    <div className="crystal-corner-bl" />
                    <div className="crystal-corner-br" />

                    {/* Sharp geometric lines */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line" />
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line-purple" />
                    <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />

                    {/* Content */}
                    <div className="relative z-10 px-3 py-2">
                      <button 
                        onClick={() => setShowLoader(true)}
                        className="flex flex-col hover:opacity-80 transition-opacity group"
                      >
                        <h1 
                          className="text-sm font-bold tracking-wider psychat-neon relative"
                          style={{ 
                            fontFamily: 'Orbitron, monospace'
                          }}
                        >
                          <span className="relative z-10">Dimension Service Explorer</span>
                          {/* Neon glow effect */}
                          <span 
                            className="absolute inset-0 text-sm font-bold tracking-wider opacity-40 blur-sm group-hover:opacity-60 transition-opacity duration-300"
                            style={{ 
                              fontFamily: 'Orbitron, monospace',
                              color: 'rgba(0, 255, 255, 0.5)'
                            }}
                          >
                            Dimension Service Explorer.
                          </span>
                        </h1>
                        <span className="text-xs text-white/70 group-hover:text-cyan-300 transition-colors duration-300">by MotusDAO</span>
                      </button>
                    </div>

                    {/* Crystal scan line effect */}
                    <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
                  </div>
                </div>

                {/* Farcaster Connection Status */}
                {isReady && (
                  <div className="flex items-center space-x-2">
                    {isConnected && user ? (
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
                        {user.pfpUrl && (
                          <img 
                            src={user.pfpUrl} 
                            alt={user.displayName || user.username || 'User'} 
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-xs text-cyan-300">
                          {user.displayName || user.username || `FID: ${user.fid}`}
                        </span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-gray-500/10 border border-gray-400/30">
                        <span className="text-xs text-gray-400">Not connected</span>
                      </div>
                    )}
                  </div>
                )}
                
              </div>
            </div>
          </header>

      {/* Main Content */}
      <main className={`p-4 pb-24 transition-all duration-300 ${
        isDockVisible 
          ? 'pl-24 md:pl-24' // Desktop: keep left padding
          : 'pl-4 md:pl-24'  // Mobile: remove left padding when dock hidden
      }`}>
        <div className={`max-w-6xl mx-auto ${
          !isDockVisible && typeof window !== 'undefined' && window.innerWidth < 768 
            ? 'px-2' // Full width on mobile when dock hidden
            : 'px-4' // Normal padding otherwise
        }`}>
          <>
            {activeTab === 'home' && (
              <main>
                <HeroTerminalSection
                  onConnect={async () => {
                    // No wallet connection needed
                  }}
                  onNavigate={(tab) => {
                    if (tab === 'learn') {
                      const el = document.querySelector('[data-how-it-works]');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }}
                />
              </main>
            )}
            {activeTab === 'profile' && <Profile />}
          </>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 mt-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl crystal-glass crystal-glass-hover refraction-overlay transition-all duration-300 border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] crystal-panel crystal-layer-2">
            {/* Geometric overlay */}
            <div className="geometric-overlay" />

            {/* Crystal corner accents */}
            <div className="crystal-corner-tl" />
            <div className="crystal-corner-tr" />
            <div className="crystal-corner-bl" />
            <div className="crystal-corner-br" />

            {/* Sharp geometric lines */}
            <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line" />
            <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
            <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line-purple" />
            <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />

            {/* Content */}
            <div className="relative z-10 p-6 text-center text-white/80 text-sm">
              <p>
                •Built for Polkadot Sub Zero • MotusDAO • 
                <span className="text-green-400"> XX Network</span> • 
                <span className="text-blue-400"> Arkiv</span> • 
                <span className="text-purple-400"> Kusama</span> • 
                <span className="text-green-400"> </span>
              </p>
            </div>

            {/* Crystal scan line effect */}
            <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
          </div>
        </div>
      </footer>
      </div>
    </div>
    </>
  );
}
