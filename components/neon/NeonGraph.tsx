import React from 'react';

type Props = {
  activeIndex: number;
  reducedMotion?: boolean;
};

export default function NeonGraph({ activeIndex, reducedMotion = false }: Props) {
  // Simple 2x2 node layout within SVG, lines connecting sequentially
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full bg-black/60">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Lines */}
      {[
        [50, 100, 350, 100], // top
        [50, 300, 350, 300], // bottom
        [50, 100, 50, 300],  // left
        [350, 100, 350, 300], // right
      ].map((l, i) => (
        <line
          key={i}
          x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]}
          stroke="#10b981"
          strokeOpacity={0.25}
          strokeWidth={2}
          className="neon-stroke"
        />
      ))}

      {/* Nodes */}
      {[
        [50, 100], [350, 100], [50, 300], [350, 300]
      ].map((p, i) => (
        <g key={i} filter="url(#glow)">
          <circle
            cx={p[0]} cy={p[1]} r={14}
            fill={i === activeIndex ? '#10b981' : 'transparent'}
            stroke="#10b981"
            strokeWidth={2}
            className={i === activeIndex && !reducedMotion ? 'neon-node-pulse' : ''}
          />
        </g>
      ))}
    </svg>
  );
}


