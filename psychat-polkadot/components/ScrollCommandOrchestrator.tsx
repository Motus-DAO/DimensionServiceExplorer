import React, { useEffect } from 'react';

type Props = {
  threshold?: number;
  rootMargin?: string;
};

export default function ScrollCommandOrchestrator({ threshold = 0.6, rootMargin = '0px' }: Props) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // Respect reduced motion: disable scroll-driven commands

    const elements = Array.from(document.querySelectorAll('[data-section-command]')) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const cmd = target.getAttribute('data-section-command');
          if (cmd) {
            window.dispatchEvent(new CustomEvent('hero:run', { detail: { cmd } }));
          }
        }
      });
    }, { threshold, rootMargin });

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return null;
}


