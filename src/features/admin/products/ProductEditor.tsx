"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional(),
  priceCents: z.string().min(1),
  sizes: z.string().min(1),
  images: z.string().optional(),
  active: z.boolean().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export function ProductEditor({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    priceCents: number;
    sizes: string[];
    images: string[];
    active: boolean;
  };
}) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      priceCents: String(initial?.priceCents ?? 0),
      sizes: (initial?.sizes ?? ["S", "M", "L", "XL"]).join(", "),
      images: (initial?.images ?? []).join("\n"),
      active: initial?.active ?? true,
    },
    mode: "onChange",
  });

  async function submit(values: ProductForm) {
    setError(null);
    setLoading(true);
    try {
      const priceCents = Number.parseInt(values.priceCents, 10);
      if (!Number.isFinite(priceCents) || priceCents < 0) {
        throw new Error("Prix invalide (centimes).");
      }

      const sizes = values.sizes
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
      if (sizes.length === 0) throw new Error("Tailles invalides.");

      const images = (values.images ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: values.name,
        slug: values.slug,
        description: values.description ?? "",
        priceCents,
        sizes,
        images,
        active: Boolean(values.active),
      };

      const res =
        mode === "create"
          ? await fetch("/api/admin/products", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/products/${initial?.id}`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload),
            });

      const json = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(json.error || "Erreur");

      router.replace("/admin/products");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {mode === "create" ? "Nouveau produit" : "Éditer produit"}
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Slug: minuscules, chiffres, tirets (ex: maillot-noir-2026)
          </p>
        </div>
        <Link
          href="/admin/products"
          className="focus-ring rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/8"
        >
          Retour
        </Link>
      </div>

      <form
        className="glass rounded-3xl p-5 space-y-4"
        onSubmit={form.handleSubmit(submit)}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-white/75">Nom</label>
            <Input className="mt-2" {...form.register("name")} />
          </div>
          <div>
            <label className="text-sm font-medium text-white/75">Slug</label>
            <Input className="mt-2" {...form.register("slug")} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-white/75">
              Prix (centimes)
            </label>
            <Input className="mt-2" {...form.register("priceCents")} />
            <p className="mt-2 text-xs text-white/45">
              Exemple: 1500000 = 15 000 XOF
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-white/75">
              Tailles (CSV)
            </label>
            <Input className="mt-2" {...form.register("sizes")} />
            <p className="mt-2 text-xs text-white/45">Ex: S, M, L, XL, XXL</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-white/75">
            Description
          </label>
          <textarea
            className="focus-ring mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 shadow-inner shadow-black/20 transition hover:border-white/15"
            {...form.register("description")}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white/75">
            Images (1 URL par ligne)
          </label>
          <textarea
            className="focus-ring mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 shadow-inner shadow-black/20 transition hover:border-white/15"
            {...form.register("images")}
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            className="h-4 w-4 accent-indigo-500"
            {...form.register("active")}
          />
          Actif (visible sur la boutique)
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            size="lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <p className="text-xs text-white/45">
            Les changements apparaissent côté boutique si le produit est actif.
          </p>
        </div>
      </form>
    </div>
  );
}

