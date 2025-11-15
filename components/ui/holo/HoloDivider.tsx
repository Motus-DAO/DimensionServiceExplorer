import React from "react";
import clsx from "clsx";

interface HoloDividerProps {
  variant?: "horizontal" | "vertical";
  thickness?: "thin" | "medium" | "thick";
  className?: string;
}

export const HoloDivider: React.FC<HoloDividerProps> = ({
  variant = "horizontal",
  thickness = "medium",
  className,
}) => {
  const baseClasses = "relative";
  
  const variantClasses = {
    horizontal: "w-full",
    vertical: "h-full"
  };
  
  const thicknessClasses = {
    thin: variant === "horizontal" ? "h-[1px]" : "w-[1px]",
    medium: variant === "horizontal" ? "h-[2px]" : "w-[2px]",
    thick: variant === "horizontal" ? "h-[4px]" : "w-[4px]"
  };

  return (
    <div className={clsx(baseClasses, variantClasses[variant], thicknessClasses[thickness], className)}>
      {/* Main gradient line */}
      <div className={clsx(
        "absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/30 to-cyan-500/20",
        variant === "vertical" && "bg-gradient-to-b from-cyan-500/20 via-fuchsia-500/30 to-cyan-500/20"
      )} />
      
      {/* Glow effect */}
      <div className={clsx(
        "absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-fuchsia-500/50 to-cyan-400/40 blur-sm",
        variant === "vertical" && "bg-gradient-to-b from-cyan-400/40 via-fuchsia-500/50 to-cyan-400/40 blur-sm"
      )} />
      
      {/* Animated scan line */}
      <div className={clsx(
        "absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-[holographic-scan-line_3s_linear_infinite]",
        variant === "vertical" && "bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent animate-[holographic-scan-line_3s_linear_infinite]"
      )} />
    </div>
  );
};
