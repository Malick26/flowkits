"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useCart } from "@/features/cart/useCart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatMoneyCents } from "@/lib/money";
import { createOrderSchema, type CreateOrderInput } from "./orderSchema";

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotalCents, clear } = useCart();
  const [error, setError] = React.useState<string | null>(null);
  const [redirecting, setRedirecting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerFirstName: "",
      customerLastName: "",
      phone: "",
      address: "",
      items: [],
    },
    mode: "onChange",
  });

  const totalCents = subtotalCents;

  React.useEffect(() => {
    form.setValue(
      "items",
      items.map((it) => ({ productId: it.productId, size: it.size, qty: it.qty })),
      { shouldValidate: true },
    );
  }, [items, form]);

  if (items.length === 0 && !redirecting) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <p className="text-white/70">Ton panier est vide.</p>
        <p className="mt-2 text-sm text-white/55">
          Ajoute au moins un produit avant de valider.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-semibold tracking-tight">Validation</h1>
        <p className="mt-1 text-sm text-white/55">
          Paiement à la livraison. Livraison possible partout à Dakar.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            setError(null);
            setLoading(true);
            try {
              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(values),
              });
              const json = (await res.json()) as { orderId?: string; error?: string };
              if (!res.ok || !json.orderId) {
                throw new Error(json.error || "Erreur de validation.");
              }
              setRedirecting(true);
              clear();
              router.push(`/order/${json.orderId}`);
            } catch (e: unknown) {
              setError(e instanceof Error ? e.message : "Erreur inconnue.");
            } finally {
              setLoading(false);
            }
          })}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-white/75">Nom</label>
              <Input
                className="mt-2"
                placeholder="Nom"
                {...form.register("customerLastName")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/75">Prénom</label>
              <Input
                className="mt-2"
                placeholder="Prénom"
                {...form.register("customerFirstName")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-white/75">Téléphone</label>
              <Input
                className="mt-2"
                placeholder="ex: 77 000 00 00"
                {...form.register("phone")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/75">Adresse de livraison</label>
              <Input
                className="mt-2"
                placeholder="Ex: Parcelles Assainies U15"
                {...form.register("address")}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: error ? 1 : 0, y: error ? 0 : 6 }}
            className="text-sm text-rose-300"
          >
            {error}
          </motion.div>

          <div className="pt-2">
            <Button type="submit" size="lg" disabled={!form.formState.isValid || loading}>
              {loading ? "Validation..." : "Confirmer la commande"}
            </Button>
          </div>
        </form>
      </div>

      <div className="glass h-fit rounded-3xl p-5">
        <p className="text-sm font-medium text-white/70">Résumé</p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between text-white/70">
            <span>Sous-total</span>
            <span className="font-semibold text-white">
              {formatMoneyCents(subtotalCents)}
            </span>
          </div>

          <div className="h-px bg-white/10" />
          <div className="flex items-center justify-between">
            <span className="text-white/70">Total</span>
            <span className="text-base font-semibold">
              {formatMoneyCents(totalCents)}
            </span>
          </div>
          <p className="text-xs text-white/45">
            Paiement: <span className="text-white/70">à la livraison</span>
          </p>
        </div>
      </div>
    </div>
  );
}

