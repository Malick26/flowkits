import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatMoneyCents } from "@/lib/money";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  sizes: string[] | null;
  active: boolean;
  created_at: string;
};

export default async function AdminProductsPage() {
  await requireAdmin();

  const canPersist = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const products: ProductRow[] = canPersist
    ? (((await getSupabaseAdmin()
        .from("products")
        .select("id,name,slug,price_cents,sizes,active,created_at")
        .order("created_at", { ascending: false })).data ?? []) as unknown as ProductRow[])
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Produits</h2>
          <p className="mt-1 text-sm text-white/55">
            Gérer les maillots (prix, tailles, activation).
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="focus-ring rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/8"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="glass overflow-x-auto rounded-3xl p-5">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-white/55">
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4">Nom</th>
              <th className="py-3 pr-4">Slug</th>
              <th className="py-3 pr-4">Prix</th>
              <th className="py-3 pr-4">Tailles</th>
              <th className="py-3 pr-4">Actif</th>
              <th className="py-3 pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {products.length === 0 ? (
              <tr>
                <td className="py-6 text-white/55" colSpan={6}>
                  Aucun produit (ou Supabase non configuré).
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-white/6">
                  <td className="py-3 pr-4 font-medium">{p.name}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-white/60">
                    {p.slug}
                  </td>
                  <td className="py-3 pr-4 font-semibold">
                    {formatMoneyCents(p.price_cents)}
                  </td>
                  <td className="py-3 pr-4 text-white/70">
                    {(p.sizes ?? []).join(", ")}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        p.active
                          ? "rounded-lg bg-emerald-500/15 px-2 py-1 text-xs text-emerald-200 ring-1 ring-emerald-400/20"
                          : "rounded-lg bg-white/8 px-2 py-1 text-xs text-white/60 ring-1 ring-white/10"
                      }
                    >
                      {p.active ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="focus-ring rounded-lg px-2 py-1 text-sm hover:bg-white/6"
                    >
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

