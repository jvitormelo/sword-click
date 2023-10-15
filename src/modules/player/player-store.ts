import { create } from "zustand";

type Store = {
  life: number;

  actions: {
    takeDamage: (damage: number) => void;
  };
};

interface EnergyStore {
  energy: number;
  energyRegen: number;
  maxEnergy: number;
  actions: {
    increase: (value: number) => void;
    decrease: (value: number) => void;
    regenerate: () => void;
  };
}

export const useEnergyStore = create<EnergyStore>((set) => ({
  energyRegen: 10,
  energy: 100,
  maxEnergy: 100,
  actions: {
    decrease: (value) => {
      set((state) => {
        return {
          energy: state.energy - value,
        };
      });
    },
    increase: (value) => {
      set((state) => {
        if (state.energy + value > 100) return state;

        return {
          energy: state.energy + value,
        };
      });
    },
    regenerate: () => {
      set((state) => {
        const newEnergy = state.energy + state.energyRegen;

        if (newEnergy > state.maxEnergy) {
          if (state.energy === state.maxEnergy) return state;
          return { energy: state.maxEnergy };
        }

        return { energy: state.energy + state.energyRegen };
      });
    },
  },
}));

export const usePlayerStore = create<Store>((set) => ({
  life: 100,

  actions: {
    takeDamage: (damage) => {
      set((state) => {
        return {
          life: state.life - damage,
        };
      });
    },
  },
}));

export const usePlayerActions = () => {
  const actions = usePlayerStore((s) => s.actions);

  return actions;
};
