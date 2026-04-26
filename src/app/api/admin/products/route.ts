import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminApiAccess } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const productPayloadSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  priceCents: z.number().int().min(0),
  sizes: z.array(z.string().min(1)).min(1),
  images: z.array(z.string().min(4)).optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  const gate = await assertAdminApiAccess();
  if (!gate.ok) return gate.response;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .select("id,name,slug,description,price_cents,images,sizes,active,created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] }, { status: 200 });
}

export async function POST(req: Request) {
  const gate = await assertAdminApiAccess();
  if (!gate.ok) return gate.response;

  try {
    const json = await req.json();
    const input = productPayloadSchema.parse(json);

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("products")
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        price_cents: input.priceCents,
        images: input.images ?? [],
        sizes: input.sizes,
        active: input.active ?? true,
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue." },
      { status: 400 },
    );
  }
}

