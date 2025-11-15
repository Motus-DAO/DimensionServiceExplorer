import React from 'react';

interface DataFlowLinesProps {
  connections: Array<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    color?: 'cyan' | 'magenta' | 'purple' | 'mixed';
    intensity?: 'low' | 'medium' | 'high';
    delay?: number;
  }>;
  className?: string;
  style?: React.CSSProperties;
}

export default function DataFlowLines({
  connections,
  className = '',
  style = {}
}: DataFlowLinesProps) {
  
  const getColorGradient = (color: string, intensity: string) => {
    const opacityMap: Record<string, number> = {
      low: 0.3,
      medium: 0.6,
      high: 0.9
    };
    
    const colorMap: Record<string, string> = {
      cyan: `rgba(0, 255, 255, ${opacityMap[intensity]})`,
      magenta: `rgba(255, 0, 255, ${opacityMap[intensity]})`,
      purple: `rgba(157, 104, 255, ${opacityMap[intensity]})`,
      mixed: `url(#mixedGradient)`
    };
    
    return colorMap[color] || colorMap.cyan;
  };

  const createBezierPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const controlOffset = Math.abs(to.x - from.x) * 0.3;
    
    return `M ${from.x} ${from.y} Q ${midX} ${from.y - controlOffset} ${to.x} ${to.y}`;
  };

  return (
    <svg 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 5, ...style }}
    >
      <defs>
        <linearGradient id="mixedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#FF00FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9D68FF" stopOpacity="0.6" />
        </linearGradient>
        
        <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.2" />
        </linearGradient>
        
        <linearGradient id="magentaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.2" />
        </linearGradient>
        
        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9D68FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#9D68FF" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      
      {connections.map((connection, index) => {
        const path = createBezierPath(connection.from, connection.to);
        const color = connection.color || 'cyan';
        const intensity = connection.intensity || 'medium';
        const delay = connection.delay || 0;
        
        const gradientId = color === 'mixed' ? 'mixedGradient' : `${color}Gradient`;
        
        return (
          <g key={index}>
            {/* Main connection line */}
            <path
              d={path}
              stroke={`url(#${gradientId})`}
              strokeWidth="2"
              fill="none"
              className="circuit-flow"
              style={{
                strokeDasharray: "10 5",
                animationDelay: `${delay}s`,
                filter: `drop-shadow(0 0 4px ${getColorGradient(color, intensity)})`
              }}
            />
            
            {/* Animated particles along the path */}
            <circle
              r="2"
              fill={getColorGradient(color, intensity)}
              className="circuit-flow"
              style={{
                animationDelay: `${delay + 0.5}s`,
                filter: `drop-shadow(0 0 6px ${getColorGradient(color, intensity)})`
              }}
            >
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path={path}
                begin={`${delay}s`}
              />
            </circle>
            
            {/* Secondary glow line */}
            <path
              d={path}
              stroke={getColorGradient(color, 'low')}
              strokeWidth="4"
              fill="none"
              className="circuit-flow"
              style={{
                strokeDasharray: "20 10",
                animationDelay: `${delay + 1}s`,
                filter: 'blur(2px)'
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
