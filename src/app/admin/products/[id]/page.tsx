import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ProductEditor } from "@/features/admin/products/ProductEditor";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  images: string[] | null;
  sizes: string[] | null;
  active: boolean;
};

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const canPersist = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  if (!canPersist) return notFound();

  const { id } = await params;

  const { data } = await getSupabaseAdmin()
    .from("products")
    .select("id,name,slug,description,price_cents,images,sizes,active")
    .eq("id", id)
    .maybeSingle();

  if (!data) return notFound();

  const product = data as unknown as ProductRow;

  return (
    <ProductEditor
      mode="edit"
      initial={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? "",
        priceCents: product.price_cents,
        images: product.images ?? [],
        sizes: product.sizes ?? ["S", "M", "L", "XL"],
        active: product.active,
      }}
    />
  );
}

