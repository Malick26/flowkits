export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceCents: number;
  images: string[];
  sizes: string[];
  active: boolean;
  stock: number;
};
export type Neighborhood = {
  id: string;
  name: string;
  feeCents: number;
};


export type OrderStatus = "new" | "confirmed" | "delivering" | "done" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  customerFirstName: string;
  customerLastName: string;
  phone: string;
  address: string;
  subtotalCents: number;
  totalCents: number;
  status: OrderStatus;
  paymentMethod: "cod";
};

