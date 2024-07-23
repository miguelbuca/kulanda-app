import { create } from "zustand";

export interface OrderList {
  qtd?: number;
  total?: number;
  extra: ProductType | ServiceType;
}

export interface IOrder {
  items: ProductType[] | ServiceType[];
  qtd: string[];
  totalPrice: number;
  totalTaxes: number;
  cash: number;
  bankCard: number;
  change: number;
  subtotalPrice: number;
  list: OrderList[];
  lastSale?: SaleType;
  reset(): void;
  addItem?: (item: ProductType | ServiceType) => void;
  removeItem?: (id: string) => void;
  deleteItem?: (id: string) => void;
  setTotalTaxes?: (value: number) => void;
  setFormData?: (
    value: number,
    type: keyof Pick<IOrder, "cash" | "bankCard">
  ) => void;
  setLastSale?: (value: SaleType) => void;
}

export const useOrder = create<IOrder>((set) => ({
  items: [],
  qtd: [],
  totalPrice: 0,
  cash: 0,
  bankCard: 0,
  change: 0,
  totalTaxes: 0,
  subtotalPrice: 0,
  list: [],
  reset() {
    set({
      items: [],
      qtd: [],
      totalPrice: 0,
      cash: 0,
      bankCard: 0,
      change: 0,
      totalTaxes: 0,
      subtotalPrice: 0,
      list: [],
    });
  },
  setLastSale(lastSale) {
    set({
      lastSale,
    });
  },
  setTotalTaxes(value) {
    set(({ subtotalPrice }) => ({
      totalTaxes: value,
      totalPrice: subtotalPrice + value,
    }));
  },
  setFormData(value, type) {
    set(({ cash, bankCard, totalPrice }) =>
      type === "bankCard"
        ? {
            bankCard: value,
            change: value + cash - totalPrice,
          }
        : {
            cash: value,
            change: value + bankCard - totalPrice,
          }
    );
  },
  addItem(item) {
    set(({ items, qtd, totalTaxes, setTotalTaxes }) => {
      const exists = items.filter(({ id }) => id === item.id).length > 0;

      const totalCharges =
        totalTaxes +
        calCharges(item.price, item.charges) +
        calCharges(item.price, item.category.charges);

      setTotalTaxes?.(totalCharges);

      const nItems = !exists ? [...items, item] : items;
      const nQtd = item.id ? [...qtd, item.id] : qtd;

      const list: OrderList[] = [];

      var subtotalPrice = 0;

      nItems.forEach((extra) => {
        const { id, price } = extra;
        const totalAdd = nQtd.filter((value) => value === id).length;
        const total = (price ?? 0) * totalAdd;

        subtotalPrice += total;

        list.push({
          total,
          qtd: totalAdd,
          extra,
        });
      });

      return {
        items: nItems,
        qtd: nQtd,
        list,
        subtotalPrice,
        totalPrice: subtotalPrice + totalCharges,
      };
    });
  },
  removeItem(id) {
    set(({ items, qtd, totalTaxes, setTotalTaxes }) => {
      const isItem = items.filter(({ id }) => id === id);
      const exists = isItem.length > 0;
      const lastIndexOf = qtd.lastIndexOf(id);
      const nItems = !exists ? [...items] : items;
      const nQtd = qtd.filter((_, index) => index !== lastIndexOf);

      const list: OrderList[] = [];

      const item = isItem?.[0];

      const totalCharges =
        totalTaxes -
        (calCharges(item.price, item.charges) +
          calCharges(item.price, item.category.charges));

      setTotalTaxes?.(totalCharges);

      var subtotalPrice = 0;

      nItems.forEach((extra) => {
        const { id, price } = extra;
        const totalAdd = nQtd.filter((value) => value === id).length;

        const total = (price ?? 0) * totalAdd;

        subtotalPrice += total;

        list.push({
          total,
          qtd: totalAdd,
          extra,
        });
      });

      return {
        items: nItems,
        qtd: nQtd,
        list,
        subtotalPrice,
        totalPrice: subtotalPrice + totalCharges,
      };
    });
  },
  deleteItem(id) {
    set(({ items, qtd, totalTaxes, setTotalTaxes }) => {
      const nItems = items.filter(({ id: _id }) => _id !== id);
      const nQtd = qtd.filter((_id) => _id !== id);

      const _item = items.filter(({ id }) => id === id)?.[0];
      const _qtd = qtd.filter((_id) => _id === id)?.length;

      const totalCharges =
        totalTaxes -
        (calCharges(_item.price, _item.charges) +
          calCharges(_item.price, _item.category.charges)) *
          _qtd;

      setTotalTaxes?.(totalCharges);

      const list: OrderList[] = [];

      var subtotalPrice = 0;

      nItems.forEach((extra) => {
        const { id, price } = extra;
        const totalAdd = nQtd.filter((value) => value === id).length;

        const total = (price ?? 0) * totalAdd;

        subtotalPrice += total;

        list.push({
          total: (price ?? 0) * totalAdd,
          qtd: totalAdd,
          extra,
        });
      });

      return {
        items: nItems,
        qtd: nQtd,
        list,
        subtotalPrice,
        totalPrice: subtotalPrice + totalCharges,
      };
    });
  },
}));

function calCharges(value: number, charges: ChargeType[]) {
  let totalCharges = 0;

  charges.forEach((charge) => {
    totalCharges += calcPercentage(value, charge.percentage);
  });

  return totalCharges;
}

function calcPercentage(value: number, percentage: number) {
  return (value * percentage) / 100;
}
