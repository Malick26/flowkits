import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type AdminDashboardStats = {
  ordersCount: number;
  revenueCents: number;
  pendingCount: number;
};

type OrderTotalRow = { total_cents: number | null };

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const canPersist = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  if (!canPersist) return { ordersCount: 0, revenueCents: 0, pendingCount: 0 };

  const admin = getSupabaseAdmin();

  const [{ count: ordersCount }, { data: revenueRows }, { count: pendingCount }] =
    await Promise.all([
      admin.from("orders").select("*", { count: "exact", head: true }),
      admin.from("orders").select("total_cents"),
      admin.from("orders").select("*", { count: "exact", head: true }).eq("status", "new"),
    ]);

  const revenueCents =
    (revenueRows as unknown as OrderTotalRow[] | null)?.reduce(
      (acc, r) => acc + (r.total_cents ?? 0),
      0,
    ) ?? 0;

  return {
    ordersCount: ordersCount ?? 0,
    revenueCents,
    pendingCount: pendingCount ?? 0,
  };
}

export async function listAdminOrders() {
  const canPersist = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  if (!canPersist) return [];

  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("orders")
    .select(
      "id, created_at, customer_first_name, customer_last_name, phone, address, subtotal_cents, total_cents, status, payment_method",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return data ?? [];
}

export async function getAdminOrder(orderId: string) {
  const canPersist = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  if (!canPersist) return null;

  const admin = getSupabaseAdmin();

  const [{ data: order }, { data: items }] = await Promise.all([
    admin
      .from("orders")
      .select(
        "id, created_at, customer_first_name, customer_last_name, phone, address, subtotal_cents, total_cents, status, payment_method",
      )
      .eq("id", orderId)
      .maybeSingle(),
    admin
      .from("order_items")
      .select("id, product_name, size, qty, unit_price_cents, line_total_cents")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true }),
  ]);

  if (!order) return null;
  return { order, items: items ?? [] };
}

export async function listAdminSupportTickets() {
  const canPersist = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  if (!canPersist) return [];

  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}
