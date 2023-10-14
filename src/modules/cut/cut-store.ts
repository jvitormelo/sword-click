import { create } from "zustand";
import { Cut } from "./types";

type Store = {
  cuts: Array<Cut>;
  actions: {
    addCut: (cut: Cut) => void;
    removeCut: (cutId: string) => void;
  };
};

export const useCutStore = create<Store>((set) => ({
  actions: {
    addCut: (cut) =>
      set((state) => {
        return {
          ...state,
          cuts: [...state.cuts, cut],
        };
      }),
    removeCut: (cutId) => {
      set((state) => {
        return {
          ...state,
          cuts: state.cuts.filter((c) => c.id !== cutId),
        };
      });
    },
  },
  cuts: [],
}));

export const useCutActions = () => {
  const actions = useCutStore((s) => s.actions);
  return actions;
};
