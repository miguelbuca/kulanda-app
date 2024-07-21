import { create } from "zustand";

export interface ICompany {
  company?: CompanyType;
  setCompany: (company?: CompanyType) => void;
}

export const useCompany = create<ICompany>((set) => ({
  setCompany: (company?: CompanyType) => set({ company }),
}));
