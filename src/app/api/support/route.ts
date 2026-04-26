import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const supportSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(6),
  issueType: z.string().min(1),
  details: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = supportSchema.parse(json);

    // If Supabase is not configured yet, still allow local demo flow.
    const canPersist = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    if (!canPersist) {
      return NextResponse.json({ success: true, id: `demo_${Date.now()}` }, { status: 200 });
    }

    const admin = getSupabaseAdmin();

    const { error } = await admin.from("support_tickets").insert({
      customer_name: input.customerName,
      phone: input.phone,
      issue_type: input.issueType,
      details: input.details,
      status: "new",
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue." },
      { status: 400 },
    );
  }
}
