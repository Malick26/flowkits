import { NextResponse } from "next/server";
import { createOrderSchema } from "@/features/checkout/orderSchema";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { MOCK_PRODUCTS } from "@/lib/mockData";

type ProductRow = { id: string; name: string; price_cents: number; stock: number };

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

    const { data: products, error: productsError } = await admin
      .from("products")
      .select("id, name, price_cents, stock")
      .in("id", productIds);

    if (productsError) throw new Error(productsError.message);

    const productsMap = new Map<ProductRow["id"], ProductRow>(
      ((products ?? []) as unknown as ProductRow[]).map((p) => [p.id, p]),
    );

    const orderItems = input.items.map((it) => {
      const p =
        productsMap.get(it.productId) ??
        MOCK_PRODUCTS.find((mp) => mp.id === it.productId) ??
        null;
      if (!p) throw new Error("Produit invalide.");
      
      const availableStock = "stock" in p ? p.stock : 0;
      if (it.qty > availableStock) {
        throw new Error(`Rupture de stock pour le produit: ${p.name}`);
      }

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
    const totalCents = subtotalCents;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        customer_first_name: input.customerFirstName,
        customer_last_name: input.customerLastName,
        phone: input.phone,
        address: input.address,
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

    // Decrement stock
    for (const it of orderItems) {
      const p = productsMap.get(it.product_id);
      if (p) {
        await admin
          .from("products")
          .update({ stock: p.stock - it.qty })
          .eq("id", p.id);
      }
    }

    return NextResponse.json({ orderId }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue." },
      { status: 400 },
    );
  }
}

