import { create } from "zustand";
import { Cut } from "./types";
import { useEnergyStore } from "../player/player-store";

type Store = {
  cuts: Array<Cut>;
  actions: {
    addCut: (cut: Cut) => boolean;
    removeCut: (cutId: string) => void;
  };
};

export const useCutStore = create<Store>((set) => ({
  actions: {
    addCut: (cut) => {
      const playerEnergy = useEnergyStore.getState().energy;

      if (playerEnergy < cut.cost) return false;

      set((state) => ({ cuts: [...state.cuts, cut] }));

      useEnergyStore.getState().actions.decrease(cut.cost);

      return true;
    },
    removeCut: (cutId) => {
      set((state) => ({ cuts: state.cuts.filter((c) => c.id !== cutId) }));
    },
  },
  cuts: [],
}));

export const useCutActions = () => {
  const actions = useCutStore((s) => s.actions);
  return actions;
};
