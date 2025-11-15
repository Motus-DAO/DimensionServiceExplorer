import React from "react";
import clsx from "clsx";

interface RetroTextProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  weight?: "light" | "normal" | "semibold" | "bold";
  className?: string;
  variant?: "default" | "terminal" | "neon";
}

export const RetroText: React.FC<RetroTextProps> = ({
  children,
  size = "base",
  weight = "normal",
  className,
  variant = "default",
}) => {
  const variantClasses = {
    default: "text-cyan-300 font-mono tracking-wider",
    terminal: "text-cyan-400 font-mono tracking-wider terminal-text",
    neon: "text-cyan-400 font-mono tracking-wider accent"
  };

  return (
    <p
      className={clsx(
        variantClasses[variant],
        {
          "text-xs": size === "xs",
          "text-sm": size === "sm",
          "text-base": size === "base",
          "text-lg": size === "lg",
          "text-xl": size === "xl",
          "font-light": weight === "light",
          "font-normal": weight === "normal",
          "font-semibold": weight === "semibold",
          "font-bold": weight === "bold",
        },
        className
      )}
    >
      {children}
    </p>
  );
};
