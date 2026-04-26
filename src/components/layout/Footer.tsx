import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-black/10">
      <Container className="flex flex-col gap-2 py-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} FlowKits</p>
        <p className="text-white/45">Paiement à la livraison (COD).</p>
      </Container>
    </footer>
  );
}

