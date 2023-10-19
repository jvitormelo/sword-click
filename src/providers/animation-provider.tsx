import { AnimatePresence } from "framer-motion";
import { Fragment, ReactNode, useMemo } from "react";
import { create } from "zustand";

type AnimationStore = {
  animations: Map<string, ReactNode>;
  addAnimation: (animation: ReactNode, duration: number) => void;
  removeAnimation: (id: string) => void;
};

export function playSound(src: string, removeAfter: number = 300) {
  const audio = new Audio(src);
  audio.play();

  setTimeout(() => {
    audio.pause();
    audio.remove();
  }, removeAfter);
}

export const animationStore = create<AnimationStore>((set) => ({
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
  animations: new Map(),
  removeAnimation: (id) => {
    set((s) => {
      s.animations.delete(id);
      return {
        animations: new Map(s.animations),
      };
    });
  },
}));

export const AnimationProvider = () => {
  const { animations } = animationStore();
  const arr = useMemo(() => Array.from(animations), [animations]);

  return (
    <AnimatePresence>
      {arr.map(([key, animation]) => (
        <Fragment key={key}>{animation}</Fragment>
      ))}
    </AnimatePresence>
  );
};
