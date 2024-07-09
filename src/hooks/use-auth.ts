import { create } from "zustand";

export interface IAuth {
  user: UserType;
  setUser: (user: UserType) => void;
}

export const useAuth = create<IAuth>((set) => ({
  user: {},
  setUser: (user: UserType) => set({ user }),
}));
