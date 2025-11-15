import React from "react";
import clsx from "clsx";

interface HoloTextProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  weight?: "light" | "normal" | "semibold" | "bold";
  className?: string;
}

export const HoloText: React.FC<HoloTextProps> = ({
  children,
  size = "base",
  weight = "normal",
  className,
}) => (
  <p
    className={clsx(
      "neon-solid-cyan font-mono tracking-wider",
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
