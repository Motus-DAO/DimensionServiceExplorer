import React from 'react';

interface FloatingDataVizProps {
  type: 'chart' | 'progress' | 'geometric';
  position: { x: number; y: number; z: number };
  size?: 'small' | 'medium' | 'large';
  color?: 'cyan' | 'magenta' | 'purple';
}

export default function FloatingDataViz({ 
  type, 
  position, 
  size = 'medium', 
  color = 'cyan' 
}: FloatingDataVizProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const colorClasses = {
    cyan: 'text-cyan-400 border-cyan-400/30 shadow-cyan-400/20',
    magenta: 'text-fuchsia-400 border-fuchsia-400/30 shadow-fuchsia-400/20',
    purple: 'text-purple-400 border-purple-400/30 shadow-purple-400/20'
  };

  const renderChart = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color === 'cyan' ? '#00E5FF' : color === 'magenta' ? '#E144FF' : '#9D68FF'} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color === 'cyan' ? '#00E5FF' : color === 'magenta' ? '#E144FF' : '#9D68FF'} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M10,80 Q25,60 40,45 T70,30 T90,20"
          stroke="url(#gradient-cyan)"
          strokeWidth="2"
          fill="none"
          className="drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
        />
        <circle cx="90" cy="20" r="3" fill="#00E5FF" className="drop-shadow-[0_0_4px_rgba(0,229,255,0.8)]" />
        <circle cx="70" cy="30" r="2" fill="#00E5FF" className="drop-shadow-[0_0_4px_rgba(0,229,255,0.6)]" />
        <circle cx="40" cy="45" r="2" fill="#00E5FF" className="drop-shadow-[0_0_4px_rgba(0,229,255,0.6)]" />
      </svg>
    </div>
  );

  const renderProgress = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={color === 'cyan' ? '#00E5FF' : color === 'magenta' ? '#E144FF' : '#9D68FF'}
          strokeWidth="4"
          fill="none"
          strokeDasharray="251.2"
          strokeDashoffset="62.8"
          className="drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
          style={{ animation: 'spin 3s linear infinite' }}
        />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          className="text-xs font-mono fill-white/80"
        >
          75%
        </text>
      </svg>
    </div>
  );

  const renderGeometric = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon
          points="50,10 80,30 80,70 50,90 20,70 20,30"
          fill="none"
          stroke={color === 'cyan' ? '#00E5FF' : color === 'magenta' ? '#E144FF' : '#9D68FF'}
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
        <circle
          cx="50"
          cy="50"
          r="15"
          fill={color === 'cyan' ? '#00E5FF' : color === 'magenta' ? '#E144FF' : '#9D68FF'}
          fillOpacity="0.3"
          className="drop-shadow-[0_0_6px_rgba(0,229,255,0.4)]"
        />
      </svg>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'chart':
        return renderChart();
      case 'progress':
        return renderProgress();
      case 'geometric':
        return renderGeometric();
      default:
        return renderChart();
    }
  };

  return (
    <div
      className={`absolute ${colorClasses[color]} liquid-glass layered-lighting float-panel parallax-drift`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translateZ(${position.z}px)`,
        zIndex: Math.floor(position.z / 10)
      }}
    >
      {/* Clean minimal borders */}
      <div className="absolute inset-0 rounded-lg border border-white/8" />
      
      {/* Content with proper z-index */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
