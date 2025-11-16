'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PageGridDistortion from '../../components/PageGridDistortion'
import MintedGallery from '../../components/fractales/MintedGallery'
import Dock from '../../components/Dock'
import ClientWalletButton from '../../components/ClientWalletButton'
import { HoloText } from '../../components/ui/holo'
import { 
  HiHome,
  HiChat,
  HiVideoCamera,
  HiShoppingBag,
  HiChartBar,
  HiUser,
  HiPhotograph
} from 'react-icons/hi'

export default function FractalesGalleryPage() {
  const router = useRouter()
  const [isDockVisible, setIsDockVisible] = useState(true)

  return (
    <>
      {/* Dock Navigation */}
      {isDockVisible && (
        <div className="fixed inset-y-0 left-0 z-50">
          <Dock 
            items={[
              { icon: <HiHome className="text-cyan-400" size={24} />, label: 'Home', onClick: () => router.push('/') },
              { icon: <HiChat className="text-fuchsia-400" size={24} />, label: 'Chat', onClick: () => router.push('/?tab=chat') },
              { icon: <HiVideoCamera className="text-emerald-400" size={24} />, label: 'Video', onClick: () => router.push('/?tab=videochat') },
              { icon: <HiShoppingBag className="text-purple-400" size={24} />, label: 'Marketplace', onClick: () => router.push('/?tab=marketplace') },
              { icon: <HiChartBar className="text-blue-400" size={24} />, label: 'Dashboard', onClick: () => router.push('/?tab=dashboard') },
              { icon: <HiPhotograph className="text-yellow-400" size={24} />, label: 'Gallery', onClick: () => router.push('/fractales/gallery') },
              { icon: <HiUser className="text-orange-400" size={24} />, label: 'Profile', onClick: () => router.push('/?tab=profile') },
            ]}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      )}

      <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0B101A' }}>
        <div className="fixed inset-0 z-0">
          <PageGridDistortion isActive />
        </div>

        {/* Header */}
        <header className="p-4 relative z-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Hamburger Menu */}
                <button
                  onClick={() => setIsDockVisible(!isDockVisible)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 border border-cyan-400 hover:bg-black/60 transition-colors shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                  title={isDockVisible ? 'Hide Navigation' : 'Show Navigation'}
                >
                  <div className="w-4 h-4 flex flex-col justify-center space-y-1">
                    <div className={`w-full h-0.5 bg-cyan-400 transition-all duration-300 ${isDockVisible ? 'rotate-45 translate-y-1' : ''}`} />
                    <div className={`w-full h-0.5 bg-cyan-400 transition-all duration-300 ${isDockVisible ? 'opacity-0' : ''}`} />
                    <div className={`w-full h-0.5 bg-cyan-400 transition-all duration-300 ${isDockVisible ? '-rotate-45 -translate-y-1' : ''}`} />
                  </div>
                </button>

                {/* Compact Holo Container */}
                <div className="relative overflow-hidden rounded-lg crystal-glass crystal-glass-hover refraction-overlay transition-all duration-300 border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] crystal-panel crystal-layer-2">
                  {/* Content */}
                  <div className="relative z-10 px-3 py-2">
                    <Link 
                      href="/"
                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity group"
                    >
                      <h1 
                        className="text-lg font-bold tracking-wider psychat-neon relative"
                        style={{ fontFamily: 'Orbitron, monospace' }}
                      >
                        <span className="relative z-10">PsyChat</span>
                        <span 
                          className="absolute inset-0 text-lg font-bold tracking-wider opacity-40 blur-sm group-hover:opacity-60 transition-opacity duration-300"
                          style={{ color: 'rgba(0, 255, 255, 0.5)', fontFamily: 'Orbitron, monospace' }}
                        >
                          PsyChat
                        </span>
                      </h1>
                      <span className="text-xs text-white/70 group-hover:text-cyan-300 transition-colors duration-300">by MotusDAO</span>
                    </Link>
                  </div>
                  <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
                </div>
              </div>

              {/* Wallet Button */}
              <div className="pr-4">
                <ClientWalletButton />
              </div>
            </div>
          </div>
        </header>

        <div className={`relative z-10 max-w-6xl mx-auto px-6 py-24 transition-all duration-300 ${
          isDockVisible ? 'pl-24 md:pl-24' : 'pl-4 md:pl-24'
        }`}>
          <div className="mb-8">
            <HoloText size="xl" weight="bold">Fractales Gallery</HoloText>
            <HoloText size="sm" weight="normal" className="text-white/70">All minted fractals on Polkadot Hub Testnet</HoloText>
          </div>

          <MintedGallery />
        </div>
      </main>
    </>
  )
}

