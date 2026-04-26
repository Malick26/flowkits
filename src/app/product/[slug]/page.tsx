import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { getProductBySlug } from "@/lib/data/products";
import { formatMoneyCents } from "@/lib/money";
import { AddToCartCard } from "@/features/cart/components/AddToCartCard";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <div className="py-10">
      <Container>
        <div className="mb-6 flex items-center gap-2 text-sm text-white/55">
          <Link className="focus-ring rounded-lg px-2 py-1 hover:bg-white/6" href="/">
            Boutique
          </Link>
          <span>/</span>
          <span className="text-white/75">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0] ?? ""}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="text-white/60">{product.description}</p>
            <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-base font-semibold">
              {formatMoneyCents(product.priceCents)}
            </div>

            <AddToCartCard product={product} />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              <p className="font-medium text-white/80">Paiement</p>
              <p className="mt-1">Par défaut: paiement à la livraison.</p>
              <p className="mt-2 font-medium text-white/80">Livraison</p>
              <p className="mt-1">
                Choisis ton quartier à l’étape checkout (prix variable).
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

