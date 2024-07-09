import { create } from "zustand";

export interface IStore {
  store: StoreType;
  setStore: (store: StoreType) => void;
}

export const useStore = create<IStore>((set) => ({
  store: {},
  setStore: (store: StoreType) => set({ store }),
}));
