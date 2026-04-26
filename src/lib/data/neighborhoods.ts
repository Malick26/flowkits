import type { Neighborhood } from "@/lib/storeTypes";
import { MOCK_NEIGHBORHOODS } from "@/lib/mockData";
import { getSupabaseServer } from "@/lib/supabase/server";

type NeighborhoodRow = { id: string; name: string; fee_cents: number };

function mapNeighborhood(row: NeighborhoodRow): Neighborhood {
  return {
    id: row.id,
    name: row.name,
    feeCents: row.fee_cents,
  };
}

export async function listNeighborhoods(): Promise<Neighborhood[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return MOCK_NEIGHBORHOODS;

  const { data, error } = await supabase
    .from("neighborhoods")
    .select("*")
    .order("name", { ascending: true });

  if (error || !data) return MOCK_NEIGHBORHOODS;
  return (data as unknown as NeighborhoodRow[]).map(mapNeighborhood);
}

export async function getNeighborhood(id: string): Promise<Neighborhood | null> {
  const supabase = await getSupabaseServer();
  if (!supabase) return MOCK_NEIGHBORHOODS.find((n) => n.id === id) ?? null;

  const { data, error } = await supabase
    .from("neighborhoods")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapNeighborhood(data as unknown as NeighborhoodRow);
}

