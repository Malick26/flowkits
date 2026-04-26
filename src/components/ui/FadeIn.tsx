"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeIn({
  children,
  delay = 0,
  className,
  direction = "up",
  distance = 40,
  blur = true,
  scale = 0.96,
  stiffness = 80,
  damping = 20,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  blur?: boolean;
  scale?: number;
  stiffness?: number;
  damping?: number;
}) {
  const y = direction === "up" ? distance : direction === "down" ? -distance : 0;
  const x = direction === "left" ? distance : direction === "right" ? -distance : 0;

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y, 
        x, 
        scale,
        filter: blur ? "blur(12px)" : "none",
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0, 
        scale: 1,
        filter: blur ? "blur(0px)" : "none",
      }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ 
        type: "spring",
        stiffness,
        damping,
        mass: 1,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
