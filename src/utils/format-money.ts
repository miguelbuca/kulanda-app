export const formatMoney = (number: number) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(
    number
  );
