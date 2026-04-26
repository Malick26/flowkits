"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/useCart";
import { formatMoneyCents } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CartClient() {
  const { items, subtotalCents, setQty, removeItem, clear } = useCart();

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Panier</h1>
          <p className="mt-1 text-sm text-white/55">
            Vérifie les tailles et quantités avant de valider.
          </p>
        </div>
        {items.length ? (
          <Button variant="ghost" onClick={clear}>
            Vider le panier
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-8 glass rounded-3xl p-8 text-center">
          <p className="text-white/70">Ton panier est vide.</p>
          <div className="mt-4">
            <Link
              href="/"
              className="focus-ring inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/8"
            >
              Continuer shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {items.map((it) => (
              <div
                key={`${it.productId}-${it.size}`}
                className="glass flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-28 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.imageUrl ?? ""}
                      alt={it.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold tracking-tight">{it.name}</p>
                    <p className="mt-1 text-sm text-white/55">
                      Taille: <span className="text-white/80">{it.size}</span>
                    </p>
                    <p className="mt-1 text-sm text-white/65">
                      {formatMoneyCents(it.priceCents)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-between gap-3 sm:justify-end">
                  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => setQty({ productId: it.productId, size: it.size }, Math.max(1, it.qty - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-white/70"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{it.qty}</span>
                    <button
                      onClick={() => setQty({ productId: it.productId, size: it.size }, it.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-white/70"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      removeItem({ productId: it.productId, size: it.size })
                    }
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-3xl p-5 h-fit">
            <p className="text-sm font-medium text-white/70">Résumé</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-white/70">
                <span>Sous-total</span>
                <span className="font-semibold text-white">
                  {formatMoneyCents(subtotalCents)}
                </span>
              </div>
              <div className="flex items-center justify-between text-white/55">
                <span>Livraison</span>
                <span>Calculée au checkout</span>
              </div>
            </div>
            <div className="mt-5">
              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Valider le panier
                </Button>
              </Link>
              <p className="mt-3 text-xs text-white/45">
                Paiement à la livraison.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

