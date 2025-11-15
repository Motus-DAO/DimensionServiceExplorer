import React from 'react';

interface HolographicPanelProps {
  variant?: 'primary' | 'secondary' | 'overlay' | 'background';
  edgeColor?: 'cyan' | 'magenta' | 'purple' | 'mixed';
  opacity?: 'bg' | 'far' | 'mid' | 'near' | 'main';
  depth?: number;
  size?: 'small' | 'medium' | 'large' | 'xl';
  position?: { x: number; y: number; z: number };
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function HolographicPanel({
  variant = 'primary',
  edgeColor = 'cyan',
  opacity = 'main',
  depth = 0,
  size = 'medium',
  position = { x: 0, y: 0, z: 0 },
  children,
  className = '',
  style = {}
}: HolographicPanelProps) {
  
  const sizeClasses = {
    small: 'w-32 h-24',
    medium: 'w-48 h-32',
    large: 'w-64 h-40',
    xl: 'w-80 h-48'
  };

  const variantClasses = {
    primary: 'alive-glass layered-lighting',
    secondary: 'liquid-glass layered-lighting',
    overlay: 'diffraction-effect opacity-80',
    background: 'liquid-glass opacity-60'
  };

  const edgeClasses = {
    cyan: 'edge-lighting-cyan',
    magenta: 'edge-lighting-magenta',
    purple: 'edge-lighting-cyan', // Using cyan as base for purple
    mixed: 'edge-lighting-cyan' // Will be enhanced with custom styles
  };

  const opacityClasses = {
    bg: 'opacity-bg',
    far: 'opacity-far',
    mid: 'opacity-mid',
    near: 'opacity-near',
    main: 'opacity-main'
  };

  const getEdgeGlowStyle = () => {
    if (edgeColor === 'mixed') {
      return {
        background: 'linear-gradient(45deg, #00FFFF, #FF00FF, #9D68FF, #00FFFF)',
        backgroundSize: '400% 400%',
        animation: 'gradient-rotation 3s linear infinite'
      };
    }
    return {};
  };

  const getDepthTransform = () => {
    return {
      transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px)`,
      zIndex: Math.floor(position.z / 10) + 5
    };
  };

  return (
    <div
      className={`
        absolute rounded-2xl p-4 backdrop-blur-xl
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${edgeClasses[edgeColor]}
        ${opacityClasses[opacity]}
        ${className}
      `}
      style={{
        ...getDepthTransform(),
        ...getEdgeGlowStyle(),
        ...style
      }}
    >
      {/* Clean edge system - minimal borders */}
      <div className="absolute inset-0 rounded-2xl border border-white/10" />
      
      {/* Subtle inner highlight */}
      <div className="absolute inset-1 rounded-2xl border border-white/5" />
      
      {/* Content with proper z-index */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
