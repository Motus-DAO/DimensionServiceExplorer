import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HoloText } from './ui/holo';

interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
  color?: string;
}

interface CrystalCarouselProps {
  items: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
}

const GAP = 20;
const containerPadding = 20;

export default function CrystalCarousel({
  items = [],
  baseWidth = 280,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false
}: CrystalCarouselProps): JSX.Element {
  
  const itemWidth = baseWidth - containerPadding * 2;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev === items.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, items.length, pauseOnHover]);

  const getItemColor = (index: number) => {
    const colors = ['neon-solid-cyan', 'neon-solid-magenta', 'neon-solid-purple'];
    return colors[index % colors.length];
  };

  const getBorderColor = (index: number) => {
    const colors = ['crystal-border', 'crystal-border-magenta', 'crystal-border-purple'];
    return colors[index % colors.length];
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center"
      style={{ height: '400px' }}
    >
      {/* Card Container */}
      <div className="flex items-center justify-center mb-8">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`relative flex flex-col items-start justify-between crystal-panel crystal-glass-hover overflow-hidden ${getBorderColor(currentIndex)}`}
          style={{
            width: itemWidth,
            height: '260px',
          }}
        >
          {/* Crystal corner accents */}
          <div className="crystal-corner-tl" />
          <div className="crystal-corner-tr" />
          <div className="crystal-corner-bl" />
          <div className="crystal-corner-br" />
          
          {/* Geometric overlay */}
          <div className="geometric-overlay" />
          
          {/* Crystal lines */}
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line" />
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
          <div className="absolute left-0 top-0 bottom-1/2 w-0.5 crystal-line-purple" />
          <div className="absolute right-0 top-0 bottom-1/2 w-0.5 crystal-line" />
          
          <div className="relative z-10 p-5 w-full h-full flex flex-col justify-between">
            <div className="mb-4">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/20 ${getItemColor(currentIndex)}`}>
                {items[currentIndex]?.icon}
              </span>
            </div>
            <div>
              <HoloText size="base" weight="bold" className={`${getItemColor(currentIndex)} mb-2`}>
                {items[currentIndex]?.title}
              </HoloText>
              <HoloText size="sm" weight="normal" className="text-white/80">
                {items[currentIndex]?.description}
              </HoloText>
            </div>
          </div>
          
          {/* Crystal scan line effect */}
          <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
        </motion.div>
      </div>
      
      {/* Navigation dots - Now properly positioned below the card */}
      <div className="flex space-x-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-110' 
                : 'bg-white/30 hover:bg-white/50 hover:scale-105'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
