import { Container } from "@/components/layout/Container";
import { CheckoutClient } from "@/features/checkout/CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="py-10">
      <Container>
        <CheckoutClient />
      </Container>
    </div>
  );
}
