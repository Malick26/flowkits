import { requireAdmin } from "@/lib/admin/requireAdmin";
import { ProductEditor } from "@/features/admin/products/ProductEditor";

export default async function AdminNewProductPage() {
  await requireAdmin();
  return <ProductEditor mode="create" />;
}

