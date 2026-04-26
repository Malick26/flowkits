import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { Container } from "@/components/layout/Container";
import { formatMoneyCents } from "@/lib/money";

export default function Home() {
  return <HomePage />;
}

async function HomePage() {
  const products = await listProducts();
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/2 p-7 shadow-[0_30px_120px_-60px_rgba(99,102,241,0.55)] sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_380px_at_80%_20%,rgba(236,72,153,0.14),transparent_60%)]" />
          <div className="relative">
            <p className="text-sm font-medium text-white/60">
              Livraison + paiement à la livraison
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              Maillots premium, design moderne.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Choisis ton maillot, sélectionne la taille, ajoute au panier, puis
              valide en 30 secondes.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Nouveautés
            </h2>
            <p className="text-sm text-white/50">{products.length} produits</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group focus-ring overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/15 hover:bg-white/7"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0] ?? ""}
                    alt={p.name}
                    className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold tracking-tight">{p.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-white/55">
                        {p.description}
                      </p>
                    </div>
                    <p className="shrink-0 rounded-xl bg-white/8 px-3 py-1 text-sm font-semibold">
                      {formatMoneyCents(p.priceCents)}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.sizes.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-white/10 bg-black/15 px-2 py-1 text-xs text-white/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
