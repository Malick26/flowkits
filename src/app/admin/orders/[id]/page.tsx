import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getAdminOrder } from "@/lib/admin/dashboardData";
import { formatMoneyCents } from "@/lib/money";
import { OrderStatusEditor } from "@/features/admin/orders/OrderStatusEditor";

type AdminOrderItemRow = {
  id: string;
  product_name: string;
  size: string;
  qty: number;
  unit_price_cents: number | null;
  line_total_cents: number | null;
};

type AdminOrderRow = {
  id: string;
  status: string;
};

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const data = await getAdminOrder(id);
  if (!data) return notFound();

  const { order, items } = data;

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="focus-ring inline-flex rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/8"
      >
        ← Retour
      </Link>

      <section className="glass rounded-3xl p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-white/55">Commande</p>
            <p className="mt-1 font-mono text-sm text-white/80">{order.id}</p>
            <p className="mt-3 text-sm text-white/55">Client</p>
            <p className="mt-1 text-white/80">
              {order.customer_first_name} {order.customer_last_name}
            </p>
            <p className="text-sm text-white/55">{order.phone}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-10 text-white/70">
              <span>Sous-total</span>
              <span className="font-semibold text-white">
                {formatMoneyCents(order.subtotal_cents ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-10 text-white/70">
              <span>Livraison ({order.neighborhood_name})</span>
              <span className="font-semibold text-white">
                {formatMoneyCents(order.delivery_fee_cents ?? 0)}
              </span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between gap-10">
              <span className="text-white/70">Total</span>
              <span className="text-base font-semibold">
                {formatMoneyCents(order.total_cents ?? 0)}
              </span>
            </div>
            <p className="text-xs text-white/45">
              Paiement: <span className="text-white/70">{order.payment_method}</span>
            </p>

            <div className="pt-2">
              <OrderStatusEditor
                orderId={(order as AdminOrderRow).id}
                initialStatus={(order as AdminOrderRow).status}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="glass rounded-3xl p-5">
        <p className="text-sm font-medium text-white/70">Articles</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-white/55">
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4">Produit</th>
                <th className="py-3 pr-4">Taille</th>
                <th className="py-3 pr-4">Qté</th>
                <th className="py-3 pr-4">PU</th>
                <th className="py-3 pr-4">Total</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {(items as AdminOrderItemRow[]).map((it) => (
                <tr key={it.id} className="border-b border-white/6">
                  <td className="py-3 pr-4">{it.product_name}</td>
                  <td className="py-3 pr-4 text-white/70">{it.size}</td>
                  <td className="py-3 pr-4 text-white/70">{it.qty}</td>
                  <td className="py-3 pr-4">{formatMoneyCents(it.unit_price_cents ?? 0)}</td>
                  <td className="py-3 pr-4 font-semibold">
                    {formatMoneyCents(it.line_total_cents ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

