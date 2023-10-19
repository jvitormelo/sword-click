import { create } from "zustand";

export enum Views {
  Game = "game",
  Town = "town",
}

export const useViewStore = create<{
  view: Views;
  actions: {
    setView: (view: Views) => void;
  };
}>((set) => ({
  actions: {
    setView: (view) => set({ view }),
  },
  view: Views.Game,
}));
