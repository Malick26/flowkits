import { Container } from "@/components/layout/Container";
import { listNeighborhoods } from "@/lib/data/neighborhoods";
import { CheckoutClient } from "@/features/checkout/CheckoutClient";

export default async function CheckoutPage() {
  const neighborhoods = await listNeighborhoods();

  return (
    <div className="py-10">
      <Container>
        <CheckoutClient neighborhoods={neighborhoods} />
      </Container>
    </div>
  );
}

