"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
import { useCart } from "@/features/cart/useCart";

export function Navbar({ className }: { className?: string }) {
  const { count } = useCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 border-b border-white/8 bg-black/20 backdrop-blur-xl", className)}>
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="focus-ring group inline-flex items-center gap-2 rounded-xl px-2 py-1">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10">
            <span className="h-3 w-3 rounded-sm bg-gradient-to-br from-indigo-300 to-fuchsia-300 shadow-[0_0_20px_rgba(99,102,241,0.55)]" />
          </span>
          <span className="font-semibold tracking-tight">FlowKits</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/cart"
            className="focus-ring relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:border-white/15 hover:bg-white/8"
          >
            <ShoppingBag className="h-4 w-4" />
            Panier
            {mounted && count > 0 ? (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-xs font-semibold text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </Container>
    </header>
  );
}

