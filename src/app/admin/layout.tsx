import { Container } from "@/components/layout/Container";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-8">
      <Container>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
            <p className="mt-1 text-sm text-white/55">
              Commandes, stats et compta.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/8"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/8"
            >
              Produits
            </Link>
            <Link
              href="/admin/accounting"
              className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/8"
            >
              Compta
            </Link>
            <Link
              href="/admin/sign-in"
              className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/8"
            >
              Login
            </Link>
          </div>
        </div>
        {children}
      </Container>
    </div>
  );
}

