import { NextResponse } from "next/server";
import { assertAdminApiAccess } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type OrderRow = {
  id: string;
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  phone: string;
  neighborhood_name: string;
  delivery_fee_cents: number | null;
  subtotal_cents: number | null;
  total_cents: number | null;
  status: string;
  payment_method: string;
};

function csvEscape(v: string) {
  if (v.includes('"') || v.includes(",") || v.includes("\n")) {
    return `"${v.replaceAll('"', '""')}"`;
  }
  return v;
}

export async function GET(req: Request) {
  const gate = await assertAdminApiAccess();
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const admin = getSupabaseAdmin();
  let q = admin
    .from("orders")
    .select("id,created_at,customer_first_name,customer_last_name,phone,neighborhood_name,delivery_fee_cents,subtotal_cents,total_cents,status,payment_method")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (from) q = q.gte("created_at", from);
  if (to) q = q.lte("created_at", to);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []) as unknown as OrderRow[];
  const header = [
    "id",
    "created_at",
    "first_name",
    "last_name",
    "phone",
    "neighborhood",
    "delivery_fee_cents",
    "subtotal_cents",
    "total_cents",
    "status",
    "payment_method",
  ];

  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.id,
        r.created_at,
        r.customer_first_name,
        r.customer_last_name,
        r.phone,
        r.neighborhood_name,
        String(r.delivery_fee_cents ?? 0),
        String(r.subtotal_cents ?? 0),
        String(r.total_cents ?? 0),
        r.status,
        r.payment_method,
      ]
        .map((v) => csvEscape(String(v ?? "")))
        .join(","),
    ),
  ];

  const csv = lines.join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="compta.csv"`,
    },
  });
}

