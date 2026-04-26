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

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await assertAdminApiAccess();
  if (!gate.ok) return gate.response;

  try {
    const { id } = await ctx.params;
    const json = await req.json();
    const input = productPayloadSchema.parse(json);

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("products")
      .update({
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        price_cents: input.priceCents,
        images: input.images ?? [],
        sizes: input.sizes,
        active: input.active ?? true,
      })
      .eq("id", id)
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

