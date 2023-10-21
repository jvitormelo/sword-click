import { ReactNode } from "react";
import { create } from "zustand";

type Store = {
  animations: Map<string, ReactNode>;
  addAnimation: (animation: ReactNode, duration: number) => void;
  removeAnimation: (id: string) => void;
};

export const animationStore = create<Store>((set) => ({
  animations: new Map(),
  addAnimation: (animation, duration) => {
    const id = Math.random().toString();
    set((s) => {
      s.animations.set(id, animation);
      return {
        animations: new Map(s.animations),
      };
    });

    setTimeout(() => {
      set((s) => {
        s.animations.delete(id);
        return {
          animations: new Map(s.animations),
        };
      });
    }, duration);
  },
  removeAnimation: (id) => {
    set((s) => {
      s.animations.delete(id);
      return {
        animations: new Map(s.animations),
      };
    });
  },
}));

export function playAnimation(node: ReactNode, duration: number) {
  animationStore.getState().addAnimation(node, duration);
}
