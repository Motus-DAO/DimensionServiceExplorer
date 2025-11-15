'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue } from 'motion/react';
import { Children, cloneElement, useEffect, useMemo, useRef, useState, ReactNode } from 'react';

interface DockItemProps {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  mouseX: MotionValue<number>;
  spring: any;
  distance: number;
  magnification: number;
  baseItemSize: number;
}

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    } as DOMRect;
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
        zIndex: 50
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/40 via-blue-500/35 to-cyan-400/40 border border-cyan-400/40 text-green-400 shadow-[0_0_20px_rgba(0,255,255,0.2)] backdrop-blur-sm cursor-pointer outline-none hover:from-cyan-500/50 hover:via-blue-500/45 hover:to-cyan-400/50 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300 ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child =>
        child && typeof child === 'object' && 'type' in child
          ? cloneElement(child as any, { isHovered })
          : child
      )}
    </motion.div>
  );
}

interface DockLabelProps {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
}

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-[-2.5rem] left-1/2 w-fit whitespace-nowrap rounded-md border border-gray-700 bg-black/90 px-2 py-1 text-xs text-green-400 transform -translate-x-1/2 backdrop-blur-sm z-[100] pointer-events-none ${className}`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DockIconProps {
  children: ReactNode;
  className?: string;
}

function DockIcon({ children, className = '' }: DockIconProps) {
  return (
    <div 
      className={`dock-icon-container w-full h-full text-green-400 ${className}`}
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      <div 
        className="dock-icon-inner"
        style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateY(2px)',
          width: 'auto',
          height: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface DockItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface DockProps {
  items: DockItem[];
  className?: string;
  spring?: any;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  dockHeight?: number;
  baseItemSize?: number;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 200, damping: 15 },
  magnification = 120,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ scrollbarWidth: 'none' }} className="font-mono">
      <div className="fixed left-2 top-1/2 transform -translate-y-1/2 pt-8">
        {/* Fixed Background Container */}
        <div className="relative z-40">
          <div className={`rounded-2xl crystal-glass crystal-glass-hover refraction-overlay transition-all duration-300 border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] crystal-panel crystal-layer-2 text-green-400 py-2 pl-2 pr-3`} style={{ width: panelHeight, height: panelHeight * 6 + 20 }}>
            {/* Geometric overlay */}
            <div className="geometric-overlay" />

            {/* Crystal corner accents */}
            <div className="crystal-corner-tl" />
            <div className="crystal-corner-tr" />
            <div className="crystal-corner-bl" />
            <div className="crystal-corner-br" />

            {/* Sharp geometric lines */}
            <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line" />
            <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
            <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line-purple" />
            <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />

            {/* Crystal scan line effect */}
            <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
          </div>
        </div>

        {/* Expanding Items Container */}
        <motion.div
          onMouseMove={({ pageX }) => {
            isHovered.set(1);
            mouseX.set(pageX);
          }}
          onMouseLeave={() => {
            isHovered.set(0);
            mouseX.set(Infinity);
          }}
          className="absolute top-0 left-0 flex flex-col items-start gap-4 py-2 pl-2 pr-3 overflow-visible"
          style={{ width: panelHeight }}
          role="toolbar"
          aria-label="Application dock"
        >
          {items.map((item: DockItem, index: number) => (
            <DockItem
              key={index}
              onClick={item.onClick}
              className={item.className}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
