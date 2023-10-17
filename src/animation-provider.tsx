import { PropsWithChildren, ReactNode, useMemo } from "react";
import { create } from "zustand";

type AnimationStore = {
  animations: Map<string, (props: { id: string }) => ReactNode>;
  addAnimation: (animation: (props: { id: string }) => ReactNode) => void;
  removeAnimation: (id: string) => void;
};

export const animationStore = create<AnimationStore>((set) => ({
  addAnimation: (animation) => {
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
    }, 1000);
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

  console.log(arr);
  return (
    <>
      {arr.map(([key, Animation]) => (
        <Animation key={key} id={key} />
      ))}
      {children}
    </>
  );
};
