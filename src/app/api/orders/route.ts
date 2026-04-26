import { NextResponse } from "next/server";
import { createOrderSchema } from "@/features/checkout/orderSchema";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { MOCK_NEIGHBORHOODS, MOCK_PRODUCTS } from "@/lib/mockData";

type ProductRow = { id: string; name: string; price_cents: number };
type NeighborhoodRow = { id: string; name: string; fee_cents: number };

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = createOrderSchema.parse(json);

    const productIds = Array.from(new Set(input.items.map((i) => i.productId)));

    // If Supabase is not configured yet, still allow local demo flow.
    const canPersist = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    if (!canPersist) {
      return NextResponse.json({ orderId: `demo_${Date.now()}` }, { status: 200 });
    }

    const admin = getSupabaseAdmin();

    const [
      { data: products, error: productsError },
      { data: neighborhood, error: neighborhoodError },
    ] = await Promise.all([
      admin.from("products").select("id, name, price_cents").in("id", productIds),
      admin
        .from("neighborhoods")
        .select("id, name, fee_cents")
        .eq("id", input.neighborhoodId)
        .maybeSingle(),
    ]);

    if (productsError) throw new Error(productsError.message);
    if (neighborhoodError) throw new Error(neighborhoodError.message);

    const productsMap = new Map<string, ProductRow>(
      ((products ?? []) as unknown as ProductRow[]).map((p) => [p.id, p]),
    );

    const resolvedNeighborhood: NeighborhoodRow | null =
      ((neighborhood ?? null) as unknown as NeighborhoodRow | null) ??
      null;

    const fallbackNeighborhood =
      MOCK_NEIGHBORHOODS.find((n) => n.id === input.neighborhoodId) ?? null;

    const neighborhoodName = resolvedNeighborhood?.name ?? fallbackNeighborhood?.name;
    const deliveryFeeCents =
      resolvedNeighborhood?.fee_cents ?? fallbackNeighborhood?.feeCents ?? null;

    if (!neighborhoodName || deliveryFeeCents == null) throw new Error("Quartier invalide.");

    const orderItems = input.items.map((it) => {
      const p =
        productsMap.get(it.productId) ??
        MOCK_PRODUCTS.find((mp) => mp.id === it.productId) ??
        null;
      if (!p) throw new Error("Produit invalide.");
      const unitPriceCents = "price_cents" in p ? p.price_cents : p.priceCents;
      return {
        product_id: it.productId,
        product_name: p.name,
        size: it.size,
        qty: it.qty,
        unit_price_cents: unitPriceCents,
        line_total_cents: unitPriceCents * it.qty,
      };
    });

    const subtotalCents = orderItems.reduce((acc, it) => acc + it.line_total_cents, 0);
    const totalCents = subtotalCents + deliveryFeeCents;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        customer_first_name: input.customerFirstName,
        customer_last_name: input.customerLastName,
        phone: input.phone,
        neighborhood_id: input.neighborhoodId,
        neighborhood_name: neighborhoodName,
        delivery_fee_cents: deliveryFeeCents,
        subtotal_cents: subtotalCents,
        total_cents: totalCents,
        status: "new",
        payment_method: "cod",
      })
      .select("id")
      .single();

    if (orderError) throw new Error(orderError.message);
    const orderId = order.id as string;

    const { error: itemsError } = await admin.from("order_items").insert(
      orderItems.map((it) => ({
        order_id: orderId,
        ...it,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);

    return NextResponse.json({ orderId }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue." },
      { status: 400 },
    );
  }
}

