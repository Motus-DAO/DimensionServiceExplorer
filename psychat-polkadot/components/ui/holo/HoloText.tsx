import React from "react";
import clsx from "clsx";

interface HoloTextProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  weight?: "light" | "normal" | "semibold" | "bold";
  className?: string;
  id?: string;
  as?: "p" | "span" | "div";
}

export const HoloText: React.FC<HoloTextProps> = ({
  children,
  size = "base",
  weight = "normal",
  className,
  id,
  as = "p",
}) => {
  const Component = as;
  
  return (
    <Component
      id={id}
      className={clsx(
        "font-mono tracking-wider neon-solid-cyan",
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
      style={{
        color: 'var(--color-text)',
        textShadow: '0 0 10px var(--color-accent)'
      }}
    >
      {children}
    </Component>
  );
};
