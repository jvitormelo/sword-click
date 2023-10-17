import { create } from "zustand";
import { Enemy } from "../modules/enemies/use-enemy-factory";
import { between } from "../utils/random";

interface GoldStore {
  gold: number;
  addGold: (amount: number) => void;
  generateGold: (enemy: Enemy) => void;
}

export const useGoldStore = create<GoldStore>((set) => ({
  addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
  gold: 100,
  generateGold: function () {
    const gold = between(1, 10);
    this.addGold(gold);
  },
}));
