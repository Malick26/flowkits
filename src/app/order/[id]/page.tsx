import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="py-12">
      <Container>
        <div className="mx-auto max-w-2xl glass rounded-3xl p-8 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 ring-1 ring-indigo-400/30">
            <span className="text-xl font-bold text-indigo-200">✓</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Commande confirmée
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Merci. Ton paiement se fera à la livraison.
          </p>
          <p className="mt-4 text-xs text-white/45">
            Référence: <span className="text-white/70">{id}</span>
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="focus-ring rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/8"
            >
              Retour boutique
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

