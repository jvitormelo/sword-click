import { create } from "zustand";

export enum Views {
  Camp = "camp",
  Town = "town",
  Abyss = "abyss",
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
  view: Views.Camp,
}));
