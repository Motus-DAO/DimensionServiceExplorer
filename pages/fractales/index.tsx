import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PageGridDistortion from '../../components/PageGridDistortion'
import { HoloPanel, HoloText, HoloButton } from '../../components/ui/holo'
import MintedGallery from '../../components/fractales/MintedGallery'
import Dock from '../../components/Dock'
import { 
  HiHome, 
  HiUser,
  HiPhotograph
} from 'react-icons/hi'

const names = ['brainmelt','cosmic','entropy','glitchy','iterate','jazzdimension','matrixchat','neuroreality','planet','psyched','quantum','ripples','transform']

export default function FractalesIndex() {
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
                    <Link 
                      href="/"
                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity group"
                    >
                      <h1 
                        className="text-lg font-bold tracking-wider psychat-neon relative"
                        style={{ 
                          fontFamily: 'Orbitron, monospace'
                        }}
                      >
                        <span className="relative z-10">DSE</span>
                        {/* Neon glow effect */}
                        <span 
                          className="absolute inset-0 text-lg font-bold tracking-wider opacity-40 blur-sm group-hover:opacity-60 transition-opacity duration-300"
                          style={{ 
                            fontFamily: 'Orbitron, monospace',
                            color: 'rgba(0, 255, 255, 0.5)'
                          }}
                        >
                          DSE
                        </span>
                      </h1>
                      <span className="text-xs text-white/70 group-hover:text-cyan-300 transition-colors duration-300">by MotusDAO</span>
                    </Link>
                  </div>

                  {/* Crystal scan line effect */}
                  <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
                </div>
              </div>
              
            </div>
          </div>
        </header>

        <div className={`relative z-10 max-w-6xl mx-auto px-6 py-24 transition-all duration-300 ${
          isDockVisible 
            ? 'pl-24 md:pl-24' 
            : 'pl-4 md:pl-24'
        }`}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <HoloText size="xl" weight="bold">Fractales</HoloText>
            <HoloText size="sm" weight="normal" className="text-white/70">Explore and relax your mind with Dimension Service Explorer. Mint, share and earn from your favorite fractals.</HoloText>
          </div>
          <Link href="/fractales/gallery">
            <HoloButton variant="primary" size="sm">View Gallery</HoloButton>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {names.map((name) => (
            <Link key={name} href={`/fractales/${name}`}>
              <div className="cursor-pointer">
                <HoloPanel variant="elevated" size="lg" className="p-6 hover:bg-cyan-500/10 transition-colors">
                  <HoloText size="base" weight="normal" className="text-cyan-400 capitalize">{name}</HoloText>
                  <div className="text-white/60 text-sm mt-2">Open fractal</div>
                </HoloPanel>
              </div>
            </Link>
          ))}
        </div>

        {/* Minted Gallery Section */}
        <MintedGallery />
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-4 mt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
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
            <div className="relative z-10 p-6 text-center">
              <HoloText size="lg" weight="bold" className="text-cyan-400 mb-2">
                EXPECT CHAOS
              </HoloText>
              <p className="text-white/60 text-sm">
                Built for Polkadot Sub Zero • MotusDAO • 
                <span className="text-green-400"> XX Network</span> • 
                <span className="text-blue-400"> Arkiv</span> • 
                <span className="text-purple-400"> Kusama</span>
              </p>
            </div>

            {/* Crystal scan line effect */}
            <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
          </div>
        </div>
      </footer>
      </main>
    </>
  )
}
