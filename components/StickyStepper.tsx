import React, { useEffect, useMemo, useRef, useState } from 'react';
import NeonGraph from './neon/NeonGraph';

type Step = {
  title: string;
  cmd: string;
  icon?: React.ReactNode;
  description?: string;
};

type Props = {
  steps: Step[];
};

export default function StickyStepper({ steps }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panels = panelRefs.current.filter(Boolean) as HTMLElement[];
    if (panels.length === 0) return;

    const io = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let idx = activeIndex;
      entries.forEach((e) => {
        const i = panels.indexOf(e.target as HTMLElement);
        if (i >= 0 && e.intersectionRatio > maxRatio) {
          maxRatio = e.intersectionRatio;
          idx = i;
        }
      });
      if (maxRatio > 0.4) setActiveIndex(idx);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], root: null });

    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  return (
    <div className="relative grid md:grid-cols-[1fr,1fr] gap-8 items-start">
      {/* Sticky neon graph */}
      <div className="hidden md:block md:sticky md:top-24 h-[60vh] bg-black/40 border border-emerald-500/20 rounded-lg overflow-hidden">
        <NeonGraph activeIndex={activeIndex} reducedMotion={reduced} />
      </div>

      {/* Panels */}
      <div ref={containerRef} className="space-y-24">
        {steps.map((s, i) => (
          <section
            key={s.title}
            ref={(el) => { panelRefs.current[i] = el; }}
            data-section-command={s.cmd}
            className="bg-black/60 border border-white/10 rounded-sm p-6 font-mono"
            aria-describedby={`step-${i}-desc`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-emerald-400" aria-hidden>{s.icon}</div>
              <h4 className="text-white text-xl font-semibold">{i + 1}. {s.title}</h4>
            </div>
            <p id={`step-${i}-desc`} className="text-white/70 text-sm">
              {s.description}
            </p>
            <div className="mt-3 text-emerald-300/80 text-xs">Command: <span className="text-emerald-400">{s.cmd}</span></div>
          </section>
        ))}
      </div>
    </div>
  );
}


