import { use3DTilt } from '@/lib/hooks/use3DTilt';
import FloatingDataViz from './FloatingDataViz';
import HolographicPanel from './HolographicPanel';
import DataFlowLines from './DataFlowLines';
import MotionBlurStreak, { HorizontalCyanStreak, DiagonalMagentaStreak, VerticalPurpleStreak } from './MotionBlurStreak';

export default function TerminalMockup() {
  const { elementRef, tiltValues, transformStyle } = use3DTilt();

  return (
    <div 
      ref={elementRef}
      className="relative w-full h-[600px] overflow-hidden" 
      style={{ perspective: '2000px' }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 blur-3xl" />
      
      {/* Enhanced motion blur streaks */}
      <div className="absolute inset-0 overflow-hidden">
        <HorizontalCyanStreak delay={0} speed="medium" intensity="medium" />
        <DiagonalMagentaStreak delay={1} angle={15} speed="fast" intensity="high" />
        <VerticalPurpleStreak delay={2} speed="slow" intensity="low" />
        <HorizontalCyanStreak delay={3} speed="ultra" intensity="high" />
      </div>

      {/* Main Terminal Panel (Center) - Enhanced */}
      <HolographicPanel
        variant="primary"
        edgeColor="mixed"
        opacity="main"
        size="xl"
        position={{ x: 0, y: 0, z: 0 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 float-panel"
        style={{
          ...transformStyle,
          transform: `${transformStyle.transform} translateZ(0px)`,
          zIndex: 10
        }}
      >
        {/* Terminal borders */}
        <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/40 circuit-pulse" />
        <div className="absolute inset-1 rounded-3xl border border-fuchsia-400/30 circuit-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Header */}
        <header className="flex justify-between items-center mb-4 relative z-20">
          <h2 className="text-lg font-bold text-cyan-300 font-mono tracking-wide neon-flicker drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]">
            PsyChat Terminal
          </h2>
          <span className="text-xs text-fuchsia-400/90 font-mono neon-flicker">connected</span>
        </header>

        {/* Terminal content */}
        <div className="font-mono text-xs text-white/90 space-y-1 leading-relaxed relative z-20">
          <p className="text-white/70">&gt; chat --private</p>
          <p className="text-cyan-300 neon-flicker drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]">Chat ready</p>
          <p className="text-white/70">&gt; analyze --mood</p>
          <p className="text-fuchsia-300 neon-flicker drop-shadow-[0_0_6px_rgba(225,68,255,0.6)]">Calm detected</p>
          <p className="text-white/70">&gt; mint --hnft</p>
          <p className="text-slate-300 neon-flicker drop-shadow-[0_0_6px_rgba(167,180,198,0.6)]">Identity minted</p>
          <p className="text-cyan-400 mt-2 neon-flicker drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">$ active</p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-4 relative z-20">
          {["Connect", "Analyze"].map((label, i) => (
            <button
              key={i}
              className="relative px-4 py-2 rounded-full text-white text-xs font-medium border border-white/20 bg-gradient-to-r from-cyan-400/15 to-fuchsia-500/15 hover:from-cyan-400/25 hover:to-fuchsia-500/25 backdrop-blur-xl shadow-[0_0_20px_rgba(225,68,255,0.4)] transition-all duration-300 hover:scale-105 neon-flicker"
            >
              {label}
            </button>
          ))}
        </div>
      </HolographicPanel>

      {/* Stats Panel (Top Right) */}
      <HolographicPanel
        variant="secondary"
        edgeColor="cyan"
        opacity="far"
        size="medium"
        position={{ x: 0, y: 0, z: 50 }}
        className="absolute top-8 right-8 float-panel parallax-drift"
        style={{
          transform: `translateZ(50px) rotateX(${tiltValues.tiltX * 0.5}deg) rotateY(${tiltValues.tiltY * 0.5}deg)`,
          zIndex: 8,
          animationDelay: '1s'
        }}
      >
        <h3 className="text-sm font-bold text-cyan-300 font-mono mb-2 neon-flicker">System Stats</h3>
        <div className="space-y-1 text-xs text-white/80">
          <div className="flex justify-between">
            <span>CPU:</span>
            <span className="text-cyan-300">78%</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="text-fuchsia-300">64%</span>
          </div>
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="text-slate-300">Active</span>
          </div>
        </div>
      </HolographicPanel>

      {/* Activity Log Panel (Bottom Right) */}
      <HolographicPanel
        variant="secondary"
        edgeColor="magenta"
        opacity="mid"
        size="large"
        position={{ x: 0, y: 0, z: 60 }}
        className="absolute bottom-8 right-8 float-panel parallax-drift"
        style={{
          transform: `translateZ(60px) rotateX(${tiltValues.tiltX * 0.3}deg) rotateY(${tiltValues.tiltY * 0.3}deg)`,
          zIndex: 7,
          animationDelay: '2s'
        }}
      >
        <h3 className="text-sm font-bold text-fuchsia-300 font-mono mb-2 neon-flicker">Activity Log</h3>
        <div className="space-y-1 text-xs text-white/80 font-mono">
          <p className="text-cyan-300">[12:34] Chat initialized</p>
          <p className="text-fuchsia-300">[12:35] Mood analysis complete</p>
          <p className="text-slate-300">[12:36] NFT minted</p>
          <p className="text-cyan-300">[12:37] Session active</p>
        </div>
      </HolographicPanel>

      {/* Status Indicator Panel (Top Left) */}
      <HolographicPanel
        variant="overlay"
        edgeColor="cyan"
        opacity="near"
        size="small"
        position={{ x: 0, y: 0, z: 40 }}
        className="absolute top-8 left-8 float-panel parallax-drift"
        style={{
          transform: `translateZ(40px) rotateX(${tiltValues.tiltX * 0.7}deg) rotateY(${tiltValues.tiltY * 0.7}deg)`,
          zIndex: 9,
          animationDelay: '0.5s'
        }}
      >
        <div className="text-center">
          <div className="w-3 h-3 bg-cyan-400 rounded-full mx-auto mb-1 neon-flicker drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          <p className="text-xs text-white/80 font-mono">Online</p>
        </div>
      </HolographicPanel>

      {/* Network Status Panel (Bottom Left) */}
      <HolographicPanel
        variant="secondary"
        edgeColor="purple"
        opacity="mid"
        size="medium"
        position={{ x: 0, y: 0, z: 45 }}
        className="absolute bottom-8 left-8 float-panel parallax-drift"
        style={{
          transform: `translateZ(45px) rotateX(${tiltValues.tiltX * 0.4}deg) rotateY(${tiltValues.tiltY * 0.4}deg)`,
          zIndex: 8,
          animationDelay: '1.5s'
        }}
      >
        <h3 className="text-sm font-bold text-purple-300 font-mono mb-1 neon-flicker">Network</h3>
        <div className="space-y-1 text-xs text-white/80">
          <div className="flex justify-between">
            <span>Latency:</span>
            <span className="text-cyan-300">12ms</span>
          </div>
          <div className="flex justify-between">
            <span>Bandwidth:</span>
            <span className="text-fuchsia-300">1.2Gbps</span>
          </div>
        </div>
      </HolographicPanel>

      {/* Performance Panel (Top Center) */}
      <HolographicPanel
        variant="overlay"
        edgeColor="cyan"
        opacity="near"
        size="medium"
        position={{ x: 0, y: 0, z: 55 }}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 float-panel parallax-drift"
        style={{
          transform: `translateZ(55px) rotateX(${tiltValues.tiltX * 0.6}deg) rotateY(${tiltValues.tiltY * 0.6}deg) translateX(-50%)`,
          zIndex: 8,
          animationDelay: '0.8s'
        }}
      >
        <h3 className="text-sm font-bold text-green-300 font-mono mb-2 neon-flicker">Performance</h3>
        <div className="space-y-1 text-xs text-white/80">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className="text-green-300">60</span>
          </div>
          <div className="flex justify-between">
            <span>Load:</span>
            <span className="text-cyan-300">Low</span>
          </div>
        </div>
      </HolographicPanel>

      {/* Security Panel (Bottom Center) */}
      <HolographicPanel
        variant="overlay"
        edgeColor="magenta"
        opacity="far"
        size="medium"
        position={{ x: 0, y: 0, z: 65 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 float-panel parallax-drift"
        style={{
          transform: `translateZ(65px) rotateX(${tiltValues.tiltX * 0.2}deg) rotateY(${tiltValues.tiltY * 0.2}deg) translateX(-50%)`,
          zIndex: 7,
          animationDelay: '2.5s'
        }}
      >
        <h3 className="text-sm font-bold text-yellow-300 font-mono mb-2 neon-flicker">Security</h3>
        <div className="space-y-1 text-xs text-white/80">
          <div className="flex justify-between">
            <span>Encryption:</span>
            <span className="text-yellow-300">AES-256</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-300">Secure</span>
          </div>
        </div>
      </HolographicPanel>

      {/* Floating Data Visualizations */}
      <FloatingDataViz 
        type="chart" 
        position={{ x: 150, y: 150, z: 100 }} 
        size="small" 
        color="cyan" 
      />
      <FloatingDataViz 
        type="progress" 
        position={{ x: 450, y: 120, z: 120 }} 
        size="small" 
        color="magenta" 
      />
      <FloatingDataViz 
        type="geometric" 
        position={{ x: 120, y: 350, z: 80 }} 
        size="small" 
        color="purple" 
      />
      <FloatingDataViz 
        type="chart" 
        position={{ x: 450, y: 350, z: 90 }} 
        size="small" 
        color="cyan" 
      />
      <FloatingDataViz 
        type="progress" 
        position={{ x: 300, y: 100, z: 110 }} 
        size="small" 
        color="magenta" 
      />
      <FloatingDataViz 
        type="geometric" 
        position={{ x: 300, y: 450, z: 70 }} 
        size="small" 
        color="purple" 
      />

      {/* Enhanced circuit connections between panels */}
      <DataFlowLines
        connections={[
          {
            from: { x: 200, y: 200 },
            to: { x: 450, y: 120 },
            color: 'cyan',
            intensity: 'medium',
            delay: 0
          },
          {
            from: { x: 200, y: 200 },
            to: { x: 300, y: 450 },
            color: 'magenta',
            intensity: 'high',
            delay: 1
          },
          {
            from: { x: 200, y: 200 },
            to: { x: 450, y: 400 },
            color: 'purple',
            intensity: 'medium',
            delay: 2
          },
          {
            from: { x: 200, y: 200 },
            to: { x: 100, y: 150 },
            color: 'mixed',
            intensity: 'low',
            delay: 3
          }
        ]}
      />

      {/* Enhanced ambient glow */}
      <div className="absolute -bottom-20 left-0 right-0 h-40 bg-gradient-to-r from-cyan-500/10 via-fuchsia-400/10 to-slate-400/10 blur-3xl rounded-full opacity-30" />
      <div className="absolute -top-20 left-0 right-0 h-40 bg-gradient-to-r from-cyan-500/5 via-fuchsia-400/5 to-slate-400/5 blur-3xl rounded-full opacity-20" />
    </div>
  );
}
