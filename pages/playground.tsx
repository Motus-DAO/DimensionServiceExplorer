import TerminalMockup from "@/components/ui/TerminalMockup";
import { HoloTerminal } from "@/components/organisms";
import { HoloText } from "@/components/ui";
import Link from "next/link";

export default function Playground() {
  return (
    // Experimental playground page - independent background system for testing components
    <main className="min-h-screen bg-deep-black text-text flex flex-col items-center justify-center p-10 relative overflow-hidden">
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
      
      <div className="max-w-6xl w-full space-y-8 relative z-10" style={{ transformStyle: 'preserve-3d' }}>
        <h1 className="text-5xl text-center font-bold text-white/90 tracking-wide">
          <span className="bg-gradient-to-r from-electric-cyan via-vibrant-magenta to-slate-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.5)] edge-glow-pulse">
            PsyChat Holographic Terminal
          </span>
        </h1>

        <div className="relative" style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}>
          <TerminalMockup />
        </div>

        {/* HoloTerminal Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <HoloText size="xl" weight="bold" className="font-futuristic-sans">
              Holographic Terminal Interface
            </HoloText>
            <HoloText size="base" weight="normal" className="mt-4 opacity-80">
              Experience the full holographic terminal with real-time system monitoring
            </HoloText>
          </div>

          {/* HoloTerminal Preview */}
          <div className="relative bg-black/20 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
            <div className="h-96 overflow-hidden rounded-lg">
              <HoloTerminal
                onConnect={() => console.log('Connect from playground')}
                onAnalyze={() => console.log('Analyze from playground')}
                className="scale-75 origin-top-left"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center space-x-4">
            <Link href="/holo">
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:from-cyan-500/30 hover:to-fuchsia-500/30 hover:border-cyan-400/50 transition-all duration-300 font-semibold">
                View Full Terminal
              </button>
            </Link>
            <button className="px-6 py-3 bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-400/30 rounded-xl text-fuchsia-300 hover:from-fuchsia-500/30 hover:to-cyan-500/30 hover:border-fuchsia-400/50 transition-all duration-300 font-semibold">
              Learn More
            </button>
          </div>
        </div>

        <footer className="text-center text-sm text-white/40 pt-8">
          <p className="font-mono">© 2025 MotusDAO — AI Companion Prototype</p>
          <p className="text-xs mt-2 text-electric-cyan/60 edge-glow-pulse">Holographic Interface v2.0</p>
        </footer>
      </div>
    </main>
  );
}
