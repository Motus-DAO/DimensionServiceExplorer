import React from "react";
import clsx from "clsx";

interface RetroButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const RetroButton: React.FC<RetroButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className,
  type = "button",
}) => {
  const baseClasses = "relative overflow-hidden rounded-lg font-mono uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-500/10 to-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:from-cyan-500/20 hover:to-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]",
    secondary: "bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300 hover:from-fuchsia-500/20 hover:to-fuchsia-500/30 hover:border-fuchsia-400/60 hover:shadow-[0_0_15px_rgba(255,0,255,0.4)]",
    ghost: "bg-transparent border border-cyan-400/30 text-cyan-300/80 hover:bg-cyan-500/5 hover:border-cyan-400/50 hover:text-cyan-300"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed hover:shadow-none hover:border-current" 
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        "retro-button",
        className
      )}
    >
      {/* Retro scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-300" />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Neon glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px'
        }} />
      </div>
    </button>
  );
};
