import { useEffect, useRef } from "react";
import { create } from "zustand";

type Store = {
  life: number;

  actions: {
    takeDamage: (damage: number) => void;
  };
};

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

export const PlayerHealth = () => {
  const { life } = usePlayerStore();

  const maxLife = useRef(life);

  useEffect(() => {
    if (life <= 0) {
      console.log("You died");
    }
  }, [life]);

  return (
    <div>
      <div className="w-full bg-red-700 h-4 flex items-center justify-center relative">
        <div
          style={{
            width: `${(life / maxLife.current) * 100}%`,
          }}
          className="bg-green-500 h-full absolute left-0 top-0"
        ></div>
        <span className="z-10">
          {life} / {maxLife.current}
        </span>
      </div>
    </div>
  );
};
