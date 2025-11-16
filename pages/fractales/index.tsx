import Link from 'next/link'
import PageGridDistortion from '../../components/PageGridDistortion'
import { HoloPanel, HoloText } from '../../components/ui/holo'

const names = ['brainmelt','cosmic','entropy','glitchy','iterate','jazzdimension','matrixchat','neuroreality','planet','psyched','quantum','ripples','transform']

export default function FractalesIndex() {
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0B101A' }}>
      <div className="fixed inset-0 z-0">
        <PageGridDistortion isActive />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="mb-8">
          <HoloText size="xl" weight="bold">Fractales</HoloText>
          <HoloText size="sm" weight="normal" className="text-white/70">Explore generated DES fractals</HoloText>
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
      </div>
    </main>
  )
}
