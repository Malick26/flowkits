"use client";

import { useCartUnsafe } from "./CartProvider";

export function useCart() {
  const ctx = useCartUnsafe();
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

