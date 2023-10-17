import { AnimatePresence } from "framer-motion";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { create } from "zustand";
import ThunderSound from "./assets/sounds/thunder-strike-sound.mp3";

type AnimationStore = {
  animations: Map<string, (props: { id: string }) => ReactNode>;
  addAnimation: (animation: (props: { id: string }) => ReactNode) => void;
  removeAnimation: (id: string) => void;
};

function playSound(src: string) {
  const audio = new Audio(src);
  audio.play();

  setTimeout(() => {
    audio.pause();
    audio.remove();
  }, 300);
}

export const animationStore = create<AnimationStore>((set) => ({
  addAnimation: (animation) => {
    const id = Math.random().toString();
    set((s) => {
      s.animations.set(id, animation);
      return {
        animations: new Map(s.animations),
      };
    });

    playSound(ThunderSound);

    setTimeout(() => {
      set((s) => {
        s.animations.delete(id);
        return {
          animations: new Map(s.animations),
        };
      });
    }, 150);
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

export const AnimationProvider = ({ children }: PropsWithChildren) => {
  const { animations } = animationStore();
  const arr = useMemo(() => Array.from(animations), [animations]);

  return (
    <>
      <AnimatePresence>
        {arr.map(([key, Animation]) => (
          <Animation key={key} id={key} />
        ))}
      </AnimatePresence>
      {children}
    </>
  );
};
