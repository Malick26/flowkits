"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/storeTypes";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useCart } from "@/features/cart/useCart";

export function AddToCartCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = React.useState<string>(product.sizes[0] ?? "M");
  const [added, setAdded] = React.useState(false);

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/75">Taille</p>
          <Select
            value={size}
            onChange={setSize}
            options={product.sizes.map((s) => ({ value: s, label: s }))}
            className="mt-2"
          />
        </div>

        <div className="sm:w-56">
          <Button
            className="w-full"
            onClick={() => {
              addItem({
                productId: product.id,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.images[0] ?? null,
                size,
                qty: 1,
              });
              setAdded(true);
              window.setTimeout(() => setAdded(false), 900);
            }}
          >
            Ajouter au panier
          </Button>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: added ? 1 : 0, y: added ? 0 : 6 }}
            className="mt-2 text-center text-xs text-white/60"
          >
            Ajouté.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

