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

        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/2 p-7 shadow-[0_30px_120px_-60px_rgba(99,102,241,0.55)] sm:p-12">

          {/* Radial glows */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_380px_at_80%_20%,rgba(236,72,153,0.14),transparent_60%)]" />

          {/* Subtle grid lines */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">
                Édition Coupe du Monde 2026
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-1 text-4xl font-bold tracking-tight sm:text-6xl leading-[1.05]">
              FlowKits,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                le maillot qui
              </span>
              <br />
              fait la différence.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Une expérience simple et moderne : tu choisis ton modèle, ta taille,
              tu valides — on s'occupe du reste. Frais de livraison transparents
              selon ton quartier. Paiement à la livraison.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-indigo-400/90 to-indigo-500 px-5 text-sm font-semibold text-white shadow-[0_12px_40px_-14px_rgba(99,102,241,0.75)] transition hover:from-indigo-300/90 hover:to-indigo-500 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Voir les maillots
              </a>
              <a
                href="#how"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 px-5 text-sm font-medium text-white/80 transition hover:bg-white/8 hover:text-white active:scale-[0.98]"
              >
                Comment commander
              </a>
            </div>

            <p className="mt-4 text-xs text-white/30">
              Commande en quelques secondes &bull; Support réactif &bull; Paiement à la livraison
            </p>
          </div>

          {/* Stats row inside hero */}
          <div className="relative mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8">
            {[
              { value: "03", label: "Équipes dispo" },
              { value: "48h", label: "Livraison rapide" },
              { value: "0 DA", label: "Frais cachés" },
            ].map((s) => (
              <div key={s.label} className="bg-black/20 px-4 py-4 text-center backdrop-blur-sm">
                <p className="text-xl font-bold text-white sm:text-2xl">{s.value}</p>
                <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="mt-12 scroll-mt-24">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Comment ça marche ?</h2>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choisis ton maillot",
                desc: "Parcours la collection et sélectionne le modèle qui te correspond.",
                color: "from-indigo-500/15 to-indigo-500/5 border-indigo-500/15",
                dot: "bg-indigo-400",
              },
              {
                step: "02",
                title: "Sélectionne ta taille",
                desc: "Du XS au 3XL, toutes les tailles sont disponibles selon les stocks.",
                color: "from-pink-500/12 to-pink-500/4 border-pink-500/15",
                dot: "bg-pink-400",
              },
              {
                step: "03",
                title: "Paiement à la livraison",
                desc: "Tu paies uniquement quand tu reçois ton colis. Zéro risque.",
                color: "from-white/6 to-white/2 border-white/10",
                dot: "bg-white/60",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 ${item.color}`}
              >
                <span className="text-4xl font-bold tracking-tighter text-white/6 select-none absolute right-4 top-3">
                  {item.step}
                </span>
                <span className={`mb-3 block h-2 w-2 rounded-full ${item.dot}`} />
                <p className="font-semibold text-sm text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section id="products" className="mt-12 scroll-mt-24">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Nos maillots</h2>
              <p className="mt-0.5 text-xs text-white/35">Collection Coupe du Monde 2026</p>
            </div>
            <p className="text-sm text-white/40">Choisis ta taille</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 overflow-hidden rounded-2xl border border-white/8 bg-white/4 transition-all duration-200 hover:border-indigo-500/30 hover:bg-white/6 hover:shadow-[0_8px_32px_-8px_rgba(99,102,241,0.25)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white/4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0] ?? ""}
                    alt={p.name}
                    className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent" />

                  {/* Price badge on image */}
                  <div className="absolute right-3 top-3 rounded-xl bg-black/50 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm border border-white/10">
                    {formatMoneyCents(p.priceCents)}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold tracking-tight text-white truncate">{p.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.sizes.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/55 transition group-hover:border-indigo-500/20 group-hover:text-white/70"
                      >
                        {s}
                      </span>
                    ))}
                    {p.sizes.length > 5 && (
                      <span className="rounded-lg border border-white/8 bg-white/4 px-2 py-0.5 text-xs text-white/30">
                        +{p.sizes.length - 5}
                      </span>
                    )}
                  </div>

                  {/* CTA row */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/30">Paiement à la livraison</span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-300 transition group-hover:bg-indigo-500/25">
                      Commander
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TRUST STRIP ── */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              {[
                { icon: "🚚", label: "Livraison dans tout le pays" },
                { icon: "💳", label: "Paiement à la livraison" },
                { icon: "↩", label: "Retour facile sous 7 jours" },
                { icon: "💬", label: "Support réactif" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/6 text-sm">
                    {item.icon}
                  </span>
                  <span className="text-xs text-white/50">{item.label}</span>
                </div>
              ))}
            </div>
            <a
              href="#products"
              className="shrink-0 inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-b from-indigo-400/90 to-indigo-500 px-4 text-xs font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition hover:from-indigo-300/90 active:scale-[0.98]"
            >
              Voir la collection
            </a>
          </div>
        </section>

      </Container>
    </div>
  );
}