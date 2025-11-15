import React from "react";
import clsx from "clsx";

interface HoloButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const HoloButton: React.FC<HoloButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className,
  type = "button",
}) => {
  const baseClasses = "relative overflow-hidden rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/30 text-cyan-300 hover:from-cyan-500/30 hover:to-fuchsia-500/30 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]",
    secondary: "bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-400/30 text-fuchsia-300 hover:from-fuchsia-500/30 hover:to-cyan-500/30 hover:border-fuchsia-400/50 hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]",
    ghost: "bg-transparent border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/40 hover:text-white"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
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
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Holographic shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Glow effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-fuchsia-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};
