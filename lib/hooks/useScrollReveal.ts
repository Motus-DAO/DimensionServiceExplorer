import { useInView } from 'react-intersection-observer';
import { motion, MotionProps } from 'framer-motion';
import { useMemo } from 'react';

interface ScrollRevealConfig {
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const useScrollReveal = (config: ScrollRevealConfig = {}) => {
  const {
    direction = 'up',
    delay = 0,
    duration = 0.6,
    threshold = 0.1
  } = config;

  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  const motionProps: MotionProps = useMemo(() => {
    const getInitialTransform = () => {
      switch (direction) {
        case 'up':
          return { opacity: 0, y: 50 };
        case 'down':
          return { opacity: 0, y: -50 };
        case 'left':
          return { opacity: 0, x: 50 };
        case 'right':
          return { opacity: 0, x: -50 };
        default:
          return { opacity: 0, y: 50 };
      }
    };

    const getAnimateTransform = () => {
      switch (direction) {
        case 'up':
          return { opacity: 1, y: 0 };
        case 'down':
          return { opacity: 1, y: 0 };
        case 'left':
          return { opacity: 1, x: 0 };
        case 'right':
          return { opacity: 1, x: 0 };
        default:
          return { opacity: 1, y: 0 };
      }
    };

    return {
      initial: getInitialTransform(),
      animate: inView ? getAnimateTransform() : getInitialTransform(),
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth holographic feel
      },
    };
  }, [direction, delay, duration, inView]);

  return { ref, motionProps };
};
