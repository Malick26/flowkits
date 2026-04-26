"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-medium transition will-change-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-base",
        variant === "primary" &&
          "bg-gradient-to-b from-indigo-400/90 to-indigo-500 text-white shadow-[0_12px_40px_-14px_rgba(99,102,241,0.75)] hover:from-indigo-300/90 hover:to-indigo-500",
        variant === "secondary" &&
          "glass hover:border-white/20 hover:bg-white/10",
        variant === "ghost" &&
          "hover:bg-white/8 border border-transparent hover:border-white/10",
        variant === "danger" &&
          "bg-gradient-to-b from-rose-400/90 to-rose-500 text-white shadow-[0_12px_40px_-14px_rgba(244,63,94,0.7)] hover:from-rose-300/90 hover:to-rose-500",
        className,
      )}
      {...props}
    />
  );
}

