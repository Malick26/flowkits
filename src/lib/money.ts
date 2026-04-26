export function formatMoneyCents(valueCents: number) {
  const value = (valueCents ?? 0) / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value);
}

