export function getDueDate(
  diasParaVencimento = 15,
  dataInicial: Date = new Date()
) {
  let data = new Date(dataInicial);

  data.setDate(data.getDate() + diasParaVencimento);

  return new Date(data).toISOString();
}
