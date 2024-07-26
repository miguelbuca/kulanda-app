import { create } from "zustand";
import { Tab } from "../components";

export interface INav {
  ativeTab?: Tab;
  setActiveTab: (value: Tab) => void;
}

export const useNav = create<INav>((set) => ({
  ativeTab: "MAIN",
  setActiveTab: (value: Tab) => set({ ativeTab: value }),
}));
