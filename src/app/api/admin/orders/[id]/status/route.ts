import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminApiAccess } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  status: z.enum(["new", "confirmed", "delivering", "done", "cancelled"]),
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
    const input = schema.parse(json);

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("orders").update({ status: input.status }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue." },
      { status: 400 },
    );
  }
}

