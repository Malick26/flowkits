"use client";

import * as React from "react";
import type { CartItem } from "./cartTypes";
import { loadCart, saveCart } from "./cartStorage";

type CartState = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (key: { productId: string; size: string }) => void;
  setQty: (key: { productId: string; size: string }, qty: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartState | null>(null);

function keyOf(i: { productId: string; size: string }) {
  return `${i.productId}__${i.size}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>(() => loadCart());

  React.useEffect(() => {
    saveCart(items);
  }, [items]);

  const value = React.useMemo<CartState>(() => {
    const count = items.reduce((acc, it) => acc + it.qty, 0);
    const subtotalCents = items.reduce((acc, it) => acc + it.priceCents * it.qty, 0);

    return {
      items,
      count,
      subtotalCents,
      addItem: (item) => {
        const qty = Math.max(1, item.qty ?? 1);
        setItems((prev) => {
          const k = keyOf(item);
          const idx = prev.findIndex((p) => keyOf(p) === k);
          if (idx === -1) return [...prev, { ...item, qty }];
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        });
      },
      removeItem: (k) => {
        setItems((prev) => prev.filter((p) => keyOf(p) !== keyOf(k)));
      },
      setQty: (k, qty) => {
        const safe = Number.isFinite(qty) ? Math.max(1, Math.min(99, qty)) : 1;
        setItems((prev) =>
          prev.map((p) => (keyOf(p) === keyOf(k) ? { ...p, qty: safe } : p)),
        );
      },
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartUnsafe() {
  return React.useContext(CartContext);
}

