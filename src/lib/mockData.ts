import type { Product, Neighborhood } from "./storeTypes";

export const MOCK_NEIGHBORHOODS: Neighborhood[] = [
  { id: "n1", name: "Dakar Plateau", feeCents: 1000 },
  { id: "n2", name: "Almadies", feeCents: 1500 },
  { id: "n3", name: "Ouakam", feeCents: 1000 },
  { id: "n4", name: "Ngor", feeCents: 1500 },
  { id: "n5", name: "Yoff", feeCents: 1500 },
  { id: "n6", name: "Parcelles Assainies", feeCents: 2000 },
  { id: "n7", name: "Guediawaye", feeCents: 2500 },
  { id: "n8", name: "Pikine", feeCents: 2500 },
  { id: "n9", name: "Rufisque", feeCents: 3000 },
];
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Maillot Domicile 2026",
    slug: "maillot-domicile-2026",
    description: "Tissu respirant, coupe moderne, flocage possible.",
    priceCents: 15000 * 100,
    images: [
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    active: true,
    stock: 50,
  },
  {
    id: "p2",
    name: "Maillot Extérieur Noir",
    slug: "maillot-exterieur-noir",
    description: "Noir premium avec détails réfléchissants.",
    priceCents: 16000 * 100,
    images: [
      "https://images.unsplash.com/photo-1526401485004-2fa806b5b4a9?auto=format&fit=crop&w=1200&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    active: true,
    stock: 0, // Out of stock for testing
  },
  {
    id: "p3",
    name: "Maillot Third Violet",
    slug: "maillot-third-violet",
    description: "Look audacieux, confort ultra doux.",
    priceCents: 17000 * 100,
    images: [
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80",
    ],
    sizes: ["M", "L", "XL"],
    active: true,
    stock: 20,
  },
];
