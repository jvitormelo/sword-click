import { AnimationObject } from "@/modules/skill/types";
import { create } from "zustand";

type Store = {
  animations: Map<string, AnimationObject>;
  actions: {
    addAnimation: (animation: AnimationObject, duration: number) => void;
    removeAnimation: (id: string) => void;
  };
};

export const useAnimationStore = create<Store>((set, get) => ({
  animations: new Map(),
  actions: {
    addAnimation: (animation, duration) => {
      const id = Math.random().toString();
      set((s) => {
        s.animations.set(id, animation);
        return {
          animations: new Map(s.animations),
        };
      });

      setTimeout(() => {
        get().actions.removeAnimation(id);
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
  },
}));
