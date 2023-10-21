import { AnimatePresence } from "framer-motion";
import { Fragment, useMemo } from "react";
import { animationStore } from "../stores/animation-store";

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
