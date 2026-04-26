import type { Product } from "@/lib/storeTypes";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { getSupabaseServer } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  images: unknown;
  sizes: unknown;
  active: boolean;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    priceCents: row.price_cents,
    images: Array.isArray(row.images) ? row.images : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : ["S", "M", "L", "XL"],
    active: Boolean(row.active),
  };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return MOCK_PRODUCTS;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return MOCK_PRODUCTS;
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await getSupabaseServer();
  if (!supabase) return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapProduct(data as unknown as ProductRow);
}

