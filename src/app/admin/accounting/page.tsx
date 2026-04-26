import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatMoneyCents } from "@/lib/money";
import Link from "next/link";

type OrderRow = {
  id: string;
  created_at: string;
  total_cents: number;
  status: string;
};

export default async function AdminAccountingPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const from = sp.from;
  const to = sp.to;

  const canPersist = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  if (!canPersist) {
    return (
      <div className="glass rounded-3xl p-5">
        <p className="text-sm text-white/70">Compta</p>
        <p className="mt-2 text-sm text-white/55">Supabase non configuré.</p>
      </div>
    );
  }

  let q = getSupabaseAdmin()
    .from("orders")
    .select("id,created_at,total_cents,status")
    .order("created_at", { ascending: false })
    .limit(500);

  if (from) q = q.gte("created_at", from);
  if (to) q = q.lte("created_at", to);

  const { data } = await q;
  const orders = (data ?? []) as unknown as OrderRow[];
  const revenue = orders.reduce((acc, o) => acc + (o.total_cents ?? 0), 0);

  const exportUrl = `/api/admin/accounting/export${from || to ? "?" : ""}${
    new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString()
  }`;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Compta</h2>
          <p className="mt-1 text-sm text-white/55">
            Filtre par date (ISO) + export CSV.
          </p>
        </div>
        <Link
          href={exportUrl}
          className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/8"
        >
          Export CSV
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-white/55">Commandes (filtrées)</p>
          <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
        </div>
        <div className="glass rounded-3xl p-5 sm:col-span-2">
          <p className="text-sm text-white/55">Total</p>
          <p className="mt-2 text-3xl font-semibold">{formatMoneyCents(revenue)}</p>
          <p className="mt-2 text-xs text-white/45">
            Astuce: utilise `from=2026-01-01T00:00:00Z` et `to=2026-12-31T23:59:59Z`
          </p>
        </div>
      </div>

      <div className="glass overflow-x-auto rounded-3xl p-5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-white/55">
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">ID</th>
              <th className="py-3 pr-4">Statut</th>
              <th className="py-3 pr-4">Total</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {orders.slice(0, 200).map((o) => (
              <tr key={o.id} className="border-b border-white/6">
                <td className="py-3 pr-4 text-white/70">
                  {new Date(o.created_at).toLocaleString("fr-FR")}
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-white/60">
                  {o.id}
                </td>
                <td className="py-3 pr-4 text-white/70">{o.status}</td>
                <td className="py-3 pr-4 font-semibold">
                  {formatMoneyCents(o.total_cents ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

