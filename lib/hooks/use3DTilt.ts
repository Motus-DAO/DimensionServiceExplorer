import { useState, useEffect, useRef } from 'react';

interface TiltValues {
  tiltX: number;
  tiltY: number;
  depth: number;
}

export function use3DTilt() {
  const [tiltValues, setTiltValues] = useState<TiltValues>({ tiltX: 0, tiltY: 0, depth: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate tilt angles (max 15 degrees)
        const tiltX = (mouseY / rect.height) * 15;
        const tiltY = (mouseX / rect.width) * 15;
        
        // Calculate depth based on distance from center
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
        const depth = (distance / maxDistance) * 20;
        
        setTiltValues({ tiltX, tiltY, depth });
      });
    };

    const handleMouseLeave = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(() => {
        setTiltValues({ tiltX: 0, tiltY: 0, depth: 0 });
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    elementRef,
    tiltValues,
    transformStyle: {
      transform: `perspective(2000px) 
                  rotateX(${tiltValues.tiltX}deg) 
                  rotateY(${tiltValues.tiltY}deg) 
                  translateZ(${tiltValues.depth}px)`,
      transformStyle: 'preserve-3d' as const,
      transition: 'transform 0.1s ease-out'
    }
  };
}
