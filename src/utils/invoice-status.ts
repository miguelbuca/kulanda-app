export function getInvoiceStatus(status: keyof typeof InvoiceEnumType = 'DRAFT') {
  const statusMap: {
    [key in keyof typeof InvoiceEnumType]: { name: string; color: string };
  } = {
    DRAFT: { name: "Rascunho", color: "gray" },
    ISSUED: { name: "Emitido", color: "blue" },
    PAID: { name: "Pago", color: "green" },
    OVERDUE: { name: "Atrasado", color: "red" },
    CANCELLED: { name: "Cancelado", color: "black" },
  };

  return statusMap[status];
}
