export const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)} ${currency}`;
  }
};
