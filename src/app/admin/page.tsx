import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getAdminDashboardStats, listAdminOrders, listAdminSupportTickets } from "@/lib/admin/dashboardData";
import { formatMoneyCents } from "@/lib/money";
import { OrderStatusEditor } from "@/features/admin/orders/OrderStatusEditor";

type AdminOrderRow = {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  phone: string;
  address: string;
  total_cents: number | null;
  status: string;
  payment_method: string;
};

export default async function AdminPage() {
  await requireAdmin();
  const [stats, orders, tickets] = await Promise.all([getAdminDashboardStats(), listAdminOrders(), listAdminSupportTickets()]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-white/55">Commandes</p>
          <p className="mt-2 text-3xl font-semibold">{stats.ordersCount}</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-white/55">En attente</p>
          <p className="mt-2 text-3xl font-semibold">{stats.pendingCount}</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-white/55">Chiffre d&apos;affaires</p>
          <p className="mt-2 text-3xl font-semibold">
            {formatMoneyCents(stats.revenueCents)}
          </p>
        </div>
      </section>

      <section className="glass rounded-3xl p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">Dernières commandes</p>
            <p className="mt-1 text-sm text-white/45">Max 100</p>
          </div>
          <Link
            href="/admin/products"
            className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/8"
          >
            Produits
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="text-white/55">
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Client</th>
                <th className="py-3 pr-4">Adresse</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Statut</th>
                <th className="py-3 pr-4">Paiement</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {orders.length === 0 ? (
                <tr>
                  <td className="py-6 text-white/55" colSpan={6}>
                    Aucune commande (ou Supabase non configuré).
                  </td>
                </tr>
              ) : (
                (orders as AdminOrderRow[]).map((o) => (
                  <tr key={o.id} className="border-b border-white/6">
                    <td className="py-3 pr-4 font-mono text-xs text-white/60">
                      <Link
                        className="focus-ring rounded-lg px-2 py-1 hover:bg-white/6"
                        href={`/admin/orders/${o.id}`}
                      >
                        {String(o.id).slice(0, 8)}…
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      {o.customer_first_name} {o.customer_last_name}
                      <div className="text-xs text-white/45">{o.phone}</div>
                    </td>
                    <td className="py-3 pr-4 text-white/70">{o.address}</td>
                    <td className="py-3 pr-4 font-semibold">
                      {formatMoneyCents(o.total_cents ?? 0)}
                    </td>
                    <td className="py-3 pr-4">
                      <OrderStatusEditor orderId={o.id} initialStatus={o.status} compact />
                    </td>
                    <td className="py-3 pr-4 text-white/70">{o.payment_method}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass rounded-3xl p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">Tickets SAV (Support)</p>
            <p className="mt-1 text-sm text-white/45">Plaintes et échanges de taille</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="text-white/55">
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Client</th>
                <th className="py-3 pr-4">Problème</th>
                <th className="py-3 pr-4">Détails</th>
                <th className="py-3 pr-4">Statut</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {tickets.length === 0 ? (
                <tr>
                  <td className="py-6 text-white/55" colSpan={5}>
                    Aucun ticket de support pour le moment.
                  </td>
                </tr>
              ) : (
                tickets.map((t: any) => (
                  <tr key={t.id} className="border-b border-white/6">
                    <td className="py-3 pr-4 text-xs text-white/60">
                      {new Date(t.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 pr-4">
                      {t.customer_name}
                      <div className="text-xs text-white/45">{t.phone}</div>
                    </td>
                    <td className="py-3 pr-4 text-white/70">
                      {t.issue_type === "taille_petite" ? "Taille trop petite" :
                       t.issue_type === "taille_grande" ? "Taille trop grande" :
                       t.issue_type === "mauvais_maillot" ? "Mauvais maillot" : 
                       "Autre"}
                    </td>
                    <td className="py-3 pr-4 text-white/80">{t.details}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/80">
                        {t.status === "new" ? "Nouveau" : t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

