import React from "react";
import clsx from "clsx";

interface RetroPanelProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "floating";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const RetroPanel: React.FC<RetroPanelProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  onClick,
  interactive = false,
}) => {
  const baseClasses = "relative overflow-hidden rounded-lg retro-panel transition-all duration-300";
  
  const variantClasses = {
    default: "border-cyan-400/30 shadow-[inset_0_0_8px_rgba(255,255,255,0.05),0_0_10px_rgba(0,255,255,0.2)]",
    elevated: "border-cyan-400/40 shadow-[inset_0_0_8px_rgba(255,255,255,0.05),0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[inset_0_0_8px_rgba(255,255,255,0.05),0_0_20px_rgba(0,255,255,0.4)]",
    floating: "border-fuchsia-400/30 shadow-[inset_0_0_8px_rgba(255,255,255,0.05),0_0_10px_rgba(255,0,255,0.2)] hover:border-fuchsia-400/40 hover:shadow-[inset_0_0_8px_rgba(255,255,255,0.05),0_0_15px_rgba(255,0,255,0.3)]"
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8"
  };

  const interactiveClasses = interactive 
    ? "cursor-pointer hover:scale-[1.01] hover:bg-black/20" 
    : "";

  return (
    <div
      onClick={onClick}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        interactiveClasses,
        className
      )}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px),
            linear-gradient(rgba(0,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Scan line effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          background: `repeating-linear-gradient(
            to bottom,
            rgba(0,255,255,0.03) 0px,
            transparent 3px,
            rgba(0,255,255,0.03) 6px
          )`,
          animation: 'scanMove 10s linear infinite'
        }} />
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Neon border glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
