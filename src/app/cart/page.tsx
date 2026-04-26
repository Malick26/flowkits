import { Container } from "@/components/layout/Container";
import { CartClient } from "@/features/cart/pages/CartClient";

export default function CartPage() {
  return (
    <div className="py-10">
      <Container>
        <CartClient />
      </Container>
    </div>
  );
}

