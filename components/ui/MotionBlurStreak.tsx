import React from 'react';

interface MotionBlurStreakProps {
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  color?: 'cyan' | 'magenta' | 'purple' | 'mixed';
  speed?: 'slow' | 'medium' | 'fast' | 'ultra';
  intensity?: 'low' | 'medium' | 'high';
  angle?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function MotionBlurStreak({
  direction = 'horizontal',
  color = 'cyan',
  speed = 'medium',
  intensity = 'medium',
  angle = 0,
  delay = 0,
  className = '',
  style = {}
}: MotionBlurStreakProps) {
  
  const getSpeedClass = () => {
    const speedMap = {
      slow: 'motion-blur-streak',
      medium: 'motion-blur-enhanced',
      fast: 'motion-blur-fast',
      ultra: 'motion-blur-fast'
    };
    return speedMap[speed];
  };

  const getColorStyle = () => {
    const intensityMap = {
      low: 0.2,
      medium: 0.4,
      high: 0.7
    };
    
    const opacity = intensityMap[intensity];
    
    const colorMap = {
      cyan: `rgba(0, 255, 255, ${opacity})`,
      magenta: `rgba(255, 0, 255, ${opacity})`,
      purple: `rgba(157, 104, 255, ${opacity})`,
      mixed: `linear-gradient(90deg, 
        rgba(0, 255, 255, ${opacity * 0.5}) 0%, 
        rgba(255, 0, 255, ${opacity}) 50%, 
        rgba(157, 104, 255, ${opacity * 0.5}) 100%)`
    };
    
    return colorMap[color];
  };

  const getDirectionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      pointerEvents: 'none' as const,
      animationDelay: `${delay}s`
    };

    switch (direction) {
      case 'horizontal':
        return {
          ...baseStyle,
          width: '400%',
          height: '2px',
          top: '50%',
          left: '-200%',
          transform: 'translateY(-50%)'
        };
      case 'vertical':
        return {
          ...baseStyle,
          width: '2px',
          height: '400%',
          left: '50%',
          top: '-200%',
          transform: 'translateX(-50%)'
        };
      case 'diagonal':
        return {
          ...baseStyle,
          width: '400%',
          height: '2px',
          top: '50%',
          left: '-200%',
          transform: `translateY(-50%) rotate(${angle}deg)`
        };
      default:
        return baseStyle;
    }
  };

  const getGradientStyle = () => {
    if (color === 'mixed') {
      return {
        background: getColorStyle(),
        backgroundSize: '200% 100%'
      };
    }
    return {
      background: getColorStyle()
    };
  };

  return (
    <div
      className={`${getSpeedClass()} ${className}`}
      style={{
        ...getDirectionStyle(),
        ...getGradientStyle(),
        ...style
      }}
    />
  );
}

// Pre-configured streak components for common use cases
export function HorizontalCyanStreak({ delay = 0, ...props }: Omit<MotionBlurStreakProps, 'direction' | 'color'>) {
  return <MotionBlurStreak direction="horizontal" color="cyan" delay={delay} {...props} />;
}

export function DiagonalMagentaStreak({ delay = 0, angle = 15, ...props }: Omit<MotionBlurStreakProps, 'direction' | 'color'>) {
  return <MotionBlurStreak direction="diagonal" color="magenta" angle={angle} delay={delay} {...props} />;
}

export function VerticalPurpleStreak({ delay = 0, ...props }: Omit<MotionBlurStreakProps, 'direction' | 'color'>) {
  return <MotionBlurStreak direction="vertical" color="purple" delay={delay} {...props} />;
}

export function MixedColorStreak({ delay = 0, ...props }: Omit<MotionBlurStreakProps, 'color'>) {
  return <MotionBlurStreak color="mixed" delay={delay} {...props} />;
}
