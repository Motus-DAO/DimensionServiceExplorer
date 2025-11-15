import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { HoloText, HoloPanel } from './ui';

export interface EarningCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  value?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
  onClick?: () => void;
}

export interface EarningBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  earnings?: {
    totalEarned: number;
    currency: 'PSY' | 'rUSD';
    fromDataSales: number;
    fromYieldFarming: number;
    autoCompounded: number;
    ubiAvailable: number;
    revenueShare: {
      userEarnings: number;
      platformFee: number;
      totalRevenue: number;
    };
  };
  hnftStats?: {
    totalMinted: number;
    totalListed: number;
    totalSold: number;
    averagePrice: number;
  };
  onClaimUbi?: () => void;
  onToggleAutoCompound?: () => void;
  isAutoCompoundEnabled?: boolean;
  isClaimingUbi?: boolean;
  claimUbiStatus?: 'idle' | 'success' | 'error';
  claimUbiMessage?: string;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  onClick?: () => void;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => { particle.parentNode?.removeChild(particle); }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) { initializeParticles(); }
    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(clone, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
      }, index * 100);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;
    const handleMouseEnter = () => { isHoveredRef.current = true; animateParticles(); if (enableTilt) { gsap.to(element, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 }); } };
    const handleMouseLeave = () => { isHoveredRef.current = false; clearAllParticles(); if (enableTilt) { gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' }); } if (enableMagnetism) { gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' }); } };
    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top; const centerX = rect.width / 2; const centerY = rect.height / 2;
      if (enableTilt) { const rotateX = ((y - centerY) / centerY) * -10; const rotateY = ((x - centerX) / centerX) * 10; gsap.to(element, { rotateX, rotateY, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 }); }
      if (enableMagnetism) { const magnetX = (x - centerX) * 0.05; const magnetY = (y - centerY) * 0.05; magnetismAnimationRef.current = gsap.to(element, { x: magnetX, y: magnetY, duration: 0.3, ease: 'power2.out' }); }
    };
    const handleClick = (e: MouseEvent) => {
      if (clickEffect) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const maxDistance = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
        const ripple = document.createElement('div');
        ripple.style.cssText = `position:absolute;width:${maxDistance * 2}px;height:${maxDistance * 2}px;border-radius:50%;background:radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);left:${x - maxDistance}px;top:${y - maxDistance}px;pointer-events:none;z-index:1000;`;
        element.appendChild(ripple);
        gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
      }
      if (onClick) onClick();
    };
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);
    return () => { isHoveredRef.current = false; element.removeEventListener('mouseenter', handleMouseEnter); element.removeEventListener('mouseleave', handleMouseLeave); element.removeEventListener('mousemove', handleMouseMove); element.removeEventListener('click', handleClick); clearAllParticles(); };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onClick]);

  return (
    <div ref={cardRef} className={`${className} relative overflow-hidden cursor-pointer`} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({ gridRef, disableAnimations = false, enabled = true, spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS, glowColor = DEFAULT_GLOW_COLOR }) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle, rgba(${glowColor},0.15) 0%, rgba(${glowColor},0.08) 15%, rgba(${glowColor},0.04) 25%, rgba(${glowColor},0.02) 40%, rgba(${glowColor},0.01) 65%, transparent 70%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(spotlight); spotlightRef.current = spotlight;
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');
      if (!mouseInside) { gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }); cards.forEach(card => { (card as HTMLElement).style.setProperty('--glow-intensity', '0'); }); return; }
      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;
      cards.forEach(card => {
        const cardElement = card as HTMLElement; const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2; const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance); minDistance = Math.min(minDistance, effectiveDistance);
        let glowIntensity = 0; if (effectiveDistance <= proximity) { glowIntensity = 1; } else if (effectiveDistance <= fadeDistance) { glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity); }
        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });
      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
      const targetOpacity = minDistance <= proximity ? 0.8 : minDistance <= fadeDistance ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8 : 0;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: 'power2.out' });
    };
    const handleMouseLeave = () => {
      isInsideSection.current = false; gridRef.current?.querySelectorAll('.card').forEach(card => { (card as HTMLElement).style.setProperty('--glow-intensity', '0'); });
      if (spotlightRef.current) { gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }); }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseleave', handleMouseLeave); spotlightRef.current?.parentNode?.removeChild(spotlightRef.current); };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);
  return null;
};

const BentoCardGrid: React.FC<{ children: React.ReactNode; gridRef?: React.RefObject<HTMLDivElement>; }> = ({ children, gridRef }) => (
  <div className="bento-section grid gap-2 p-3 max-w-[54rem] select-none relative" style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }} ref={gridRef}>
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile(); window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

const EarningBento: React.FC<EarningBentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  earnings,
  hnftStats,
  onClaimUbi,
  onToggleAutoCompound,
  isAutoCompoundEnabled = true,
  isClaimingUbi = false,
  claimUbiStatus = 'idle',
  claimUbiMessage = ''
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  // Calculate total portfolio value (simplified - in real app would need conversion rates)
  const calculateTotalValue = () => {
    if (!earnings) return { total: 0, currency: 'PSY' };
    
    // For demo purposes, assume 1 PSY = 0.5 rUSD (would be dynamic in real app)
    const psyToRusdRate = 0.5;
    const totalInRusd = earnings.totalEarned * psyToRusdRate + earnings.fromYieldFarming + earnings.autoCompounded;
    
    return {
      total: totalInRusd,
      currency: 'rUSD',
      breakdown: {
        psy: earnings.totalEarned,
        rusd: earnings.fromYieldFarming + earnings.autoCompounded
      }
    };
  };

  const totalValue = calculateTotalValue();

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Create earning-specific card data with improved UX
  const cardData: EarningCardProps[] = [
    {
      color: '#060010',
      title: 'Total Portfolio Value',
      description: `Complete earnings: ${totalValue.breakdown?.psy.toFixed(1) || '0.0'} PSY + ${totalValue.breakdown?.rusd.toFixed(1) || '0.0'} rUSD`,
      label: 'Overview',
      value: formatCurrency(totalValue.total, totalValue.currency),
      icon: '💰',
      trend: 'up',
      trendValue: '+12.5%'
    },
    {
      color: '#060010',
      title: 'Data Sales Revenue',
      description: 'Earnings from mental health insights',
      label: 'Revenue',
      value: earnings ? formatCurrency(earnings.fromDataSales, 'PSY') : '0.00 PSY',
      icon: '📊',
      trend: 'up',
      trendValue: '+8.2%'
    },
    {
      color: '#060010',
      title: 'Yield Farming',
      description: 'DeFi protocol yields',
      label: 'DeFi',
      value: earnings ? formatCurrency(earnings.fromYieldFarming, 'rUSD') : '0.00 rUSD',
      icon: '🌾',
      trend: 'up',
      trendValue: '+4.3%'
    },
    {
      color: '#060010',
      title: 'HNFT Portfolio',
      description: `${hnftStats?.totalMinted || 0} minted`,
      label: 'NFTs',
      value: hnftStats ? `${hnftStats.totalSold} sold` : '0 sold',
      icon: '🎨',
      trend: 'up',
      trendValue: `$${hnftStats?.averagePrice || 0} avg`
    }
  ];

  return (
    <>
      <style>{`
          .bento-section { --glow-x: 50%; --glow-y: 50%; --glow-intensity: 0; --glow-radius: 200px; --glow-color: ${glowColor}; --border-color: #392e4e; --background-dark: #060010; --white: hsl(0,0%,100%); --purple-primary: rgba(132, 0, 255, 1); --purple-glow: rgba(132, 0, 255, 0.2); --purple-border: rgba(132, 0, 255, 0.8); }
          .card-responsive { grid-template-columns: 1fr; width: 90%; margin: 0 auto; padding: 0.5rem; }
          @media (min-width: 600px) { .card-responsive { grid-template-columns: repeat(2, 1fr); } }
          @media (min-width: 1024px) { 
            .card-responsive { grid-template-columns: 1fr 1fr 0.5fr 1fr 1fr; } 
            .card-responsive .card:nth-child(1){ grid-column:1 / span 2; grid-row:1 / span 2; } 
            .card-responsive .card:nth-child(2){ grid-column:4 / span 2; grid-row:2; } 
            .card-responsive .card:nth-child(3){ grid-column:4 / span 2; grid-row:3; } 
            .card-responsive .card:nth-child(4){ grid-column:4 / span 2; grid-row:1; } 
            .left-aligned-cards { 
              border-right: 1px solid rgba(132, 0, 255, 0.2); 
              padding-right: 1rem; 
              position: relative;
            }
            .left-aligned-cards::before {
              content: 'NFT Portfolio';
              position: absolute;
              top: -0.5rem;
              right: 1rem;
              background: rgba(132, 0, 255, 0.1);
              color: rgba(132, 0, 255, 0.8);
              font-size: 0.75rem;
              font-weight: 600;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              border: 1px solid rgba(132, 0, 255, 0.3);
            }
            .right-aligned-cards { 
              border-left: 1px solid rgba(132, 0, 255, 0.2); 
              padding-left: 1rem; 
              position: relative;
            }
            .right-aligned-cards::before {
              content: 'Revenue Streams';
              position: absolute;
              top: -0.5rem;
              left: 1rem;
              background: rgba(132, 0, 255, 0.1);
              color: rgba(132, 0, 255, 0.8);
              font-size: 0.75rem;
              font-weight: 600;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              border: 1px solid rgba(132, 0, 255, 0.3);
            }
          }
          .card--border-glow::after { content:''; position:absolute; inset:0; padding:6px; background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%, rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%, transparent 60%); border-radius: inherit; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: subtract; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; pointer-events:none; transition: opacity 0.3s ease; z-index:1; }
          .card--border-glow:hover::after { opacity:1; }
          .card--border-glow:hover { box-shadow: 0 4px 20px rgba(46,24,78,0.4), 0 0 30px rgba(${glowColor}, 0.2); }
          .card::before { content:''; position:absolute; inset:0; background: linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; opacity:0.3; pointer-events:none; z-index:1; }
          .card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background: linear-gradient(90deg, transparent, rgba(0,255,255,0.6), transparent); pointer-events:none; z-index:2; }
          .card:hover::after { background: linear-gradient(90deg, transparent, rgba(0,255,255,0.9), transparent); }
          .card .crystal-corner-tl { position:absolute; top:0; left:0; width:20px; height:20px; background:linear-gradient(45deg, rgba(0,255,255,0.6), transparent); clip-path:polygon(0 0, 100% 0, 0 100%); }
          .card .crystal-corner-tr { position:absolute; top:0; right:0; width:20px; height:20px; background:linear-gradient(45deg, rgba(255,0,255,0.6), transparent); clip-path:polygon(0 0, 100% 0, 100% 100%); }
          .card .crystal-corner-bl { position:absolute; bottom:0; left:0; width:20px; height:20px; background:linear-gradient(45deg, transparent, rgba(0,255,255,0.6)); clip-path:polygon(0 0, 0 100%, 100% 100%); }
          .card .crystal-corner-br { position:absolute; bottom:0; right:0; width:20px; height:20px; background:linear-gradient(45deg, transparent, rgba(255,0,255,0.6)); clip-path:polygon(0 100%, 100% 0, 100% 100%); }
          .card .crystal-scan-line { position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg, transparent, rgba(0,255,255,0.8), transparent); animation:crystal-scan 3s linear infinite; }
          @keyframes crystal-scan { 0% { transform:translateY(0); opacity:0; } 50% { opacity:1; } 100% { transform:translateY(200px); opacity:0; } }
          .particle::before { content:''; position:absolute; top:-2px; left:-2px; right:-2px; bottom:-2px; background: rgba(${glowColor}, 0.2); border-radius:50%; z-index:-1; }
          .particle-container:hover { box-shadow: 0 4px 20px rgba(46,24,78,0.2), 0 0 30px rgba(${glowColor}, 0.2); }
          .text-clamp-1 { display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:1; line-clamp:1; overflow:hidden; text-overflow:ellipsis; }
          .text-clamp-2 { display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; line-clamp:2; overflow:hidden; text-overflow:ellipsis; }
          .earning-value { font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0; }
          .trend-indicator { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; }
          .action-button { 
            background: linear-gradient(135deg, rgba(132, 0, 255, 0.8), rgba(59, 130, 246, 0.8));
            border: 1px solid rgba(132, 0, 255, 0.5);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          .action-button:hover { 
            background: linear-gradient(135deg, rgba(132, 0, 255, 1), rgba(59, 130, 246, 1));
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(132, 0, 255, 0.3);
          }
          .action-button:disabled { 
            background: linear-gradient(135deg, rgba(75, 85, 99, 0.8), rgba(55, 65, 81, 0.8));
            border-color: rgba(75, 85, 99, 0.5);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          .toggle-switch { 
            background: linear-gradient(135deg, rgba(132, 0, 255, 0.8), rgba(147, 51, 234, 0.8));
            border: 1px solid rgba(132, 0, 255, 0.5);
            transition: all 0.3s ease;
          }
          .toggle-switch:hover { 
            background: linear-gradient(135deg, rgba(132, 0, 255, 1), rgba(147, 51, 234, 1));
            box-shadow: 0 0 20px rgba(132, 0, 255, 0.4);
          }
          .toggle-switch.disabled { 
            background: linear-gradient(135deg, rgba(75, 85, 99, 0.8), rgba(55, 65, 81, 0.8));
            border-color: rgba(75, 85, 99, 0.5);
          }
          @media (max-width: 599px) { .card-responsive { grid-template-columns:1fr; width:90%; margin:0 auto; padding:0.5rem; } .card-responsive .card { width:100%; min-height:180px; } }
          @media (min-width: 600px) and (max-width: 1023px) { .card-responsive { grid-template-columns: repeat(2, 1fr); } .card-responsive .card:nth-child(1){ grid-column: span 2; } }
        `}</style>

      {enableSpotlight && (
        <GlobalSpotlight gridRef={gridRef} disableAnimations={shouldDisableAnimations} enabled={enableSpotlight} spotlightRadius={spotlightRadius} glowColor={glowColor} />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {/* Information Section Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-psy-purple/30 to-transparent"></div>
            <div className="text-body text-body-sm text-psy-purple/80 px-4">Earnings Overview</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-psy-purple/30 to-transparent"></div>
          </div>
        </div>
        
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            // Card 1: Overview (left, 2 rows), Card 2: Data Sales (middle right), Card 3: DeFi (bottom right), Card 4: NFT (top right)
            const isRightAligned = index > 0; // Cards 2, 3, 4 are right-aligned
            const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[12px] font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 crystal-glass crystal-glass-hover crystal-panel crystal-layer-2 motion-crystal-hover ${enableBorderGlow ? 'card--border-glow' : ''} ${isRightAligned ? 'right-aligned-cards' : ''}`;
            const cardStyle = { 
              backgroundColor: 'transparent', 
              color: 'var(--white)', 
              '--glow-x': '50%', 
              '--glow-y': '50%', 
              '--glow-intensity': '0', 
              '--glow-radius': '200px' 
            } as React.CSSProperties;
            
            if (enableStars) {
              return (
                <ParticleCard 
                  key={index} 
                  className={baseClassName} 
                  style={cardStyle} 
                  disableAnimations={shouldDisableAnimations} 
                  particleCount={particleCount} 
                  glowColor={glowColor} 
                  enableTilt={enableTilt} 
                  clickEffect={clickEffect} 
                  enableMagnetism={enableMagnetism}
                  onClick={card.onClick}
                >
                  <div className="card__header flex justify-between gap-3 relative text-white">
                    <div className="card__label text-heading text-h6 text-psy-blue">
                      {card.label}
                    </div>
                    <span className="text-2xl text-psy-purple">{card.icon}</span>
                  </div>
                  <div className="card__content flex flex-col relative text-white">
                    <div className={`card__title text-heading text-h4 m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''} text-white`}>
                      {card.title}
                    </div>
                    <div className="earning-value text-mono text-h3 text-psy-green">
                      {card.value}
                    </div>
                    <div className={`card__description text-body text-body-sm leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''} text-white/70`}>
                      {card.description}
                    </div>
                    {card.trend && (
                      <div className={`trend-indicator text-caption ${getTrendColor(card.trend)} mt-2`}>
                        <span>{getTrendIcon(card.trend)}</span>
                        <span className="text-psy-blue">
                          {card.trendValue}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Crystal corner accents */}
                  <div className="crystal-corner-tl" />
                  <div className="crystal-corner-tr" />
                  <div className="crystal-corner-bl" />
                  <div className="crystal-corner-br" />
                  
                  {/* Crystal scan line effect */}
                  <div className="crystal-scan-line" />
                </ParticleCard>
              );
            }
            return (
              <div key={index} className={baseClassName} style={cardStyle} onClick={card.onClick}>
                <div className="card__header flex justify-between gap-3 relative text-white">
                  <div className="card__label text-heading text-h6 text-psy-blue">
                    {card.label}
                  </div>
                  <span className="text-2xl text-psy-purple">{card.icon}</span>
                </div>
                <div className="card__content flex flex-col relative text-white">
                  <div className={`card__title text-heading text-h4 m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''} text-white`}>
                    {card.title}
                  </div>
                  <div className="earning-value text-mono text-h3 text-psy-green">
                    {card.value}
                  </div>
                  <div className={`card__description text-body text-body-sm leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''} text-white/70`}>
                    {card.description}
                  </div>
                  {card.trend && (
                    <div className={`trend-indicator text-caption ${getTrendColor(card.trend)} mt-2`}>
                      <span>{getTrendIcon(card.trend)}</span>
                      <span className="text-psy-blue">
                        {card.trendValue}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Crystal corner accents */}
                <div className="crystal-corner-tl" />
                <div className="crystal-corner-tr" />
                <div className="crystal-corner-bl" />
                <div className="crystal-corner-br" />
                
                {/* Crystal scan line effect */}
                <div className="crystal-scan-line" />
              </div>
            );
          })}
        </div>
        
        {/* Section Divider */}
        <div className="mt-8 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-psy-blue/30 to-transparent"></div>
            <div className="text-body text-body-sm text-psy-blue/80 px-4">Actions</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-psy-blue/30 to-transparent"></div>
          </div>
        </div>
        
        {/* Action Buttons Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* UBI Claim Card */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-2xl">
                  🎁
                </div>
                <div>
                  <h3 className="text-heading text-h5 text-white">Available UBI</h3>
                  <p className="text-body text-body-sm text-psy-green/80">Ready to claim</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-mono text-h3 text-psy-green">
                  {earnings ? formatCurrency(earnings.ubiAvailable, 'rUSD') : '0.00 rUSD'}
                </div>
                <div className="text-caption text-psy-green/70">Universal Basic Income</div>
              </div>
            </div>
            <button
              onClick={onClaimUbi}
              disabled={isClaimingUbi || !earnings?.ubiAvailable || earnings.ubiAvailable <= 0}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 flex items-center justify-center space-x-2 ${
                claimUbiStatus === 'success' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : claimUbiStatus === 'error'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white'
              }`}
            >
              {isClaimingUbi ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Claiming...</span>
                </>
              ) : claimUbiStatus === 'success' ? (
                <>
                  <span>✅</span>
                  <span>Claimed!</span>
                </>
              ) : claimUbiStatus === 'error' ? (
                <>
                  <span>❌</span>
                  <span>Failed</span>
                </>
              ) : (
                <>
                  <span>💰</span>
                  <span>Claim UBI</span>
                </>
              )}
            </button>
            
            {/* Status Message */}
            {(claimUbiStatus === 'success' || claimUbiStatus === 'error') && claimUbiMessage && (
              <div className={`mt-2 text-body text-body-sm text-center ${
                claimUbiStatus === 'success' ? 'text-psy-green' : 'text-red-300'
              }`}>
                {claimUbiMessage}
              </div>
            )}
          </div>

          {/* Auto-Compound Toggle Card */}
          <div className={`bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border rounded-xl p-6 backdrop-blur-sm transition-all duration-300 ${
            isAutoCompoundEnabled ? 'border-purple-400/50' : 'border-gray-500/30'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                  isAutoCompoundEnabled 
                    ? 'bg-gradient-to-br from-purple-400 to-violet-500' 
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                  ⚡
                </div>
                <div>
                  <h3 className="text-heading text-h5 text-white">Auto-Compound</h3>
                  <p className="text-body text-body-sm text-psy-purple/80">Passive growth</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-mono text-h3 text-psy-purple">
                  {earnings ? formatCurrency(earnings.autoCompounded, 'rUSD') : '0.00 rUSD'}
                </div>
                <div className="text-caption text-psy-purple/70">Compounded earnings</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`text-body text-body-sm ${
                  isAutoCompoundEnabled ? 'text-psy-purple' : 'text-white/40'
                }`}>
                  {isAutoCompoundEnabled ? 'Active' : 'Paused'}
                </span>
                <div className="text-caption text-psy-purple/70">
                  {isAutoCompoundEnabled ? '5-15% APY' : 'Manual mode'}
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={onToggleAutoCompound}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                  isAutoCompoundEnabled ? 'toggle-switch' : 'toggle-switch disabled'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isAutoCompoundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </BentoCardGrid>
    </>
  );
};

export default EarningBento;
